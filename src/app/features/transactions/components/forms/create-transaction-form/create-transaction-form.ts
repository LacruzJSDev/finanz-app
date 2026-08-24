import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { eurosToCents } from '../../../../../shared/money/money';
import { TransactionsService } from '../../../../../core/transactions/transactions.service';
import {
  AccountRead,
  CategoryRead,
  CreateTransactionRequest,
  TransactionTypeEnum,
} from '../../../../../api';
import { TransactionTypeLabelPipe } from '../../../pipes/transaction-type-label.pipe';

export interface CreateTransactionFormData {
  accountId: string;
  otherAccounts: AccountRead[];
  categories: CategoryRead[];
}

@Component({
  selector: 'app-create-transaction-form',
  imports: [ReactiveFormsModule, TransactionTypeLabelPipe],
  templateUrl: './create-transaction-form.html',
})
export class CreateTransactionForm {
  private readonly fb = inject(FormBuilder);
  private readonly transactionsService = inject(TransactionsService);
  private readonly bottomSheetRef = inject(MatBottomSheetRef<CreateTransactionForm>);
  protected readonly data = inject<CreateTransactionFormData>(MAT_BOTTOM_SHEET_DATA);
  protected readonly transactionTypes = Object.values(TransactionTypeEnum);

  readonly form = this.fb.nonNullable.group({
    type: ['expense' as CreateTransactionRequest['type'], [Validators.required]],
    amount: [0, [Validators.required]],
    to_account_id: [''],
    category_id: [''],
    date: [new Date().toISOString().slice(0, 10), [Validators.required]],
    notes: [''],
  });

  protected readonly type = toSignal(this.form.controls.type.valueChanges, {
    initialValue: this.form.controls.type.value,
  });

  submit(): void {
    if (this.form.invalid) return;
    const raw = this.form.getRawValue();
    const isTransfer = raw.type === 'transfer';

    const payload: CreateTransactionRequest = {
      type: raw.type,
      amount: eurosToCents(raw.amount),
      date: raw.date,
      notes: raw.notes || undefined,
      to_account_id: isTransfer ? raw.to_account_id : undefined,
      category_id: isTransfer ? undefined : raw.category_id || undefined,
    };

    this.transactionsService.createTransactions(this.data.accountId, payload)?.subscribe(() => {
      this.bottomSheetRef.dismiss();
    });
  }
}
