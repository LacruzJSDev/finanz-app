import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatIconModule } from '@angular/material/icon';
import { AccountGroupsService } from '../../core/account-groups/account-groups.service';
import { GroupContextService } from '../../core/ui/group-context.service';
import { ColorIcon } from '../../shared/ui/color-icon/color-icon';
import { GroupRead } from '../../core/models';

@Component({
  selector: 'app-group-switcher',
  imports: [MatIconModule, ColorIcon],
  templateUrl: './group-switcher.html',
  styleUrl: './group-switcher.scss',
  host: { class: 'bottom-sheet-form' },
})
export class GroupSwitcher {
  private readonly bottomSheetRef = inject(MatBottomSheetRef<GroupSwitcher>);
  private readonly accountGroupsService = inject(AccountGroupsService);
  private readonly groupContextService = inject(GroupContextService);
  private readonly router = inject(Router);

  protected readonly activeGroupId = this.groupContextService.activeGroupId;

  protected readonly groups = computed(() =>
    this.accountGroupsService.groups().filter((group) => group.is_active),
  );

  select(group: GroupRead): void {
    this.groupContextService.setActiveGroupId(group.id);
    this.bottomSheetRef.dismiss();
  }

  manageGroups(): void {
    this.bottomSheetRef.dismiss();
    this.router.navigateByUrl('/grupos');
  }
}
