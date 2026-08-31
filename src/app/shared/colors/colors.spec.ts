import { describe, expect, it } from 'vitest';
import { AVAILABLE_COLORS, COLOR_LABELS } from './colors';

describe('paleta', () => {
  it('no repite un color', () => {
    const repetidos = AVAILABLE_COLORS.filter(
      (color, index) => AVAILABLE_COLORS.indexOf(color) !== index,
    );
    expect(repetidos).toEqual([]);
  });

  it('no repite una etiqueta', () => {
    // Dos "Verde" en el desplegable no se pueden distinguir más que por el
    // círculo, y ese es justo el detalle que no se mira.
    const etiquetas = AVAILABLE_COLORS.map((color) => COLOR_LABELS[color]);
    expect(new Set(etiquetas).size).toBe(etiquetas.length);
  });

  it('usa hexadecimales de seis dígitos', () => {
    expect(AVAILABLE_COLORS.every((color) => /^#[0-9a-f]{6}$/.test(color))).toBe(true);
  });
});
