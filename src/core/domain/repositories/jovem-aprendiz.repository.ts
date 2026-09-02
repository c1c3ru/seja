import type { Pagina, Paginacao, Periodo, UUID } from '../entities/common';
import type { AvaliacaoAdaptacao, JovemAprendiz, SituacaoAprendiz } from '../entities/jovem-aprendiz';

export interface FiltroJovemAprendiz {
  readonly campusId?: UUID;
  readonly nomeDiscente?: string;
  readonly discentePcd?: boolean;
  readonly apenasMenores?: boolean;
  readonly empregadorId?: UUID;
  readonly professorInstrutorId?: UUID;
  readonly cursoId?: UUID;
  readonly situacao?: SituacaoAprendiz;
}

/** Filtros do relatório de adaptação de 60 dias (Épico 9). */
export interface FiltroAdaptacao {
  readonly periodo: Periodo;
  readonly campusId?: UUID;
  readonly cursoId?: UUID;
  readonly empregadorId?: UUID;
  readonly apenasComRisco?: boolean;
  readonly apenasComPedidoDesligamento?: boolean;
}

export interface JovemAprendizRepository {
  buscar(filtro: FiltroJovemAprendiz, paginacao: Paginacao): Promise<Pagina<JovemAprendiz>>;
  porId(id: UUID): Promise<JovemAprendiz | null>;
  porDiscente(discenteId: UUID): Promise<readonly JovemAprendiz[]>;
  atualizarSituacao(id: UUID, situacao: SituacaoAprendiz, autorId: UUID, justificativa: string): Promise<void>;
  deletar(id: UUID, autorId: UUID, justificativa: string): Promise<void>;
  listarAdaptacoes(filtro: FiltroAdaptacao): Promise<readonly AvaliacaoAdaptacao[]>;
}
