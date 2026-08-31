import { Component, computed, input } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { formatMoney } from '../../../../shared/money/money';

/**
 * Cuánto llevas gastado hoy frente a lo que puedes gastar al día sin quedarte
 * corto antes del cobro. Responde a una pregunta distinta del saldo: no es
 * cuánto tienes, es a qué ritmo puedes gastarlo.
 */
@Component({
  selector: 'app-safe-spend-meter',
  imports: [MatProgressBarModule],
  templateUrl: './safe-spend-meter.html',
  styleUrl: './safe-spend-meter.scss',
})
export class SafeSpendMeter {
  readonly spentToday = input.required<number>();
  readonly dailySafeSpend = input.required<number>();
  readonly daysRemaining = input<number | null>(null);

  protected readonly spent = computed(() => formatMoney(this.spentToday()));
  protected readonly limit = computed(() => formatMoney(this.dailySafeSpend()));

  protected readonly overLimit = computed(() => this.spentToday() >= this.dailySafeSpend());

  // La barra se llena hasta el tope y ahí se queda: pasado el límite, cuánto te
  // has pasado ya no lo cuenta ella, lo cuenta la cifra de al lado.
  protected readonly progress = computed(() => {
    const limit = this.dailySafeSpend();
    if (limit <= 0) return 100;
    return Math.min(100, (this.spentToday() / limit) * 100);
  });
}
