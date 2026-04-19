/**
 * web-bff entrypoint: load config, build Fastify app, start server.
 */
import { loadConfig } from "./config.js";
import { buildApp } from "./app.js";

const cfg = loadConfig();

const app = await buildApp(cfg);

const address = await app.listen({ port: cfg.port, host: "0.0.0.0" });
app.log.info({ address, env: cfg.env }, "web-bff listening");

// Graceful shutdown
const shutdown = async (signal: string) => {
  app.log.info({ signal }, "shutdown signal received");
  await app.close();
  process.exit(0);
};

process.on("SIGINT",  () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
