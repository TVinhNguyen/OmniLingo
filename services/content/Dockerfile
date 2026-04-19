FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
RUN npm run build

FROM node:22-alpine
WORKDIR /app
RUN addgroup -g 1001 -S nodejs && adduser -S content -u 1001

COPY --from=builder --chown=content:nodejs /app/dist ./dist
COPY --from=builder --chown=content:nodejs /app/node_modules ./node_modules
COPY --chown=content:nodejs package.json .

USER content
EXPOSE 3003
HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
    CMD wget -qO- http://localhost:3003/healthz || exit 1

CMD ["node", "dist/index.js"]
