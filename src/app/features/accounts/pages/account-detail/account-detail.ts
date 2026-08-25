import { Component, effect, inject, input, signal } from '@angular/core';
import { AccountsService } from '../../../../core/accounts/accounts.service';
import { CentsToEurosPipe } from '../../../../shared/money/cents-to-euros.pipe';
import { TransactionsList } from '../../../transactions/components/tables/transactions-list/transactions-list';
import { TransactionsService } from '../../../../core/transactions/transactions.service';
import { Paginator } from '../../../../shared/ui/paginator/paginator';
import {
  CreateTransactionForm,
  CreateTransactionFormData,
} from '../../../transactions/components/forms/create-transaction-form/create-transaction-form';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { CategoriesService } from '../../../../core/categories/categories.service';
import {
  UpdateTransactionForm,
  UpdateTransactionFormData,
} from '../../../transactions/components/forms/update-transaction-form/update-transaction-form';
import { TransactionRead } from '../../../../api';

@Component({
  selector: 'app-account-detail',
  imports: [CentsToEurosPipe, TransactionsList, Paginator],
  templateUrl: 'account-detail.html',
})
export class AccountDetail {
  private readonly bottomSheet = inject(MatBottomSheet);
  protected readonly accountsService = inject(AccountsService);
  protected readonly transactionsService = inject(TransactionsService);
  protected readonly categoriesService = inject(CategoriesService);

  readonly id = input.required<string>();

  protected readonly account = this.accountsService.account;
  protected readonly accounts = this.accountsService.accounts;

  protected readonly transactions = this.transactionsService.transactions;
  protected readonly total = this.transactionsService.total;

  // Se sigue cargando aquí: TransactionsList lo necesita para pintar el nombre de
  // categoría de cada fila, y los forms de crear/editar transacción para su <select>.
  protected readonly categories = this.categoriesService.categories;

  protected readonly limit = 20;
  protected readonly offset = signal(0);

  constructor() {
    effect(() => {
      this.accountsService.getAccountById(this.id()).subscribe();
      this.transactionsService.getTransactions(this.id(), this.limit, this.offset()).subscribe();
    });
    effect(() => {
      const groupId = this.account()?.group_id;
      if (groupId) {
        this.categoriesService.getCategories(groupId)?.subscribe();
      }
    });
  }

  onPageChange(newOffset: number): void {
    this.offset.set(newOffset);
  }

  openCreateTransactionForm(): void {
    const account = this.account();
    if (!account) return;

    this.accountsService.getAccounts(account.group_id)?.subscribe(() => {
      const ref = this.bottomSheet.open<CreateTransactionForm, CreateTransactionFormData>(
        CreateTransactionForm,
        {
          data: {
            accountId: account.id,
            otherAccounts: this.accountsService.accounts().filter((a) => a.id !== account.id),
            categories: this.categories(),
          },
        },
      );

      ref.afterDismissed().subscribe(() => {
        this.accountsService.getAccountById(this.id()).subscribe();
      });
    });
  }

  openUpdateTransactionForm(transaction: TransactionRead): void {
    const account = this.account();
    if (!account) return;

    this.accountsService.getAccounts(account.group_id)?.subscribe(() => {
      const ref = this.bottomSheet.open<UpdateTransactionForm, UpdateTransactionFormData>(
        UpdateTransactionForm,
        {
          data: {
            transaction,
            accountId: account.id,
            otherAccounts: this.accountsService.accounts().filter((a) => a.id !== account.id),
            categories: this.categories(),
          },
        },
      );
      ref.afterDismissed().subscribe(() => {
        this.accountsService.getAccountById(this.id()).subscribe();
      });
    });
  }

  deleteTransaction(transaction: TransactionRead): void {
    this.transactionsService.deleteTransactionById(this.id(), transaction.id).subscribe(() => {
      this.accountsService.getAccountById(this.id()).subscribe();
    });
  }
}
