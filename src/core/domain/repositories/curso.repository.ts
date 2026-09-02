import type { Curso, Pagina, Paginacao, UUID } from '../entities/common';

export interface CursoRepository {
  buscar(nome: string | undefined, paginacao: Paginacao): Promise<Pagina<Curso>>;
  porId(id: UUID): Promise<Curso | null>;
  criar(dados: Omit<Curso, 'id'>): Promise<Curso>;
  atualizar(id: UUID, dados: Partial<Omit<Curso, 'id'>>): Promise<Curso>;
}
