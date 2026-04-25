#!/bin/sh
set -eu

mkdir -p services/web-bff/src/generated

npx openapi-typescript services/identity/openapi.yaml -o services/web-bff/src/generated/identity.types.ts
npx openapi-typescript services/learning/openapi.yaml -o services/web-bff/src/generated/learning.types.ts
npx openapi-typescript services/content/openapi.yaml -o services/web-bff/src/generated/content.types.ts
npx openapi-typescript services/billing/openapi.yaml -o services/web-bff/src/generated/billing.types.ts
npx openapi-typescript services/vocabulary/openapi.yaml -o services/web-bff/src/generated/vocabulary.types.ts
