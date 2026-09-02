import type { Pagina, Paginacao, UUID } from '../entities/common';
import type {
  Concedente,
  SituacaoConvenio,
  SolicitacaoConvenio,
  StatusPipelineConvenio,
} from '../entities/concedente';

export interface FiltroConcedente {
  readonly termo?: string;
  readonly documento?: string;
  readonly situacao?: SituacaoConvenio;
}

export interface ConcedenteRepository {
  listarConveniosAtivos(filtro: FiltroConcedente, paginacao: Paginacao): Promise<Pagina<Concedente>>;
  listarConveniosEmAndamento(paginacao: Paginacao): Promise<Pagina<SolicitacaoConvenio>>;
  porId(id: UUID): Promise<Concedente | null>;
  criarSolicitacao(dados: Omit<SolicitacaoConvenio, 'id' | 'criadoEm' | 'atualizadoEm'>): Promise<SolicitacaoConvenio>;
  alterarStatus(solicitacaoId: UUID, status: StatusPipelineConvenio, autorId: UUID): Promise<void>;
}
