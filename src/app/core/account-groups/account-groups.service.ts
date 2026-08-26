import { Injectable, inject, signal } from '@angular/core';
import { finalize, tap } from 'rxjs';
import {
  AccountGroupsService as AccountsGroupApi,
  CreateGroupRequest,
  GroupRead,
  UpdateGroupRequest,
} from '../../api';

@Injectable({ providedIn: 'root' })
export class AccountGroupsService {
  private readonly api = inject(AccountsGroupApi);

  private readonly groupsSignal = signal<GroupRead[]>([]);
  readonly groups = this.groupsSignal.asReadonly();
  private readonly loadingSignal = signal(false);
  readonly loading = this.loadingSignal.asReadonly();

  getAccountGroups() {
    this.loadingSignal.set(true);
    return this.api.groupsApiV1AccountGroupsGet().pipe(
      tap((res) => {
        this.groupsSignal.set(res.items);
      }),
      finalize(() => this.loadingSignal.set(false)),
    );
  }

  createAccountGroup(payload: CreateGroupRequest) {
    return this.api
      .createGroupApiV1AccountGroupsPost(payload)
      .pipe(tap((group) => this.groupsSignal.update((groups) => [...groups, group])));
  }

  updateAccountGroup(groupId: string, payload: UpdateGroupRequest) {
    return this.api.updateGroupApiV1AccountGroupsGroupIdPatch(groupId, payload).pipe(
      tap((group) => {
        this.groupsSignal.update((groups) => groups.map((g) => (g.id === group.id ? group : g)));
      }),
    );
  }
}
