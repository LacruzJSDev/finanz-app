/**
 * El catálogo de iconos, por familias. Los grupos son lo que se pinta en el
 * desplegable: con esta cantidad, una lista plana obliga a recorrerla entera
 * para saber si hay algo mejor más abajo.
 *
 * Los nombres son ligaduras de Material Icons (el clásico, no Symbols): uno
 * que no exista no falla, se pinta el nombre en letras dentro de la caja del
 * icono.
 */
export const ICON_GROUPS = [
  {
    label: 'Hogar y suministros',
    icons: [
      { name: 'home', label: 'Casa' },
      { name: 'apartment', label: 'Piso' },
      { name: 'chair', label: 'Muebles' },
      { name: 'lightbulb', label: 'Luz' },
      { name: 'invert_colors', label: 'Agua' },
      { name: 'local_fire_department', label: 'Gas' },
      { name: 'wifi', label: 'Internet' },
      { name: 'build', label: 'Reparaciones' },
      { name: 'cleaning_services', label: 'Limpieza' },
      { name: 'pets', label: 'Mascotas' },
    ],
  },
  {
    label: 'Comida y compra',
    icons: [
      { name: 'shopping_cart', label: 'Supermercado' },
      { name: 'restaurant', label: 'Restaurante' },
      { name: 'local_cafe', label: 'Café' },
      { name: 'local_bar', label: 'Copas' },
      { name: 'lunch_dining', label: 'Comida rápida' },
      { name: 'bakery_dining', label: 'Panadería' },
    ],
  },
  {
    label: 'Transporte',
    icons: [
      { name: 'directions_car', label: 'Coche' },
      { name: 'local_gas_station', label: 'Gasolina' },
      { name: 'directions_bus', label: 'Autobús' },
      { name: 'train', label: 'Tren' },
      { name: 'local_taxi', label: 'Taxi' },
      { name: 'directions_bike', label: 'Bici' },
      { name: 'two_wheeler', label: 'Moto' },
      { name: 'local_parking', label: 'Aparcamiento' },
      { name: 'flight', label: 'Avión' },
    ],
  },
  {
    label: 'Salud y cuidado',
    icons: [
      { name: 'local_hospital', label: 'Salud' },
      { name: 'medication', label: 'Farmacia' },
      { name: 'fitness_center', label: 'Gimnasio' },
      { name: 'spa', label: 'Cuidado personal' },
      { name: 'self_improvement', label: 'Bienestar' },
    ],
  },
  {
    label: 'Ocio y viajes',
    icons: [
      { name: 'movie', label: 'Cine' },
      { name: 'music_note', label: 'Música' },
      { name: 'sports_esports', label: 'Videojuegos' },
      { name: 'menu_book', label: 'Libros' },
      { name: 'sports_soccer', label: 'Deporte' },
      { name: 'celebration', label: 'Fiestas' },
      { name: 'confirmation_number', label: 'Entradas' },
      { name: 'subscriptions', label: 'Suscripciones' },
      { name: 'hotel', label: 'Alojamiento' },
      { name: 'beach_access', label: 'Vacaciones' },
    ],
  },
  {
    label: 'Compras y personal',
    icons: [
      { name: 'shopping_bag', label: 'Tienda' },
      { name: 'checkroom', label: 'Ropa' },
      { name: 'storefront', label: 'Comercio' },
      { name: 'card_giftcard', label: 'Regalos' },
      { name: 'child_care', label: 'Niños' },
      { name: 'phone_iphone', label: 'Móvil' },
      { name: 'computer', label: 'Informática' },
    ],
  },
  {
    label: 'Trabajo y estudios',
    icons: [
      { name: 'work', label: 'Trabajo' },
      { name: 'school', label: 'Educación' },
      { name: 'business_center', label: 'Negocio' },
      { name: 'badge', label: 'Autónomo' },
    ],
  },
  {
    label: 'Dinero',
    icons: [
      { name: 'savings', label: 'Ahorro' },
      { name: 'account_balance', label: 'Banco' },
      { name: 'credit_card', label: 'Tarjeta' },
      { name: 'wallet', label: 'Cartera' },
      { name: 'payments', label: 'Pagos' },
      { name: 'receipt_long', label: 'Facturas' },
      { name: 'trending_up', label: 'Inversión' },
      { name: 'currency_exchange', label: 'Divisas' },
      { name: 'paid', label: 'Cobros' },
    ],
  },
  {
    label: 'Otros',
    icons: [
      { name: 'security', label: 'Seguros' },
      { name: 'gavel', label: 'Impuestos' },
      { name: 'description', label: 'Papeleo' },
      { name: 'volunteer_activism', label: 'Donaciones' },
      { name: 'favorite', label: 'Personal' },
      { name: 'category', label: 'Otros' },
      { name: 'more_horiz', label: 'Varios' },
    ],
  },
] as const;

export type IconName = (typeof ICON_GROUPS)[number]['icons'][number]['name'];

/** El catálogo en plano, para validar lo que llega del servidor. */
export const AVAILABLE_ICONS: readonly IconName[] = ICON_GROUPS.flatMap((group) =>
  group.icons.map((icon) => icon.name),
);

export const ICON_LABELS = Object.fromEntries(
  ICON_GROUPS.flatMap((group) => group.icons.map((icon) => [icon.name, icon.label])),
) as Record<IconName, string>;

/**
 * Sin icono, o con uno que no está en el catálogo, se pinta el de "nada": así
 * un valor viejo que ya no ofrecemos no deja el hueco vacío ni pinta letras.
 */
export function resolveIcon(icon: string | null | undefined): string {
  return icon && (AVAILABLE_ICONS as readonly string[]).includes(icon) ? icon : 'block';
}
