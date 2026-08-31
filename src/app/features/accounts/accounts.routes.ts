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
    children: [
      {
        path: '',
        redirectTo: 'movimientos',
        pathMatch: 'full',
      },
      {
        path: 'movimientos',
        loadComponent: () => import('../transactions/').then((m) => m.Transactions),
        canActivate: [authGuard],
      },
      {
        path: 'planificados',
        loadComponent: () => import('../payment-plans').then((m) => m.PaymentPlans),
        canActivate: [authGuard],
      },
    ],
  },
];
