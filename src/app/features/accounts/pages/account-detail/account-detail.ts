import { Component, effect, inject, input } from '@angular/core';
import { AccountsService } from '../../../../core/accounts/accounts.service';
import { TransactionsService } from '../../../../core/transactions/transactions.service';
import { CategoriesService } from '../../../../core/categories/categories.service';
import { PageContextService } from '../../../../core/ui/page-context.service';
import { GroupContextService } from '../../../../core/ui/group-context.service';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { formatMoney } from '../../../../shared/money/money';

@Component({
  selector: 'app-account-detail',
  imports: [RouterOutlet, MatButtonToggleModule],
  templateUrl: 'account-detail.html',
  host: { class: 'page-container' },
})
export class AccountDetail {
  protected readonly accountsService = inject(AccountsService);
  protected readonly transactionsService = inject(TransactionsService);
  protected readonly router = inject(Router);
  protected readonly route = inject(ActivatedRoute);

  protected readonly categoriesService = inject(CategoriesService);
  protected readonly pageContextService = inject(PageContextService);
  private readonly groupContextService = inject(GroupContextService);

  private childPath = () => this.route.snapshot.firstChild?.routeConfig?.path;

  protected readonly section = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map(() => this.childPath()),
    ),
    { initialValue: this.childPath() },
  );

  readonly id = input.required<string>();

  protected readonly account = this.accountsService.account;

  constructor() {
    // Una URL que apunta a una cuenta que no existe no es un estado que pintar:
    // es una vuelta a la lista, que sí es válida siempre.
    effect(() => {
      this.accountsService.getAccountById(this.id()).subscribe({
        error: () => this.router.navigateByUrl('/cuentas'),
      });
    });

    // Al cambiar de grupo de trabajo esta cuenta deja de pertenecer a él, y la
    // URL nombra una entidad que ya no existe en el grupo nuevo. No se puede
    // quedar: se vuelve a la lista, que sí es válida en cualquier grupo.
    // Se comprueba el id para no actuar sobre la cuenta anterior, que sigue en
    // la signal hasta que llega la nueva.
    effect(() => {
      const account = this.account();
      const activeGroupId = this.groupContextService.activeGroupId();
      if (!account || !activeGroupId || account.id !== this.id()) return;
      if (account.group_id !== activeGroupId) {
        this.router.navigateByUrl('/cuentas');
      }
    });
    // El saldo va de subtítulo en la barra superior en vez de ocupar una
    // tarjeta propia: es la identidad de la cuenta, se mira siempre, y así no
    // gasta una franja de pantalla por encima de la lista.
    effect(() => {
      const account = this.account();
      if (account) {
        this.pageContextService.setTitle(
          account.name,
          formatMoney(account.balance, account.currency),
        );
      }
    });
  }
}
