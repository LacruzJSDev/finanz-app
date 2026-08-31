import { Component, computed, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CategorySummaryRead } from '../../../../core/models';
import { formatMoney } from '../../../../shared/money/money';
import { EmptyState } from '../../../../shared/ui/empty-state/empty-state';

type BreakdownKind = 'expense' | 'income';

interface BreakdownRow {
  id: string;
  name: string;
  amount: string;
  percent: string;
  share: number;
}

/**
 * Cuánto se lleva cada categoría raíz, de lo gastado o de lo ingresado. Las
 * subcategorías vienen ya sumadas a su padre desde el servidor, y las
 * transferencias quedan siempre fuera del resumen.
 */
@Component({
  selector: 'app-category-breakdown',
  imports: [MatCardModule, EmptyState],
  templateUrl: './category-breakdown.html',
  styleUrl: './category-breakdown.scss',
})
export class CategoryBreakdown {
  readonly summary = input.required<CategorySummaryRead[]>();
  readonly kind = input.required<BreakdownKind>();

  protected readonly isExpense = computed(() => this.kind() === 'expense');
  protected readonly title = computed(() => (this.isExpense() ? 'Gastos' : 'Ingresos'));
  protected readonly sign = computed(() => (this.isExpense() ? '−' : '+'));

  protected readonly emptyMessage = computed(() =>
    this.isExpense() ? 'Ningún gasto este mes.' : 'Ningún ingreso este mes.',
  );

  // Los gastos se guardan en negativo y los ingresos en positivo. Aquí se
  // trabaja con la magnitud y el signo lo pone la vista.
  private readonly amounts = computed(() =>
    this.summary()
      .map((row) => ({
        id: row.root_category_id ?? 'sin-categoria',
        name: row.root_category_name ?? 'Sin categoría',
        value: Math.abs(this.isExpense() ? row.expense : row.income),
      }))
      .filter((row) => row.value > 0),
  );

  private readonly total = computed(() => this.amounts().reduce((sum, row) => sum + row.value, 0));

  /**
   * La barra mide la parte del total, no la comparación con la mayor. Contra la
   * mayor, la primera siempre llenaba la barra entera dijera lo que dijera su
   * peso real; sobre el total, una categoría que se lleva la mitad se ve por la
   * mitad.
   *
   * No se enseña el número de movimientos: el resumen lo da por categoría, no
   * por signo, así que una categoría con ingresos y gastos daría el mismo
   * recuento en las dos tarjetas y en ninguna sería cierto.
   */
  protected readonly rows = computed<BreakdownRow[]>(() => {
    const total = this.total();
    return [...this.amounts()]
      .sort((a, b) => b.value - a.value)
      .map((row) => {
        const share = total > 0 ? (row.value / total) * 100 : 0;
        return {
          id: row.id,
          name: row.name,
          amount: formatMoney(row.value),
          percent: `${Math.round(share)} %`,
          share,
        };
      });
  });
}
