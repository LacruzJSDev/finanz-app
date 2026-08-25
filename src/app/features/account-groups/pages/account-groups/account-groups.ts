import { Component, inject } from '@angular/core';
import { AccountGroupsService } from '../../../../core/account-groups/account-groups.service';
import { Router } from '@angular/router';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { CreateAccountGroupForm } from '../../components/forms/create-account-group-form/create-account-group-form';
import { PageContextService } from '../../../../core/ui/page-context.service';
import { AccountGroupCard } from '../../components/account-group-card/account-group-card';
import { GroupContextService } from '../../../../core/ui/group-context.service';

@Component({
  selector: 'app-account-groups',
  imports: [AccountGroupCard],
  templateUrl: './account-groups.html',
  styleUrl: 'account-groups.scss',
  host: { class: 'page-container' },
})
export class AccountGroups {
  private readonly bottomSheet = inject(MatBottomSheet);
  protected readonly accountGroupsService = inject(AccountGroupsService);
  private readonly router = inject(Router);
  protected readonly pageContextService = inject(PageContextService);
  protected readonly groupContextService = inject(GroupContextService);

  protected groups = this.accountGroupsService.groups;
  protected activeGroupId = this.groupContextService.activeGroupId;

  constructor() {
    this.pageContextService.setTitle('Grupos');
    this.pageContextService.setAction({
      onClick: () => this.openCreateAccountGroupForm(),
      icon: 'add',
    });
  }

  showDetail(groupId: string) {
    this.router.navigateByUrl(`/grupos/${groupId}`);
  }

  activeGroup(groupId: string) {
    this.groupContextService.setActiveGroupId(groupId);
  }

  openCreateAccountGroupForm(): void {
    this.bottomSheet.open<CreateAccountGroupForm>(CreateAccountGroupForm);
  }
}
