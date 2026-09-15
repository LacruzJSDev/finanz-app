import { AppButton } from '../../../../../shared/ui/button';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { APP_SHEET_DATA, AppSheetRef } from '../../../../../shared/ui/app-sheet';
import { AppSelect, AppSelectOption } from '../../../../../shared/ui/select';
import { AppTextInput } from '../../../../../shared/ui/text-input';
import { AppLoader } from '../../../../../shared/ui/loader';
import { AppDatePicker } from '../../../../../shared/ui/date-picker';
import { AppInputGroup } from '../../../../../shared/ui/input-group';
import { eurosToCents } from '../../../../../shared/money/money';
import { dateToIso } from '../../../../../shared/date/date';
import { TransactionsService } from '../../../../../core/transactions/transactions.service';
import {
  AccountRead,
  CategoryRead,
  CreateTransactionRequest,
  TransactionTypeEnum,
} from '../../../../../core/models';
import { CategorySelect } from '../../../../categories';
import { AmountInput } from '../../amount-input/amount-input';
import { ToggleTransactionType } from '../../toggle-transaction-type/toggle-transaction-type';
import { applyServerErrors } from '../../../../../core/forms/apply-server-errors';

export interface CreateTransactionFormData {
  accountId: string;
  otherAccounts: AccountRead[];
  categories: CategoryRead[];
}

@Component({
  selector: 'app-create-transaction-form',
  imports: [
    ReactiveFormsModule,
    CategorySelect,
    AmountInput,
    ToggleTransactionType,
    AppSelect,
    AppTextInput,
    AppButton,
    AppDatePicker,
    AppInputGroup,
    AppLoader,
  ],
  templateUrl: './create-transaction-form.html',
  host: { class: 'bottom-sheet-form' },
})
export class CreateTransactionForm {
  private readonly fb = inject(FormBuilder);
  private readonly transactionsService = inject(TransactionsService);
  private readonly sheetRef = inject(AppSheetRef<CreateTransactionForm>);
  protected readonly data = inject<CreateTransactionFormData>(APP_SHEET_DATA);

  protected readonly submitting = signal(false);
  protected readonly formError = signal<string | null>(null);
  protected readonly transactionTypes = Object.values(TransactionTypeEnum);
  protected readonly accountOptions: readonly AppSelectOption[] = this.data.otherAccounts.map(
    (account) => ({ value: account.id, label: account.name }),
  );

  readonly form = this.fb.nonNullable.group({
    type: [TransactionTypeEnum.Expense as CreateTransactionRequest['type'], [Validators.required]],
    amount: [0, [Validators.required]],
    to_account_id: [''],
    category_id: [''],
    date: [new Date(), [Validators.required]],
    notes: [''],
  });

  protected readonly type = toSignal(this.form.controls.type.valueChanges, {
    initialValue: this.form.controls.type.value,
  });

  submit(): void {
    if (this.form.invalid || this.submitting()) return;
    this.submitting.set(true);
    this.formError.set(null);
    this.sheetRef.disableClose = true;
    const raw = this.form.getRawValue();
    const isTransfer = raw.type === 'transfer';

    const payload: CreateTransactionRequest = {
      type: raw.type,
      amount: eurosToCents(raw.amount),
      date: dateToIso(raw.date),
      notes: raw.notes || undefined,
      to_account_id: isTransfer ? raw.to_account_id : undefined,
      category_id: isTransfer ? undefined : raw.category_id || undefined,
    };

    this.transactionsService.createTransaction(this.data.accountId, payload).subscribe({
      next: () => this.sheetRef.dismiss(),
      error: (error: unknown) => {
        this.submitting.set(false);
        this.sheetRef.disableClose = false;
        this.formError.set(applyServerErrors(this.form, error));
      },
    });
  }
}
