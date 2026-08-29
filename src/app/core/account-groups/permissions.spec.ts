import { describe, expect, it } from 'vitest';
import { AccountGroupMemberRoleEnum, GroupMemberRead } from '../models';
import { canChangeRole, canManageGroupData, canRemoveMember } from './permissions';

const { Owner, Admin, Member } = AccountGroupMemberRoleEnum;

const quien = (user_id: string, role: AccountGroupMemberRoleEnum) =>
  ({ id: user_id, user_id, role, name: user_id, email: `${user_id}@x.es` }) as GroupMemberRead;

const dueño = quien('dueño', Owner);
const otroDueño = quien('otro-dueño', Owner);
const admin = quien('admin', Admin);
const otroAdmin = quien('otro-admin', Admin);
const socio = quien('socio', Member);

describe('canManageGroupData', () => {
  it('gobernar el grupo es de owner y admin; un member solo participa', () => {
    expect(canManageGroupData(Owner)).toBe(true);
    expect(canManageGroupData(Admin)).toBe(true);
    expect(canManageGroupData(Member)).toBe(false);
    expect(canManageGroupData(null)).toBe(false);
  });
});

describe('canChangeRole', () => {
  it('solo un owner cambia roles: un admin no puede', () => {
    const grupo = [dueño, admin, socio];
    expect(canChangeRole(grupo, admin, socio)).toBe(false);
    expect(canChangeRole(grupo, socio, admin)).toBe(false);
    expect(canChangeRole(grupo, dueño, socio)).toBe(true);
  });

  it('el owner puede tocar a otro owner mientras quede uno', () => {
    expect(canChangeRole([dueño, otroDueño], dueño, otroDueño)).toBe(true);
  });

  it('el único owner no puede degradarse a sí mismo', () => {
    expect(canChangeRole([dueño, admin], dueño, dueño)).toBe(false);
  });

  it('con dos owners, uno sí puede cambiar su propio rol', () => {
    expect(canChangeRole([dueño, otroDueño], dueño, dueño)).toBe(true);
  });
});

describe('canRemove', () => {
  it('un admin solo expulsa a members', () => {
    const grupo = [dueño, admin, otroAdmin, socio];
    expect(canRemoveMember(grupo, admin, socio)).toBe(true);
    expect(canRemoveMember(grupo, admin, otroAdmin)).toBe(false);
    expect(canRemoveMember(grupo, admin, dueño)).toBe(false);
  });

  it('un owner expulsa a cualquiera', () => {
    const grupo = [dueño, otroDueño, admin, socio];
    expect(canRemoveMember(grupo, dueño, admin)).toBe(true);
    expect(canRemoveMember(grupo, dueño, otroDueño)).toBe(true);
  });

  it('un member no expulsa a nadie, pero sí se va él', () => {
    const grupo = [dueño, socio];
    expect(canRemoveMember(grupo, socio, dueño)).toBe(false);
    expect(canRemoveMember(grupo, socio, socio)).toBe(true);
  });

  it('el único owner no abandona un grupo con más gente', () => {
    expect(canRemoveMember([dueño, socio], dueño, dueño)).toBe(false);
  });

  it('ni siquiera si es el único miembro: el grupo quedaría vacío y sin retorno', () => {
    expect(canRemoveMember([dueño], dueño, dueño)).toBe(false);
  });

  it('con otro owner detrás, el owner sí puede irse', () => {
    expect(canRemoveMember([dueño, otroDueño, socio], dueño, dueño)).toBe(true);
  });
});
