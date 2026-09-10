import { AppButton } from '../../shared/ui/button';
import { Component, inject } from '@angular/core';
import { PageContextService } from '../../core/ui/page-context.service';
import { AppIcon } from '../../shared/ui/icon';
import { GroupContextService } from '../../core/ui/group-context.service';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-bottom-nav',
  imports: [AppButton, AppIcon, RouterLink, RouterLinkActive],
  templateUrl: 'bottom-nav.html',
  styleUrl: 'bottom-nav.scss',
  host: { role: 'navigation', 'aria-label': 'Navegación principal' },
})
export class BottomNav {
  protected readonly pageContextService = inject(PageContextService);
  protected readonly groupContextService = inject(GroupContextService);
  protected readonly action = this.pageContextService.action;
  protected readonly activeGroupId = this.groupContextService.activeGroupId;
}
