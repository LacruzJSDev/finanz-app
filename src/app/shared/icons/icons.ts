export const AVAILABLE_ICONS = [
  'home',
  'restaurant',
  'shopping_cart',
  'directions_car',
  'local_hospital',
  'school',
  'flight',
  'savings',
  'account_balance',
  'credit_card',
  'work',
] as const;

export type IconName = (typeof AVAILABLE_ICONS)[number];

export const ICON_LABELS: Record<IconName, string> = {
  home: 'Casa',
  restaurant: 'Restaurante',
  shopping_cart: 'Compras',
  directions_car: 'Coche',
  local_hospital: 'Salud',
  school: 'Educación',
  flight: 'Viajes',
  savings: 'Ahorro',
  account_balance: 'Banco',
  credit_card: 'Tarjeta',
  work: 'Trabajo',
};
