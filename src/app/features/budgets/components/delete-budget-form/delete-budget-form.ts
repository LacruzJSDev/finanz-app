import { Component, inject, signal } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BudgetsService } from '../../../../core/budgets/budgets.service';

export interface DeleteBudgetFormData {
  groupId: string;
  categoryId: string;
  categoryName: string;
  month: string;
}

@Component({
  selector: 'app-delete-budget-form',
  imports: [MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './delete-budget-form.html',
  styleUrl: './delete-budget-form.scss',
  host: { class: 'bottom-sheet-form' },
})
export class DeleteBudgetForm {
  private readonly bottomSheetRef = inject(MatBottomSheetRef<DeleteBudgetForm>);
  private readonly budgetsService = inject(BudgetsService);
  protected readonly data = inject<DeleteBudgetFormData>(MAT_BOTTOM_SHEET_DATA);
  protected readonly submitting = signal(false);

  submit(): void {
    if (this.submitting()) return;
    this.submitting.set(true);
    this.bottomSheetRef.disableClose = true;
    this.budgetsService
      .deleteBudget(this.data.groupId, this.data.categoryId, this.data.month)
      .subscribe({
        next: () => this.bottomSheetRef.dismiss(),
        error: () => {
          this.submitting.set(false);
          this.bottomSheetRef.disableClose = false;
        },
      });
  }

  cancel(): void {
    this.bottomSheetRef.dismiss();
  }
}
