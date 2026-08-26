import { Injectable, inject, signal } from '@angular/core';
import { finalize, tap } from 'rxjs';
import {
  TransactionsService as TransactionsApi,
  TransactionRead,
  UpdateTransactionRequest,
  CreateTransactionRequest,
} from '../../api';

@Injectable({ providedIn: 'root' })
export class TransactionsService {
  private readonly api = inject(TransactionsApi);

  private readonly transactionsSignal = signal<TransactionRead[]>([]);
  readonly transactions = this.transactionsSignal.asReadonly();
  private readonly transactionSignal = signal<TransactionRead | null>(null);
  readonly transaction = this.transactionSignal.asReadonly();
  private readonly totalSignal = signal(0);
  readonly total = this.totalSignal.asReadonly();
  private readonly loadingSignal = signal(false);
  readonly loading = this.loadingSignal.asReadonly();

  getTransactions(accountId: string, limit = 20, offset = 0) {
    this.loadingSignal.set(true);
    return this.api
      .getTransactionsApiV1AccountsAccountIdTransactionsGet(accountId, limit, offset)
      .pipe(
        tap((res) => {
          this.transactionsSignal.set(res.items);
          this.totalSignal.set(res.total);
        }),
        finalize(() => this.loadingSignal.set(false)),
      );
  }

  createTransaction(accountId: string, payload: CreateTransactionRequest) {
    return this.api
      .createTransactionApiV1AccountsAccountIdTransactionsPost(accountId, payload)
      .pipe(
        tap((transaction) => {
          this.transactionsSignal.update((transactions) => [...transactions, transaction]);
        }),
      );
  }

  updateTransaction(accountId: string, transactionId: string, payload: UpdateTransactionRequest) {
    return this.api
      .updateTransactionApiV1AccountsAccountIdTransactionsTransactionIdPatch(
        accountId,
        transactionId,
        payload,
      )
      .pipe(
        tap((transaction) => {
          this.transactionsSignal.update((transactions) => {
            return transactions.map((t) => (t.id === transaction.id ? transaction : t));
          });
        }),
      );
  }

  getTransactionById(accountId: string, transactionId: string) {
    return this.api
      .getTransactionApiV1AccountsAccountIdTransactionsTransactionIdGet(accountId, transactionId)
      .pipe(
        tap((transaction) => {
          this.transactionsSignal.update((transactions) => {
            return transactions.map((t) => (t.id === transaction.id ? transaction : t));
          });
          this.transactionSignal.set(transaction);
        }),
      );
  }

  deleteTransactionById(accountId: string, transactionId: string) {
    return this.api
      .deleteTransactionApiV1AccountsAccountIdTransactionsTransactionIdDelete(
        accountId,
        transactionId,
      )
      .pipe(
        tap((transaction) => {
          const deletedTransaction = { ...transaction, deleted_at: new Date().toISOString() };
          this.transactionsSignal.update((transactions) =>
            transactions.filter((t) => t.id !== transactionId),
          );
          this.transactionSignal.set(deletedTransaction);
        }),
      );
  }
}
