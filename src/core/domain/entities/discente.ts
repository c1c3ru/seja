import type { Turno, UUID } from './common';

export interface Discente {
  readonly id: UUID;
  readonly matricula: string;
  readonly nome: string;
  readonly cpf: string;
  readonly dataNascimento: Date;
  readonly email: string;
  readonly cursoId: UUID;
  readonly campusId: UUID;
  readonly turno: Turno;
  readonly pcd: boolean;
  readonly bairro: string | null;
  readonly cidade: string | null;
}

/** Menor de 18 anos: relevante para o filtro "Discentes Menores" (Épico 2). */
export function ehMenorDeIdade(discente: Discente, referencia: Date = new Date()): boolean {
  const dezoitoAnos = new Date(discente.dataNascimento);
  dezoitoAnos.setFullYear(dezoitoAnos.getFullYear() + 18);
  return referencia < dezoitoAnos;
}
