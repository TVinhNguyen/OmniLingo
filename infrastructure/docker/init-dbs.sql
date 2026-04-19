-- ============================================
-- Initialize separate databases per service
-- ============================================

CREATE DATABASE identity_db;

CREATE DATABASE learning_db;

CREATE DATABASE vocabulary_db;

CREATE DATABASE assessment_db;

CREATE DATABASE srs_db;

CREATE DATABASE progress_db;

CREATE DATABASE billing_db;

CREATE DATABASE payment_db;

CREATE DATABASE entitlement_db;

CREATE DATABASE gamification_db;

CREATE DATABASE llmgateway_db;

CREATE DATABASE notification_db;

-- Enable useful extensions for all databases
\c identity_db CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE EXTENSION IF NOT EXISTS "citext";

\c learning_db CREATE EXTENSION IF NOT EXISTS "pgcrypto";

\c vocabulary_db CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE EXTENSION IF NOT EXISTS "pg_trgm";

\c assessment_db CREATE EXTENSION IF NOT EXISTS "pgcrypto";

\c srs_db CREATE EXTENSION IF NOT EXISTS "pgcrypto";

\c progress_db CREATE EXTENSION IF NOT EXISTS "pgcrypto";

\c billing_db CREATE EXTENSION IF NOT EXISTS "pgcrypto";

\c payment_db CREATE EXTENSION IF NOT EXISTS "pgcrypto";

\c entitlement_db CREATE EXTENSION IF NOT EXISTS "pgcrypto";

\c gamification_db CREATE EXTENSION IF NOT EXISTS "pgcrypto";

\c llmgateway_db CREATE EXTENSION IF NOT EXISTS "pgcrypto";

\c notification_db CREATE EXTENSION IF NOT EXISTS "pgcrypto";