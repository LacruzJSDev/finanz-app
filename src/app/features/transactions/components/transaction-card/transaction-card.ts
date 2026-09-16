import { AppCard } from '../../../../shared/ui/card';
import { AppButton } from '../../../../shared/ui/button';
import { Component, computed, input, output } from '@angular/core';
import { AppIcon } from '../../../../shared/ui/icon';
import { CentsToEurosPipe } from '../../../../shared/money/cents-to-euros.pipe';
import { ColorIcon } from '../../../../shared/ui/color-icon/color-icon';
import { CategoryRead, TransactionRead, TransactionTypeEnum } from '../../../../core/models';
import { FRONTEND_TRANSFER_CATEGORY } from '../../transaction-presentation';

/** Una fila de movimiento: icono de categoría, concepto, contexto e importe. */
@Component({
  selector: 'app-transaction-card',
  imports: [AppCard, AppButton, AppIcon, CentsToEurosPipe, ColorIcon],
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
  readonly presentationCategory = computed(
    () =>
      this.category() ??
      (this.transaction().type === TransactionTypeEnum.Transfer
        ? FRONTEND_TRANSFER_CATEGORY
        : null),
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
  readonly subtitle = computed(() => {
    if (this.category()) return this.category()!.name;
    return this.transaction().type === TransactionTypeEnum.Transfer ? null : 'Sin categoría';
  });
}
