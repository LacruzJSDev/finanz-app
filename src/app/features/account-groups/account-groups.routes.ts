import { Routes } from '@angular/router';
import { authGuard } from '../../core/auth/auth.guard';

export const GROUP_ACCOUNTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/account-groups/account-groups').then((m) => m.AccountGroups),
    canActivate: [authGuard],
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/account-group-detail/account-group-detail').then((m) => m.AccountGroupDetail),
    children: [
      {
        path: '',
        redirectTo: 'miembros',
        pathMatch: 'full',
      },
      {
        path: 'miembros',
        loadComponent: () => import('../group-members').then((m) => m.GroupMembers),
        canActivate: [authGuard],
      },
      {
        path: 'invitaciones',
        loadComponent: () => import('../invitations').then((m) => m.GroupInvitations),
        canActivate: [authGuard],
      },
      {
        path: 'categorias',
        loadComponent: () => import('../categories').then((m) => m.Categories),
        canActivate: [authGuard],
      },
    ],
  },
];
