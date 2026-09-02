import type { UUID } from './common';

export type TipoEstagio = 'OBRIGATORIO' | 'NAO_OBRIGATORIO';

export type SituacaoEstagio =
  | 'EM_ANDAMENTO'
  | 'AGUARDANDO_DOCUMENTACAO'
  | 'AGUARDANDO_APROVACAO'
  | 'ENCERRADO'
  | 'CANCELADO'
  | 'RESCINDIDO';

export interface Estagio {
  readonly id: UUID;
  readonly discenteId: UUID;
  readonly concedenteId: UUID;
  readonly orientadorId: UUID | null;
  readonly campusId: UUID;
  readonly cursoId: UUID;
  readonly tipo: TipoEstagio;
  readonly situacao: SituacaoEstagio;
  readonly dataInicio: Date;
  readonly dataFim: Date | null;
  readonly propostaAposEstagio: boolean;
  readonly empresaIndicada: boolean;
}

/** Transições permitidas — barra mudanças de estado inválidas no serviço. */
export const TRANSICOES_SITUACAO: Record<SituacaoEstagio, readonly SituacaoEstagio[]> = {
  AGUARDANDO_DOCUMENTACAO: ['AGUARDANDO_APROVACAO', 'CANCELADO'],
  AGUARDANDO_APROVACAO: ['EM_ANDAMENTO', 'AGUARDANDO_DOCUMENTACAO', 'CANCELADO'],
  EM_ANDAMENTO: ['ENCERRADO', 'RESCINDIDO'],
  ENCERRADO: [],
  CANCELADO: [],
  RESCINDIDO: [],
};

export function podeTransicionar(de: SituacaoEstagio, para: SituacaoEstagio): boolean {
  return TRANSICOES_SITUACAO[de].includes(para);
}
