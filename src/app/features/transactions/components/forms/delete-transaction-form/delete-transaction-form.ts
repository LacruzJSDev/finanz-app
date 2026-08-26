import { Component, inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { TransactionsService } from '../../../../../core/transactions/transactions.service';
import { TransactionRead } from '../../../../../api';

export interface DeleteTransactionFormData {
  accountId: string;
  transaction: TransactionRead;
}

@Component({
  selector: 'app-delete-transaction-form',
  imports: [MatButtonModule],
  templateUrl: './delete-transaction-form.html',
  styleUrl: './delete-transaction-form.scss',
  host: { class: 'bottom-sheet-form' },
})
export class DeleteTransactionForm {
  private readonly bottomSheetRef = inject(MatBottomSheetRef<DeleteTransactionForm>);
  private readonly transactionsService = inject(TransactionsService);

  protected readonly data = inject<DeleteTransactionFormData>(MAT_BOTTOM_SHEET_DATA);

  submit(): void {
    this.transactionsService
      .deleteTransactionById(this.data.accountId, this.data.transaction.id)
      .subscribe(() => {
        this.bottomSheetRef.dismiss();
      });
  }

  cancel(): void {
    this.bottomSheetRef.dismiss();
  }
}
