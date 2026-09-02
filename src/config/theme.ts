/**
 * Identidade visual institucional do IFCE.
 * Ajustar os hex conforme o manual de marca oficial antes do primeiro release.
 */

export const CORES = {
  verdeInstitucional: '#1B7E3C',
  verdeEscuro: '#0F5228',
  verdeClaro: '#3FA35F',
  cinzaFundo: '#F4F5F7',
  cinzaBorda: '#D9DCE1',
  textoPrimario: '#1F2933',
  textoSecundario: '#5A6572',
  branco: '#FFFFFF',
  erro: '#C0271A',
  alerta: '#D98324',
  sucesso: '#1B7E3C',
} as const;

export type Cor = keyof typeof CORES;
