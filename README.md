# protheus-health

Monitoramento/gestão do ambiente Protheus (módulos, patches, customizações AdvPL, base de conhecimento, jobs, integrações e chamados TOTVS/consultoria).

## Stack

- **apps/web** — Nuxt 4
- **apps/api** — NestJS 12 + Prisma + PostgreSQL
- Monorepo com pnpm workspaces

## Setup

```bash
pnpm install
cp apps/api/.env.example apps/api/.env   # ajuste DATABASE_URL
pnpm db:generate
pnpm db:migrate
```

## Desenvolvimento

```bash
pnpm dev:api   # http://localhost:3001
pnpm dev:web   # http://localhost:3000
```
