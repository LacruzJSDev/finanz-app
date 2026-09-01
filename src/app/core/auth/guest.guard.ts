import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

/**
 * El reverso de [authGuard](./auth.guard.ts): cierra la portada a quien ya ha
 * entrado. A quien tiene sesión no hay que contarle qué es esto, y va al mismo
 * sitio al que le lleva iniciar sesión.
 *
 * Puede decidirlo en el momento de navegar porque la sesión se resuelve antes
 * de que arranque el router, en el `provideAppInitializer` de app.config.
 */
export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.isAuthenticated() ? router.parseUrl('/grupos') : true;
};
