import { Component, computed, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AppSegmentedControl } from '../../../../shared/ui/segmented-control';
import { TransactionTypeEnum } from '../../../../core/models';
import { TransactionTypeLabelPipe } from '../../pipes/transaction-type-label.pipe';

@Component({
  selector: 'app-toggle-transaction-type',
  imports: [ReactiveFormsModule, AppSegmentedControl, TransactionTypeLabelPipe],
  templateUrl: './toggle-transaction-type.html',
  styleUrl: './toggle-transaction-type.scss',
})
export class ToggleTransactionType {
  readonly control = input.required<FormControl<TransactionTypeEnum>>();

  /** Tipos entre los que se puede elegir; con uno solo se muestra como texto. */
  readonly options = input.required<TransactionTypeEnum[]>();
  protected readonly segmentOptions = computed(() =>
    this.options().map((type) => ({
      value: type,
      label: new TransactionTypeLabelPipe().transform(type),
    })),
  );
}
