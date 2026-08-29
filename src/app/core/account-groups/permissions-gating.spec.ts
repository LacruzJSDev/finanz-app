import { describe, expect, it } from 'vitest';
import { AccountGroupMemberRoleEnum } from '../models';
import { canManageGroupData } from './permissions';

const { Owner, Admin, Member } = AccountGroupMemberRoleEnum;

// Lo que decide si la pantalla publica una acción de página o publica `null`,
// que es lo que hace desaparecer el botón + de la navegación inferior.
const accionDe = (role: AccountGroupMemberRoleEnum | null) =>
  canManageGroupData(role) ? { icon: 'add' } : null;

describe('el botón + de cuentas y categorías', () => {
  it('lo ven owner y admin', () => {
    expect(accionDe(Owner)).toEqual({ icon: 'add' });
    expect(accionDe(Admin)).toEqual({ icon: 'add' });
  });

  it('desaparece para un member, no se deshabilita', () => {
    expect(accionDe(Member)).toBe(null);
  });

  it('desaparece también sin grupo activo o sin sesión', () => {
    expect(accionDe(null)).toBe(null);
  });
});
