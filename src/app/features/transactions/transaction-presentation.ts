/**
 * Transferencias no tienen categoría en la API por diseño: no forman parte de
 * los ingresos o gastos. La interfaz les da una identidad visual local sin
 * convertirlas en una categoría seleccionable ni enviarlas en un payload.
 */
export const FRONTEND_TRANSFER_CATEGORY = {
  name: 'Transferencia',
  icon: 'transfer',
  color: 'var(--app-color-transfer)',
} as const;
