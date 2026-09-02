import type { UUID } from './common';

export type SituacaoAprendiz =
  | 'EM_ANDAMENTO'
  | 'AGUARDANDO_DOCUMENTACAO'
  | 'ENCERRADO'
  | 'DESLIGADO'
  | 'CANCELADO';

export interface JovemAprendiz {
  readonly id: UUID;
  readonly discenteId: UUID;
  readonly empregadorId: UUID;
  readonly professorInstrutorId: UUID | null;
  readonly campusId: UUID;
  readonly cursoId: UUID;
  readonly situacao: SituacaoAprendiz;
  readonly dataInicio: Date;
  readonly dataFim: Date | null;
  readonly propostaAposContrato: boolean;
  readonly empresaIndicada: boolean;
}

/** Avaliação de adaptação dos 60 dias (Épico 9). */
export interface AvaliacaoAdaptacao {
  readonly id: UUID;
  readonly jovemAprendizId: UUID;
  readonly dataAvaliacao: Date;
  readonly adaptado: boolean;
  /** `true` marca o aluno como risco no filtro "Apenas com risco". */
  readonly possuiDificuldade: boolean;
  readonly detalhamento: string | null;
  readonly pedidoDesligamento: boolean;
}
