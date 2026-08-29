import { Pipe, PipeTransform } from '@angular/core';
import { AccountGroupMemberRoleEnum } from '../../../core/models';

const MEMBER_ROLE_LABELS: Record<AccountGroupMemberRoleEnum, string> = {
  [AccountGroupMemberRoleEnum.Owner]: 'Propietario',
  [AccountGroupMemberRoleEnum.Admin]: 'Administrador',
  [AccountGroupMemberRoleEnum.Member]: 'Miembro',
};

@Pipe({ name: 'memberRoleLabel' })
export class MemberRoleLabelPipe implements PipeTransform {
  transform(role: AccountGroupMemberRoleEnum): string {
    return MEMBER_ROLE_LABELS[role];
  }
}
