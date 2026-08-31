import { Component, computed, input, output } from '@angular/core';
import { CategoryRead, TransactionRead } from '../../../../../core/models';
import { isoToDate } from '../../../../../shared/date/date';
import { TransactionCard } from '../../transaction-card/transaction-card';

/** Un día con sus movimientos, tal como se pinta: cabecera + tarjetas. */
interface TransactionDayGroup {
  key: string;
  /** «HOY», «AYER» o el día de la semana. */
  label: string;
  /** La fecha corta a la derecha, p.ej. «27 AGO». */
  date: string;
  /**
   * Solo en el primer día de cada mes: abre su bloque. El resto lo llevan a
   * `null`, así que el cambio de mes se ve una vez y no en cada día.
   */
  monthLabel: string | null;
  transactions: TransactionRead[];
}

const WEEKDAY_FMT = new Intl.DateTimeFormat('es-ES', { weekday: 'long' });
const SHORT_DATE_FMT = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short' });
const MONTH_FMT = new Intl.DateTimeFormat('es-ES', { month: 'long' });
const MONTH_YEAR_FMT = new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' });

function startOfDay(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

// El año solo cuando no es el corriente: dentro de este año es ruido, y al
// cruzar a diciembre del anterior es justo lo que hace falta saber.
function monthLabel(date: Date): string {
  const fmt = date.getFullYear() === new Date().getFullYear() ? MONTH_FMT : MONTH_YEAR_FMT;
  return fmt.format(date);
}

function dayLabel(date: Date): string {
  const today = startOfDay(new Date());
  const diffDays = Math.round((today - startOfDay(date)) / 86_400_000);
  if (diffDays === 0) return 'HOY';
  if (diffDays === 1) return 'AYER';
  return WEEKDAY_FMT.format(date).toUpperCase();
}

@Component({
  selector: 'app-transactions-list',
  imports: [TransactionCard],
  templateUrl: 'transactions-list.html',
  styleUrl: 'transactions-list.scss',
})
export class TransactionsList {
  readonly transactions = input.required<TransactionRead[]>();
  readonly categories = input.required<CategoryRead[]>();
  readonly rowClick = output<TransactionRead>();
  readonly deleteClick = output<TransactionRead>();

  /** Movimientos por día, más recientes primero. */
  readonly groups = computed<TransactionDayGroup[]>(() => {
    // Dos niveles: primero el día, y dentro de cada día la hora de alta, porque
    // `date` es solo YYYY-MM-DD y ahí empatan todos los del mismo día. Si el día
    // más reciente va arriba, dentro del día también.
    const sorted = [...this.transactions()].sort((a, b) => {
      const byDate = b.date.localeCompare(a.date);
      if (byDate !== 0) return byDate;
      return b.created_at.localeCompare(a.created_at);
    });
    const groups = new Map<string, TransactionDayGroup>();
    // El mes del grupo anterior, para saber cuál es el primer día de cada uno.
    let previousMonth = '';

    for (const transaction of sorted) {
      let group = groups.get(transaction.date);
      if (!group) {
        const date = isoToDate(transaction.date);
        const month = transaction.date.slice(0, 7);
        group = {
          key: transaction.date,
          label: dayLabel(date),
          date: SHORT_DATE_FMT.format(date).replace('.', '').toUpperCase(),
          monthLabel: month === previousMonth ? null : monthLabel(date),
          transactions: [],
        };
        previousMonth = month;
        groups.set(transaction.date, group);
      }
      group.transactions.push(transaction);
    }
    return [...groups.values()];
  });
}
