FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production=false
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
RUN addgroup -g 1001 -S appgroup && adduser -u 1001 -S appuser -G appgroup

COPY --from=builder --chown=appuser:appgroup /app/package*.json ./
RUN npm ci --only=production

COPY --from=builder --chown=appuser:appgroup /app/dist ./dist

USER appuser
EXPOSE 3006
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD wget -qO- http://localhost:3006/healthz || exit 1

CMD ["node", "dist/main.js"]
