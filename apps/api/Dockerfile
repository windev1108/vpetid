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

# Generate Prisma Client for build
RUN pnpm prisma generate

# Build NestJS
RUN pnpm build


# ============================================
# Production dependencies
# ============================================
FROM base AS production

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/api/package.json apps/api/package.json

# Built API
COPY --from=builder /app/apps/api/dist ./apps/api/dist

# Prisma schema + migrations
COPY --from=builder /app/apps/api/prisma ./apps/api/prisma

# Install production dependencies into /prod
RUN pnpm deploy --legacy --filter api --prod /prod


# ============================================
# Generate Prisma Client inside production tree
# ============================================
WORKDIR /prod

RUN pnpm prisma generate


# ============================================
# Runtime
# ============================================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN apk add --no-cache dumb-init

COPY --from=production /prod ./

EXPOSE 3000

USER node

ENTRYPOINT ["dumb-init", "--"]

CMD ["node", "dist/src/main.js"]
