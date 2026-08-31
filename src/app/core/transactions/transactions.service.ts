import { Injectable, inject, signal } from '@angular/core';
import { finalize, tap } from 'rxjs';
import {
  CategorySummaryRead,
  TransactionsService as TransactionsApi,
  TransactionRead,
  UpdateTransactionRequest,
  CreateTransactionRequest,
} from '../../api';
import { LatestRequest } from '../http/latest-request';

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

  // Aquí el testigo no marca "la última petición" sino "la lista en curso": las
  // páginas siguientes se acumulan sobre la primera, así que comparten el suyo
  // en vez de invalidarla. Empezar de cero es lo que abre una lista nueva.
  private readonly listRequest = new LatestRequest();

  // El resumen por categoría es otra pregunta sobre los mismos movimientos: en
  // qué se va el dinero, no cuáles son. Va aparte porque se pide con otros
  // filtros, se recarga por su cuenta y a quien lo mira no le importa la lista.
  private readonly summarySignal = signal<CategorySummaryRead[]>([]);
  readonly summary = this.summarySignal.asReadonly();
  private readonly summaryLoadingSignal = signal(false);
  readonly summaryLoading = this.summaryLoadingSignal.asReadonly();
  private readonly summaryRequest = new LatestRequest();

  getTransactions(accountId: string, limit = 20, offset = 0) {
    const isFirstPage = offset === 0;
    const token = isFirstPage ? this.listRequest.next() : this.listRequest.current();
    const busy = isFirstPage ? this.loadingSignal : this.loadingMoreSignal;
    busy.set(true);
    return this.api
      .getTransactionsApiV1AccountsAccountIdTransactionsGet(accountId, limit, offset)
      .pipe(
        tap((res) => {
          // Una página de la lista anterior no se puede pegar a la de ahora:
          // saldría con duplicados o huecos, y el total descuadrado.
          if (!this.listRequest.isCurrent(token)) return;
          this.transactionsSignal.update((current) =>
            isFirstPage ? res.items : [...current, ...res.items],
          );
          this.totalSignal.set(res.total);
        }),
        finalize(() => {
          // `loading` lo apaga quien siga siendo la carga vigente, porque la
          // que la reemplazó ya lo encendió por su cuenta. `loadingMore` no lo
          // va a apagar nadie más: su petición queda abandonada, y dejarlo
          // encendido bloquearía el scroll para siempre.
          if (!isFirstPage) this.loadingMoreSignal.set(false);
          else if (this.listRequest.isCurrent(token)) this.loadingSignal.set(false);
        }),
      );
  }

  /** El grupo es obligatorio; la cuenta y las fechas acotan lo que se resume. */
  getCategorySummary(groupId: string, accountId?: string, dateFrom?: string, dateTo?: string) {
    const token = this.summaryRequest.next();
    this.summaryLoadingSignal.set(true);
    return this.api
      .getCategorySummaryApiV1TransactionsSummaryGet(
        groupId,
        accountId,
        undefined,
        undefined,
        undefined,
        dateFrom,
        dateTo,
      )
      .pipe(
        tap((res) => {
          if (!this.summaryRequest.isCurrent(token)) return;
          this.summarySignal.set(res.items);
        }),
        finalize(() => {
          if (this.summaryRequest.isCurrent(token)) this.summaryLoadingSignal.set(false);
        }),
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
