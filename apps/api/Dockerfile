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

RUN pnpm prisma generate

RUN pnpm build


# ============================================
# Runtime
# ============================================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN apk add --no-cache dumb-init

# Built application
COPY --from=builder /app/apps/api/dist ./dist

# API node_modules
COPY --from=builder /app/apps/api/node_modules ./node_modules

# Prisma generated client
COPY --from=builder /app/apps/api/node_modules/.prisma ./node_modules/.prisma

# Prisma
COPY --from=builder /app/apps/api/prisma ./prisma

# API package.json
COPY --from=builder /app/apps/api/package.json ./package.json

EXPOSE 3000

USER node

ENTRYPOINT ["dumb-init", "--"]

CMD ["node", "dist/src/main.js"]
