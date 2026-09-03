import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { GroupMonthlyAnalysisService } from '../../../../core/group-monthly-analysis/group-monthly-analysis.service';
import { PageContextService } from '../../../../core/ui/page-context.service';
import { dateToIso, endOfMonth, startOfMonth } from '../../../../shared/date/date';
import { formatMoney } from '../../../../shared/money/money';
import { EmptyState } from '../../../../shared/ui/empty-state/empty-state';
import { PageContent } from '../../../../shared/ui/page-content/page-content';
import { PageLoader } from '../../../../shared/ui/page-loader/page-loader';
import { StatTile } from '../../../../shared/ui/stat-tile/stat-tile';
import { CategoryBreakdown, MonthStepper } from '../../../account-stats';

@Component({
  selector: 'app-group-analysis',
  imports: [MonthStepper, PageContent, PageLoader, EmptyState, StatTile, CategoryBreakdown],
  templateUrl: './group-analysis.html',
  styleUrl: './group-analysis.scss',
  host: { class: 'page-section' },
})
export class GroupAnalysis {
  private readonly analysisService = inject(GroupMonthlyAnalysisService);
  private readonly pageContextService = inject(PageContextService);

  readonly id = input.required<string>();
  protected readonly loading = this.analysisService.loading;
  protected readonly summary = this.analysisService.summary;
  protected readonly month = signal(startOfMonth(new Date()));

  private readonly range = computed(() => ({
    from: dateToIso(this.month()),
    to: dateToIso(endOfMonth(this.month())),
  }));
  private readonly totals = computed(() =>
    this.summary().reduce(
      (acc, row) => ({
        income: acc.income + row.income,
        expense: acc.expense + Math.abs(row.expense),
      }),
      { income: 0, expense: 0 },
    ),
  );
  protected readonly spent = computed(() => formatMoney(this.totals().expense));
  protected readonly earned = computed(() => formatMoney(this.totals().income));
  protected readonly hasData = computed(() =>
    this.summary().some((row) => row.transaction_count > 0),
  );

  constructor() {
    effect(() => {
      const { from, to } = this.range();
      this.analysisService.getCategorySummary(this.id(), from, to).subscribe();
    });
    effect(() => this.pageContextService.setAction(null));
  }
}
