/** Tipos compartilhados pelo domínio. */

export type UUID = string;

export interface Campus {
  readonly id: UUID;
  readonly nome: string;
  readonly sigla: string;
}

export interface Curso {
  readonly id: UUID;
  readonly nome: string;
  readonly nivel: NivelCurso;
  readonly campusId: UUID;
  readonly ativo: boolean;
}

export type NivelCurso = 'TECNICO_INTEGRADO' | 'TECNICO_SUBSEQUENTE' | 'GRADUACAO' | 'POS_GRADUACAO';

export type Turno = 'MATUTINO' | 'VESPERTINO' | 'NOTURNO' | 'INTEGRAL';

export interface Paginacao {
  readonly pagina: number;
  readonly linhasPorPagina: number;
}

export interface Pagina<T> {
  readonly itens: readonly T[];
  readonly total: number;
  readonly pagina: number;
  readonly linhasPorPagina: number;
}

export interface Periodo {
  readonly inicio: Date;
  readonly fim: Date;
}
