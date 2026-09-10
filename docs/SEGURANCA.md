# Padrão transversal de segurança

Checklist obrigatório em toda PR que toque em rota, serviço ou repositório.

## 1. Autorização no servidor

O frontend esconde botões; o backend decide. Toda Server Action e Route
Handler sensível começa com:

```ts
const sessao = await exigirPermissao('estagios:deletar');
```

Nunca confie em um perfil enviado pelo cliente (body, query, header). O perfil
ativo vem do cookie de sessão assinado.

## 2. Prevenção a IDOR

Todo ID que chega do cliente é tratado como hostil. Depois de carregar o
recurso, confirme o escopo antes de devolver ou alterar:

```ts
const estagio = await this.repo.porId(id);
if (!estagio) throw new NotFoundError('Estágio');
exigirEscopoCampus(sessao, estagio.campusId);
```

O `PROFESSOR_ORIENTADOR` é restringido ainda mais: o serviço força
`orientadorId = sessao.id` no filtro de busca.

## 3. Injeção

- Sempre query builder do Supabase com parâmetros tipados. Nada de SQL
  concatenado com input de usuário.
- Funções SQL `security definer` fixam `set search_path = public`.
- Toda entrada passa por um esquema Zod (`src/lib/validation/schemas.ts`)
  antes de chegar ao serviço.

## 4. XSS

- Renderize texto como filho de elemento; o React escapa por padrão.
- `dangerouslySetInnerHTML` é proibido sem revisão explícita.
- Texto que sai do React (CSV, PDF, e-mail) passa por
  `escaparHtml` / `protegerCelulaCsv` (`src/lib/security/sanitize.ts`).

## 5. Segredos

- Zero credencial no código. Tudo via `process.env`, validado em
  `src/config/env.ts`.
- `SUPABASE_SERVICE_ROLE_KEY` bypassa o RLS: só em módulos com
  `import 'server-only'`. Nunca prefixe um segredo com `NEXT_PUBLIC_`.
- Rotação de chaves a cada troca de equipe ou incidente.

## 6. RLS

RLS é a segunda linha de defesa, não a única. Toda tabela nasce com
`enable row level security`. Ver `supabase/policies/README.md`.

## 7. Erros

Nenhuma stack trace chega ao usuário. Erros passam por
`src/lib/errors/handler.ts`, que devolve `mensagemPublica` e registra o
detalhe interno no log do servidor.

## 8. Auditoria

Ações destrutivas (Épico 7) exigem justificativa de no mínimo 20 caracteres e
gravam em `auditoria_acoes` autor, perfil ativo, entidade, ação e estado
anterior — na mesma transação da alteração.

## 9. Dados pessoais (LGPD)

Currículos e vínculos contêm dados pessoais de discentes. Não exporte para
serviços externos, não logue CPF ou e-mail, e limite as consultas ao escopo
necessário do perfil.

## 10. Segurança automatizada no CI/CD

Além da revisão manual dos itens acima, duas ferramentas gratuitas rodam
automaticamente em todo `push` e Pull Request para as branches `dev`,
`homologacao` e `producao`.

### Dependabot — SCA (Software Composition Analysis)

Configurado em `.github/dependabot.yml`. Varre semanalmente o ecossistema
`npm` na raiz do projeto e abre PR automático ao encontrar uma vulnerabilidade
conhecida (CVE) ou versão desatualizada, com atenção especial aos pacotes
centrais do produto — `react`, `next` e `@supabase/*`. O PR gerado passa pelo
mesmo CI de qualidade (`lint`, `typecheck`, `test`, `build`) antes de poder
ser mesclado.

### Gitleaks — prevenção de vazamento de segredos

Configurado em `.github/workflows/gitleaks.yml`. Varre o histórico de commits
de todo `push` e Pull Request em busca de credenciais expostas por engano no
código-fonte, em particular:

- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` e, sobretudo,
  `SUPABASE_SERVICE_ROLE_KEY` (bypassa o RLS — ver seção 5);
- `SIGAA_CLIENT_ID` / `SIGAA_CLIENT_SECRET` da integração de autenticação de
  discentes e servidores (ver `src/infra/integrations/sigaa/`);
- `SESSION_SECRET` e demais tokens listados em `.env.example`.

Se o Gitleaks encontrar um padrão de segredo, o job falha e bloqueia o merge.
A chave exposta deve ser removida do histórico e rotacionada imediatamente
(ver seção 5, "Rotação de chaves").
