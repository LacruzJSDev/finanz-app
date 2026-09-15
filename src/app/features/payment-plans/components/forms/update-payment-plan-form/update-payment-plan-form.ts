import { AppButton } from '../../../../../shared/ui/button';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { APP_SHEET_DATA, AppSheetRef } from '../../../../../shared/ui/app-sheet';
import { AppSelect, AppSelectOption } from '../../../../../shared/ui/select';
import { AppInputGroup } from '../../../../../shared/ui/input-group';
import { AppTextInput } from '../../../../../shared/ui/text-input';
import { AppSwitch } from '../../../../../shared/ui/switch';
import { AppDatePicker } from '../../../../../shared/ui/date-picker';
import { AppLoader } from '../../../../../shared/ui/loader';
import { PaymentPlansService } from '../../../../../core/payment-plans/payment-plans.service';
import { applyServerErrors } from '../../../../../core/forms/apply-server-errors';
import {
  CategoryRead,
  FrequencyUnitEnum,
  PaymentPlanRead,
  TransactionTypeEnum,
  UpdatePaymentPlanRequest,
} from '../../../../../core/models';
import { centsToEuros, eurosToCents } from '../../../../../shared/money/money';
import { dateToIso, isoToDate } from '../../../../../shared/date/date';
import { AmountInput, ToggleTransactionType } from '../../../../transactions';
import { CategorySelect } from '../../../../categories';
import { FrequencyUnitLabelPipe } from '../../../pipes/frequency-unit-label.pipe';

export interface UpdatePaymentPlanFormData {
  accountId: string;
  plan: PaymentPlanRead;
  categories: CategoryRead[];
}

@Component({
  selector: 'app-update-payment-plan-form',
  imports: [
    ReactiveFormsModule,
    CategorySelect,
    AmountInput,
    ToggleTransactionType,
    AppInputGroup,
    AppSelect,
    AppTextInput,
    AppButton,
    AppSwitch,
    AppDatePicker,
    AppLoader,
  ],
  templateUrl: './update-payment-plan-form.html',
  host: { class: 'bottom-sheet-form' },
})
export class UpdatePaymentPlanForm {
  private readonly fb = inject(FormBuilder);
  private readonly paymentPlansService = inject(PaymentPlansService);
  private readonly sheetRef = inject(AppSheetRef<UpdatePaymentPlanForm>);
  protected readonly data = inject<UpdatePaymentPlanFormData>(APP_SHEET_DATA);

  protected readonly submitting = signal(false);
  protected readonly formError = signal<string | null>(null);

  protected readonly frequencyUnits = Object.values(FrequencyUnitEnum);
  protected readonly frequencyOptions: readonly AppSelectOption[] = this.frequencyUnits.map(
    (unit) => ({ value: unit, label: new FrequencyUnitLabelPipe().transform(unit) }),
  );

  protected readonly transactionTypes =
    this.data.plan.type === TransactionTypeEnum.Transfer
      ? [TransactionTypeEnum.Transfer]
      : [TransactionTypeEnum.Expense, TransactionTypeEnum.Income];

  protected readonly isTransfer = this.data.plan.type === TransactionTypeEnum.Transfer;

  readonly form = this.fb.nonNullable.group({
    type: [this.data.plan.type, [Validators.required]],
    amount: [centsToEuros(this.data.plan.amount), [Validators.required]],
    description: [this.data.plan.description ?? ''],
    next_due_date: [isoToDate(this.data.plan.next_due_date), [Validators.required]],
    category_id: [this.data.plan.category_id ?? ''],
    is_recurring: [this.data.plan.is_recurring],
    frequency_interval: [this.data.plan.frequency_interval ?? 1],
    frequency_unit: [this.data.plan.frequency_unit ?? FrequencyUnitEnum.Month],
    end_date: [this.data.plan.end_date ? isoToDate(this.data.plan.end_date) : null],
    is_active: [this.data.plan.is_active],
  });

  protected readonly type = toSignal(this.form.controls.type.valueChanges, {
    initialValue: this.form.controls.type.value,
  });

  protected readonly recurring = toSignal(this.form.controls.is_recurring.valueChanges, {
    initialValue: this.form.controls.is_recurring.value,
  });

  submit(): void {
    if (this.form.invalid || this.submitting()) return;
    this.submitting.set(true);
    this.formError.set(null);
    this.sheetRef.disableClose = true;
    const raw = this.form.getRawValue();

    const payload: UpdatePaymentPlanRequest = {
      type: raw.type,
      amount: eurosToCents(raw.amount),
      description: raw.description || null,
      next_due_date: dateToIso(raw.next_due_date),
      category_id: this.isTransfer ? null : raw.category_id || null,
      is_recurring: raw.is_recurring,
      frequency_interval: raw.is_recurring ? raw.frequency_interval : null,
      frequency_unit: raw.is_recurring ? raw.frequency_unit : null,
      end_date: raw.is_recurring && raw.end_date ? dateToIso(raw.end_date) : null,
      is_active: raw.is_active,
    };

    this.paymentPlansService
      .updatePaymentPlan(this.data.accountId, this.data.plan.id, payload)
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
