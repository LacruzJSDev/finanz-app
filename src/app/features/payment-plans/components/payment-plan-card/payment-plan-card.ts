import { Component, computed, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CentsToEurosPipe } from '../../../../shared/money/cents-to-euros.pipe';
import { ColorIcon } from '../../../../shared/ui/color-icon/color-icon';
import { isoToDate } from '../../../../shared/date/date';
import {
  AccountRead,
  CategoryRead,
  PaymentPlanRead,
  TransactionTypeEnum,
} from '../../../../core/models';
import { PlanFrequencyPipe } from '../../pipes/plan-frequency.pipe';

@Component({
  selector: 'app-payment-plan-card',
  imports: [
    DatePipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    CentsToEurosPipe,
    ColorIcon,
    PlanFrequencyPipe,
  ],
  templateUrl: 'payment-plan-card.html',
  styleUrl: 'payment-plan-card.scss',
})
export class PaymentPlanCard {
  readonly plan = input.required<PaymentPlanRead>();
  readonly categories = input.required<CategoryRead[]>();

  readonly accounts = input.required<AccountRead[]>();

  readonly canManage = input(false);

  readonly editClick = output<PaymentPlanRead>();

  protected readonly nextDue = computed(() => isoToDate(this.plan().next_due_date));

  protected readonly category = computed(() =>
    this.categories().find((category) => category.id === this.plan().category_id),
  );

  private readonly destination = computed(() =>
    this.accounts().find((account) => account.id === this.plan().to_account_id),
  );

  protected readonly title = computed(() => {
    const description = this.plan().description?.trim();
    if (description) return description;

    switch (this.plan().type) {
      case TransactionTypeEnum.Transfer:
        return this.destination() ? `Traspaso a ${this.destination()?.name}` : 'Traspaso';
      case TransactionTypeEnum.Income:
        return 'Ingreso';
      default:
        return this.category()?.name ?? 'Gasto';
    }
  });

  protected readonly sign = computed(() => {
    switch (this.plan().type) {
      case TransactionTypeEnum.Expense:
        return '−';
      case TransactionTypeEnum.Income:
        return '+';
      default:
        return '';
    }
  });
}
