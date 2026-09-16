import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CategoryRead, TransactionRead, TransactionTypeEnum } from '../../../../core/models';
import { TransactionCard } from './transaction-card';

const transfer: TransactionRead = {
  id: 'transfer-1',
  account_id: 'account-1',
  to_account_id: 'account-2',
  category_id: null,
  transfer_group_id: 'group-1',
  payment_plan_id: null,
  amount: 1000,
  type: TransactionTypeEnum.Transfer,
  date: '2026-09-16',
  notes: null,
  created_by: 'user-1',
  updated_by: 'user-1',
  created_at: '2026-09-16T10:00:00Z',
  updated_at: '2026-09-16T10:00:00Z',
};

@Component({
  imports: [TransactionCard],
  template: '<app-transaction-card [transaction]="transaction" [categories]="categories" />',
})
class Host {
  transaction = transfer;
  categories: CategoryRead[] = [];
}

describe('TransactionCard presentation category', () => {
  it('gives an uncategorized transfer a local icon and color without a duplicate subtitle', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();

    const card = fixture.nativeElement.querySelector('app-transaction-card');
    const component = fixture.debugElement.query(By.directive(TransactionCard)).componentInstance;
    expect(component.presentationCategory()).toEqual({
      name: 'Transferencia',
      icon: 'swap_horiz',
      color: '#3567c8',
    });
    expect(card.textContent).toContain('Transferencia');
    expect(card.textContent).not.toContain('Sin categoría');
  });
});
