# SEJA — Sistema de Estágios e Jovem Aprendiz

Plataforma institucional do IFCE para centralizar e automatizar a gestão de
estágios (obrigatórios e não obrigatórios), programas de jovem aprendiz,
banco de talentos, convênios com concedentes e apólices de seguro estudantil.

## Stack

| Camada        | Tecnologia                                    |
| ------------- | --------------------------------------------- |
| Frontend      | Next.js 16 (App Router), React 19, TypeScript |
| Backend       | Server Actions e Route Handlers (Node 22)     |
| Persistência  | Supabase / PostgreSQL com RLS                 |
| Validação     | Zod                                           |
| CI/CD         | GitHub Actions → Vercel                       |
| Mobile (opc.) | Flutter, sobre a mesma base de dados          |

## Como rodar

```bash
npm install
cp .env.example .env.local   # preencha as chaves do Supabase
npm run dev                  # http://localhost:3000
```

Comandos úteis:

```bash
npm run lint        # ESLint
npm run typecheck   # tsc --noEmit
npm test            # Vitest
npm run db:types    # regenera src/types/database.types.ts do schema
```

## Estrutura

```
src/
├── app/                    Apresentação (App Router)
│   ├── (auth)/login/       Épico 0 — login SIGAA + bifurcação de empresa
│   ├── (dashboard)/        Épicos 1–9 — shell autenticado
│   └── api/                Route Handlers
├── core/
│   ├── domain/             Entidades, erros e portas de repositório
│   └── application/        Serviços, casos de uso e DTOs
├── infra/
│   ├── supabase/           Clientes browser / server / admin
│   ├── repositories/       Adapters Supabase das portas
│   ├── mappers/            Linha do banco → entidade de domínio
│   └── integrations/sigaa/ Autenticação institucional
├── components/             ui, layout, forms, data-table, shared
├── lib/                    auth (RBAC), validation, security, errors, utils
├── config/                 env, navegação da sidebar, tema institucional
├── hooks/  types/  styles/
supabase/                   migrations, policies, seed
tests/                      unit, integration, e2e
docs/                       arquitetura, segurança, branching, roadmap
```

## Perfis de acesso

| Perfil                 | Alcance                                               |
| ---------------------- | ----------------------------------------------------- |
| DEEE                   | Gestão institucional ampla, inclusive parâmetros      |
| Apoio de Coordenação   | Validação de documentos e convênios; sem exclusões    |
| Coordenação de Estágio | Aprovação, mudança de situação e exclusão de vínculos |
| Professor Orientador   | Leitura dos discentes que orienta                     |
| Empresa (externo)      | Somente solicitação de convênio                       |

A matriz completa está em [`src/lib/auth/rbac.ts`](src/lib/auth/rbac.ts).

## Branches

`dev` → `homologacao` → `producao`, uma por ambiente. Detalhes e proteções
recomendadas em [`docs/BRANCHING.md`](docs/BRANCHING.md).

## Documentação

- [Arquitetura](docs/ARQUITETURA.md) — camadas, portas e adapters, convenções
- [Segurança](docs/SEGURANCA.md) — RBAC, IDOR, XSS, segredos, auditoria
- [Branching](docs/BRANCHING.md) — fluxo de branches e ambientes
- [Roadmap](docs/ROADMAP.md) — backlog por épico
