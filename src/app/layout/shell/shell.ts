import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopBar } from '../top-bar/top-bar';
import { BottomNav } from '../bottom-nav/bottom-nav';
import { AccountGroupsService } from '../../core/account-groups/account-groups.service';
import { GroupContextService } from '../../core/ui/group-context.service';
import { GroupTrigger } from '../group-trigger/group-trigger';
import { PageContextService } from '../../core/ui/page-context.service';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, TopBar, BottomNav, GroupTrigger],
  templateUrl: 'shell.html',
  styleUrl: 'shell.scss',
  host: { '[class.shell--has-group-trigger]': 'showGroup()' },
})
export class Shell {
  protected readonly accountGroupsService = inject(AccountGroupsService);
  protected readonly groupContextService = inject(GroupContextService);
  private readonly pageContextService = inject(PageContextService);
  protected readonly showGroup = this.pageContextService.showGroup;

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
