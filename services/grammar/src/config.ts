import 'dotenv/config';

export const config = {
  env: process.env.ENV ?? 'development',
  port: parseInt(process.env.PORT ?? '3006', 10),
  version: process.env.VERSION ?? 'dev',

  mongoUri: process.env.MONGO_URI ?? 'mongodb://omnilingo:omnilingo_dev@localhost:27017/grammar_db?authSource=admin',
  redisUrl: process.env.REDIS_URL ?? 'redis://localhost:6379',

  kafkaBrokers: (process.env.KAFKA_BROKERS ?? 'localhost:9094').split(','),
  kafkaEnabled: (process.env.KAFKA_ENABLED ?? 'false') === 'true',
  kafkaGroupId: process.env.KAFKA_GROUP_ID ?? 'grammar-service',

  identityServiceUrl: process.env.IDENTITY_SERVICE_URL ?? 'http://localhost:3001',
  allowedOrigins: (process.env.ALLOWED_ORIGINS ?? 'http://localhost:3000,http://localhost:5173').split(','),

  logLevel: process.env.LOG_LEVEL ?? 'info',

  drillMaxGenerate: parseInt(process.env.DRILL_MAX_GENERATE ?? '10', 10),
} as const;
