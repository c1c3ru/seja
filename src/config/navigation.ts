/**
 * Sidebar do Épico 1. Cada item declara a permissão exigida; a renderização
 * é filtrada por perfil e reavaliada quando o usuário troca de papel.
 */

import type { Permissao } from '@/lib/auth/rbac';

export interface ItemMenu {
  readonly rotulo: string;
  readonly rota: string;
  readonly permissao: Permissao;
}

export interface GrupoMenu {
  readonly rotulo: string;
  /** Grupos com `filhos` viram accordion; sem filhos, link direto. */
  readonly rota?: string;
  readonly permissao: Permissao;
  readonly filhos?: readonly ItemMenu[];
}

export const MENU_LATERAL: readonly GrupoMenu[] = [
  { rotulo: 'Estágios', rota: '/estagios', permissao: 'estagios:ler' },
  { rotulo: 'Jovem aprendiz', rota: '/jovem-aprendiz', permissao: 'aprendiz:ler' },
  { rotulo: 'Banco de Currículos', rota: '/banco-curriculos', permissao: 'curriculos:ler' },
  {
    rotulo: 'Relatórios',
    permissao: 'relatorios:estagios',
    filhos: [
      { rotulo: 'Relatórios de estágios', rota: '/relatorios-estagios', permissao: 'relatorios:estagios' },
      { rotulo: 'Relatórios de jovem aprendiz', rota: '/relatorios-jovem-aprendiz', permissao: 'relatorios:aprendiz' },
      { rotulo: 'Relatórios de conformidade', rota: '/relatorios-conformidade', permissao: 'relatorios:conformidade' },
    ],
  },
  { rotulo: 'Seguros IFCE', rota: '/seguros-ifce', permissao: 'seguros:ler' },
  {
    rotulo: 'Concedentes e credenciados',
    permissao: 'concedentes:ler',
    filhos: [
      { rotulo: 'Convênios ativos', rota: '/concedentes/convenios-ativos', permissao: 'concedentes:ler' },
      { rotulo: 'Convênios em andamento', rota: '/concedentes/convenios-em-andamento', permissao: 'concedentes:ler' },
      { rotulo: 'Solicitação de convênio', rota: '/concedentes/solicitacao-convenio', permissao: 'concedentes:escrever' },
    ],
  },
  {
    rotulo: 'Parâmetros do sistema',
    permissao: 'parametros:usuarios',
    filhos: [
      { rotulo: 'Usuários', rota: '/parametros/usuarios', permissao: 'parametros:usuarios' },
      { rotulo: 'Cursos', rota: '/parametros/cursos', permissao: 'parametros:cursos' },
      { rotulo: 'Seguradora', rota: '/parametros/seguradora', permissao: 'parametros:seguradora' },
    ],
  },
];

/** Rotas de intervenção crítica (Épico 7), fora do menu principal. */
export const ROTAS_GERENCIAMENTO = {
  estagios: '/gerenciamento-estagios',
  jovemAprendiz: '/gerenciamento-jovem-aprendiz',
} as const;
