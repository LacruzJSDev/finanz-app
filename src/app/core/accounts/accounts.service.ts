import { Injectable, inject, signal } from '@angular/core';
import { finalize, tap } from 'rxjs';
import {
  AccountRead,
  AccountsService as AccountsApi,
  CreateAccountRequest,
  UpdateAccountRequest,
} from '../../api';
import { LatestRequest } from '../http/latest-request';

@Injectable({ providedIn: 'root' })
export class AccountsService {
  private readonly api = inject(AccountsApi);

  private readonly accountsSignal = signal<AccountRead[]>([]);
  readonly accounts = this.accountsSignal.asReadonly();
  private readonly accountSignal = signal<AccountRead | null>(null);
  readonly account = this.accountSignal.asReadonly();
  private readonly loadingSignal = signal(false);
  readonly loading = this.loadingSignal.asReadonly();

  // Cambiar de grupo relanza la lista, y navegar entre cuentas relanza el
  // detalle. En los dos casos puede haber dos cargas en vuelo a la vez.
  private readonly accountsRequest = new LatestRequest();
  private readonly accountRequest = new LatestRequest();

  getAccounts(groupId: string) {
    const token = this.accountsRequest.next();
    this.loadingSignal.set(true);
    return this.api.getAccountsApiV1AccountsGet(groupId).pipe(
      tap((res) => {
        if (!this.accountsRequest.isCurrent(token)) return;
        this.accountsSignal.set(res.items);
      }),
      // Solo apaga el spinner quien sigue siendo la carga vigente: si lo
      // apagara una respuesta vieja, la pantalla se quedaría sin él mientras
      // la buena sigue en vuelo.
      finalize(() => {
        if (this.accountsRequest.isCurrent(token)) this.loadingSignal.set(false);
      }),
    );
  }

  createAccount(groupId: string, payload: CreateAccountRequest) {
    return this.api.createAccountApiV1AccountsPost(groupId, payload).pipe(
      tap((account) => {
        this.accountsSignal.update((accounts) => [...accounts, account]);
      }),
    );
  }

  updateAccount(accountId: string, payload: UpdateAccountRequest) {
    return this.api.updateAccountApiV1AccountsAccountIdPatch(accountId, payload).pipe(
      tap((account) => {
        this.accountsSignal.update((accounts) => {
          return accounts.map((a) => (a.id === account.id ? account : a));
        });
      }),
    );
  }

  getAccountById(accountId: string) {
    const token = this.accountRequest.next();
    return this.api.getAccountApiV1AccountsAccountIdGet(accountId).pipe(
      tap((account) => {
        if (!this.accountRequest.isCurrent(token)) return;
        this.accountsSignal.update((accounts) => {
          return accounts.map((a) => (a.id === account.id ? account : a));
        });
        this.accountSignal.set(account);
      }),
    );
  }
}
