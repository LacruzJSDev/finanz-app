import { Component, computed, effect, inject, input } from '@angular/core';
import { AccountGroupsService } from '../../../../core/account-groups/account-groups.service';
import { AccountsService } from '../../../../core/accounts/accounts.service';
import { CentsToEurosPipe } from '../../../../shared/money/cents-to-euros.pipe';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import {
  CreateAccountForm,
  CreateAccountFormData,
} from '../../../accounts/components/forms/create-account-form/create-account-form';
import {
  UpdateAccountForm,
  UpdateAccountFormData,
} from '../../../accounts/components/forms/update-account-form/update-account-form';
import { AccountRead, UpdateAccountRequest } from '../../../../api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account-group-detail',
  imports: [CentsToEurosPipe],
  templateUrl: './account-group-detail.html',
})
export class AccountGroupDetail {
  private readonly bottomSheet = inject(MatBottomSheet);
  protected readonly accountGroupsService = inject(AccountGroupsService);
  protected readonly accountsService = inject(AccountsService);
  private readonly router = inject(Router);

  readonly id = input.required<string>();

  protected readonly group = computed(() =>
    this.accountGroupsService.groups().find((g) => g.id === this.id()),
  );

  constructor() {
    this.accountGroupsService.ensureLoaded().subscribe();

    effect(() => {
      this.accountsService.getAccounts(this.id())?.subscribe();
    });
  }

  openCreateAccountForm(): void {
    this.bottomSheet.open<CreateAccountForm, CreateAccountFormData>(CreateAccountForm, {
      data: { groupId: this.id() },
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

  showCategories(): void {
    this.router.navigateByUrl(`/categorias/${this.id()}`);
  }
}
