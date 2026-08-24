import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./features/dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES),
  },
  {
    path: 'grupos',
    loadChildren: () =>
      import('./features/account-groups/account-groups.routes').then((m) => m.GROUP_ACCOUNTS_ROUTES),
  },
  {
    path: 'cuentas',
    loadChildren: () =>
      import('./features/accounts/accounts.routes').then((m) => m.ACCOUNTS_ROUTES),
  },
  {
    path: 'categorias',
    loadChildren: () =>
      import('./features/categories/categories.routes').then((m) => m.CATEGORIES_ROUTES),
  },
];
