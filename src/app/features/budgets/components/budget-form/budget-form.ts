import { AppButton } from '../../../../shared/ui/button';
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { APP_SHEET_DATA, AppSheetRef } from '../../../../shared/ui/app-sheet';
import { AppLoader } from '../../../../shared/ui/loader';
import { AppSelect, AppSelectOption } from '../../../../shared/ui/select';
import { AppInputGroup } from '../../../../shared/ui/input-group';
import { AppTextInput } from '../../../../shared/ui/text-input';
import { BudgetsService } from '../../../../core/budgets/budgets.service';
import { applyServerErrors } from '../../../../core/forms/apply-server-errors';
import { BudgetProgressRead, CategoryRead } from '../../../../core/models';
import { centsToEuros, eurosToCents } from '../../../../shared/money/money';

export interface BudgetFormData {
  groupId: string;
  categories: CategoryRead[];
  budgets: BudgetProgressRead[];
  categoryId?: string;
  month: string;
}

@Component({
  selector: 'app-budget-form',
  imports: [ReactiveFormsModule, AppButton, AppInputGroup, AppTextInput, AppLoader, AppSelect],
  templateUrl: './budget-form.html',
  host: { class: 'bottom-sheet-form' },
})
export class BudgetForm {
  private readonly fb = inject(FormBuilder);
  private readonly budgetsService = inject(BudgetsService);
  private readonly sheetRef = inject(AppSheetRef<BudgetForm>);
  protected readonly data = inject<BudgetFormData>(APP_SHEET_DATA);
  protected readonly submitting = signal(false);
  protected readonly formError = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    categoryId: [this.data.categoryId ?? '', Validators.required],
    amount: [this.initialAmount(), [Validators.required, Validators.min(0.01)]],
  });
  protected readonly categoryId = toSignal(this.form.controls.categoryId.valueChanges, {
    initialValue: this.form.controls.categoryId.value,
  });
  protected readonly selectedCategory = computed(() =>
    this.data.categories.find((category) => category.id === this.categoryId()),
  );
  protected readonly categoryOptions: readonly AppSelectOption[] = this.data.categories.map(
    (category) => ({
      value: category.id,
      label: category.name,
      icon: category.icon ?? undefined,
      color: category.color ?? undefined,
    }),
  );
  protected readonly selectedBudget = computed(() =>
    this.data.budgets.find((budget) => budget.category_id === this.categoryId()),
  );

  constructor() {
    this.form.controls.categoryId.valueChanges.subscribe(() => this.categoryChanged());
  }

  protected categoryChanged(): void {
    const budget = this.selectedBudget();
    this.form.controls.amount.setValue(budget ? centsToEuros(budget.amount) : 0);
  }

  submit(): void {
    if (this.form.invalid || this.submitting()) return;
    this.submitting.set(true);
    this.formError.set(null);
    this.sheetRef.disableClose = true;
    const { categoryId, amount } = this.form.getRawValue();
    this.budgetsService
      .setBudget(this.data.groupId, categoryId, { amount: eurosToCents(amount) }, this.data.month)
      .subscribe({
        next: () => this.sheetRef.dismiss(),
        error: (error) => this.handleError(error),
      });
  }

  private initialAmount(): number {
    const budget = this.data.budgets.find((item) => item.category_id === this.data.categoryId);
    return budget ? centsToEuros(budget.amount) : 0;
  }

  private handleError(error: unknown): void {
    this.submitting.set(false);
    this.sheetRef.disableClose = false;
    this.formError.set(applyServerErrors(this.form, error));
  }
}
