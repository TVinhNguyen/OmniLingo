#!/bin/sh
set -eu

npx @apidevtools/swagger-cli validate services/identity/openapi.yaml
npx @apidevtools/swagger-cli validate services/learning/openapi.yaml
npx @apidevtools/swagger-cli validate services/content/openapi.yaml
npx @apidevtools/swagger-cli validate services/billing/openapi.yaml
npx @apidevtools/swagger-cli validate services/vocabulary/openapi.yaml
