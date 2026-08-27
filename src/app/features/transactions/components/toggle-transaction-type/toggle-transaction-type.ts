import { Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { TransactionTypeEnum } from '../../../../core/models';
import { TransactionTypeLabelPipe } from '../../pipes/transaction-type-label.pipe';

@Component({
  selector: 'app-toggle-transaction-type',
  imports: [ReactiveFormsModule, MatButtonToggleModule, TransactionTypeLabelPipe],
  templateUrl: './toggle-transaction-type.html',
  styleUrl: './toggle-transaction-type.scss',
})
export class ToggleTransactionType {
  readonly control = input.required<FormControl<TransactionTypeEnum>>();

  /** Tipos entre los que se puede elegir; con uno solo se muestra como texto. */
  readonly options = input.required<TransactionTypeEnum[]>();
}
