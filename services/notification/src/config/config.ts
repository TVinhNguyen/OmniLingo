export interface NotificationConfig {
  env: string;
  port: number;
  version: string;

  // Database
  pgUrl: string;

  // Redis
  redisUrl: string;

  // Kafka
  kafkaBrokers: string[];
  kafkaEnabled: boolean;
  kafkaGroupId: string;

  // Email
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPass: string;
  emailFrom: string;

  // Firebase Cloud Messaging
  fcmServiceAccountPath: string;

  // Identity
  identityServiceUrl: string;
  allowedOrigins: string[];

  // Throttle
  notifRateLimitPerHour: number;
}

export function loadConfig(): NotificationConfig {
  return {
    env: process.env.ENV ?? 'development',
    port: parseInt(process.env.PORT ?? '3011', 10),
    version: process.env.VERSION ?? 'dev',

    pgUrl: process.env.PG_URL ?? 'postgres://omnilingo:omnilingo_dev@localhost:5432/notification_db',
    redisUrl: process.env.REDIS_URL ?? 'redis://localhost:6379',

    kafkaBrokers: (process.env.KAFKA_BROKERS ?? 'localhost:9094').split(','),
    kafkaEnabled: process.env.KAFKA_ENABLED === 'true',
    kafkaGroupId: process.env.KAFKA_GROUP_ID ?? 'notification-service',

    smtpHost: process.env.SMTP_HOST ?? 'smtp.sendgrid.net',
    smtpPort: parseInt(process.env.SMTP_PORT ?? '587', 10),
    smtpUser: process.env.SMTP_USER ?? '',
    smtpPass: process.env.SMTP_PASS ?? '',
    emailFrom: process.env.EMAIL_FROM ?? 'noreply@omnilingo.io',

    fcmServiceAccountPath: process.env.FCM_SERVICE_ACCOUNT_PATH ?? '',

    identityServiceUrl: process.env.IDENTITY_SERVICE_URL ?? 'http://localhost:3001',
    allowedOrigins: (process.env.ALLOWED_ORIGINS ?? 'http://localhost:3000,http://localhost:5173').split(','),

    notifRateLimitPerHour: parseInt(process.env.NOTIF_RATE_LIMIT_PER_HOUR ?? '20', 10),
  };
}
