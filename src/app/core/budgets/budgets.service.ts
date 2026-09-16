import { Injectable, inject, signal } from '@angular/core';
import { concatMap, finalize, tap } from 'rxjs';
import { BudgetProgressRead, BudgetsService as BudgetsApi, SetBudgetRequest } from '../../api';
import { LatestRequest } from '../http/latest-request';

@Injectable({ providedIn: 'root' })
export class BudgetsService {
  private readonly api = inject(BudgetsApi);

  private readonly budgetsSignal = signal<BudgetProgressRead[]>([]);
  readonly budgets = this.budgetsSignal.asReadonly();
  /**
   * Un GET inmediatamente posterior a DELETE puede venir de una réplica o
   * caché todavía atrasada. Una categoría eliminada no debe reaparecer ni
   * ofrecer una segunda eliminación que el servidor ya rechazará.
   */
  private readonly hiddenBudgetCategoryIds = new Set<string>();
  private readonly loadingSignal = signal(false);
  readonly loading = this.loadingSignal.asReadonly();

  private readonly budgetsRequest = new LatestRequest();

  getBudgets(groupId: string, month?: string) {
    const token = this.budgetsRequest.next();
    this.loadingSignal.set(true);
    return this.api.getBudgetsApiV1BudgetsGet(groupId, month).pipe(
      tap((response) => {
        if (!this.budgetsRequest.isCurrent(token)) return;
        this.budgetsSignal.set(
          response.items.filter((budget) => !this.hiddenBudgetCategoryIds.has(budget.category_id)),
        );
      }),
      finalize(() => {
        if (this.budgetsRequest.isCurrent(token)) this.loadingSignal.set(false);
      }),
    );
  }

  setBudget(groupId: string, categoryId: string, payload: SetBudgetRequest, month?: string) {
    return this.api.setBudgetApiV1BudgetsCategoryIdPut(categoryId, payload).pipe(
      // Crear o volver a fijar el presupuesto es la única operación que puede
      // hacer visible de nuevo una categoría que se había retirado localmente.
      tap(() => this.hiddenBudgetCategoryIds.delete(categoryId)),
      // La respuesta de escritura no trae progreso ni nombre de categoría. Se
      // vuelve a pedir la representación que pinta la pantalla tras confirmarla.
      concatMap(() => this.getBudgets(groupId, month)),
    );
  }

  deleteBudget(groupId: string, categoryId: string, month?: string) {
    return this.api.deleteBudgetApiV1BudgetsCategoryIdDelete(categoryId).pipe(
      tap(() => {
        this.hiddenBudgetCategoryIds.add(categoryId);
        this.budgetsSignal.update((budgets) =>
          budgets.filter((budget) => budget.category_id !== categoryId),
        );
      }),
      concatMap(() => this.getBudgets(groupId, month)),
    );
  }
}
