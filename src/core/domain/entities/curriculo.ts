import type { Turno, UUID } from './common';

export type CategoriaCNH = 'NAO_POSSUI' | 'A' | 'B' | 'AB' | 'C' | 'D' | 'E';

export type TipoCandidato = 'ESTAGIO' | 'JOVEM_APRENDIZ' | 'AMBOS';

/** Card do Banco de Talentos (Épico 3). */
export interface Curriculo {
  readonly id: UUID;
  readonly discenteId: UUID;
  readonly turnoEstudo: Turno;
  readonly tipoCandidato: TipoCandidato;
  readonly cnh: CategoriaCNH;
  readonly tempoEstagioDesejadoMeses: number | null;
  readonly sobreBolsa: string | null;
  readonly tipoEstagioDesejado: string | null;
  readonly areaInteresse: string | null;
  /** Chips "Áreas e/ou Linguagens" (ex.: React, Java, Go). */
  readonly areasLinguagens: readonly string[];
  /** Chips "Habilidades" (ex.: Comunicação, Ética profissional). */
  readonly habilidades: readonly string[];
  readonly publicado: boolean;
  readonly atualizadoEm: Date;
}
