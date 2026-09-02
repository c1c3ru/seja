/**
 * Cliente Supabase para Server Components, Server Actions e Route Handlers.
 * Continua sob RLS — é a sessão do usuário, não um bypass.
 */

import 'server-only';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

import { envPublico } from '@/config/env';
import type { Database } from '@/types/database.types';

export async function criarClienteServidor() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    envPublico.NEXT_PUBLIC_SUPABASE_URL,
    envPublico.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesParaDefinir) => {
          try {
            for (const { name, value, options } of cookiesParaDefinir) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Server Component não pode escrever cookies; o proxy renova a sessão.
          }
        },
      },
    },
  );
}
