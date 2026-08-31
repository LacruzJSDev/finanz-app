import { Component, computed, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { PendingFixedExpenseRead } from '../../../../core/models';
import { formatMoney } from '../../../../shared/money/money';
import { isoToDate } from '../../../../shared/date/date';

interface PendingExpenseRow {
  id: string;
  title: string;
  due: Date;
  amount: string;
}

/**
 * Lo que todavía tiene que salir antes del cobro. Es el desglose de la resta
 * que la tarjeta de saldo enseña en total: sin él, esa cifra es un número sin
 * explicación.
 */
@Component({
  selector: 'app-pending-expenses-card',
  imports: [DatePipe, MatCardModule],
  templateUrl: './pending-expenses-card.html',
  styleUrl: './pending-expenses-card.scss',
})
export class PendingExpensesCard {
  readonly expenses = input.required<PendingFixedExpenseRead[]>();
  readonly total = input.required<number>();

  protected readonly totalAmount = computed(() => formatMoney(this.total()));

  /** Lo que vence antes, antes: es el orden en el que va a salir el dinero. */
  protected readonly rows = computed<PendingExpenseRow[]>(() =>
    [...this.expenses()]
      .sort((a, b) => a.due_date.localeCompare(b.due_date))
      .map((expense) => ({
        id: expense.payment_plan_id,
        title: expense.description?.trim() || 'Gasto fijo',
        due: isoToDate(expense.due_date),
        amount: formatMoney(expense.amount),
      })),
  );
}
