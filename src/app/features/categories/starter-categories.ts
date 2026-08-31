import { ColorName } from '../../shared/colors/colors';
import { IconName } from '../../shared/icons/icons';

/**
 * Tipada contra los catálogos a propósito: un icono o un color que no
 * existan son un fallo de compilación, no un cuadrado vacío en la lista.
 */
export interface StarterCategory {
  name: string;
  color: ColorName;
  icon: IconName;
  children: readonly { name: string; icon: IconName }[];
}

/**
 * El punto de partida que se ofrece a un grupo recién hecho: los doce sitios
 * por los que se va el dinero en una casa, cada uno con el desglose que de
 * verdad se mira al repasar el mes.
 *
 * No pretende ser exhaustiva ni definitiva. Es un borrador editable: se crean
 * como categorías normales, así que sobra con archivar lo que no se use y
 * renombrar lo que se llame de otra manera en cada casa.
 */
export const STARTER_CATEGORIES: readonly StarterCategory[] = [
  {
    name: 'Vivienda',
    color: '#3f51b5',
    icon: 'home',
    children: [
      { name: 'Alquiler o hipoteca', icon: 'home' },
      { name: 'Luz', icon: 'lightbulb' },
      { name: 'Agua', icon: 'invert_colors' },
      { name: 'Gas', icon: 'local_fire_department' },
      { name: 'Internet y móvil', icon: 'wifi' },
      { name: 'Reparaciones', icon: 'build' },
    ],
  },
  {
    name: 'Alimentación',
    color: '#4caf50',
    icon: 'shopping_cart',
    children: [
      { name: 'Supermercado', icon: 'shopping_cart' },
      { name: 'Restaurantes', icon: 'restaurant' },
      { name: 'Cafés', icon: 'local_cafe' },
      { name: 'Comida a domicilio', icon: 'lunch_dining' },
    ],
  },
  {
    name: 'Transporte',
    color: '#2196f3',
    icon: 'directions_car',
    children: [
      { name: 'Gasolina', icon: 'local_gas_station' },
      { name: 'Transporte público', icon: 'directions_bus' },
      { name: 'Aparcamiento', icon: 'local_parking' },
      { name: 'Taxi', icon: 'local_taxi' },
      { name: 'Mantenimiento', icon: 'build' },
    ],
  },
  {
    name: 'Salud',
    color: '#f44336',
    icon: 'local_hospital',
    children: [
      { name: 'Médico', icon: 'local_hospital' },
      { name: 'Farmacia', icon: 'medication' },
      { name: 'Gimnasio', icon: 'fitness_center' },
      { name: 'Cuidado personal', icon: 'spa' },
    ],
  },
  {
    name: 'Ocio',
    color: '#9c27b0',
    icon: 'celebration',
    children: [
      { name: 'Cine y series', icon: 'movie' },
      { name: 'Música', icon: 'music_note' },
      { name: 'Videojuegos', icon: 'sports_esports' },
      { name: 'Libros', icon: 'menu_book' },
      { name: 'Salir', icon: 'local_bar' },
    ],
  },
  {
    name: 'Compras',
    color: '#e91e63',
    icon: 'shopping_bag',
    children: [
      { name: 'Ropa', icon: 'checkroom' },
      { name: 'Hogar', icon: 'chair' },
      { name: 'Tecnología', icon: 'phone_iphone' },
      { name: 'Regalos', icon: 'card_giftcard' },
    ],
  },
  {
    name: 'Suscripciones',
    color: '#00bcd4',
    icon: 'subscriptions',
    children: [
      { name: 'Streaming', icon: 'movie' },
      { name: 'Software', icon: 'computer' },
      { name: 'Otras suscripciones', icon: 'subscriptions' },
    ],
  },
  {
    name: 'Educación',
    color: '#ff9800',
    icon: 'school',
    children: [
      { name: 'Cursos', icon: 'school' },
      { name: 'Material', icon: 'menu_book' },
    ],
  },
  {
    name: 'Viajes',
    color: '#03a9f4',
    icon: 'flight',
    children: [
      { name: 'Transporte', icon: 'flight' },
      { name: 'Alojamiento', icon: 'hotel' },
      { name: 'Actividades', icon: 'beach_access' },
    ],
  },
  {
    name: 'Impuestos y seguros',
    color: '#607d8b',
    icon: 'gavel',
    children: [
      { name: 'Impuestos', icon: 'gavel' },
      { name: 'Seguros', icon: 'security' },
      { name: 'Comisiones bancarias', icon: 'account_balance' },
    ],
  },
  {
    name: 'Ingresos',
    color: '#009688',
    icon: 'payments',
    children: [
      { name: 'Nómina', icon: 'work' },
      { name: 'Ingresos extra', icon: 'trending_up' },
      { name: 'Devoluciones', icon: 'currency_exchange' },
    ],
  },
  {
    name: 'Ahorro e inversión',
    color: '#1b5e20',
    icon: 'savings',
    children: [
      { name: 'Ahorro', icon: 'savings' },
      { name: 'Inversión', icon: 'trending_up' },
    ],
  },
];

/** Lo que hace falta saber de una categoría ya existente para descartarla. */
interface ExistingCategory {
  name: string;
  parent_id: string | null;
}

// Ni las mayúsculas, ni los espacios de más, ni las tildes hacen que una
// categoría sea otra distinta.
function normalize(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');
}

/**
 * Las sugeridas que todavía no están en el grupo, comparando por el nombre de
 * las raíces. Es lo que evita duplicar: no se guarda en ningún sitio que el
 * botón se pulsó —eso se perdería al cambiar de móvil y no lo sabría el resto
 * del grupo—, se mira lo que hay.
 *
 * Solo cuentan las raíces: una subcategoría llamada «Vivienda» colgando de
 * otra cosa no es la misma categoría.
 */
export function pendingStarterCategories(
  existing: readonly ExistingCategory[],
): readonly StarterCategory[] {
  const roots = new Set(
    existing
      .filter((category) => category.parent_id === null)
      .map((category) => normalize(category.name)),
  );
  return STARTER_CATEGORIES.filter((starter) => !roots.has(normalize(starter.name)));
}
