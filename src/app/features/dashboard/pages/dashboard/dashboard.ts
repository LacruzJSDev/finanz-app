import { Component, inject } from '@angular/core';
import { PageContextService } from '../../../../core/ui/page-context.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dashboard',
  imports: [MatIconModule],
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
