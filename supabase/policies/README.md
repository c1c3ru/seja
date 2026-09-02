# Políticas de RLS

As policies vivem junto das migrações (`supabase/migrations/`) para que schema
e segurança sejam versionados na mesma transação. Esta pasta guarda apenas
notas de revisão e cenários de teste manual.

## Invariantes

1. Toda tabela nasce com `enable row level security`. Sem policy = sem acesso.
2. `DEEE` tem alcance institucional; os demais perfis são limitados ao campus
   via `auth_tem_campus()`.
3. A `service_role` bypassa o RLS — use apenas em rotinas internas
   (`src/infra/supabase/admin.ts`), nunca para atender requisição de usuário.
4. RLS é a segunda linha de defesa. A primeira é `exigirPermissao()` no
   servidor. As duas são obrigatórias.
