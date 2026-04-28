/**
 * AuthUser — unified user context injected into requests after JWT verification.
 *
 * Aggregates claim shapes across all OmniLingo Node-TS services:
 *  - notification: { sub, roles }
 *  - content:      { id, roles, scopes }
 *  - grammar:      { sub, roles }
 *  - web-bff:      { userId, tier, roles }
 */
export interface AuthUser {
  /** User UUID from JWT `sub` claim */
  userId: string;
  /** RBAC roles from JWT `roles` claim */
  roles: string[];
  /** OAuth2 scopes from JWT `scopes` claim */
  scopes: string[];
  /** Subscription tier from JWT `tier` claim (may be absent on old tokens) */
  tier?: string;
}
