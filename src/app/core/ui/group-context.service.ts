import { computed, inject, Injectable, signal } from '@angular/core';
import { AccountGroupsService } from '../account-groups/account-groups.service';

const ACTIVE_GROUP_ID_KEY = 'activeGroupId';

@Injectable({ providedIn: 'root' })
export class GroupContextService {
  protected readonly accountGroupsService = inject(AccountGroupsService);
  private readonly activeGroupIdSignal = signal<string | null>(null);

  readonly activeGroupId = this.activeGroupIdSignal.asReadonly();
  readonly activeGroup = computed(() =>
    this.accountGroupsService.groups().find((g) => g.id === this.activeGroupId()),
  );

  constructor() {
    this.setActiveGroupId(sessionStorage.getItem(ACTIVE_GROUP_ID_KEY));
  }

  setActiveGroupId(groupId: string | null): void {
    this.activeGroupIdSignal.set(groupId);
    if (groupId) {
      sessionStorage.setItem(ACTIVE_GROUP_ID_KEY, groupId);
    } else {
      sessionStorage.removeItem(ACTIVE_GROUP_ID_KEY);
    }
  }
}
