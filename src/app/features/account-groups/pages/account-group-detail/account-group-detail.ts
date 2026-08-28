import { Component, computed, effect, inject, input } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { PageContextService } from '../../../../core/ui/page-context.service';
import { AccountGroupsService } from '../../../../core/account-groups/account-groups.service';
import {
  UpdateAccountGroupForm,
  UpdateAccountGroupFormData,
} from '../../components/forms/update-account-group-form/update-account-group-form';
import { Router } from '@angular/router';
import { PageContent } from '../../../../shared/ui/page-content/page-content';
import { PageLoader } from '../../../../shared/ui/page-loader/page-loader';

@Component({
  selector: 'app-account-group-detail',
  imports: [PageContent, PageLoader],
  templateUrl: './account-group-detail.html',
  host: { class: 'page-container' },
})
export class AccountGroupDetail {
  private readonly bottomSheet = inject(MatBottomSheet);
  protected readonly accountGroupsService = inject(AccountGroupsService);
  protected readonly pageContextService = inject(PageContextService);
  private readonly router = inject(Router);

  protected readonly loading = this.accountGroupsService.loading;

  readonly id = input.required<string>();
  protected readonly group = computed(() =>
    this.accountGroupsService.groups().find((g) => g.id === this.id()),
  );

  constructor() {
    // `group` busca en una lista que puede no haber llegado todavía, así que no
    // se puede confundir "no está" con "aún no ha cargado". Solo cuando la
    // carga ha terminado y sigue sin aparecer, la URL apunta a algo que no
    // existe, y eso se resuelve volviendo a la lista.
    effect(() => {
      if (!this.loading() && !this.group()) {
        this.router.navigateByUrl('/grupos');
      }
    });

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
