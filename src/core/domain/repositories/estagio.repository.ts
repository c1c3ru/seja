/**
 * Porta de persistência de estágios. O domínio define a interface; a camada
 * de infraestrutura fornece a implementação Supabase. Serviços dependem
 * apenas deste contrato.
 */

import type { Pagina, Paginacao, UUID } from '../entities/common';
import type { Estagio, SituacaoEstagio, TipoEstagio } from '../entities/estagio';

/** Filtros do buscador avançado (Épico 2). */
export interface FiltroEstagio {
  readonly campusId?: UUID;
  readonly nomeDiscente?: string;
  readonly discentePcd?: boolean;
  readonly tipoConcedente?: string;
  readonly concedenteDocumento?: string;
  readonly orientadorId?: UUID;
  readonly tipoEstagio?: TipoEstagio;
  readonly cursoId?: UUID;
  readonly situacao?: SituacaoEstagio;
}

export interface EstagioRepository {
  buscar(filtro: FiltroEstagio, paginacao: Paginacao): Promise<Pagina<Estagio>>;
  porId(id: UUID): Promise<Estagio | null>;
  porDiscente(discenteId: UUID): Promise<readonly Estagio[]>;
  criar(dados: Omit<Estagio, 'id'>): Promise<Estagio>;
  atualizarSituacao(id: UUID, situacao: SituacaoEstagio, autorId: UUID, justificativa: string): Promise<void>;
  deletar(id: UUID, autorId: UUID, justificativa: string): Promise<void>;
  deletarRelatoriosAssinados(estagioId: UUID, autorId: UUID, justificativa: string): Promise<void>;
}
