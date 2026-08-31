import { Component, computed, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { GroupOverviewRead } from '../../../../core/models';
import { formatMoney, moneyParts } from '../../../../shared/money/money';
import { isoToDate } from '../../../../shared/date/date';
import { SafeSpendMeter } from '../safe-spend-meter/safe-spend-meter';

/**
 * Lo que de verdad queda: el disponible menos los gastos fijos que todavía
 * tienen que salir antes del cobro. Es la cifra que contesta "¿puedo gastar?",
 * y por eso manda en la pantalla.
 */
@Component({
  selector: 'app-real-balance-card',
  imports: [DatePipe, SafeSpendMeter],
  templateUrl: './real-balance-card.html',
  styleUrl: './real-balance-card.scss',
})
export class RealBalanceCard {
  readonly overview = input.required<GroupOverviewRead>();

  protected readonly amount = computed(() => moneyParts(this.overview().real_balance));
  protected readonly available = computed(() => formatMoney(this.overview().available));
  protected readonly fixed = computed(() =>
    formatMoney(this.overview().pending_fixed_expenses_total),
  );

  /** Sin ancla de cobro no hay horizonte que enseñar. */
  protected readonly paydayDate = computed(() => {
    const payday = this.overview().payday;
    return payday ? isoToDate(payday.date) : null;
  });

  protected readonly safeSpend = computed(() => this.overview().daily_safe_spend);

  // Sin nada pendiente, el saldo real es el disponible y la resta sobra:
  // «− 0,00 € en fijos» solo hace ruido.
  protected readonly hasPendingExpenses = computed(
    () => this.overview().pending_fixed_expenses.length > 0,
  );
}
