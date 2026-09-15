import { Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TransactionTypeEnum } from '../../../../core/models';
import { AppTextInput } from '../../../../shared/ui/text-input';

@Component({
  selector: 'app-amount-input',
  imports: [ReactiveFormsModule, AppTextInput],
  templateUrl: './amount-input.html',
  styleUrl: './amount-input.scss',
})
export class AmountInput {
  readonly control = input.required<FormControl<number>>();

  /** De él salen el signo y el color del importe. */
  readonly type = input.required<TransactionTypeEnum>();
}
