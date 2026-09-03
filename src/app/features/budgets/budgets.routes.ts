import { Routes } from '@angular/router';

export const BUDGETS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/budgets/budgets').then((m) => m.Budgets),
  },
];
