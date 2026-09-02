/**
 * Cliente administrativo — BYPASSA o RLS.
 *
 * Uso restrito a rotinas internas (cron jobs, sincronização com o SIGAA,
 * migrações de dados). NUNCA importar em Client Components e NUNCA usar
 * para atender requisição de usuário sem checagem explícita de permissão.
 */

import 'server-only';

import { createClient } from '@supabase/supabase-js';

import { envPublico, envServidor } from '@/config/env';
import type { Database } from '@/types/database.types';

export function criarClienteAdmin() {
  return createClient<Database>(
    envPublico.NEXT_PUBLIC_SUPABASE_URL,
    envServidor().SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
