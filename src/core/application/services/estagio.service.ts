/**
 * Serviço de estágios — camada de regras de negócio.
 *
 * Referência do padrão para os demais serviços do sistema:
 *   Route Handler / Server Action  →  Service  →  Repository  →  Banco
 *
 * O serviço não conhece HTTP nem Supabase. Recebe a sessão já autenticada e
 * decide o que é permitido; a permissão granular é checada na borda pelo
 * `exigirPermissao`, e o escopo institucional é revalidado aqui, por recurso.
 */

import type { Pagina, Paginacao, UUID } from '@/core/domain/entities/common';
import {
  podeTransicionar,
  type Estagio,
  type SituacaoEstagio,
} from '@/core/domain/entities/estagio';
import { BusinessRuleError, NotFoundError, ValidationError } from '@/core/domain/errors/app-error';
import type { EstagioRepository, FiltroEstagio } from '@/core/domain/repositories/estagio.repository';
import { exigirEscopoCampus, type SessaoUsuario } from '@/lib/auth/guard';

const JUSTIFICATIVA_MINIMA = 20;

export class EstagioService {
  constructor(private readonly repo: EstagioRepository) {}

  async buscar(
    sessao: SessaoUsuario,
    filtro: FiltroEstagio,
    paginacao: Paginacao,
  ): Promise<Pagina<Estagio>> {
    // Orientador só enxerga os vínculos que orienta.
    const escopo: FiltroEstagio =
      sessao.perfilAtivo === 'PROFESSOR_ORIENTADOR'
        ? { ...filtro, orientadorId: sessao.id }
        : filtro;

    return this.repo.buscar(escopo, paginacao);
  }

  async porId(sessao: SessaoUsuario, id: UUID): Promise<Estagio> {
    const estagio = await this.repo.porId(id);
    if (!estagio) throw new NotFoundError('Estágio');

    // Prevenção a IDOR: o ID veio do cliente, o escopo vem da sessão.
    exigirEscopoCampus(sessao, estagio.campusId);
    return estagio;
  }

  async mudarSituacao(
    sessao: SessaoUsuario,
    id: UUID,
    novaSituacao: SituacaoEstagio,
    justificativa: string,
  ): Promise<void> {
    const estagio = await this.porId(sessao, id);

    if (!podeTransicionar(estagio.situacao, novaSituacao)) {
      throw new BusinessRuleError(
        `Não é possível alterar a situação de "${estagio.situacao}" para "${novaSituacao}".`,
      );
    }

    this.validarJustificativa(justificativa);
    await this.repo.atualizarSituacao(id, novaSituacao, sessao.id, justificativa);
  }

  /** Ação destrutiva: exige dupla confirmação na UI e justificativa aqui. */
  async deletar(sessao: SessaoUsuario, id: UUID, justificativa: string): Promise<void> {
    const estagio = await this.porId(sessao, id);
    this.validarJustificativa(justificativa);
    await this.repo.deletar(estagio.id, sessao.id, justificativa);
  }

  async deletarRelatoriosAssinados(
    sessao: SessaoUsuario,
    id: UUID,
    justificativa: string,
  ): Promise<void> {
    const estagio = await this.porId(sessao, id);
    this.validarJustificativa(justificativa);
    await this.repo.deletarRelatoriosAssinados(estagio.id, sessao.id, justificativa);
  }

  private validarJustificativa(justificativa: string): void {
    if (justificativa.trim().length < JUSTIFICATIVA_MINIMA) {
      throw new ValidationError(
        `A justificativa deve ter ao menos ${JUSTIFICATIVA_MINIMA} caracteres.`,
      );
    }
  }
}
