/**
 * Guardas de servidor. Nenhuma Server Action / Route Handler sensível deve
 * ler dados sem passar por aqui primeiro.
 */

import 'server-only';

import { ForbiddenError, UnauthorizedError } from '@/core/domain/errors/app-error';
import { temPermissao, type Perfil, type Permissao } from '@/lib/auth/rbac';

export interface SessaoUsuario {
  readonly id: string;
  readonly nome: string;
  readonly perfilAtivo: Perfil;
  readonly perfisDisponiveis: readonly Perfil[];
  /** Escopo institucional do usuário — base da prevenção a IDOR. */
  readonly campusIds: readonly string[];
}

/**
 * TODO(Épico 0): resolver a sessão a partir do cookie assinado emitido no
 * login (SIGAA ou fluxo de empresa). Deve validar assinatura e expiração.
 */
export async function obterSessao(): Promise<SessaoUsuario | null> {
  throw new Error('obterSessao() não implementado — ver Épico 0 (autenticação).');
}

export async function exigirSessao(): Promise<SessaoUsuario> {
  const sessao = await obterSessao();
  if (!sessao) throw new UnauthorizedError();
  return sessao;
}

/** Exige sessão autenticada COM a permissão informada. */
export async function exigirPermissao(permissao: Permissao): Promise<SessaoUsuario> {
  const sessao = await exigirSessao();
  if (!temPermissao(sessao.perfilAtivo, permissao)) {
    throw new ForbiddenError(`Perfil ${sessao.perfilAtivo} não possui a permissão ${permissao}.`);
  }
  return sessao;
}

/**
 * Prevenção a IDOR: confirma que o recurso pertence ao escopo do usuário.
 * Chamar SEMPRE que uma rota receber um ID vindo do cliente.
 */
export function exigirEscopoCampus(sessao: SessaoUsuario, campusIdDoRecurso: string): void {
  if (sessao.perfilAtivo === 'DEEE') return; // visão institucional ampla
  if (!sessao.campusIds.includes(campusIdDoRecurso)) {
    throw new ForbiddenError('Recurso fora do escopo de atuação do usuário.');
  }
}
