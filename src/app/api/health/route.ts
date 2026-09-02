/** Health check para o pipeline de deploy. Não expõe dados sensíveis. */

import { envPublico } from '@/config/env';

export function GET() {
  return Response.json({ status: 'ok', ambiente: envPublico.NEXT_PUBLIC_APP_ENV });
}
