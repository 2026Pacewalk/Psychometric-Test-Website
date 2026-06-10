# Container image for managed hosts (Render / Railway / Fly.io) or self-hosted Docker.
# Persist /data (SQLite DB) and /app/uploads (QR codes, documents, payment proofs)
# with a volume so they survive redeploys.
FROM node:20-bookworm-slim AS base
WORKDIR /app
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

# Install deps
COPY package*.json ./
RUN npm ci

# Build
COPY . .
RUN npx prisma generate && npm run build

ENV NODE_ENV=production
ENV PORT=3000
# Default DB location lives on the mounted volume (override via env if needed).
ENV DATABASE_URL="file:/data/app.db"
EXPOSE 3000

# Ensure DB schema exists, then start. Seed runs only if DB is empty-ish (idempotent upserts).
CMD ["sh", "-c", "npx prisma db push --skip-generate && node node_modules/next/dist/bin/next start -p 3000"]
