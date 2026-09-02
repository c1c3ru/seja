-- =====================================================================
-- SEJA — migração baseline
-- Cria as tabelas institucionais e a trilha de auditoria. As tabelas de
-- estágio, jovem aprendiz, concedentes e currículos entram nas migrações
-- seguintes, conforme os épicos forem implementados.
--
-- Regra do projeto: TODA tabela nasce com RLS habilitado. Uma tabela sem
-- policy não é "aberta", é inacessível — o que é o padrão seguro.
-- =====================================================================

create extension if not exists "pgcrypto";

-- --------------------------------------------------------------------
-- Perfis institucionais (espelha src/lib/auth/rbac.ts)
-- --------------------------------------------------------------------
create type perfil_usuario as enum (
  'DEEE',
  'APOIO_COORDENACAO',
  'COORDENACAO_ESTAGIO',
  'PROFESSOR_ORIENTADOR',
  'EXTERNO_EMPRESA'
);

create type situacao_usuario as enum ('ATIVO', 'INATIVO');

create type nivel_curso as enum (
  'TECNICO_INTEGRADO',
  'TECNICO_SUBSEQUENTE',
  'GRADUACAO',
  'POS_GRADUACAO'
);

-- --------------------------------------------------------------------
-- Campus e cursos
-- --------------------------------------------------------------------
create table campus (
  id         uuid primary key default gen_random_uuid(),
  nome       text not null,
  sigla      text not null unique,
  criado_em  timestamptz not null default now()
);

create table cursos (
  id         uuid primary key default gen_random_uuid(),
  nome       text not null,
  nivel      nivel_curso not null,
  campus_id  uuid not null references campus (id) on delete restrict,
  ativo      boolean not null default true,
  criado_em  timestamptz not null default now(),
  unique (nome, campus_id)
);

create index cursos_campus_id_idx on cursos (campus_id);

-- --------------------------------------------------------------------
-- Usuários e vínculos de perfil (RBAC)
-- --------------------------------------------------------------------
create table usuarios (
  id           uuid primary key references auth.users (id) on delete cascade,
  nome         text not null,
  email        text not null unique,
  siape        text unique,
  situacao     situacao_usuario not null default 'ATIVO',
  criado_em    timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create table usuario_perfis (
  usuario_id uuid not null references usuarios (id) on delete cascade,
  perfil     perfil_usuario not null,
  primary key (usuario_id, perfil)
);

-- Escopo institucional: base da prevenção a IDOR no backend.
create table usuario_campus (
  usuario_id uuid not null references usuarios (id) on delete cascade,
  campus_id  uuid not null references campus (id) on delete cascade,
  primary key (usuario_id, campus_id)
);

-- --------------------------------------------------------------------
-- Trilha de auditoria — obrigatória nas ações destrutivas (Épico 7)
-- --------------------------------------------------------------------
create table auditoria_acoes (
  id             uuid primary key default gen_random_uuid(),
  autor_id       uuid not null references usuarios (id) on delete restrict,
  perfil_ativo   perfil_usuario not null,
  entidade       text not null,
  entidade_id    uuid not null,
  acao           text not null,
  justificativa  text,
  dados_anteriores jsonb,
  criado_em      timestamptz not null default now()
);

create index auditoria_entidade_idx on auditoria_acoes (entidade, entidade_id);
create index auditoria_autor_idx on auditoria_acoes (autor_id, criado_em desc);

-- --------------------------------------------------------------------
-- Helpers de RLS
-- --------------------------------------------------------------------
create or replace function auth_tem_perfil(perfis perfil_usuario[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from usuario_perfis up
    where up.usuario_id = auth.uid() and up.perfil = any (perfis)
  );
$$;

create or replace function auth_tem_campus(alvo uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select auth_tem_perfil(array['DEEE']::perfil_usuario[])
      or exists (
        select 1 from usuario_campus uc
        where uc.usuario_id = auth.uid() and uc.campus_id = alvo
      );
$$;

-- --------------------------------------------------------------------
-- RLS
-- --------------------------------------------------------------------
alter table campus            enable row level security;
alter table cursos            enable row level security;
alter table usuarios          enable row level security;
alter table usuario_perfis    enable row level security;
alter table usuario_campus    enable row level security;
alter table auditoria_acoes   enable row level security;

create policy campus_leitura_autenticada on campus
  for select to authenticated using (true);

create policy cursos_leitura_autenticada on cursos
  for select to authenticated using (true);

create policy cursos_escrita_deee on cursos
  for all to authenticated
  using (auth_tem_perfil(array['DEEE']::perfil_usuario[]))
  with check (auth_tem_perfil(array['DEEE']::perfil_usuario[]));

create policy usuarios_le_proprio on usuarios
  for select to authenticated using (id = auth.uid());

create policy usuarios_gestao_deee on usuarios
  for all to authenticated
  using (auth_tem_perfil(array['DEEE']::perfil_usuario[]))
  with check (auth_tem_perfil(array['DEEE']::perfil_usuario[]));

create policy perfis_le_proprio on usuario_perfis
  for select to authenticated using (usuario_id = auth.uid());

create policy campus_vinculo_le_proprio on usuario_campus
  for select to authenticated using (usuario_id = auth.uid());

-- Auditoria é append-only e legível apenas pela gestão.
create policy auditoria_leitura_gestao on auditoria_acoes
  for select to authenticated
  using (auth_tem_perfil(array['DEEE', 'COORDENACAO_ESTAGIO']::perfil_usuario[]));
