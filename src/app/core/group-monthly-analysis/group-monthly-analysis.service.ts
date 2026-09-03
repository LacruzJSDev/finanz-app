import { Injectable, inject, signal } from '@angular/core';
import { finalize, tap } from 'rxjs';
import { CategorySummaryRead, TransactionsService as TransactionsApi } from '../../api';
import { LatestRequest } from '../http/latest-request';

@Injectable({ providedIn: 'root' })
export class GroupMonthlyAnalysisService {
  private readonly api = inject(TransactionsApi);

  private readonly summarySignal = signal<CategorySummaryRead[]>([]);
  readonly summary = this.summarySignal.asReadonly();
  private readonly loadingSignal = signal(false);
  readonly loading = this.loadingSignal.asReadonly();
  private readonly request = new LatestRequest();

  getCategorySummary(groupId: string, dateFrom: string, dateTo: string) {
    const token = this.request.next();
    this.loadingSignal.set(true);
    return this.api
      .getCategorySummaryApiV1TransactionsSummaryGet(
        groupId,
        undefined,
        undefined,
        undefined,
        undefined,
        dateFrom,
        dateTo,
      )
      .pipe(
        tap((response) => {
          if (!this.request.isCurrent(token)) return;
          this.summarySignal.set(response.items);
        }),
        finalize(() => {
          if (this.request.isCurrent(token)) this.loadingSignal.set(false);
        }),
      );
  }
}
