/**
 * Tipos gerados do schema do Supabase.
 *
 * Gerar com: npm run db:types
 * Este placeholder existe apenas para o projeto compilar antes do primeiro
 * `supabase gen types`. Não editar manualmente após a geração.
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: Record<string, never>;
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
