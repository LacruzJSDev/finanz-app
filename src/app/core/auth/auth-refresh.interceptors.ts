import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';

const AUTH_ENDPOINTS = ['/auth/login', '/auth/register', 'auth/refresh', 'auth/logout'];

export const authRefreshInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const isAuthEndpoint = AUTH_ENDPOINTS.some((path) => req.url.includes(path));

  return next(req).pipe(
    catchError((error: unknown) => {
      const status = error instanceof HttpErrorResponse ? error.status : undefined;
      if (status !== 401 || isAuthEndpoint) {
        return throwError(() => error);
      }
      return authService
        .refresh()
        .pipe(switchMap((user) => (user ? next(req) : throwError(() => error))));
    }),
  );
};
