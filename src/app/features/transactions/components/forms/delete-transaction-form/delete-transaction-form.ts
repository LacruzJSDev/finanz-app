import { Component, inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { TransactionsService } from '../../../../../core/transactions/transactions.service';
import { AccountRead, TransactionRead } from '../../../../../api';

export interface DeleteTransactionFormData {
  accountId: string;
  transaction: TransactionRead;
  otherAccounts: AccountRead[];
}

@Component({
  selector: 'app-delete-transaction-form',
  imports: [],
  templateUrl: './delete-transaction-form.html',
})
export class DeleteTransactionForm {
  private readonly bottomSheetRef = inject(MatBottomSheetRef<DeleteTransactionFormData>);
  private readonly transactionsService = inject(TransactionsService);

  protected readonly data = inject<DeleteTransactionFormData>(MAT_BOTTOM_SHEET_DATA);

  submit(): void {
    this.transactionsService
      .deleteTransactionById(this.data.accountId, this.data.transaction.id)
      ?.subscribe(() => {
        this.bottomSheetRef.dismiss();
      });
  }

  cancel(): void {
    this.bottomSheetRef.dismiss();
  }
}
