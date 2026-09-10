import { AppButton } from '../../../../../shared/ui/button';
import { Component, inject, signal } from '@angular/core';
import { APP_SHEET_DATA, AppSheetRef } from '../../../../../shared/ui/app-sheet';
import { AppLoader } from '../../../../../shared/ui/loader';
import { TransactionsService } from '../../../../../core/transactions/transactions.service';
import { TransactionRead } from '../../../../../core/models';

export interface DeleteTransactionFormData {
  accountId: string;
  transaction: TransactionRead;
}

@Component({
  selector: 'app-delete-transaction-form',
  imports: [AppButton, AppLoader],
  templateUrl: './delete-transaction-form.html',
  styleUrl: './delete-transaction-form.scss',
  host: { class: 'bottom-sheet-form' },
})
export class DeleteTransactionForm {
  private readonly sheetRef = inject(AppSheetRef<DeleteTransactionForm>);
  private readonly transactionsService = inject(TransactionsService);

  protected readonly data = inject<DeleteTransactionFormData>(APP_SHEET_DATA);

  protected readonly submitting = signal(false);

  submit(): void {
    if (this.submitting()) return;
    this.submitting.set(true);
    this.sheetRef.disableClose = true;

    this.transactionsService
      .deleteTransactionById(this.data.accountId, this.data.transaction.id)
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
