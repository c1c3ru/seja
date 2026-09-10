# Rotas de autenticação

Épico 0. Endpoints previstos:

- `POST /api/auth/login` — valida usuário e senha no backend do SEJA (sem
  integração externa); emite o cookie de sessão assinado (`httpOnly`,
  `secure`, `sameSite=lax`).
- `POST /api/auth/login-empresa` — fluxo bifurcado do checkbox "Sou empresa";
  usa uma tabela de credenciais própria, distinta do login institucional.
- `POST /api/auth/logout` — invalida a sessão.
- `POST /api/auth/perfil-ativo` — troca o papel no seletor do cabeçalho.
  Valida no servidor que o perfil pedido está entre os do usuário; jamais
  aceita o perfil enviado pelo cliente como verdade.
