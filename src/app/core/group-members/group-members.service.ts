import { Injectable, inject, signal } from '@angular/core';
import { finalize, tap } from 'rxjs';
import {
  AccountGroupsService as AccountGroupsApi,
  ChangeGroupMemberRoleRequest,
  GroupMemberRead,
} from '../../api';
import { LatestRequest } from '../http/latest-request';

@Injectable({ providedIn: 'root' })
export class GroupMembersService {
  private readonly api = inject(AccountGroupsApi);

  private readonly membersSignal = signal<GroupMemberRead[]>([]);
  readonly members = this.membersSignal.asReadonly();
  private readonly loadingSignal = signal(false);
  readonly loading = this.loadingSignal.asReadonly();

  // La pantalla de un grupo se abre desde la lista, así que se puede saltar de
  // un grupo a otro con la carga anterior todavía en vuelo.
  private readonly membersRequest = new LatestRequest();

  getGroupMembers(groupId: string) {
    const token = this.membersRequest.next();
    this.loadingSignal.set(true);
    return this.api.getGroupMembersApiV1AccountGroupsGroupIdMembersGet(groupId).pipe(
      tap((res) => {
        if (!this.membersRequest.isCurrent(token)) return;
        this.membersSignal.set(res.items);
      }),
      finalize(() => {
        if (this.membersRequest.isCurrent(token)) this.loadingSignal.set(false);
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
