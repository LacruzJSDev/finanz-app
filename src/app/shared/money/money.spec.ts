import { describe, expect, it } from 'vitest';
import { moneyParts } from './money';

describe('moneyParts', () => {
  it('separa euros, céntimos y símbolo', () => {
    expect(moneyParts(10471)).toEqual({ whole: '104', fraction: ',71', symbol: '€' });
  });

  // es-ES no separa los millares de cuatro cifras, solo a partir de cinco.
  it('mantiene el separador de miles en su sitio, no al final', () => {
    expect(moneyParts(726700).whole).toBe('7267');
    expect(moneyParts(1234500).whole).toBe('12.345');
    expect(moneyParts(123456700).whole).toBe('1.234.567');
  });

  it('el signo va con los euros, no suelto', () => {
    expect(moneyParts(-2600).whole).toBe('-26');
  });
});
