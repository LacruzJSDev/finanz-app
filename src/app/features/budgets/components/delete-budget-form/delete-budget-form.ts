import { AppButton } from '../../../../shared/ui/button';
import { Component, inject, signal } from '@angular/core';
import { APP_SHEET_DATA, AppSheetRef } from '../../../../shared/ui/app-sheet';
import { AppLoader } from '../../../../shared/ui/loader';
import { BudgetsService } from '../../../../core/budgets/budgets.service';

export interface DeleteBudgetFormData {
  groupId: string;
  categoryId: string;
  categoryName: string;
  month: string;
}

@Component({
  selector: 'app-delete-budget-form',
  imports: [AppButton, AppLoader],
  templateUrl: './delete-budget-form.html',
  styleUrl: './delete-budget-form.scss',
  host: { class: 'bottom-sheet-form bottom-sheet-confirm' },
})
export class DeleteBudgetForm {
  private readonly sheetRef = inject(AppSheetRef<DeleteBudgetForm>);
  private readonly budgetsService = inject(BudgetsService);
  protected readonly data = inject<DeleteBudgetFormData>(APP_SHEET_DATA);
  protected readonly submitting = signal(false);

  submit(): void {
    if (this.submitting()) return;
    this.submitting.set(true);
    this.sheetRef.disableClose = true;
    this.budgetsService
      .deleteBudget(this.data.groupId, this.data.categoryId, this.data.month)
      .subscribe({
        next: () => this.sheetRef.dismiss(),
        error: () => {
          this.submitting.set(false);
          this.sheetRef.disableClose = false;
        },
      });
  }

  cancel(): void {
    this.sheetRef.dismiss();
  }
}
