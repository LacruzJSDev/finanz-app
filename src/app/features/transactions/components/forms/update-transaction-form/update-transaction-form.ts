import { Component, computed, inject, signal } from '@angular/core';
import { LowerCasePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { centsToEuros, eurosToCents } from '../../../../../shared/money/money';
import { dateToIso, isoToDate } from '../../../../../shared/date/date';
import { TransactionsService } from '../../../../../core/transactions/transactions.service';
import {
  AccountRead,
  CategoryRead,
  TransactionRead,
  TransactionTypeEnum,
  UpdateTransactionRequest,
} from '../../../../../core/models';
import { TransactionTypeLabelPipe } from '../../../pipes/transaction-type-label.pipe';
import { ColorIcon } from '../../../../../shared/ui/color-icon/color-icon';
import { AmountInput } from '../../amount-input/amount-input';
import { ToggleTransactionType } from '../../toggle-transaction-type/toggle-transaction-type';
import { applyServerErrors } from '../../../../../core/forms/apply-server-errors';

export interface UpdateTransactionFormData {
  accountId: string;
  transaction: TransactionRead;
  otherAccounts: AccountRead[];
  categories: CategoryRead[];
}

@Component({
  selector: 'app-update-transaction-form',
  imports: [
    ReactiveFormsModule,
    TransactionTypeLabelPipe,
    LowerCasePipe,
    ColorIcon,
    AmountInput,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatProgressSpinnerModule,
    ToggleTransactionType,
  ],
  templateUrl: './update-transaction-form.html',
  styleUrl: './update-transaction-form.scss',
  host: { class: 'bottom-sheet-form' },
})
export class UpdateTransactionForm {
  private readonly fb = inject(FormBuilder);
  private readonly bottomSheetRef = inject(MatBottomSheetRef<UpdateTransactionForm>);
  protected readonly data = inject<UpdateTransactionFormData>(MAT_BOTTOM_SHEET_DATA);

  protected readonly submitting = signal(false);
  protected readonly formError = signal<string | null>(null);

  protected readonly transactionTypes =
    this.data.transaction.type !== TransactionTypeEnum.Transfer
      ? [TransactionTypeEnum.Expense, TransactionTypeEnum.Income]
      : [TransactionTypeEnum.Transfer];

  readonly form = this.fb.nonNullable.group({
    type: [this.data.transaction.type, [Validators.required]],
    amount: [centsToEuros(Math.abs(this.data.transaction.amount)), [Validators.required]],
    date: [isoToDate(this.data.transaction.date), [Validators.required]],
    notes: [this.data.transaction.notes],
    category_id: [this.data.transaction.category_id ?? ''],
  });

  protected readonly type = toSignal(this.form.controls.type.valueChanges, {
    initialValue: this.form.controls.type.value,
  });

  protected readonly categoryId = toSignal(this.form.controls.category_id.valueChanges, {
    initialValue: this.form.controls.category_id.value,
  });

  protected readonly selectedCategory = computed(() =>
    this.data.categories.find((c) => c.id === this.categoryId()),
  );

  private readonly transactionsService = inject(TransactionsService);

  submit(): void {
    if (this.form.invalid || this.submitting()) return;
    this.submitting.set(true);
    this.formError.set(null);
    this.bottomSheetRef.disableClose = true;
    const raw = this.form.getRawValue();
    const isTransfer = raw.type === 'transfer';

    const payload: UpdateTransactionRequest = {
      type: raw.type,
      amount: eurosToCents(raw.amount),
      date: dateToIso(raw.date),
      // `null` y no `undefined`: al serializar el cuerpo se pierden las claves
      // `undefined`, así que el campo no viajaría y el PATCH lo dejaría como
      // estaba. Vaciar el concepto o quitar la categoría no llegaba nunca.
      notes: raw.notes || null,
      category_id: isTransfer ? null : raw.category_id || null,
    };

    this.transactionsService
      .updateTransaction(this.data.accountId, this.data.transaction.id, payload)
      .subscribe({
        next: () => this.bottomSheetRef.dismiss(),
        error: (error: unknown) => {
          this.submitting.set(false);
          this.bottomSheetRef.disableClose = false;
          this.formError.set(applyServerErrors(this.form, error));
        },
      });
  }
}
