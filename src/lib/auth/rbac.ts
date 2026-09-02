/**
 * RBAC — Controle de Acesso Baseado em Papéis.
 *
 * Fonte única de verdade das permissões. Usado tanto pelo frontend (para
 * ocultar itens de menu) quanto pelo backend. O frontend esconde; o backend
 * decide. Toda rota sensível DEVE chamar `assertPermission` no servidor.
 */

export const PERFIS = ['DEEE', 'APOIO_COORDENACAO', 'COORDENACAO_ESTAGIO', 'PROFESSOR_ORIENTADOR', 'EXTERNO_EMPRESA'] as const;

export type Perfil = (typeof PERFIS)[number];

export const PERFIL_LABEL: Record<Perfil, string> = {
  DEEE: 'DEEE',
  APOIO_COORDENACAO: 'Apoio de Coordenação',
  COORDENACAO_ESTAGIO: 'Coordenação de Estágio',
  PROFESSOR_ORIENTADOR: 'Professor Orientador',
  EXTERNO_EMPRESA: 'Empresa',
};

/** Perfis exibidos no seletor do cabeçalho (Épico 1) — empresa não entra. */
export const PERFIS_INTERNOS: readonly Perfil[] = [
  'DEEE',
  'APOIO_COORDENACAO',
  'COORDENACAO_ESTAGIO',
  'PROFESSOR_ORIENTADOR',
];

export const PERMISSOES = [
  'estagios:ler',
  'estagios:escrever',
  'estagios:mudar_situacao',
  'estagios:deletar',
  'aprendiz:ler',
  'aprendiz:escrever',
  'aprendiz:mudar_situacao',
  'aprendiz:deletar',
  'curriculos:ler',
  'curriculos:exportar',
  'relatorios:estagios',
  'relatorios:aprendiz',
  'relatorios:conformidade',
  'seguros:ler',
  'seguros:gerar_relacao',
  'concedentes:ler',
  'concedentes:escrever',
  'concedentes:alterar_status',
  'convenio:solicitar',
  'parametros:usuarios',
  'parametros:cursos',
  'parametros:seguradora',
] as const;

export type Permissao = (typeof PERMISSOES)[number];

const COORDENACAO: readonly Permissao[] = [
  'estagios:ler',
  'estagios:escrever',
  'estagios:mudar_situacao',
  'estagios:deletar',
  'aprendiz:ler',
  'aprendiz:escrever',
  'aprendiz:mudar_situacao',
  'aprendiz:deletar',
  'curriculos:ler',
  'curriculos:exportar',
  'relatorios:estagios',
  'relatorios:aprendiz',
  'relatorios:conformidade',
  'seguros:ler',
  'seguros:gerar_relacao',
  'concedentes:ler',
  'concedentes:escrever',
  'concedentes:alterar_status',
];

export const MATRIZ_PERMISSOES: Record<Perfil, readonly Permissao[]> = {
  // DEEE: gestão ampla — todas as permissões, inclusive parâmetros globais.
  DEEE: PERMISSOES,

  COORDENACAO_ESTAGIO: COORDENACAO,

  // Apoio: suporte a validação de documentos/convênios; sem ações destrutivas.
  APOIO_COORDENACAO: [
    'estagios:ler',
    'estagios:escrever',
    'aprendiz:ler',
    'aprendiz:escrever',
    'curriculos:ler',
    'relatorios:estagios',
    'relatorios:aprendiz',
    'relatorios:conformidade',
    'seguros:ler',
    'concedentes:ler',
    'concedentes:escrever',
  ],

  // Orientador: acompanhamento pedagógico, somente leitura dos seus vínculos.
  PROFESSOR_ORIENTADOR: [
    'estagios:ler',
    'aprendiz:ler',
    'curriculos:ler',
    'relatorios:estagios',
  ],

  // Empresa: fluxo bifurcado do login, apenas solicitação de convênio.
  EXTERNO_EMPRESA: ['convenio:solicitar'],
};

export function temPermissao(perfil: Perfil, permissao: Permissao): boolean {
  return MATRIZ_PERMISSOES[perfil].includes(permissao);
}

export function temAlgumaPermissao(perfil: Perfil, permissoes: readonly Permissao[]): boolean {
  return permissoes.some((p) => temPermissao(perfil, p));
}

export function isPerfil(valor: unknown): valor is Perfil {
  return typeof valor === 'string' && (PERFIS as readonly string[]).includes(valor);
}
