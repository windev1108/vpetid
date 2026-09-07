# ══════════════════════════════════════════════════════════════════════
# VPetId API — Production Dockerfile
# Monorepo: pnpm workspace + NestJS
# ══════════════════════════════════════════════════════════════════════

FROM node:20-alpine AS base

WORKDIR /app

# pnpm
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate


# ──────────────────────────────────────────────────────────────────────
# Dependencies
# ──────────────────────────────────────────────────────────────────────

FROM base AS deps

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./

COPY apps/api/package.json apps/api/package.json

RUN pnpm install --frozen-lockfile


# ──────────────────────────────────────────────────────────────────────
# Build
# ──────────────────────────────────────────────────────────────────────

FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/api ./apps/api

WORKDIR /app/apps/api

# Generate Prisma client
RUN pnpm prisma generate

# Build NestJS
RUN pnpm build


# ──────────────────────────────────────────────────────────────────────
# Production
# ──────────────────────────────────────────────────────────────────────

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Required runtime libraries
RUN apk add --no-cache dumb-init

# pnpm
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

# Copy application
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/node_modules ./node_modules
COPY --from=builder /app/apps/api/package.json ./package.json

# Prisma files/client
COPY --from=builder /app/apps/api/prisma ./prisma

EXPOSE 3000

USER node

ENTRYPOINT ["dumb-init", "--"]

CMD ["node", "dist/main.js"]
