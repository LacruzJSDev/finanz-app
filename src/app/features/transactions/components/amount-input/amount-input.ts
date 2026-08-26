import { Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TransactionTypeEnum } from '../../../../api';

@Component({
  selector: 'app-amount-input',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './amount-input.html',
  styleUrl: './amount-input.scss',
})
export class AmountInput {
  readonly control = input.required<FormControl<number>>();

  /** De él salen el signo y el color del importe. */
  readonly type = input.required<TransactionTypeEnum>();
}
