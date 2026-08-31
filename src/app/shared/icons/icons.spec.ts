import { describe, expect, it } from 'vitest';
import { AVAILABLE_ICONS, ICON_GROUPS, ICON_LABELS, resolveIcon } from './icons';

describe('catálogo de iconos', () => {
  it('no repite un icono en dos grupos', () => {
    // Un duplicado no se vería al pintar, pero dejaría dos opciones con el
    // mismo valor y una de las dos etiquetas perdida en ICON_LABELS.
    const repetidos = AVAILABLE_ICONS.filter(
      (icon, index) => AVAILABLE_ICONS.indexOf(icon) !== index,
    );
    expect(repetidos).toEqual([]);
  });

  it('tiene etiqueta para cada icono', () => {
    const sinEtiqueta = AVAILABLE_ICONS.filter((icon) => !ICON_LABELS[icon]);
    expect(sinEtiqueta).toEqual([]);
  });

  it('no deja grupos vacíos', () => {
    expect(ICON_GROUPS.every((group) => group.icons.length > 0)).toBe(true);
  });
});

describe('resolveIcon', () => {
  it('deja pasar los del catálogo', () => {
    expect(resolveIcon('home')).toBe('home');
  });

  it('sustituye los que ya no ofrecemos', () => {
    // Un icono retirado del catálogo sigue guardado en el servidor: pintar su
    // nombre en letras dentro de la caja es peor que no pintar icono.
    expect(resolveIcon('un_icono_retirado')).toBe('block');
  });

  it('sustituye la ausencia de icono', () => {
    expect(resolveIcon(null)).toBe('block');
    expect(resolveIcon(undefined)).toBe('block');
    expect(resolveIcon('')).toBe('block');
  });
});
