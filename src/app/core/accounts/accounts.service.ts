import { Injectable, inject, signal } from '@angular/core';
import { tap } from 'rxjs';
import {
  AccountRead,
  AccountsService as AccountsApi,
  CreateAccountRequest,
  UpdateAccountRequest,
} from '../../api';

@Injectable({ providedIn: 'root' })
export class AccountsService {
  private readonly api = inject(AccountsApi);

  private readonly accountsSignal = signal<AccountRead[]>([]);
  readonly accounts = this.accountsSignal.asReadonly();
  private readonly accountSignal = signal<AccountRead | null>(null);
  readonly account = this.accountSignal.asReadonly();

  getAccounts(groupId: string) {
    return this.api.getAccountsApiV1AccountsGet(groupId).pipe(
      tap((res) => {
        this.accountsSignal.set(res.items);
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
    return this.api.getAccountApiV1AccountsAccountIdGet(accountId).pipe(
      tap((account) => {
        this.accountsSignal.update((accounts) => {
          return accounts.map((a) => (a.id === account.id ? account : a));
        });
        this.accountSignal.set(account);
      }),
    );
  }
}
