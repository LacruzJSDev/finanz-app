/**
 * La paleta, ordenada por familias para que el desplegable se lea como un
 * espectro y no como una lista de nombres sueltos.
 *
 * Todos son tonos medios u oscuros a propósito: el color se usa tal cual para
 * el icono y al 18% para su fondo, y un pastel deja las dos cosas ilegibles.
 */
const COLORS = [
  { value: '#f44336', label: 'Rojo' },
  { value: '#b71c1c', label: 'Rojo oscuro' },
  { value: '#ff5722', label: 'Teja' },
  { value: '#e91e63', label: 'Rosa' },
  { value: '#880e4f', label: 'Rosa oscuro' },
  { value: '#9c27b0', label: 'Morado' },
  { value: '#4a148c', label: 'Morado oscuro' },
  { value: '#673ab7', label: 'Violeta' },
  { value: '#3f51b5', label: 'Índigo' },
  { value: '#1a237e', label: 'Azul marino' },
  { value: '#2196f3', label: 'Azul' },
  { value: '#0d47a1', label: 'Azul oscuro' },
  { value: '#03a9f4', label: 'Celeste' },
  { value: '#00bcd4', label: 'Turquesa' },
  { value: '#006064', label: 'Turquesa oscuro' },
  { value: '#009688', label: 'Verde azulado' },
  { value: '#4caf50', label: 'Verde' },
  { value: '#1b5e20', label: 'Verde oscuro' },
  { value: '#8bc34a', label: 'Verde claro' },
  { value: '#827717', label: 'Oliva' },
  { value: '#ffc107', label: 'Ámbar' },
  { value: '#ff9800', label: 'Naranja' },
  { value: '#e65100', label: 'Naranja oscuro' },
  { value: '#795548', label: 'Marrón' },
  { value: '#3e2723', label: 'Chocolate' },
  { value: '#607d8b', label: 'Gris azulado' },
  { value: '#263238', label: 'Pizarra' },
  { value: '#9e9e9e', label: 'Gris' },
  { value: '#000000', label: 'Negro' },
] as const;

export type ColorName = (typeof COLORS)[number]['value'];

export const AVAILABLE_COLORS: readonly ColorName[] = COLORS.map((color) => color.value);

export const COLOR_LABELS = Object.fromEntries(
  COLORS.map((color) => [color.value, color.label]),
) as Record<ColorName, string>;
