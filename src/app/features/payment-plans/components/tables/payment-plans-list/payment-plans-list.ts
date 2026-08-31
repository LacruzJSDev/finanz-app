import { Component, computed, input, output } from '@angular/core';
import { AccountRead, CategoryRead, PaymentPlanRead } from '../../../../../core/models';
import { PaymentPlanCard } from '../../payment-plan-card/payment-plan-card';

@Component({
  selector: 'app-payment-plans-list',
  imports: [PaymentPlanCard],
  templateUrl: './payment-plans-list.html',
  styleUrl: './payment-plans-list.scss',
})
export class PaymentPlansList {
  /** Ya filtrados por la página (activos o archivados). */
  readonly plans = input.required<PaymentPlanRead[]>();
  readonly categories = input.required<CategoryRead[]>();
  readonly accounts = input.required<AccountRead[]>();
  readonly canManage = input(false);

  readonly editClick = output<PaymentPlanRead>();

  protected readonly sorted = computed(() =>
    [...this.plans()].sort((a, b) => a.next_due_date.localeCompare(b.next_due_date)),
  );
}
