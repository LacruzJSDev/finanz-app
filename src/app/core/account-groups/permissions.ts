import { AccountGroupMemberRoleEnum, GroupMemberRead, GroupRead } from '../models';

// Las reglas de rol del backend, en un solo sitio. Aquí solo sirven para no
// enseñar botones que van a fallar: quien decide de verdad es el servidor.
//
// Viven en core y no en una feature porque no son de una: el mismo corte entre
// gobernar el grupo y participar en él gobierna cuentas, categorías, planes y
// presupuestos. Y no pueden vivir en shared, que no conoce el dominio.

const { Owner, Admin } = AccountGroupMemberRoleEnum;

/**
 * Tu rol dentro de un grupo concreto, que no tiene por qué ser el de trabajo:
 * la pantalla de un grupo gestiona cualquiera, y ahí manda el rol que tengas
 * en ese, no en el activo.
 */
export function roleInGroup(
  group: GroupRead | undefined,
  userId: string | undefined,
): AccountGroupMemberRoleEnum | null {
  if (!userId) return null;
  return group?.members?.find((member) => member.user_id === userId)?.role ?? null;
}

/**
 * Gestionar es gobierno del grupo; participar, no. Crear, editar y archivar
 * cuentas, categorías, planes de pago y presupuestos exige `owner` o `admin`;
 * consultarlos está abierto a cualquier rol.
 *
 * Las transacciones son la excepción declarada: una anotación cotidiana, de
 * bajo riesgo, que cualquier miembro puede crear, editar y borrar. Por eso no
 * pasan por aquí.
 */
export function canManageGroupData(role: AccountGroupMemberRoleEnum | null): boolean {
  return role === Owner || role === Admin;
}

/** Listar y revocar invitaciones tiene el mismo corte que crearlas. */
export function canManageInvitations(role: AccountGroupMemberRoleEnum | null): boolean {
  return canManageGroupData(role);
}

const owners = (members: GroupMemberRead[]) => members.filter((m) => m.role === Owner).length;
const isSame = (a: GroupMemberRead, b: GroupMemberRead) => a.user_id === b.user_id;

/**
 * Cambiar el rol de alguien exige ser `owner` — un `admin` no puede, aunque sí
 * pueda invitar y expulsar.
 *
 * No hay endpoint de transferir propiedad: se promueve a otro a `owner` y ya
 * hay dos. Por eso `owner` es un rol asignable como cualquier otro.
 */
export function canChangeRole(
  members: GroupMemberRead[],
  viewer: GroupMemberRead | undefined,
  member: GroupMemberRead,
): boolean {
  if (viewer?.role !== Owner) return false;

  // El único `owner` no puede degradarse: dejaría el grupo sin ninguno.
  if (isSame(viewer, member) && owners(members) === 1) return false;

  return true;
}

/**
 * Expulsar a otro, o abandonar el grupo uno mismo. Son el mismo endpoint y por
 * eso la misma regla, pero para quien mira son dos acciones distintas.
 */
export function canRemoveMember(
  members: GroupMemberRead[],
  viewer: GroupMemberRead | undefined,
  member: GroupMemberRead,
): boolean {
  if (!viewer) return false;

  if (isSame(viewer, member)) {
    // Abandonar: cualquiera puede irse, salvo el único `owner`, que antes tiene
    // que promover a otro.
    //
    // La API es más permisiva: deja irse al único `owner` si además es el único
    // miembro (§6). No se ofrece, porque el grupo queda sin nadie dentro, nadie
    // puede invitarte de vuelta y no hay endpoint que lo borre — un callejón sin
    // salida. Quien quiera dejar de ver un grupo suyo lo archiva.
    if (viewer.role === Owner && owners(members) === 1) return false;
    return true;
  }

  // Un `admin` solo llega hasta los `member`: ni a otro `admin`, ni a un `owner`.
  if (viewer.role === Admin) return member.role !== Owner && member.role !== Admin;

  return viewer.role === Owner;
}
