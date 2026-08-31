import { Component, input, output } from '@angular/core';
import { GroupMemberRead } from '../../../../../core/models';
import { canChangeRole, canRemoveMember } from '../../../../../core/account-groups/permissions';
import { MemberCard } from '../../member-card/member-card';

@Component({
  selector: 'app-members-list',
  imports: [MemberCard],
  templateUrl: './members-list.html',
  styleUrl: './members-list.scss',
})
export class MembersList {
  readonly members = input.required<GroupMemberRead[]>();

  /** Quién mira, para saber sobre quién puede actuar y quién es él mismo. */
  readonly viewer = input<GroupMemberRead>();

  readonly roleClick = output<GroupMemberRead>();
  readonly removeClick = output<GroupMemberRead>();

  // Cada fila depende de la lista entera —cuántos owners quedan, cuánta gente
  // hay— así que se resuelve aquí, que es quien la tiene toda.
  isViewer(member: GroupMemberRead): boolean {
    return member.user_id === this.viewer()?.user_id;
  }

  canChangeRole(member: GroupMemberRead): boolean {
    return canChangeRole(this.members(), this.viewer(), member);
  }

  canRemove(member: GroupMemberRead): boolean {
    return canRemoveMember(this.members(), this.viewer(), member);
  }
}
