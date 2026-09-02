/**
 * Higienização de texto livre (observações, detalhamentos, descrições).
 *
 * A defesa principal contra XSS é o escape automático do React: renderize
 * texto como filho de elemento e nunca use `dangerouslySetInnerHTML`. Estas
 * funções cobrem os casos em que o texto sai do React — exportações de
 * relatório, e-mails e PDFs.
 */

const ENTIDADES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

export function escaparHtml(texto: string): string {
  return texto.replace(/[&<>"']/g, (c) => ENTIDADES[c] ?? c);
}

/** Faixas de controle C0 e C1 (tab, CR e LF são preservados por `\s`). */
function ehCaractereDeControle(codigo: number): boolean {
  return codigo < 0x20 || (codigo >= 0x7f && codigo <= 0x9f);
}

/** Remove caracteres de controle e normaliza espaços antes de persistir. */
export function normalizarTextoLivre(texto: string, limite = 1000): string {
  const semControle = Array.from(texto)
    .filter((c) => !ehCaractereDeControle(c.codePointAt(0) ?? 0))
    .join('');

  return semControle.replace(/\s+/g, ' ').trim().slice(0, limite);
}

/**
 * Neutraliza fórmulas em exportações CSV/XLSX (CSV injection): células que
 * começam com = + - @ são executadas ao abrir a planilha no Excel.
 */
export function protegerCelulaCsv(valor: string): string {
  return /^[=+\-@]/.test(valor) ? `'${valor}` : valor;
}
