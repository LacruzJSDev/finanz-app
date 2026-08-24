import { Component, inject } from '@angular/core';
import { AccountGroupsService } from '../../../../core/account-groups/account-groups.service';
import { Router } from '@angular/router';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { CreateAccountGroupForm } from '../../components/forms/create-account-group-form/create-account-group-form';

@Component({
  selector: 'app-account-groups',
  imports: [],
  templateUrl: './account-groups.html',
})
export class AccountGroups {
  private readonly bottomSheet = inject(MatBottomSheet);
  protected readonly accountGroupsService = inject(AccountGroupsService);
  private readonly router = inject(Router);

  constructor() {
    this.accountGroupsService.getAccountGroups().subscribe();
  }

  showDetail(groupId: string) {
    this.router.navigateByUrl(`/grupos/${groupId}`);
  }
  openCreateAccountForm(): void {
    this.bottomSheet.open<CreateAccountGroupForm>(CreateAccountGroupForm);
  }
}
