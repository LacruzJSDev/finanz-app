import { Component, computed, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { addMonths, startOfMonth } from '../../../../shared/date/date';

const MONTH_FMT = new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' });

/**
 * Un mes cada vez, hacia atrás sin límite. No es un control segmentado a
 * propósito: encima ya hay uno que cambia de sección, y dos con la misma piel
 * se leen como hermanos cuando no lo son.
 */
@Component({
  selector: 'app-month-stepper',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './month-stepper.html',
  styleUrl: './month-stepper.scss',
})
export class MonthStepper {
  readonly month = input.required<Date>();
  readonly monthChange = output<Date>();

  protected readonly label = computed(() => MONTH_FMT.format(this.month()));

  /** Hacia delante solo hasta el mes en curso: del futuro no hay nada que resumir. */
  protected readonly canGoForward = computed(
    () => this.month().getTime() < startOfMonth(new Date()).getTime(),
  );

  previous(): void {
    this.monthChange.emit(addMonths(this.month(), -1));
  }

  next(): void {
    if (this.canGoForward()) this.monthChange.emit(addMonths(this.month(), 1));
  }
}
