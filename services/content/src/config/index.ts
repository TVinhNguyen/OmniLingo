import 'dotenv/config';

function getEnv(key: string, defaultValue?: string): string {
  const val = process.env[key];
  if (!val && defaultValue === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return val ?? (defaultValue as string);
}

export const config = {
  env: getEnv('NODE_ENV', 'development'),
  port: parseInt(getEnv('PORT', '3003'), 10),
  version: getEnv('SERVICE_VERSION', 'dev'),
  logLevel: getEnv('LOG_LEVEL', 'info'),

  // Database
  mongodbUrl: getEnv('MONGODB_URL', 'mongodb://omnilingo:omnilingo_dev@localhost:27017/content_db?authSource=admin'),

  // Cache
  redisUrl: getEnv('REDIS_URL', 'redis://localhost:6379'),

  // Kafka
  kafkaBrokers: getEnv('KAFKA_BROKERS', 'localhost:9094').split(','),
  kafkaEnabled: getEnv('KAFKA_ENABLED', 'false') === 'true',

  // Auth — fetch JWKS from identity-service
  identityServiceUrl: getEnv('IDENTITY_SERVICE_URL', 'http://localhost:3001'),

  // CORS
  allowedOrigins: getEnv('ALLOWED_ORIGINS', 'http://localhost:3000').split(','),

  // Cache TTLs (seconds)
  cacheTtl: {
    languages: 3600,      // 1h — rarely changes
    tracks: 3600,         // 1h
    courses: 1800,        // 30m
    units: 1800,          // 30m
    lessons: 900,         // 15m — can be invalidated on publish
    lessonVersion: 86400, // 24h — immutable once published
    exercises: 1800,      // 30m
  },
} as const;

export type Config = typeof config;
