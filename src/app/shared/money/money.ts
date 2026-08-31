export function eurosToCents(euros: number): number {
  return Math.round(euros * 100);
}

export function centsToEuros(cents: number): number {
  return cents / 100;
}

// El mismo formato que el pipe, pero alcanzable desde TypeScript: hay sitios
// que necesitan el importe ya escrito y no pasan por una plantilla, como el
// subtítulo de la barra superior.
export function formatMoney(cents: number, currency = 'EUR'): string {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency }).format(
    centsToEuros(cents),
  );
}

/**
 * El importe partido en sus piezas, para poder pintar los céntimos más
 * pequeños que los euros. Sale de `formatToParts`, así que respeta el separador
 * y la posición del símbolo del idioma en vez de suponerlos.
 */
export function moneyParts(
  cents: number,
  currency = 'EUR',
): { whole: string; fraction: string; symbol: string } {
  const parts = new Intl.NumberFormat('es-ES', { style: 'currency', currency }).formatToParts(
    centsToEuros(cents),
  );
  // En el orden en que vienen: el separador de miles va entre dos grupos de
  // dígitos, así que juntar por tipo lo dejaría al final.
  const join = (...types: Intl.NumberFormatPartTypes[]) =>
    parts
      .filter((part) => types.includes(part.type))
      .map((part) => part.value)
      .join('');

  return {
    whole: join('minusSign', 'integer', 'group'),
    fraction: join('decimal', 'fraction'),
    symbol: join('currency'),
  };
}
