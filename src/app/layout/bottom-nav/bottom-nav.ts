import { Component, inject } from '@angular/core';
import { PageContextService } from '../../core/ui/page-context.service';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { GroupContextService } from '../../core/ui/group-context.service';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-bottom-nav',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: 'bottom-nav.html',
  styleUrl: 'bottom-nav.scss',
})
export class BottomNav {
  protected readonly pageContextService = inject(PageContextService);
  protected readonly groupContextService = inject(GroupContextService);
  private readonly router = inject(Router);

  protected readonly action = this.pageContextService.action;
  protected readonly activeGroupId = this.groupContextService.activeGroupId;

  navigate(url: string) {
    this.router.navigateByUrl(url);
  }
}
