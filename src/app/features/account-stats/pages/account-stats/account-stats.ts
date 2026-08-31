import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { TransactionsService } from '../../../../core/transactions/transactions.service';
import { AccountsService } from '../../../../core/accounts/accounts.service';
import { PageContextService } from '../../../../core/ui/page-context.service';
import { formatMoney } from '../../../../shared/money/money';
import { dateToIso, endOfMonth, startOfMonth } from '../../../../shared/date/date';
import { PageContent } from '../../../../shared/ui/page-content/page-content';
import { PageLoader } from '../../../../shared/ui/page-loader/page-loader';
import { EmptyState } from '../../../../shared/ui/empty-state/empty-state';
import { StatTile } from '../../../../shared/ui/stat-tile/stat-tile';
import { CategoryBreakdown } from '../../components/category-breakdown/category-breakdown';
import { MonthStepper } from '../../components/month-stepper/month-stepper';

@Component({
  selector: 'app-account-stats',
  imports: [MonthStepper, PageContent, PageLoader, EmptyState, StatTile, CategoryBreakdown],
  templateUrl: './account-stats.html',
  styleUrl: './account-stats.scss',
  host: { class: 'page-section' },
})
export class AccountStats {
  private readonly transactionsService = inject(TransactionsService);
  private readonly accountsService = inject(AccountsService);
  private readonly pageContextService = inject(PageContextService);

  /** El id de la cuenta lo hereda del armazón que la enruta. */
  readonly id = input.required<string>();

  protected readonly loading = this.transactionsService.summaryLoading;
  protected readonly summary = this.transactionsService.summary;

  private readonly account = this.accountsService.account;
  private readonly groupId = computed(() => this.account()?.group_id ?? null);

  /** Arranca en el mes en curso; el stepper lo mueve hacia atrás sin límite. */
  protected readonly month = signal(startOfMonth(new Date()));

  private readonly range = computed(() => ({
    from: dateToIso(this.month()),
    to: dateToIso(endOfMonth(this.month())),
  }));

  private readonly totals = computed(() =>
    this.summary().reduce(
      // El gasto llega negativo; se suma su magnitud para poder enseñarlo como
      // «gastado» y no como un número en rojo con signo.
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
      const groupId = this.groupId();
      if (!groupId) return;
      const { from, to } = this.range();
      this.transactionsService.getCategorySummary(groupId, this.id(), from, to).subscribe();
    });

    effect(() => {
      this.pageContextService.setAction(null);
    });
  }
}
