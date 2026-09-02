import type { UUID } from './common';

export type TipoConcedente = 'EMPRESA_PRIVADA' | 'ORGAO_PUBLICO' | 'AGENTE_INTEGRACAO' | 'PROFISSIONAL_LIBERAL';

export type SituacaoConvenio = 'CONVENIADA' | 'EM_ANDAMENTO' | 'EXPIRADA' | 'RECUSADA';

/** Pipeline da tabela "Convênios em andamento" (Épico 5). */
export type StatusPipelineConvenio =
  | 'ANALISE_INICIAL'
  | 'AGUARDANDO_ASSINATURA_EMPRESA'
  | 'AGUARDANDO_ASSINATURA_REITOR'
  | 'ULTIMA_CONVOCACAO'
  | 'CONCLUIDO'
  | 'ARQUIVADO';

export interface Concedente {
  readonly id: UUID;
  readonly razaoSocial: string;
  readonly nomeFantasia: string | null;
  /** CNPJ ou CPF (profissional liberal), somente dígitos. */
  readonly documento: string;
  readonly tipo: TipoConcedente;
  readonly situacao: SituacaoConvenio;
  readonly ultimoEditorId: UUID | null;
  readonly atualizadoEm: Date;
}

export interface SolicitacaoConvenio {
  readonly id: UUID;
  readonly concedenteId: UUID;
  readonly status: StatusPipelineConvenio;
  readonly solicitanteId: UUID;
  /** Assinatura eletrônica obrigatória do termo (Épico 5). */
  readonly termoReconhecimentoAceito: boolean;
  readonly criadoEm: Date;
  readonly atualizadoEm: Date;
}
