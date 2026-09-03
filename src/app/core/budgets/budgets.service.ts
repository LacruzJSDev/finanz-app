import { Injectable, inject, signal } from '@angular/core';
import { concatMap, finalize, tap } from 'rxjs';
import { BudgetProgressRead, BudgetsService as BudgetsApi, SetBudgetRequest } from '../../api';
import { LatestRequest } from '../http/latest-request';

@Injectable({ providedIn: 'root' })
export class BudgetsService {
  private readonly api = inject(BudgetsApi);

  private readonly budgetsSignal = signal<BudgetProgressRead[]>([]);
  readonly budgets = this.budgetsSignal.asReadonly();
  private readonly loadingSignal = signal(false);
  readonly loading = this.loadingSignal.asReadonly();

  private readonly budgetsRequest = new LatestRequest();

  getBudgets(groupId: string, month?: string) {
    const token = this.budgetsRequest.next();
    this.loadingSignal.set(true);
    return this.api.getBudgetsApiV1BudgetsGet(groupId, month).pipe(
      tap((response) => {
        if (!this.budgetsRequest.isCurrent(token)) return;
        this.budgetsSignal.set(response.items);
      }),
      finalize(() => {
        if (this.budgetsRequest.isCurrent(token)) this.loadingSignal.set(false);
      }),
    );
  }

  setBudget(groupId: string, categoryId: string, payload: SetBudgetRequest) {
    return this.api.setBudgetApiV1BudgetsCategoryIdPut(categoryId, payload).pipe(
      // La respuesta de escritura no trae progreso ni nombre de categoría. Se
      // vuelve a pedir la representación que pinta la pantalla tras confirmarla.
      concatMap(() => this.getBudgets(groupId)),
    );
  }

  deleteBudget(groupId: string, categoryId: string) {
    return this.api
      .deleteBudgetApiV1BudgetsCategoryIdDelete(categoryId)
      .pipe(concatMap(() => this.getBudgets(groupId)));
  }
}
