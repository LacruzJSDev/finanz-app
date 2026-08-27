import { Component, inject, signal } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TransactionsService } from '../../../../../core/transactions/transactions.service';
import { TransactionRead } from '../../../../../core/models';

export interface DeleteTransactionFormData {
  accountId: string;
  transaction: TransactionRead;
}

@Component({
  selector: 'app-delete-transaction-form',
  imports: [MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './delete-transaction-form.html',
  styleUrl: './delete-transaction-form.scss',
  host: { class: 'bottom-sheet-form' },
})
export class DeleteTransactionForm {
  private readonly bottomSheetRef = inject(MatBottomSheetRef<DeleteTransactionForm>);
  private readonly transactionsService = inject(TransactionsService);

  protected readonly data = inject<DeleteTransactionFormData>(MAT_BOTTOM_SHEET_DATA);

  protected readonly submitting = signal(false);

  submit(): void {
    if (this.submitting()) return;
    this.submitting.set(true);
    this.bottomSheetRef.disableClose = true;

    this.transactionsService
      .deleteTransactionById(this.data.accountId, this.data.transaction.id)
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
