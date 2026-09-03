import { TestBed } from '@angular/core/testing';
import { Subject, of } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { BudgetProgressRead, BudgetsService as BudgetsApi } from '../../api';
import { BudgetsService } from './budgets.service';

type Response = Subject<{ items: BudgetProgressRead[] }>;

class FakeApi {
  readonly requests: Response[] = [];
  setCalls: Array<[string, unknown]> = [];
  deleteCalls: string[] = [];

  getBudgetsApiV1BudgetsGet() {
    const response: Response = new Subject();
    this.requests.push(response);
    return response.asObservable();
  }

  setBudgetApiV1BudgetsCategoryIdPut(categoryId: string, payload: unknown) {
    this.setCalls.push([categoryId, payload]);
    return of({});
  }

  deleteBudgetApiV1BudgetsCategoryIdDelete(categoryId: string) {
    this.deleteCalls.push(categoryId);
    return of({});
  }
}

const budgets = (names: string[]) =>
  ({ items: names.map((category_name) => ({ category_name })) }) as unknown as {
    items: BudgetProgressRead[];
  };

describe('BudgetsService', () => {
  let api: FakeApi;
  let service: BudgetsService;

  beforeEach(() => {
    api = new FakeApi();
    TestBed.configureTestingModule({ providers: [{ provide: BudgetsApi, useValue: api }] });
    service = TestBed.inject(BudgetsService);
  });

  it('ignora la respuesta del grupo anterior cuando llega tarde', () => {
    service.getBudgets('group-A').subscribe();
    service.getBudgets('group-B').subscribe();

    api.requests[1].next(budgets(['B']));
    api.requests[1].complete();
    api.requests[0].next(budgets(['A']));
    api.requests[0].complete();

    expect(service.budgets().map((budget) => budget.category_name)).toEqual(['B']);
  });

  it('refresca la lista después de fijar un presupuesto confirmado', () => {
    service.setBudget('group-A', 'category-A', { amount: 2500 }).subscribe();

    expect(api.setCalls).toEqual([['category-A', { amount: 2500 }]]);
    expect(api.requests).toHaveLength(1);
    api.requests[0].next(budgets(['Alimentación']));
    api.requests[0].complete();

    expect(service.budgets().map((budget) => budget.category_name)).toEqual(['Alimentación']);
  });

  it('refresca la lista después de retirar un presupuesto confirmado', () => {
    service.deleteBudget('group-A', 'category-A').subscribe();

    expect(api.deleteCalls).toEqual(['category-A']);
    api.requests[0].next(budgets([]));
    api.requests[0].complete();

    expect(service.budgets()).toEqual([]);
  });
});
