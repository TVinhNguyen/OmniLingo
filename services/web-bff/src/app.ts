/**
 * web-bff Fastify application factory.
 * Registers: Mercurius (GraphQL), CORS, Helmet, Prometheus metrics, health routes.
 */
import Fastify, { type FastifyRequest } from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import mercurius from "mercurius";
import { Registry, collectDefaultMetrics, Counter, Histogram } from "prom-client";
import type { Config } from "./config.js";
import { initJWKS, verifyToken, extractBearerToken } from "./middleware/auth.js";
import { buildDataSources } from "./datasources/datasources.js";
import { schema } from "./schema/schema.js";
import { resolvers, type BffContext } from "./resolvers/resolvers.js";

const SERVICE_NAME = "web-bff";
const HTTP_DURATION_BUCKETS = [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5];

export async function buildApp(cfg: Config) {
  // ─── Logger ──────────────────────────────────────────────────────────────
  const app = Fastify({
    logger: {
      level: cfg.env === "production" ? "info" : "debug",
      ...(cfg.env !== "production" && { transport: { target: "pino-pretty" } }),
    },
    trustProxy: true,
  });

  // ─── JWKS init ────────────────────────────────────────────────────────────
  initJWKS(cfg.identityServiceUrl);

  // ─── Prometheus ───────────────────────────────────────────────────────────
  const registry = new Registry();
  registry.setDefaultLabels({ service_name: SERVICE_NAME });
  collectDefaultMetrics({ register: registry });

  const httpRequests = new Counter({
    name: "webbff_http_requests_total",
    help: "Total HTTP/GraphQL requests",
    labelNames: ["method", "route", "status_code"],
    registers: [registry],
  });

  const httpDuration = new Histogram({
    name: "webbff_http_request_duration_seconds",
    help: "Request duration",
    labelNames: ["method", "route", "status_code"],
    buckets: HTTP_DURATION_BUCKETS,
    registers: [registry],
  });

  app.addHook("onRequest", async (req) => {
    (req as unknown as { metricsStart: bigint }).metricsStart = process.hrtime.bigint();
  });

  app.addHook("onResponse", async (req, reply) => {
    const route = req.routeOptions.url ?? req.url.split("?")[0];
    const statusCode = String(reply.statusCode);
    const start = (req as unknown as { metricsStart?: bigint }).metricsStart;
    const durationSec = start ? Number(process.hrtime.bigint() - start) / 1_000_000_000 : 0;

    httpRequests.inc({ method: req.method, route, status_code: statusCode });
    httpDuration.observe({ method: req.method, route, status_code: statusCode }, durationSec);
  });

  // ─── Security headers (Helmet) ────────────────────────────────────────────
  await app.register(helmet, {
    contentSecurityPolicy: false, // GraphQL playground needs inline scripts in dev
  });

  // ─── CORS — whitelist only ─────────────────────────────────────────────────
  await app.register(cors, {
    origin: (origin, cb) => {
      // Reject requests with no Origin in production
      if (!origin) {
        if (cfg.env !== "production") return cb(null, true);
        return cb(new Error("CORS: missing origin"), false);
      }
      if (cfg.allowedOrigins.includes(origin)) {
        return cb(null, true);
      }
      return cb(new Error(`CORS: origin ${origin} not allowed`), false);
    },
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Request-ID"],
    exposedHeaders: ["X-Request-ID"],
    maxAge: 3600,
  });

  // ─── Mercurius (GraphQL) ──────────────────────────────────────────────────
  await app.register(mercurius, {
    schema,
    resolvers: resolvers as any, // MercuriusGetResolvers expects specific shape
    graphiql: cfg.env !== "production",
    context: async (req: FastifyRequest): Promise<Omit<BffContext, keyof import("mercurius").MercuriusContext>> => {
      // Verify JWT — null for anonymous, throws on invalid token
      let user = null;
      try {
        user = await verifyToken(req);
      } catch (_err) {
        // Token present but invalid — resolvers will reject via requireAuth
      }

      const token = extractBearerToken(req);
      const dataSources = buildDataSources(cfg, token);

      return { user, dataSources };
    },
    errorFormatter: (execution, ctx) => {
      // Log upstream errors at warn level, hide internals from client
      const errors = (execution.errors ?? []).map((err) => {
        const original = err.originalError;
        if (original && "statusCode" in original && (original as any).statusCode >= 500) {
          app.log.warn({ err: original }, "upstream error in GQL resolver");
          return { ...err, message: "Internal server error", extensions: { code: "INTERNAL_ERROR" } };
        }
        return err;
      });
      return { statusCode: 200, response: { ...execution, errors } };
    },
  });

  // ─── Health & Metrics endpoints ───────────────────────────────────────────
  app.get("/healthz", async () => ({ status: "ok" }));

  app.get("/readyz", async () => {
    // BFF is stateless — readiness = process alive + JWKS reachable
    // In production, add upstream ping if needed
    return { status: "ready" };
  });

  app.get("/metrics", async (_req, reply) => {
    reply.header("Content-Type", registry.contentType);
    return registry.metrics();
  });

  // ─── Request ID propagation ────────────────────────────────────────────────
  app.addHook("onRequest", async (req, reply) => {
    const rid = (req.headers["x-request-id"] as string) ?? crypto.randomUUID();
    reply.header("X-Request-ID", rid);
    reply.header("Vary", "Origin");
  });

  return app;
}
