import { Component, computed, effect, inject, input } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { PageContextService } from '../../../../core/ui/page-context.service';
import { AccountGroupsService } from '../../../../core/account-groups/account-groups.service';
import { GroupContextService } from '../../../../core/ui/group-context.service';
import {
  UpdateAccountGroupForm,
  UpdateAccountGroupFormData,
} from '../../components/forms/update-account-group-form/update-account-group-form';

@Component({
  selector: 'app-account-group-detail',
  imports: [RouterOutlet, MatButtonToggleModule],
  templateUrl: './account-group-detail.html',
  host: { class: 'page-container' },
})
export class AccountGroupDetail {
  private readonly bottomSheet = inject(MatBottomSheet);
  protected readonly accountGroupsService = inject(AccountGroupsService);
  protected readonly pageContextService = inject(PageContextService);
  private readonly groupContextService = inject(GroupContextService);
  protected readonly router = inject(Router);
  protected readonly route = inject(ActivatedRoute);

  readonly id = input.required<string>();

  protected readonly loading = this.accountGroupsService.loading;

  protected readonly group = computed(() =>
    this.accountGroupsService.groups().find((g) => g.id === this.id()),
  );

  private childPath = () => this.route.snapshot.firstChild?.routeConfig?.path;

  protected readonly section = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map(() => this.childPath()),
    ),
    { initialValue: this.childPath() },
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

    // El subtítulo dice en qué estado está este grupo, no cuál es el de trabajo:
    // es la información que importa mientras se gestiona, y estás mirando un
    // grupo que puede no ser el activo.
    effect(() => {
      const group = this.group();
      if (!group) return;
      const state = !group.is_active
        ? 'Archivado'
        : this.groupContextService.activeGroupId() === group.id
          ? 'En uso'
          : 'Activo';
      this.pageContextService.setTitle(group.name, { detail: state, showGroup: false });
    });

    effect(() => {
      this.pageContextService.setAction({ onClick: () => this.updateAccountGroup(), icon: 'edit' });
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
