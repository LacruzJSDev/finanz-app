import { describe, expect, it } from 'vitest';
import { addMonths, dateToIso, endOfMonth, startOfMonth } from './date';

describe('límites de mes', () => {
  it('el último día sale del día 0 del mes siguiente', () => {
    expect(dateToIso(endOfMonth(new Date(2026, 1, 15)))).toBe('2026-02-28');
    expect(dateToIso(endOfMonth(new Date(2024, 1, 15)))).toBe('2024-02-29');
    expect(dateToIso(endOfMonth(new Date(2026, 7, 3)))).toBe('2026-08-31');
  });

  it('el primero es el día 1', () => {
    expect(dateToIso(startOfMonth(new Date(2026, 7, 31)))).toBe('2026-08-01');
  });

  it('sumar meses cruza el año sin aritmética a mano', () => {
    expect(dateToIso(addMonths(new Date(2026, 11, 1), 1))).toBe('2027-01-01');
    expect(dateToIso(addMonths(new Date(2026, 0, 1), -1))).toBe('2025-12-01');
  });

  it('retroceder desde un día 31 no se va al mes equivocado', () => {
    expect(dateToIso(addMonths(new Date(2026, 6, 31), -1))).toBe('2026-06-01');
  });
});
