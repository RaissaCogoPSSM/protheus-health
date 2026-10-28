# protheus-health

Monitoramento/gestão do ambiente Protheus (módulos, patches, customizações AdvPL, base de conhecimento, jobs, integrações e chamados TOTVS/consultoria).

## Estrutura

- **frontend/** — Nuxt 4
- **backend/** — NestJS 12 + Prisma
- **infra/** — docker-compose (PostgreSQL)
- Monorepo com pnpm workspaces

## Setup

```bash
pnpm install
cp backend/.env.example backend/.env   # ajuste DATABASE_URL se necessário
pnpm infra:up                          # sobe o PostgreSQL local
pnpm db:generate
pnpm db:migrate
pnpm db:seed
```

## Desenvolvimento

```bash
pnpm dev:backend    # http://localhost:3005
pnpm dev:frontend   # http://localhost:3006
```
