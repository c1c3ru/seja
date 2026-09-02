import type { Pagina, Paginacao, UUID } from '../entities/common';
import type { SituacaoUsuario, Usuario } from '../entities/usuario';

export interface FiltroUsuario {
  readonly nome?: string;
  readonly campusId?: UUID;
  readonly situacao?: SituacaoUsuario;
}

export interface UsuarioRepository {
  buscar(filtro: FiltroUsuario, paginacao: Paginacao): Promise<Pagina<Usuario>>;
  porId(id: UUID): Promise<Usuario | null>;
  criar(dados: Omit<Usuario, 'id'>): Promise<Usuario>;
  atualizar(id: UUID, dados: Partial<Omit<Usuario, 'id'>>): Promise<Usuario>;
}
