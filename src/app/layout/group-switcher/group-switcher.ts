import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AppSheetRef } from '../../shared/ui/app-sheet';
import { AppIcon } from '../../shared/ui/icon';
import { AccountGroupsService } from '../../core/account-groups/account-groups.service';
import { GroupContextService } from '../../core/ui/group-context.service';
import { ColorIcon } from '../../shared/ui/color-icon/color-icon';
import { GroupRead } from '../../core/models';
import { AppInputGroup } from '../../shared/ui/input-group';

@Component({
  selector: 'app-group-switcher',
  imports: [AppIcon, ColorIcon, AppInputGroup],
  templateUrl: './group-switcher.html',
  styleUrl: './group-switcher.scss',
  host: { class: 'bottom-sheet-form' },
})
export class GroupSwitcher {
  private readonly sheetRef = inject(AppSheetRef<GroupSwitcher>);
  private readonly accountGroupsService = inject(AccountGroupsService);
  private readonly groupContextService = inject(GroupContextService);
  private readonly router = inject(Router);

  protected readonly activeGroupId = this.groupContextService.activeGroupId;

  protected readonly groups = computed(() =>
    this.accountGroupsService.groups().filter((group) => group.is_active),
  );

  select(group: GroupRead): void {
    this.groupContextService.setActiveGroupId(group.id);
    this.sheetRef.dismiss();
    // Una cuenta pertenece al grupo anterior; salir a la raíz evita dejar una
    // URL de alcance de grupo apuntando a una entidad contradictoria.
    if (/^\/cuentas\/[^/]+(?:\/|$)/.test(this.router.url)) {
      this.router.navigateByUrl('/cuentas');
    }
  }

  manageGroups(): void {
    this.sheetRef.dismiss();
    this.router.navigateByUrl('/grupos');
  }
}
