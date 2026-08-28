import { Component, effect, inject, input } from '@angular/core';
import { AccountsService } from '../../../../core/accounts/accounts.service';
import { TransactionsService } from '../../../../core/transactions/transactions.service';
import { CategoriesService } from '../../../../core/categories/categories.service';
import { PageContextService } from '../../../../core/ui/page-context.service';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-account-detail',
  imports: [MatIconModule, MatProgressSpinnerModule, RouterOutlet, MatButtonToggleModule],
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
    effect(() => {
      this.accountsService.getAccountById(this.id()).subscribe();
    });
    effect(() => {
      const account = this.account();
      if (account) {
        this.pageContextService.setTitle(account.name);
      }
    });
  }
}
