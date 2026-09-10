# Estratégia de branches e ambientes

O SEJA usa três branches de longa duração, cada uma vinculada a um ambiente.

| Branch        | Ambiente        | `NEXT_PUBLIC_APP_ENV` | Deploy     | Banco               |
| ------------- | --------------- | --------------------- | ---------- | ------------------- |
| `dev`         | Desenvolvimento | `development`         | automático | Supabase (dev)      |
| `homologacao` | Homologação     | `homologacao`         | automático | Supabase (homolog.) |
| `producao`    | Produção        | `production`          | manual     | Supabase (prod)     |

> Os nomes das branches são escritos sem acento (`homologacao`, `producao`).
> Acentos em refs Git funcionam, mas quebram em ferramentas de CI, URLs de
> preview e shells com locale diferente. O rótulo com acento aparece na UI
> (tag "Homologação" no cabeçalho), não no nome da ref.

## Fluxo

```
feature/xyz  →  dev  →  homologacao  →  producao
   PR obrigatório em cada seta; merge sem PR apenas em feature/*
```

1. **Feature** — criar a partir de `dev`: `feature/<épico>-<resumo>`
   (ex.: `feature/epico-2-busca-estagios`). Correções urgentes:
   `hotfix/<resumo>`, criada a partir de `producao` e retroportada para
   `homologacao` e `dev`.
2. **`dev`** — integração contínua. CI roda lint, typecheck e testes.
3. **`homologacao`** — validação com a DEEE e as coordenações. Só recebe
   merge de `dev`, nunca de feature direto.
4. **`producao`** — release. Só recebe merge de `homologacao`. Cada merge é
   marcado com tag `v<major>.<minor>.<patch>`.

## Proteções recomendadas no GitHub

Em `Settings → Branches`, para `homologacao` e `producao`:

- exigir Pull Request com ao menos 1 aprovação;
- exigir que os checks `lint`, `typecheck`, `test` e `build` passem;
- bloquear force-push e deleção;
- em `producao`, exigir que a branch esteja atualizada antes do merge.

Passo a passo completo (incluindo o check do CodeQL e a cobertura mínima
de testes) em [`.github/SECURITY-SETUP.md`](../.github/SECURITY-SETUP.md).

## Migrações de banco

Migração acompanha o código na mesma PR. A ordem de aplicação segue a das
branches: dev → homologação → produção. Migração já aplicada nunca é editada;
corrige-se com uma nova migração.
