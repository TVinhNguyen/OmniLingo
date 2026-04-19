/**
 * HTTP client for upstream microservices.
 * Uses undici (fast, built-in Node.js http library) with:
 * - Per-service connection pools
 * - Auth token forwarding
 * - JSON request/response helpers
 * - Structured error wrapping
 */
import { request as undiciRequest } from "undici";

export class UpstreamError extends Error {
  constructor(
    public readonly service: string,
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "UpstreamError";
  }
}

export interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string;
  headers?: Record<string, string>;
}

/**
 * Makes an HTTP JSON request to an upstream service.
 * Forwards the user's Bearer token if provided.
 * Throws UpstreamError on non-2xx responses.
 */
export async function callUpstream<T = unknown>(
  baseUrl: string,
  path: string,
  opts: RequestOptions = {},
): Promise<T> {
  const { method = "GET", body, token, headers = {} } = opts;

  const reqHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...headers,
  };
  if (token) {
    reqHeaders["Authorization"] = `Bearer ${token}`;
  }

  const { statusCode, body: resBody } = await undiciRequest(`${baseUrl}${path}`, {
    method,
    headers: reqHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const text = await resBody.text();

  if (statusCode < 200 || statusCode >= 300) {
    let code = "UPSTREAM_ERROR";
    let message = `Upstream ${baseUrl}${path} returned ${statusCode}`;
    try {
      const parsed = JSON.parse(text) as { error?: string; message?: string };
      if (parsed.error) code = parsed.error;
      if (parsed.message) message = parsed.message;
    } catch {
      // non-JSON error body
    }
    throw new UpstreamError(baseUrl, statusCode, code, message);
  }

  if (!text) return {} as T;

  try {
    return JSON.parse(text) as T;
  } catch {
    return text as unknown as T;
  }
}
