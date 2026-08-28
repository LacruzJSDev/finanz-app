import { Component, computed, effect, inject, input } from '@angular/core';
import { TransactionsService } from '../../../../core/transactions/transactions.service';
import { CategoriesService } from '../../../../core/categories/categories.service';
import { PageContextService } from '../../../../core/ui/page-context.service';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { AccountRead, TransactionRead } from '../../../../core/models';
import {
  CreateTransactionForm,
  CreateTransactionFormData,
} from '../../components/forms/create-transaction-form/create-transaction-form';
import {
  UpdateTransactionForm,
  UpdateTransactionFormData,
} from '../../components/forms/update-transaction-form/update-transaction-form';
import {
  DeleteTransactionForm,
  DeleteTransactionFormData,
} from '../../components/forms/delete-transaction-form/delete-transaction-form';
import { TransactionsList } from '../../components/tables/transactions-list/transactions-list';
import { InfiniteScroll } from '../../../../shared/ui/infinite-scroll/infinite-scroll';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AccountsService } from '../../../../core/accounts/accounts.service';

@Component({
  selector: 'app-transactions',
  imports: [TransactionsList, InfiniteScroll, MatIconModule, MatProgressSpinnerModule],
  templateUrl: 'transactions.html',
  styleUrl: 'transactions.scss',
  host: { class: 'page-section' },
})
export class Transactions {
  private readonly bottomSheet = inject(MatBottomSheet);
  protected readonly accountsService = inject(AccountsService);
  protected readonly transactionsService = inject(TransactionsService);

  protected readonly loading = this.transactionsService.loading;
  protected readonly loadingMore = this.transactionsService.loadingMore;

  protected readonly categoriesService = inject(CategoriesService);
  protected readonly pageContextService = inject(PageContextService);

  protected readonly categories = this.categoriesService.categories;
  protected readonly selectableCategories = computed(() =>
    this.categories().filter((category) => category.is_active),
  );

  protected readonly limit = 20;

  readonly id = input.required<string>();

  protected readonly account = this.accountsService.account;
  protected readonly accounts = this.accountsService.accounts;
  protected readonly otherAccounts = computed(() =>
    this.accountsService.accounts().filter((a) => a.id !== this.id()),
  );

  // El armazón carga la cuenta; de ella sale el grupo del que cuelgan las
  // categorías y las cuentas hermanas. Pasa por un computed para no recargarlas
  // cada vez que se refresca el saldo: solo cuando cambia el grupo de verdad.
  private readonly groupId = computed(() => this.account()?.group_id ?? null);

  protected readonly transactions = this.transactionsService.transactions;
  protected readonly total = this.transactionsService.total;

  // Lo que ya hay en pantalla es el offset de lo siguiente: no hace falta
  // llevar la cuenta aparte, y así no se puede desincronizar.
  protected readonly hasMore = computed(() => this.transactions().length < this.total());
  protected readonly canLoadMore = computed(
    () => this.hasMore() && !this.loading() && !this.loadingMore(),
  );

  constructor() {
    // Cambiar de cuenta empieza la lista de cero. Lo demás lo pide el scroll.
    effect(() => {
      this.transactionsService.getTransactions(this.id(), this.limit, 0).subscribe();
    });
    effect(() => {
      const groupId = this.groupId();
      if (!groupId) return;
      this.categoriesService.getCategories(groupId).subscribe();
      // Las cuentas hermanas son el destino posible de una transferencia. Hacen
      // falta aunque se entre directo a esta URL, sin pasar por la lista.
      this.accountsService.getAccounts(groupId).subscribe();
    });
    effect(() => {
      this.pageContextService.setAction({
        onClick: () => this.openCreateTransactionForm(),
        icon: 'add',
      });
    });
  }

  loadMore(): void {
    if (!this.canLoadMore()) return;
    this.transactionsService
      .getTransactions(this.id(), this.limit, this.transactions().length)
      .subscribe();
  }

  openCreateTransactionForm(): void {
    const account = this.account();
    if (!account) return;

    const ref = this.bottomSheet.open<CreateTransactionForm, CreateTransactionFormData>(
      CreateTransactionForm,
      {
        data: {
          accountId: account.id,
          otherAccounts: this.otherAccounts(),
          categories: this.selectableCategories(),
        },
      },
    );
    this.refreshAccountAfter(ref);
  }

  openUpdateTransactionForm(transaction: TransactionRead): void {
    const account = this.account();
    if (!account) return;

    const ref = this.bottomSheet.open<UpdateTransactionForm, UpdateTransactionFormData>(
      UpdateTransactionForm,
      {
        data: {
          transaction,
          accountId: account.id,
          otherAccounts: this.otherAccounts(),
          categories: this.selectableCategories(),
        },
      },
    );
    this.refreshAccountAfter(ref);
  }

  deleteTransaction(transaction: TransactionRead): void {
    const ref = this.bottomSheet.open<DeleteTransactionForm, DeleteTransactionFormData>(
      DeleteTransactionForm,
      { data: { transaction, accountId: this.id() } },
    );
    this.refreshAccountAfter(ref);
  }

  // Solo el saldo, que lo pinta el armazón y esta pantalla no puede calcular.
  // La lista no se vuelve a pedir: el servicio ya la actualiza al crear, editar
  // y borrar. Recargarla encendía `loading`, y eso sustituye la lista entera
  // por el spinner de pantalla completa — el parpadeo entre guardar y volver.
  private refreshAccountAfter(ref: MatBottomSheetRef<unknown>): void {
    ref.afterDismissed().subscribe(() => {
      this.accountsService.getAccountById(this.id()).subscribe();
    });
  }
}
