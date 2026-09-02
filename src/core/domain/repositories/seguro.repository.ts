import type { Periodo, UUID } from '../entities/common';
import type { ApoliceSeguro, CoberturaDiscente } from '../entities/seguro';

export interface SeguroRepository {
  apoliceVigente(): Promise<ApoliceSeguro | null>;
  atualizarParametros(id: UUID, dados: Partial<Omit<ApoliceSeguro, 'id'>>): Promise<ApoliceSeguro>;
  /** Relação de discentes cobertos no período (Épico 4, "Gerar relação"). */
  gerarRelacaoCobertura(periodo: Periodo): Promise<readonly CoberturaDiscente[]>;
}
