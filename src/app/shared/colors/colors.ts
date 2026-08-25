export const AVAILABLE_COLORS = [
  '#f44336',
  '#e91e63',
  '#9c27b0',
  '#673ab7',
  '#3f51b5',
  '#2196f3',
  '#03a9f4',
  '#009688',
  '#4caf50',
  '#8bc34a',
  '#ffc107',
  '#ff9800',
  '#795548',
  '#607d8b',
  '#000000',
] as const;

export type ColorName = (typeof AVAILABLE_COLORS)[number];

export const COLOR_LABELS: Record<ColorName, string> = {
  '#f44336': 'Rojo',
  '#e91e63': 'Rosa',
  '#9c27b0': 'Morado',
  '#673ab7': 'Índigo',
  '#3f51b5': 'Azul oscuro',
  '#2196f3': 'Azul',
  '#03a9f4': 'Celeste',
  '#009688': 'Verde azulado',
  '#4caf50': 'Verde',
  '#8bc34a': 'Verde claro',
  '#ffc107': 'Ámbar',
  '#ff9800': 'Naranja',
  '#795548': 'Marrón',
  '#607d8b': 'Gris azulado',
  '#000000': 'Negro',
};
