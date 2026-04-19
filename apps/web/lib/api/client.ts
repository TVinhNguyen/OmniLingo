/**
 * Lightweight GraphQL client for OmniLingo web-bff.
 * Works in both Next.js RSC (server) and client components.
 * BFF endpoint: process.env.NEXT_PUBLIC_BFF_URL (default: http://localhost:4000/graphql)
 *
 * Includes automatic token refresh: if BFF returns UNAUTHENTICATED,
 * the client will attempt a refresh using the stored refresh token
 * and retry the request once.
 */

import { serverRefresh } from "@/lib/api/auth";
import { getSession, setSession } from "@/lib/auth/session";

const BFF_URL =
  process.env.NEXT_PUBLIC_BFF_URL ?? "http://localhost:4000/graphql";

export class GraphQLError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly extensions?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "GraphQLError";
  }
}

interface GQLResponse<T> {
  data?: T;
  errors?: { message: string; extensions?: Record<string, unknown> }[];
}

/**
 * Execute a raw GraphQL request (no retry).
 */
async function rawGql<T>(
  query: string,
  variables: Record<string, unknown> | undefined,
  token: string | undefined,
): Promise<GQLResponse<T>> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(BFF_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
    // Next.js cache hint — override per-call as needed
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    throw new GraphQLError(
      `BFF HTTP error: ${res.status} ${res.statusText}`,
      "HTTP_ERROR",
    );
  }

  return res.json();
}

/**
 * Check if a GQL error indicates an expired/invalid token.
 */
function isAuthError(errors: GQLResponse<unknown>["errors"]): boolean {
  if (!errors?.length) return false;
  return errors.some(
    (e) =>
      e.extensions?.code === "UNAUTHENTICATED" ||
      e.extensions?.code === "FORBIDDEN" ||
      e.message.toLowerCase().includes("not authenticated") ||
      e.message.toLowerCase().includes("jwt expired"),
  );
}

/**
 * Execute a GraphQL operation against web-bff.
 *
 * If the request fails with an auth error and we have a refresh token,
 * automatically refresh the access token and retry once.
 *
 * @param query     - The GraphQL query/mutation string
 * @param variables - Variables for the operation
 * @param token     - JWT access token (optional; omit for public queries)
 */
export async function gql<T>(
  query: string,
  variables?: Record<string, unknown>,
  token?: string,
): Promise<T> {
  const json = await rawGql<T>(query, variables, token);

  // ─── Happy path ────────────────────────────────────────────────────────
  if (json.data && !json.errors?.length) {
    return json.data;
  }

  // ─── Auth error → attempt token refresh ────────────────────────────────
  if (isAuthError(json.errors) && token) {
    try {
      const session = await getSession();
      if (session?.refreshToken) {
        const newAccessToken = await serverRefresh(session.refreshToken);
        // Persist the new access token
        await setSession({
          accessToken: newAccessToken,
          refreshToken: session.refreshToken,
        });
        // Retry with new token
        const retryJson = await rawGql<T>(query, variables, newAccessToken);
        if (retryJson.data) {
          return retryJson.data;
        }
        if (retryJson.errors?.length) {
          const first = retryJson.errors[0];
          throw new GraphQLError(
            first.message,
            first.extensions?.code as string,
            first.extensions,
          );
        }
      }
    } catch (refreshErr) {
      // Refresh failed — throw original auth error so caller can redirect
      if (refreshErr instanceof GraphQLError) throw refreshErr;
      // Fall through to throw original error
    }
  }

  // ─── Other errors ──────────────────────────────────────────────────────
  if (json.errors?.length) {
    const first = json.errors[0];
    throw new GraphQLError(
      first.message,
      first.extensions?.code as string,
      first.extensions,
    );
  }

  if (json.data === undefined) {
    throw new GraphQLError("BFF returned no data", "NO_DATA");
  }

  return json.data;
}
