# Arquitetura do SEJA

## Camadas

O projeto segue Clean Architecture adaptada ao Next.js App Router. A regra de
dependência aponta sempre para dentro: a apresentação conhece a aplicação, a
aplicação conhece o domínio, e o domínio não conhece ninguém.

```
src/app/**            Apresentação — Server/Client Components, Server Actions,
                      Route Handlers. Autentica, valida entrada, chama serviço.
        │
src/core/application  Serviços e casos de uso. Regras de negócio. Sem HTTP,
        │             sem SQL, sem React.
        │
src/core/domain       Entidades, value objects, erros e as INTERFACES de
        │             repositório (portas). Zero dependência externa.
        ▲
src/infra/**          Adapters: implementações Supabase das portas, mappers,
                      integração com o SIGAA. Depende do domínio, nunca o
                      contrário.
```

`src/lib` e `src/components` são transversais: utilidades e UI sem regra de
negócio.

## Por que portas e adapters

`EstagioService` recebe um `EstagioRepository` no construtor. Trocar o
Supabase, ou testar o serviço com um repositório em memória, não toca em uma
linha de regra de negócio. Ver `src/core/application/services/estagio.service.ts`
e `src/infra/repositories/estagio.supabase.repository.ts` como par de
referência — os demais módulos seguem exatamente esse formato.

## Renderização

- **Server Components** por padrão: listagens, tabelas e relatórios buscam
  dados no servidor, sem expor endpoint nem chave.
- **Client Components** apenas onde há interatividade: filtros em cascata,
  accordion da sidebar, toggle de senha, modais de confirmação.
- **Server Actions** para mutações vindas de formulário.
- **Route Handlers** (`app/api/**`) para exportação de arquivos, webhooks e
  integrações externas.

## Convenções

- Arquivos e pastas em `kebab-case`; tipos e classes em `PascalCase`.
- Um arquivo por entidade e por porta de repositório.
- Sufixos: `.service.ts`, `.repository.ts`, `.supabase.repository.ts`,
  `.mapper.ts`, `.schema.ts`.
- Domínio em português, alinhado ao vocabulário institucional (discente,
  concedente, vínculo, apólice) — reduz atrito na conversa com a DEEE.
- `any` é erro de lint. Quando o tipo é realmente desconhecido, use `unknown`
  e estreite com Zod.

## Mapa de épicos → código

| Épico                        | Onde                                                                                 |
| ---------------------------- | ------------------------------------------------------------------------------------ |
| 0 — Login                    | `src/app/(auth)/login`, `src/infra/integrations/sigaa`                               |
| 1 — Shell e RBAC             | `src/app/(dashboard)/layout.tsx`, `src/config/navigation.ts`, `src/lib/auth/rbac.ts` |
| 2 — Buscadores               | `src/app/(dashboard)/estagios`, `.../jovem-aprendiz`                                 |
| 3 — Banco de Talentos        | `src/app/(dashboard)/banco-curriculos`                                               |
| 4 — Relatórios e seguros     | `.../relatorios-*`, `.../seguros-ifce`                                               |
| 5 — Concedentes              | `src/app/(dashboard)/concedentes/**`                                                 |
| 6 — Parâmetros               | `src/app/(dashboard)/parametros/**`                                                  |
| 7 — Intervenção              | `.../gerenciamento-estagios`, `.../gerenciamento-jovem-aprendiz`                     |
| 8 e 9 — Filtros de relatório | `src/components/forms`, `src/core/application/dto`                                   |
