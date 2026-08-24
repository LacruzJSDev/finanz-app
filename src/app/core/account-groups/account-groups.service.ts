import { Injectable, inject, signal } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { AccountGroupsService as AccountsGroupApi, CreateGroupRequest, GroupRead } from '../../api';

@Injectable({ providedIn: 'root' })
export class AccountGroupsService {
  private readonly api = inject(AccountsGroupApi);

  private readonly groupsSignal = signal<GroupRead[]>([]);
  readonly groups = this.groupsSignal.asReadonly();

  private loaded = false;

  getAccountGroups() {
    return this.api.groupsApiV1AccountGroupsGet().pipe(
      tap((res) => {
        this.groupsSignal.set(res.items);
        this.loaded = true;
      }),
    );
  }

  ensureLoaded(): Observable<unknown> {
    return this.loaded ? of(null) : this.getAccountGroups();
  }

  createAccountGroup(payload: CreateGroupRequest) {
    return this.api
      .createGroupApiV1AccountGroupsPost(payload)
      .pipe(tap((group) => this.groupsSignal.update((groups) => [...groups, group])));
  }
}
