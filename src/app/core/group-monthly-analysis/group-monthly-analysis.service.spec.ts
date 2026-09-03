import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { CategorySummaryRead, TransactionsService as TransactionsApi } from '../../api';
import { GroupMonthlyAnalysisService } from './group-monthly-analysis.service';

type Response = Subject<{ items: CategorySummaryRead[] }>;

class FakeApi {
  readonly requests: Response[] = [];

  getCategorySummaryApiV1TransactionsSummaryGet() {
    const response: Response = new Subject();
    this.requests.push(response);
    return response.asObservable();
  }
}

describe('GroupMonthlyAnalysisService', () => {
  let api: FakeApi;
  let service: GroupMonthlyAnalysisService;

  beforeEach(() => {
    api = new FakeApi();
    TestBed.configureTestingModule({ providers: [{ provide: TransactionsApi, useValue: api }] });
    service = TestBed.inject(GroupMonthlyAnalysisService);
  });

  it('ignora la respuesta de un mes anterior que llega tarde', () => {
    service.getCategorySummary('group-A', '2026-01-01', '2026-01-31').subscribe();
    service.getCategorySummary('group-A', '2026-02-01', '2026-02-28').subscribe();

    api.requests[1].next({ items: [{ root_category_name: 'Febrero' }] as CategorySummaryRead[] });
    api.requests[1].complete();
    api.requests[0].next({ items: [{ root_category_name: 'Enero' }] as CategorySummaryRead[] });
    api.requests[0].complete();

    expect(service.summary().map((row) => row.root_category_name)).toEqual(['Febrero']);
  });
});
