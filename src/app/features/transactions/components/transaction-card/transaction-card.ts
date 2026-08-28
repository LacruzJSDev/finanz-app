import { Component, computed, input, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CentsToEurosPipe } from '../../../../shared/money/cents-to-euros.pipe';
import { ColorIcon } from '../../../../shared/ui/color-icon/color-icon';
import { CategoryRead, TransactionRead, TransactionTypeEnum } from '../../../../core/models';

/** Una fila de movimiento: icono de categoría, concepto, contexto e importe. */
@Component({
  selector: 'app-transaction-card',
  imports: [MatCardModule, MatButtonModule, MatIconModule, CentsToEurosPipe, ColorIcon],
  templateUrl: 'transaction-card.html',
  styleUrl: 'transaction-card.scss',
})
export class TransactionCard {
  readonly transaction = input.required<TransactionRead>();
  readonly categories = input.required<CategoryRead[]>();

  readonly rowClick = output<TransactionRead>();
  readonly deleteClick = output<TransactionRead>();

  readonly category = computed(() =>
    this.categories().find((category) => category.id === this.transaction().category_id),
  );

  readonly title = computed(() => {
    const notes = this.transaction().notes?.trim();
    if (notes) return notes;
    if (this.transaction().type === TransactionTypeEnum.Transfer) return 'Transferencia';
    if (this.transaction().type === TransactionTypeEnum.Expense) return 'Gasto';
    if (this.transaction().type === TransactionTypeEnum.Income) return 'Ingreso';
    return 'Movimiento';
  });

  // Solo la categoría: la cuenta ya la dice el título de la barra superior, y
  // repetirla en cada fila era ruido.
  readonly subtitle = computed(() => this.category()?.name ?? 'Sin categoría');
}
