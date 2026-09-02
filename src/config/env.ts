/**
 * Validação das variáveis de ambiente na inicialização.
 * Falhar cedo é melhor do que descobrir a chave ausente em produção.
 */

import { z } from 'zod';

const esquemaPublico = z.object({
  NEXT_PUBLIC_APP_ENV: z.enum(['development', 'homologacao', 'production']),
  NEXT_PUBLIC_APP_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
});

const esquemaServidor = esquemaPublico.extend({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  SESSION_SECRET: z.string().min(32, 'SESSION_SECRET precisa de ao menos 32 caracteres'),
  SESSION_MAX_AGE: z.coerce.number().int().positive().default(28800),
  SIGAA_AUTH_URL: z.url().optional(),
  SIGAA_CLIENT_ID: z.string().optional(),
  SIGAA_CLIENT_SECRET: z.string().optional(),
});

export type EnvPublico = z.infer<typeof esquemaPublico>;
export type EnvServidor = z.infer<typeof esquemaServidor>;

/** Seguro no browser: apenas variáveis NEXT_PUBLIC_*. */
export const envPublico: EnvPublico = esquemaPublico.parse({
  NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
});

/** Somente servidor. Chamar dentro de módulos com `import 'server-only'`. */
export function envServidor(): EnvServidor {
  return esquemaServidor.parse(process.env);
}

export const ehHomologacao = envPublico.NEXT_PUBLIC_APP_ENV === 'homologacao';
export const ehProducao = envPublico.NEXT_PUBLIC_APP_ENV === 'production';

/** Tag exibida no cabeçalho (Épico 1). `null` esconde o badge em produção. */
export const rotuloAmbiente: string | null = ehProducao
  ? null
  : ehHomologacao
    ? 'Homologação'
    : 'Desenvolvimento';
