# ============================================
# Base
# ============================================
FROM node:20-alpine AS base

WORKDIR /app

RUN corepack enable \
    && corepack prepare pnpm@10.33.0 --activate


# ============================================
# Dependencies
# ============================================
FROM base AS deps

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./

COPY apps/api/package.json apps/api/package.json

RUN pnpm install --frozen-lockfile


# ============================================
# Builder
# ============================================
FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/api ./apps/api

WORKDIR /app/apps/api

# Generate Prisma Client
RUN pnpm prisma generate

# Build NestJS
RUN pnpm build


# ============================================
# Production dependencies
# ============================================
FROM base AS prod-deps

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/api/package.json apps/api/package.json

RUN pnpm install --frozen-lockfile --prod


# ============================================
# Runner
# ============================================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN apk add --no-cache dumb-init

# Copy built application
COPY --from=builder /app/apps/api/dist ./dist

# Copy Prisma schema
COPY --from=builder /app/apps/api/prisma ./prisma

# Copy production node_modules
COPY --from=prod-deps /app/apps/api/node_modules ./node_modules

# Copy package metadata
COPY --from=builder /app/apps/api/package.json ./package.json

EXPOSE 3000

USER node

ENTRYPOINT ["dumb-init", "--"]

CMD ["node", "dist/src/main.js"]
