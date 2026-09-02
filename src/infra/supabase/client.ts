/** Cliente Supabase para Client Components. Usa a anon key: sujeito ao RLS. */

'use client';

import { createBrowserClient } from '@supabase/ssr';

import { envPublico } from '@/config/env';
import type { Database } from '@/types/database.types';

export function criarClienteBrowser() {
  return createBrowserClient<Database>(
    envPublico.NEXT_PUBLIC_SUPABASE_URL,
    envPublico.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
