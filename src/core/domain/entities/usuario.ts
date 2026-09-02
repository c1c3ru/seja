import type { Perfil } from '@/lib/auth/rbac';

import type { UUID } from './common';

export type SituacaoUsuario = 'ATIVO' | 'INATIVO';

export interface Usuario {
  readonly id: UUID;
  readonly nome: string;
  readonly email: string;
  readonly siape: string | null;
  readonly perfis: readonly Perfil[];
  readonly campusIds: readonly UUID[];
  readonly situacao: SituacaoUsuario;
}
