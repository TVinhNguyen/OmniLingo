// Configuration loaded from environment variables.
export interface Config {
  env: string;
  port: number;
  version: string;

  // Identity service (JWKS)
  identityServiceUrl: string;
  jwksCacheTtlMs: number;

  // Upstream service base URLs
  services: {
    identity: string;
    learning: string;
    content: string;
    vocabulary: string;
    srs: string;
    assessment: string;
    progress: string;
    gamification: string;
    billing: string;
    entitlement: string;
    aiTutor: string;
    speechAi: string;
    notification: string;
  };

  // Redis — response cache
  redisUrl: string;
  cacheDefaultTtlSec: number;

  // CORS
  allowedOrigins: string[];
}

export function loadConfig(): Config {
  const get = (key: string, def: string): string => process.env[key] ?? def;
  const getInt = (key: string, def: number): number => {
    const v = process.env[key];
    return v ? parseInt(v, 10) : def;
  };
  const getList = (key: string, def: string): string[] =>
    (process.env[key] ?? def).split(",").map((s) => s.trim()).filter(Boolean);

  return {
    env: get("ENV", "development"),
    port: getInt("PORT", 4000),
    version: get("VERSION", "dev"),

    identityServiceUrl: get("IDENTITY_SERVICE_URL", "http://localhost:3001"),
    jwksCacheTtlMs: getInt("JWKS_CACHE_TTL_MS", 3_600_000), // 1h

    services: {
      identity: get("IDENTITY_SERVICE_URL", "http://localhost:3001"),
      learning: get("LEARNING_SERVICE_URL", "http://localhost:3002"),
      content: get("CONTENT_SERVICE_URL", "http://localhost:3003"),
      vocabulary: get("VOCABULARY_SERVICE_URL", "http://localhost:3004"),
      srs: get("SRS_SERVICE_URL", "http://localhost:3005"),
      assessment: get("ASSESSMENT_SERVICE_URL", "http://localhost:3006"),
      progress: get("PROGRESS_SERVICE_URL", "http://localhost:3007"),
      gamification: get("GAMIFICATION_SERVICE_URL", "http://localhost:3008"),
      billing: get("BILLING_SERVICE_URL", "http://localhost:3010"),
      entitlement: get("ENTITLEMENT_SERVICE_URL", "http://localhost:3016"),
      aiTutor: get("AI_TUTOR_SERVICE_URL", "http://localhost:3021"),
      speechAi: get("SPEECH_AI_SERVICE_URL", "http://localhost:3022"),
      notification: get("NOTIFICATION_SERVICE_URL", "http://localhost:3009"),
    },

    redisUrl: get("REDIS_URL", "redis://localhost:6379"),
    cacheDefaultTtlSec: getInt("CACHE_DEFAULT_TTL_SEC", 60),

    allowedOrigins: getList("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:5173"),
  };
}
