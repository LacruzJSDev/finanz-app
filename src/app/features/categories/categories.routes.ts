import { Routes } from '@angular/router';
import { authGuard } from '../../core/auth/auth.guard';

export const CATEGORIES_ROUTES: Routes = [
  {
    path: ':id',
    loadComponent: () => import('./pages/categories/categories').then((m) => m.Categories),
    canActivate: [authGuard],
  },
];
