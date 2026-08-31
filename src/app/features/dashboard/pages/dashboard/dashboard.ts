import { Component, computed, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { OverviewService } from '../../../../core/overview/overview.service';
import { GroupContextService } from '../../../../core/ui/group-context.service';
import { PageContextService } from '../../../../core/ui/page-context.service';
import { formatMoney } from '../../../../shared/money/money';
import { PageContent } from '../../../../shared/ui/page-content/page-content';
import { PageLoader } from '../../../../shared/ui/page-loader/page-loader';
import { EmptyState } from '../../../../shared/ui/empty-state/empty-state';
import { RealBalanceCard } from '../../components/real-balance-card/real-balance-card';
import { StatTile } from '../../../../shared/ui/stat-tile/stat-tile';
import { PendingExpensesCard } from '../../components/pending-expenses-card/pending-expenses-card';
import { ProjectionCard } from '../../components/projection-card/projection-card';

@Component({
  selector: 'app-dashboard',
  imports: [
    PageContent,
    PageLoader,
    EmptyState,
    RealBalanceCard,
    StatTile,
    PendingExpensesCard,
    ProjectionCard,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  host: { class: 'page-container' },
})
export class Dashboard {
  private readonly overviewService = inject(OverviewService);
  private readonly groupContextService = inject(GroupContextService);
  private readonly pageContextService = inject(PageContextService);
  private readonly router = inject(Router);

  protected readonly loading = this.overviewService.loading;
  protected readonly overview = this.overviewService.overview;

  // Sin decimales: en las cifras de contexto solo estorban, y los que importan
  // están en la de arriba.
  protected readonly netWorth = computed(() => {
    const overview = this.overview();
    return overview ? formatMoney(Math.round(overview.net_worth / 100) * 100) : '';
  });

  protected readonly spentToday = computed(() => {
    const overview = this.overview();
    return overview ? formatMoney(overview.spent_today) : '';
  });

  constructor() {
    this.pageContextService.setTitle('Resumen');
    this.pageContextService.setAction(null);

    effect(() => {
      const groupId = this.groupContextService.activeGroupId();
      if (!groupId) {
        this.router.navigateByUrl('grupos');
        return;
      }
      this.overviewService.getGroupOverview(groupId).subscribe();
    });
  }
}
