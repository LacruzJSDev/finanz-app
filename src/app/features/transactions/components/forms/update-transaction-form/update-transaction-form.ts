import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { centsToEuros, eurosToCents } from '../../../../../shared/money/money';
import { TransactionsService } from '../../../../../core/transactions/transactions.service';
import {
  AccountRead,
  CategoryRead,
  TransactionRead,
  TransactionTypeEnum,
  UpdateTransactionRequest,
} from '../../../../../api';
import { TransactionTypeLabelPipe } from '../../../pipes/transaction-type-label.pipe';

export interface UpdateTransactionFormData {
  accountId: string;
  transaction: TransactionRead;
  otherAccounts: AccountRead[];
  categories: CategoryRead[];
}

@Component({
  selector: 'app-update-transaction-form',
  imports: [ReactiveFormsModule, TransactionTypeLabelPipe],
  templateUrl: './update-transaction-form.html',
})
export class UpdateTransactionForm {
  private readonly fb = inject(FormBuilder);
  private readonly bottomSheetRef = inject(MatBottomSheetRef<UpdateTransactionForm>);
  protected readonly data = inject<UpdateTransactionFormData>(MAT_BOTTOM_SHEET_DATA);

  protected readonly transactionTypes =
    this.data.transaction.type !== TransactionTypeEnum.Transfer
      ? [TransactionTypeEnum.Expense, TransactionTypeEnum.Income]
      : [TransactionTypeEnum.Transfer];

  readonly form = this.fb.nonNullable.group({
    type: [this.data.transaction.type, [Validators.required]],
    amount: [centsToEuros(Math.abs(this.data.transaction.amount)), [Validators.required]],
    date: [this.data.transaction.date, [Validators.required]],
    notes: [this.data.transaction.notes],
    category_id: [this.data.transaction.category_id ?? ''],
  });

  protected readonly type = toSignal(this.form.controls.type.valueChanges, {
    initialValue: this.form.controls.type.value,
  });

  private readonly transactionsService = inject(TransactionsService);

  submit(): void {
    if (this.form.invalid) return;
    const raw = this.form.getRawValue();
    const isTransfer = raw.type === 'transfer';

    const payload: UpdateTransactionRequest = {
      type: raw.type,
      amount: eurosToCents(raw.amount),
      date: raw.date,
      notes: raw.notes || undefined,
      category_id: isTransfer ? undefined : raw.category_id || undefined,
    };

    this.transactionsService
      .updateTransactions(this.data.accountId, this.data.transaction.id, payload)
      ?.subscribe(() => {
        this.bottomSheetRef.dismiss();
      });
  }
}
