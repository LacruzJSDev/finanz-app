import { Component, effect, inject } from '@angular/core';
import { GroupContextService } from '../../../../core/ui/group-context.service';
import { AccountsService } from '../../../../core/accounts/accounts.service';
import { Router } from '@angular/router';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import {
  CreateAccountForm,
  CreateAccountFormData,
} from '../../components/forms/create-account-form/create-account-form';
import { AccountRead } from '../../../../api';
import {
  UpdateAccountForm,
  UpdateAccountFormData,
} from '../../components/forms/update-account-form/update-account-form';
import { PageContextService } from '../../../../core/ui/page-context.service';
import { AccountCard } from '../../components/account-card/account-card';

@Component({
  selector: 'app-accounts',
  imports: [AccountCard],
  templateUrl: 'accounts.html',
  host: { class: 'page-container' },
})
export class Accounts {
  private readonly bottomSheet = inject(MatBottomSheet);
  protected readonly groupContextService = inject(GroupContextService);
  protected readonly accountsService = inject(AccountsService);
  protected readonly router = inject(Router);
  protected readonly pageContextService = inject(PageContextService);

  protected activeGroupId = this.groupContextService.activeGroupId;
  protected accounts = this.accountsService.accounts;

  constructor() {
    effect(() => {
      const groupId = this.activeGroupId();
      if (!groupId) {
        this.router.navigateByUrl('grupos');
        return;
      }
      this.accountsService.getAccounts(groupId).subscribe();
    });
    this.pageContextService.setTitle('Cuentas');
    this.pageContextService.setAction({ onClick: () => this.openCreateAccountForm(), icon: 'add' });
  }

  openCreateAccountForm(): void {
    const groupId = this.activeGroupId();
    if (!groupId) return; // no debería poder llamarse sin grupo activo, pero el tipo obliga a comprobarlo

    this.bottomSheet.open<CreateAccountForm, CreateAccountFormData>(CreateAccountForm, {
      data: { groupId },
    });
  }

  openUpdateAccountForm(account: AccountRead): void {
    this.bottomSheet.open<UpdateAccountForm, UpdateAccountFormData>(UpdateAccountForm, {
      data: { account },
    });
  }

  showAccountDetail(accountId: string) {
    this.router.navigateByUrl(`/cuentas/${accountId}`);
  }
}
