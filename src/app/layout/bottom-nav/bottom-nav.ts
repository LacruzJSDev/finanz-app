import { Component, inject } from '@angular/core';
import { PageContextService } from '../../core/ui/page-context.service';
import { MatIconModule } from '@angular/material/icon';
import { GroupContextService } from '../../core/ui/group-context.service';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-bottom-nav',
  imports: [MatButtonModule, MatIconModule, RouterLink, RouterLinkActive],
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
