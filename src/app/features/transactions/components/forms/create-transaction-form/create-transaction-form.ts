import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { eurosToCents } from '../../../../../shared/money/money';
import { dateToIso } from '../../../../../shared/date/date';
import { TransactionsService } from '../../../../../core/transactions/transactions.service';
import {
  AccountRead,
  CategoryRead,
  CreateTransactionRequest,
  TransactionTypeEnum,
} from '../../../../../core/models';
import { ColorIcon } from '../../../../../shared/ui/color-icon/color-icon';
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
    ColorIcon,
    AmountInput,
    ToggleTransactionType,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './create-transaction-form.html',
  host: { class: 'bottom-sheet-form' },
})
export class CreateTransactionForm {
  private readonly fb = inject(FormBuilder);
  private readonly transactionsService = inject(TransactionsService);
  private readonly bottomSheetRef = inject(MatBottomSheetRef<CreateTransactionForm>);
  protected readonly data = inject<CreateTransactionFormData>(MAT_BOTTOM_SHEET_DATA);

  protected readonly submitting = signal(false);
  protected readonly formError = signal<string | null>(null);
  protected readonly transactionTypes = Object.values(TransactionTypeEnum);

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

  protected readonly categoryId = toSignal(this.form.controls.category_id.valueChanges, {
    initialValue: this.form.controls.category_id.value,
  });

  protected readonly selectedCategory = computed(() =>
    this.data.categories.find((c) => c.id === this.categoryId()),
  );

  submit(): void {
    if (this.form.invalid || this.submitting()) return;
    this.submitting.set(true);
    this.formError.set(null);
    this.bottomSheetRef.disableClose = true;
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
      next: () => this.bottomSheetRef.dismiss(),
      error: (error: unknown) => {
        this.submitting.set(false);
        this.bottomSheetRef.disableClose = false;
        this.formError.set(applyServerErrors(this.form, error));
      },
    });
  }
}
