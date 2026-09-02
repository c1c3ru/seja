import type { UUID } from './common';

/** Parâmetros contratuais da seguradora (Épico 6, painel read-only). */
export interface ApoliceSeguro {
  readonly id: UUID;
  readonly razaoSocial: string;
  readonly cnpj: string;
  readonly numeroApolice: string;
  readonly vigenciaInicio: Date;
  readonly vigenciaFim: Date;
  readonly telefonesEmergencia: readonly string[];
  readonly premioInvalidezCentavos: number;
  readonly premioMorteCentavos: number;
  readonly despesasMedicasCentavos: number;
  readonly urlDocumento: string | null;
}

export interface CoberturaDiscente {
  readonly discenteId: UUID;
  readonly apoliceId: UUID;
  readonly inicioCobertura: Date;
  readonly fimCobertura: Date;
}
