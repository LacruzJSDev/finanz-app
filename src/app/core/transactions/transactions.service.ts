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
  private readonly loadingMoreSignal = signal(false);
  readonly loadingMore = this.loadingMoreSignal.asReadonly();

  getTransactions(accountId: string, limit = 20, offset = 0) {
    const isFirstPage = offset === 0;
    const busy = isFirstPage ? this.loadingSignal : this.loadingMoreSignal;
    busy.set(true);
    return this.api
      .getTransactionsApiV1AccountsAccountIdTransactionsGet(accountId, limit, offset)
      .pipe(
        tap((res) => {
          this.transactionsSignal.update((current) =>
            isFirstPage ? res.items : [...current, ...res.items],
          );
          this.totalSignal.set(res.total);
        }),
        finalize(() => busy.set(false)),
      );
  }

  createTransaction(accountId: string, payload: CreateTransactionRequest) {
    return this.api
      .createTransactionApiV1AccountsAccountIdTransactionsPost(accountId, payload)
      .pipe(
        tap((transaction) => {
          this.transactionsSignal.update((transactions) => [...transactions, transaction]);
          this.totalSignal.update((total) => total + 1);
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
          this.totalSignal.update((total) => Math.max(0, total - 1));
          this.transactionsSignal.update((transactions) =>
            transactions.filter((t) => t.id !== transactionId),
          );
          this.transactionSignal.set(deletedTransaction);
        }),
      );
  }
}
