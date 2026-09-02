/**
 * Esquemas Zod compartilhados. Toda entrada vinda do cliente — formulário,
 * query string ou body — passa por um esquema antes de chegar ao serviço.
 */

import { z } from 'zod';

export const uuidSchema = z.uuid();

export const paginacaoSchema = z.object({
  pagina: z.coerce.number().int().min(1).default(1),
  linhasPorPagina: z.coerce.number().int().min(5).max(100).default(10),
});

export const cpfSchema = z
  .string()
  .transform((v) => v.replace(/\D/g, ''))
  .refine((v) => v.length === 11, 'CPF inválido');

export const cnpjSchema = z
  .string()
  .transform((v) => v.replace(/\D/g, ''))
  .refine((v) => v.length === 14, 'CNPJ inválido');

/** CNPJ ou CPF — campo "Concedente ou credenciado" (Épico 2). */
export const documentoSchema = z
  .string()
  .transform((v) => v.replace(/\D/g, ''))
  .refine((v) => v.length === 11 || v.length === 14, 'Informe um CPF ou CNPJ válido');

export const periodoSchema = z
  .object({ inicio: z.coerce.date(), fim: z.coerce.date() })
  .refine((p) => p.inicio <= p.fim, {
    message: 'O início do período deve ser anterior ao fim.',
    path: ['inicio'],
  });

/** Justificativa obrigatória das ações destrutivas (Épico 7). */
export const justificativaSchema = z
  .string()
  .trim()
  .min(20, 'Descreva a justificativa com ao menos 20 caracteres.')
  .max(1000);

export const credenciaisLoginSchema = z.object({
  usuario: z.string().trim().min(1, 'Informe seu usuário.'),
  senha: z.string().min(1, 'Informe sua senha.'),
  souEmpresa: z.boolean().default(false),
});

export type CredenciaisLogin = z.infer<typeof credenciaisLoginSchema>;
