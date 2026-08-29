import { computed, inject, Injectable, signal } from '@angular/core';
import { AccountGroupsService } from '../account-groups/account-groups.service';
import { AuthService } from '../auth/auth.service';
import { AccountGroupMemberRoleEnum } from '../models';

const ACTIVE_GROUP_ID_KEY = 'activeGroupId';

@Injectable({ providedIn: 'root' })
export class GroupContextService {
  protected readonly accountGroupsService = inject(AccountGroupsService);
  private readonly authService = inject(AuthService);
  private readonly activeGroupIdSignal = signal<string | null>(null);

  readonly activeGroupId = this.activeGroupIdSignal.asReadonly();
  readonly activeGroup = computed(() =>
    this.accountGroupsService.groups().find((g) => g.id === this.activeGroupId()),
  );

  // Tu rol en el grupo de trabajo, que decide qué puedes gestionar en cuentas,
  // categorías, planes y presupuestos. Sale del propio grupo, que ya trae sus
  // miembros: preguntarlo aparte en cada pantalla sería una petición por
  // pantalla para un dato que ya está.
  readonly activeRole = computed<AccountGroupMemberRoleEnum | null>(() => {
    const userId = this.authService.currentUser()?.id;
    if (!userId) return null;
    return this.activeGroup()?.members?.find((m) => m.user_id === userId)?.role ?? null;
  });

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
