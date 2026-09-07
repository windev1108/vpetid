# VPetId

VPetId is a digital identity, safety and GPS tracking platform for pets.

## Stack

- Monorepo: pnpm + Turborepo
- Frontend: Next.js + React + TypeScript
- Backend: NestJS + TypeScript
- Database: PostgreSQL / Supabase
- ORM: Prisma
- Authentication: JWT + Google OAuth
- Data fetching: TanStack React Query
- Styling: TailwindCSS, HeroUIV3
- Package manager: pnpm

## Repository

apps/
  web/     -> Next.js frontend
  api/     -> NestJS backend

## Backend architecture

apps/api/src/modules/

- auth
- pets
- prisma
- users
- devices
- geofences
- notifications
- ...

Use NestJS modular architecture.

Controllers handle HTTP concerns.
Services contain business logic.
DTOs validate input.
Guards handle authentication and authorization.
PrismaService handles database access.

## Authentication

JWT payload uses:

- sub
- email
- sessionId

AuthenticatedUser uses:

- userId
- email
- firstName
- lastName
- avatarUrl
- role
- sessionId

Important:
JWT `sub` maps to AuthenticatedUser `userId`.

Never assume request.user.id.
Use request.user.userId.

## Authorization

User roles:

- USER
- ADMIN

ADMIN_EMAILS is configured through environment variables.

Admin access must be checked server-side.

Never trust role information sent by the frontend.

## Pets

Pet database primary key remains UUID.

Pet also has:

petCode

Format:

VP-XXXXXX

Example:

VP-C9BPG4

petCode must be unique.

UUID is internal.
petCode is the public/user-facing Pet ID.

QR codes should use petCode, not the internal UUID.

Example:

https://vpetid.vn/pet/VP-C9BPG4

## API response

Prefer consistent API responses:

{
  "data": ...
}

Do not change existing API response contracts without checking frontend consumers.

## Frontend

Use TanStack React Query for server state.

API functions belong in:

src/services/

Queries and mutations should use React Query.

Do not call fetch directly inside UI components when an API service already exists.

## Prisma

Never modify Prisma schema casually.

Before changing schema:

1. Inspect existing relations.
2. Check migration history.
3. Check all usages of affected models.
4. Preserve existing foreign key types.
5. Run prisma format.
6. Run prisma generate.
7. Run typecheck.

Pet.id must remain UUID.

## Coding rules

- TypeScript strict.
- Avoid `any`.
- Reuse existing abstractions.
- Do not duplicate API clients.
- Do not introduce dependencies unless necessary.
- Follow existing project conventions.
- Do not rewrite unrelated files.
- Prefer small, focused changes.
- Explain breaking changes before making them.

## Before changing code

First inspect the relevant files and understand existing architecture.

Do not guess existing types, Prisma relations, API contracts or authentication behavior.

## After changing code

Run the smallest relevant checks.

For frontend:

pnpm typecheck

For API:

pnpm --filter api build

For Prisma:

pnpm prisma generate

Run tests when relevant.

## Important

Do not expose secrets from .env files.

Never commit:

.env
.env.local
service account credentials
API keys
JWT secrets
Google OAuth secrets
database passwords