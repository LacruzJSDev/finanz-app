import { Routes } from '@angular/router';
import { Shell } from './layout/shell/shell';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: '',
    component: Shell,
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./features/dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES),
      },
      {
        path: 'grupos',
        loadChildren: () =>
          import('./features/account-groups/account-groups.routes').then(
            (m) => m.GROUP_ACCOUNTS_ROUTES,
          ),
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
      // Suelta y no bajo /grupos: quien la usa todavía no pertenece al grupo,
      // así que no puede colgar de una URL que ya lo da por hecho. Con código
      // viene de un enlace compartido; sin él, se pega a mano.
      {
        path: 'invitaciones',
        loadComponent: () => import('./features/invitations').then((m) => m.AcceptInvitation),
        canActivate: [authGuard],
      },
      {
        path: 'invitaciones/:code',
        loadComponent: () => import('./features/invitations').then((m) => m.AcceptInvitation),
        canActivate: [authGuard],
      },
    ],
  },
];
