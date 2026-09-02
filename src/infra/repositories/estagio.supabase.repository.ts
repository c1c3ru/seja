/**
 * Implementação Supabase da porta `EstagioRepository`.
 *
 * Referência do padrão de adapter: é o ÚNICO lugar do módulo de estágios que
 * conhece nomes de tabela e colunas. Todas as consultas usam o query builder
 * com parâmetros tipados — nunca SQL concatenado.
 */

import 'server-only';

import type { Pagina, Paginacao, UUID } from '@/core/domain/entities/common';
import type { Estagio, SituacaoEstagio } from '@/core/domain/entities/estagio';
import type { EstagioRepository, FiltroEstagio } from '@/core/domain/repositories/estagio.repository';
import type { criarClienteServidor } from '@/infra/supabase/server';

type ClienteSupabase = Awaited<ReturnType<typeof criarClienteServidor>>;

export class EstagioSupabaseRepository implements EstagioRepository {
  constructor(private readonly db: ClienteSupabase) {}

  async buscar(_filtro: FiltroEstagio, _paginacao: Paginacao): Promise<Pagina<Estagio>> {
    // TODO(Épico 2): montar a query com .eq/.ilike por filtro preenchido,
    // aplicar .range() para paginação e mapear via infra/mappers/estagio.mapper.
    throw new Error('EstagioSupabaseRepository.buscar não implementado.');
  }

  async porId(_id: UUID): Promise<Estagio | null> {
    throw new Error('EstagioSupabaseRepository.porId não implementado.');
  }

  async porDiscente(_discenteId: UUID): Promise<readonly Estagio[]> {
    throw new Error('EstagioSupabaseRepository.porDiscente não implementado.');
  }

  async criar(_dados: Omit<Estagio, 'id'>): Promise<Estagio> {
    throw new Error('EstagioSupabaseRepository.criar não implementado.');
  }

  async atualizarSituacao(
    _id: UUID,
    _situacao: SituacaoEstagio,
    _autorId: UUID,
    _justificativa: string,
  ): Promise<void> {
    // Deve gravar também a trilha de auditoria (tabela auditoria_vinculos).
    throw new Error('EstagioSupabaseRepository.atualizarSituacao não implementado.');
  }

  async deletar(_id: UUID, _autorId: UUID, _justificativa: string): Promise<void> {
    throw new Error('EstagioSupabaseRepository.deletar não implementado.');
  }

  async deletarRelatoriosAssinados(
    _estagioId: UUID,
    _autorId: UUID,
    _justificativa: string,
  ): Promise<void> {
    throw new Error('EstagioSupabaseRepository.deletarRelatoriosAssinados não implementado.');
  }
}
