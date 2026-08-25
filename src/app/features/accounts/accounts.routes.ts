import { Routes } from '@angular/router';
import { authGuard } from '../../core/auth/auth.guard';

export const ACCOUNTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/accounts/accounts').then((m) => m.Accounts),
    canActivate: [authGuard],
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/account-detail/account-detail').then((m) => m.AccountDetail),
    canActivate: [authGuard],
  },
];
