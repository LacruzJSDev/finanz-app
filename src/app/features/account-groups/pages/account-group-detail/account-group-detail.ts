import { Component, computed, inject, input } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { PageContextService } from '../../../../core/ui/page-context.service';
import { AccountGroupsService } from '../../../../core/account-groups/account-groups.service';
import {
  UpdateAccountGroupForm,
  UpdateAccountGroupFormData,
} from '../../components/forms/update-account-group-form/update-account-group-form';

@Component({
  selector: 'app-account-group-detail',
  imports: [],
  templateUrl: './account-group-detail.html',
  host: { class: 'page-container' },
})
export class AccountGroupDetail {
  private readonly bottomSheet = inject(MatBottomSheet);
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
      icon: 'edit',
    });
  }

  updateAccountGroup(): void {
    const accountGroup = this.group();
    if (!accountGroup) return;

    this.bottomSheet.open<UpdateAccountGroupForm, UpdateAccountGroupFormData>(
      UpdateAccountGroupForm,
      { data: { accountGroup } },
    );
  }
}
