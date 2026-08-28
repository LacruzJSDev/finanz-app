import { Component, inject } from '@angular/core';
import { PageContextService } from '../../../../core/ui/page-context.service';
import { PageContent } from '../../../../shared/ui/page-content/page-content';
import { EmptyState } from '../../../../shared/ui/empty-state/empty-state';

@Component({
  selector: 'app-dashboard',
  imports: [PageContent, EmptyState],
  templateUrl: './dashboard.html',
  host: { class: 'page-container' },
})
export class Dashboard {
  protected readonly pageContextService = inject(PageContextService);

  constructor() {
    this.pageContextService.setTitle('FinanzApp');
    this.pageContextService.setAction(null);
  }
}
