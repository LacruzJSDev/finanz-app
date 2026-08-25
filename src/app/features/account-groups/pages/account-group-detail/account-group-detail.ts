import { Component, computed, inject, input } from '@angular/core';
import { PageContextService } from '../../../../core/ui/page-context.service';
import { AccountGroupsService } from '../../../../core/account-groups/account-groups.service';

@Component({
  selector: 'app-account-group-detail',
  imports: [],
  templateUrl: './account-group-detail.html',
  host: { class: 'page-container' },
})
export class AccountGroupDetail {
  protected readonly accountGroupsService = inject(AccountGroupsService);
  protected readonly pageContextService = inject(PageContextService);

  readonly id = input.required<string>();
  protected readonly group = computed(() =>
    this.accountGroupsService.groups().find((g) => g.id === this.id()),
  );

  constructor() {
    this.pageContextService.setTitle('Grupo');
    this.pageContextService.setAction({
      onClick: () => this.updateAccountGroup(),
      icon: 'add',
    });
  }
  updateAccountGroup() {}
}
