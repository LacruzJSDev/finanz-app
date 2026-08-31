import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PaymentPlansService } from '../../../../../core/payment-plans/payment-plans.service';
import { applyServerErrors } from '../../../../../core/forms/apply-server-errors';
import {
  AccountRead,
  CategoryRead,
  CreatePaymentPlanRequest,
  FrequencyUnitEnum,
  TransactionTypeEnum,
} from '../../../../../core/models';
import { eurosToCents } from '../../../../../shared/money/money';
import { dateToIso } from '../../../../../shared/date/date';
import { ColorIcon } from '../../../../../shared/ui/color-icon/color-icon';
import { AmountInput, ToggleTransactionType } from '../../../../transactions';
import { FrequencyUnitLabelPipe } from '../../../pipes/frequency-unit-label.pipe';

export interface CreatePaymentPlanFormData {
  accountId: string;
  otherAccounts: AccountRead[];
  categories: CategoryRead[];
}

@Component({
  selector: 'app-create-payment-plan-form',
  imports: [
    ReactiveFormsModule,
    ColorIcon,
    AmountInput,
    ToggleTransactionType,
    FrequencyUnitLabelPipe,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './create-payment-plan-form.html',
  host: { class: 'bottom-sheet-form' },
})
export class CreatePaymentPlanForm {
  private readonly fb = inject(FormBuilder);
  private readonly paymentPlansService = inject(PaymentPlansService);
  private readonly bottomSheetRef = inject(MatBottomSheetRef<CreatePaymentPlanForm>);
  protected readonly data = inject<CreatePaymentPlanFormData>(MAT_BOTTOM_SHEET_DATA);

  protected readonly submitting = signal(false);
  protected readonly formError = signal<string | null>(null);

  protected readonly transactionTypes = Object.values(TransactionTypeEnum);
  protected readonly frequencyUnits = Object.values(FrequencyUnitEnum);

  readonly form = this.fb.nonNullable.group({
    type: [TransactionTypeEnum.Expense as TransactionTypeEnum, [Validators.required]],
    amount: [0, [Validators.required]],
    description: [''],
    next_due_date: [new Date(), [Validators.required]],
    category_id: [''],
    to_account_id: [''],
    is_recurring: [true],
    frequency_interval: [1],
    frequency_unit: [FrequencyUnitEnum.Month as FrequencyUnitEnum],
    end_date: [null as Date | null],
  });

  protected readonly type = toSignal(this.form.controls.type.valueChanges, {
    initialValue: this.form.controls.type.value,
  });

  protected readonly recurring = toSignal(this.form.controls.is_recurring.valueChanges, {
    initialValue: this.form.controls.is_recurring.value,
  });

  private readonly categoryId = toSignal(this.form.controls.category_id.valueChanges, {
    initialValue: this.form.controls.category_id.value,
  });

  protected readonly selectedCategory = computed(() =>
    this.data.categories.find((category) => category.id === this.categoryId()),
  );

  submit(): void {
    if (this.form.invalid || this.submitting()) return;
    this.submitting.set(true);
    this.formError.set(null);
    this.bottomSheetRef.disableClose = true;
    const raw = this.form.getRawValue();
    const isTransfer = raw.type === TransactionTypeEnum.Transfer;

    // El backend rechaza las combinaciones incoherentes, así que se manda solo
    // lo que corresponde: una transferencia no lleva categoría, un plan puntual
    // no lleva periodicidad — ni fecha de fin, que es el fin de una repetición
    // que no existe.
    const payload: CreatePaymentPlanRequest = {
      type: raw.type,
      amount: eurosToCents(raw.amount),
      description: raw.description || undefined,
      next_due_date: dateToIso(raw.next_due_date),
      category_id: isTransfer ? undefined : raw.category_id || undefined,
      to_account_id: isTransfer ? raw.to_account_id : undefined,
      is_recurring: raw.is_recurring,
      frequency_interval: raw.is_recurring ? raw.frequency_interval : undefined,
      frequency_unit: raw.is_recurring ? raw.frequency_unit : undefined,
      end_date: raw.is_recurring && raw.end_date ? dateToIso(raw.end_date) : undefined,
    };

    this.paymentPlansService.createPaymentPlan(this.data.accountId, payload).subscribe({
      next: () => this.bottomSheetRef.dismiss(),
      error: (error: unknown) => {
        this.submitting.set(false);
        this.bottomSheetRef.disableClose = false;
        this.formError.set(applyServerErrors(this.form, error));
      },
    });
  }
}
