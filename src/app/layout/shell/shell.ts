import { Component, inject } from '@angular/core';
import { PageContextService } from '../../core/ui/page-context.service';
import { RouterOutlet } from '@angular/router';
import { TopBar } from '../top-bar/top-bar';
import { BottomNav } from '../bottom-nav/bottom-nav';
import { AccountGroupsService } from '../../core/account-groups/account-groups.service';
import { GroupContextService } from '../../core/ui/group-context.service';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, TopBar, BottomNav],
  templateUrl: 'shell.html',
  styleUrl: 'shell.scss',
})
export class Shell {
  protected readonly accountGroupsService = inject(AccountGroupsService);
  protected readonly pageContextService = inject(PageContextService);
  protected readonly groupContextService = inject(GroupContextService);

  constructor() {
    this.accountGroupsService.getAccountGroups().subscribe((res) => {
      const usable = res.items.filter((group) => group.is_active);
      const stillValid = usable.some((g) => g.id === this.groupContextService.activeGroupId());
      if (!stillValid) {
        this.groupContextService.setActiveGroupId(usable[0]?.id ?? null);
      }
    });
  }
}
