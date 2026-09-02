/**
 * Tratamento global de exceções na borda (Route Handlers e Server Actions).
 * Converte qualquer throw em uma resposta segura, sem vazar stack trace.
 */

import { AppError, type CodigoErro } from '@/core/domain/errors/app-error';

export interface RespostaErro {
  readonly ok: false;
  readonly codigo: CodigoErro;
  readonly mensagem: string;
  readonly detalhes?: Record<string, unknown>;
}

export type Resultado<T> = { readonly ok: true; readonly dados: T } | RespostaErro;

function normalizar(erro: unknown): { corpo: RespostaErro; status: number } {
  if (erro instanceof AppError) {
    const corpo: RespostaErro = {
      ok: false,
      codigo: erro.codigo,
      mensagem: erro.mensagemPublica,
      ...(erro.detalhes ? { detalhes: erro.detalhes } : {}),
    };
    return { corpo, status: erro.status };
  }

  // Erro inesperado: registrar internamente, devolver mensagem genérica.
  console.error('[SEJA] erro não tratado:', erro);
  return {
    corpo: {
      ok: false,
      codigo: 'ERRO_INTERNO',
      mensagem: 'Ocorreu um erro inesperado. Tente novamente em instantes.',
    },
    status: 500,
  };
}

/** Envelope para Route Handlers (`app/api/**`). */
export function tratarErroHttp(erro: unknown): Response {
  const { corpo, status } = normalizar(erro);
  return Response.json(corpo, { status });
}

/** Envelope para Server Actions — nunca propaga a exceção ao cliente. */
export async function executarAction<T>(fn: () => Promise<T>): Promise<Resultado<T>> {
  try {
    return { ok: true, dados: await fn() };
  } catch (erro) {
    return normalizar(erro).corpo;
  }
}
