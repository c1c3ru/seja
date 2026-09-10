# Roadmap por épico

Cada épico vira uma milestone no GitHub; cada task, uma issue com branch
`feature/epico-<n>-<resumo>` a partir de `dev`.

## Épico 0 — Tela inicial e autenticação

- [ ] Layout particionado (topo verde IFCE, base cinza) + logomarca e títulos
- [ ] Card de credenciais com toggle de visibilidade da senha
- [ ] Checkbox "Sou empresa": desvia do SIGAA para o fluxo de concedentes
- [ ] Submissão com tratamento de credencial inválida e trava de duplo clique

## Épico 1 — Estrutura base, sidebar e RBAC

- [ ] Seletor de perfil no cabeçalho (DEEE, Apoio, Coordenação, Orientador)
- [ ] Reavaliação das permissões do menu ao trocar de perfil
- [ ] Sidebar com accordion em "Relatórios" e "Concedentes e credenciados"
- [ ] Cabeçalho: saudação, tag de ambiente, botão "Sair"

## Épico 2 — Motores de busca

- [ ] Buscador avançado de estágios + botões "Cadastrar" e "Buscar"
- [ ] Buscador de jovem aprendiz (Empregador, Professor Instrutor, Menores)

## Épico 3 — Banco de Talentos

- [ ] Filtros, contador de currículos, "Limpar" e "Baixar Currículos"
- [ ] Card do discente com metadados e blocos de expectativa
- [ ] Chips de "Áreas e/ou Linguagens" e "Habilidades" + "Ver currículo"

## Épico 4 — Relatórios e seguros

- [ ] Painel de relatórios de estágios (3 opções, radio exclusivo)
- [ ] Painel de relatórios de jovem aprendiz (Geral | Adaptação)
- [ ] Relatórios de conformidade com bloqueio progressivo e alerta vermelho
- [ ] Seguros IFCE: período + "Gerar relação"

## Épico 5 — Concedentes e credenciados

- [ ] DataTable de convênios ativos (busca por coluna, paginação)
- [ ] DataTable de convênios em andamento com pipeline de status
- [ ] Termo de solicitação com checkbox legal bloqueante

## Épico 6 — Parâmetros do sistema

- [ ] Gestão de usuários (RBAC) com filtros por coluna e "Cadastrar"
- [ ] Gestão de cursos
- [ ] Painel read-only da seguradora + "Visualizar" e "Atualizar parâmetros"

## Épico 7 — Gerenciamento de vínculos

- [ ] Painel de intervenção de estágios (auto-complete + tabela de vínculos)
- [ ] Ações destrutivas com modal de dupla confirmação e justificativa
- [ ] Painel de intervenção de jovem aprendiz

## Épico 8 — Filtros de relatórios de estágio

- [ ] Situação Atual (sem período, lista extensa de filtros)
- [ ] Dados Totais (período + campus + curso)
- [ ] Relatório de Alunos (período + lista extensa)

## Épico 9 — Filtros de relatórios de jovem aprendiz

- [ ] Geral
- [ ] Adaptação (60 dias)
- [ ] Flags de risco/desligamento e prévia em tabela ("Consultar")

## Transversal

- [ ] Integração de autenticação com o SIGAA
- [ ] Modelagem completa do schema + RLS por tabela
- [ ] Exportação de relatórios (CSV/XLSX/PDF)
- [ ] Testes de autorização por perfil (matriz RBAC)
- [ ] App Flutter (opcional, mesma base de dados)
