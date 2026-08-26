import { Injectable, inject, signal } from '@angular/core';
import { tap } from 'rxjs';
import {
  AccountGroupsService as AccountGroupsApi,
  ChangeGroupMemberRoleRequest,
  GroupMemberRead,
} from '../../api';

@Injectable({ providedIn: 'root' })
export class GroupMembersService {
  private readonly api = inject(AccountGroupsApi);

  private readonly membersSignal = signal<GroupMemberRead[]>([]);
  readonly members = this.membersSignal.asReadonly();

  getGroupMembers(groupId: string) {
    return this.api.getGroupMembersApiV1AccountGroupsGroupIdMembersGet(groupId).pipe(
      tap((res) => {
        this.membersSignal.set(res.items);
      }),
    );
  }

  changeGroupMemberRole(groupId: string, userId: string, payload: ChangeGroupMemberRoleRequest) {
    return this.api
      .changeGroupMemberRoleApiV1AccountGroupsGroupIdMembersUserIdPatch(groupId, userId, payload)
      .pipe(
        tap((member) => {
          this.membersSignal.update((members) =>
            members.map((m) => (m.id === member.id ? member : m)),
          );
        }),
      );
  }

  expelGroupMember(groupId: string, userId: string) {
    return this.api
      .expelGroupMemberApiV1AccountGroupsGroupIdMembersUserIdDelete(groupId, userId)
      .pipe(
        tap(() => {
          this.membersSignal.update((members) => members.filter((m) => m.user_id !== userId));
        }),
      );
  }
}
