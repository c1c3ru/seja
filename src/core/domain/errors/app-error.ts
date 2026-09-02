/**
 * Hierarquia de erros de domínio.
 *
 * Regra: nenhuma stack trace ou mensagem crua de banco chega ao usuário final.
 * `mensagemPublica` é o único texto seguro para renderizar em toast/tela.
 */

export type CodigoErro =
  | 'NAO_AUTENTICADO'
  | 'SEM_PERMISSAO'
  | 'NAO_ENCONTRADO'
  | 'VALIDACAO'
  | 'CONFLITO'
  | 'REGRA_DE_NEGOCIO'
  | 'ERRO_INTERNO';

export class AppError extends Error {
  readonly codigo: CodigoErro;
  readonly status: number;
  readonly mensagemPublica: string;
  readonly detalhes?: Record<string, unknown>;

  constructor(
    codigo: CodigoErro,
    status: number,
    mensagemPublica: string,
    mensagemInterna?: string,
    detalhes?: Record<string, unknown>,
  ) {
    super(mensagemInterna ?? mensagemPublica);
    this.name = new.target.name;
    this.codigo = codigo;
    this.status = status;
    this.mensagemPublica = mensagemPublica;
    if (detalhes) this.detalhes = detalhes;
  }
}

export class UnauthorizedError extends AppError {
  constructor(mensagemInterna?: string) {
    super('NAO_AUTENTICADO', 401, 'Sessão expirada. Faça login novamente.', mensagemInterna);
  }
}

export class ForbiddenError extends AppError {
  constructor(mensagemInterna?: string) {
    super('SEM_PERMISSAO', 403, 'Você não tem permissão para executar esta ação.', mensagemInterna);
  }
}

export class NotFoundError extends AppError {
  constructor(recurso: string, mensagemInterna?: string) {
    super('NAO_ENCONTRADO', 404, `${recurso} não encontrado.`, mensagemInterna);
  }
}

export class ValidationError extends AppError {
  constructor(mensagemPublica: string, detalhes?: Record<string, unknown>) {
    super('VALIDACAO', 422, mensagemPublica, undefined, detalhes);
  }
}

export class BusinessRuleError extends AppError {
  constructor(mensagemPublica: string, mensagemInterna?: string) {
    super('REGRA_DE_NEGOCIO', 409, mensagemPublica, mensagemInterna);
  }
}
