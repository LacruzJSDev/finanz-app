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
