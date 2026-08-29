import { Component, computed, effect, inject, signal } from '@angular/core';
import { GroupContextService } from '../../../../core/ui/group-context.service';
import { canManageGroupData } from '../../../../core/account-groups/permissions';
import { AccountsService } from '../../../../core/accounts/accounts.service';
import { Router } from '@angular/router';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import {
  CreateAccountForm,
  CreateAccountFormData,
} from '../../components/forms/create-account-form/create-account-form';
import { AccountRead } from '../../../../core/models';
import {
  UpdateAccountForm,
  UpdateAccountFormData,
} from '../../components/forms/update-account-form/update-account-form';
import { PageContextService } from '../../../../core/ui/page-context.service';
import { AccountCard } from '../../components/account-card/account-card';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { PageContent } from '../../../../shared/ui/page-content/page-content';
import { PageLoader } from '../../../../shared/ui/page-loader/page-loader';
import { EmptyState } from '../../../../shared/ui/empty-state/empty-state';

type GroupFilter = 'active' | 'archived';

@Component({
  selector: 'app-accounts',
  imports: [AccountCard, MatButtonToggleModule, PageContent, PageLoader, EmptyState],
  templateUrl: 'accounts.html',
  host: { class: 'page-container' },
})
export class Accounts {
  private readonly bottomSheet = inject(MatBottomSheet);
  protected readonly groupContextService = inject(GroupContextService);
  protected readonly accountsService = inject(AccountsService);

  protected readonly loading = this.accountsService.loading;
  protected readonly router = inject(Router);
  protected readonly pageContextService = inject(PageContextService);

  protected activeGroupId = this.groupContextService.activeGroupId;
  protected accounts = this.accountsService.accounts;

  protected readonly filter = signal<GroupFilter>('active');

  // Crear, editar y archivar cuentas es gobierno del grupo. Quien solo participa
  // no ve esos botones: pulsarlos solo le daría un 403.
  protected readonly canManage = computed(() =>
    canManageGroupData(this.groupContextService.activeRole()),
  );

  protected readonly visibleAccounts = computed(() => {
    const wantActive = this.filter() === 'active';
    return this.accounts().filter((account) => account.is_active === wantActive);
  });

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
    effect(() => {
      this.pageContextService.setAction(
        this.canManage() ? { onClick: () => this.openCreateAccountForm(), icon: 'add' } : null,
      );
    });
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
