import type { Pagina, Paginacao, NivelCurso, Turno, UUID } from '../entities/common';
import type { CategoriaCNH, Curriculo, TipoCandidato } from '../entities/curriculo';

/** Filtros do Banco de Talentos (Épico 3). */
export interface FiltroCurriculo {
  readonly palavraChave?: string;
  readonly cursoId?: UUID;
  readonly nivel?: NivelCurso;
  readonly turnoEstudo?: Turno;
  readonly tipoCandidato?: TipoCandidato;
  readonly cnh?: CategoriaCNH;
  readonly tempoEstagioDesejadoMeses?: number;
  readonly idadeMinima?: number;
  readonly idadeMaxima?: number;
}

export interface CurriculoRepository {
  buscar(filtro: FiltroCurriculo, paginacao: Paginacao): Promise<Pagina<Curriculo>>;
  porId(id: UUID): Promise<Curriculo | null>;
  contar(filtro: FiltroCurriculo): Promise<number>;
}
