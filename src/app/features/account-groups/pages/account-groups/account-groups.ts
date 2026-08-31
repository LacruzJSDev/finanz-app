import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { AccountGroupsService } from '../../../../core/account-groups/account-groups.service';
import { CreateAccountGroupForm } from '../../components/forms/create-account-group-form/create-account-group-form';
import { PageContextService } from '../../../../core/ui/page-context.service';
import { AccountGroupsList } from '../../components/tables/account-groups-list/account-groups-list';
import { GroupContextService } from '../../../../core/ui/group-context.service';
import { PageContent } from '../../../../shared/ui/page-content/page-content';
import { PageLoader } from '../../../../shared/ui/page-loader/page-loader';
import { EmptyState } from '../../../../shared/ui/empty-state/empty-state';

/** Los archivados se listan aparte para no confundirlos con los de uso diario. */
type GroupFilter = 'active' | 'archived';

@Component({
  selector: 'app-account-groups',
  imports: [AccountGroupsList, MatButtonToggleModule, PageContent, PageLoader, EmptyState],
  templateUrl: './account-groups.html',
  host: { class: 'page-container' },
})
export class AccountGroups {
  private readonly bottomSheet = inject(MatBottomSheet);
  protected readonly accountGroupsService = inject(AccountGroupsService);

  protected readonly loading = this.accountGroupsService.loading;
  private readonly router = inject(Router);
  protected readonly pageContextService = inject(PageContextService);
  protected readonly groupContextService = inject(GroupContextService);

  protected groups = this.accountGroupsService.groups;
  protected activeGroupId = this.groupContextService.activeGroupId;

  protected readonly filter = signal<GroupFilter>('active');

  protected readonly visibleGroups = computed(() => {
    const wantActive = this.filter() === 'active';
    return this.groups().filter((group) => group.is_active === wantActive);
  });

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

  openCreateAccountGroupForm(): void {
    this.bottomSheet.open<CreateAccountGroupForm>(CreateAccountGroupForm);
  }
}
