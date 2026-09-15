import { AppButton } from '../../../../../shared/ui/button';
import { Component, inject, signal } from '@angular/core';
import { LowerCasePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { APP_SHEET_DATA, AppSheetRef } from '../../../../../shared/ui/app-sheet';
import { AppTextInput } from '../../../../../shared/ui/text-input';
import { AppLoader } from '../../../../../shared/ui/loader';
import { AppDatePicker } from '../../../../../shared/ui/date-picker';
import { AppInputGroup } from '../../../../../shared/ui/input-group';
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
import { CategorySelect } from '../../../../categories';
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
    CategorySelect,
    AmountInput,
    AppTextInput,
    AppButton,
    AppDatePicker,
    AppInputGroup,
    AppLoader,
    ToggleTransactionType,
  ],
  templateUrl: './update-transaction-form.html',
  styleUrl: './update-transaction-form.scss',
  host: { class: 'bottom-sheet-form' },
})
export class UpdateTransactionForm {
  private readonly fb = inject(FormBuilder);
  private readonly sheetRef = inject(AppSheetRef<UpdateTransactionForm>);
  protected readonly data = inject<UpdateTransactionFormData>(APP_SHEET_DATA);

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

  private readonly transactionsService = inject(TransactionsService);

  submit(): void {
    if (this.form.invalid || this.submitting()) return;
    this.submitting.set(true);
    this.formError.set(null);
    this.sheetRef.disableClose = true;
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
        next: () => this.sheetRef.dismiss(),
        error: (error: unknown) => {
          this.submitting.set(false);
          this.sheetRef.disableClose = false;
          this.formError.set(applyServerErrors(this.form, error));
        },
      });
  }
}
