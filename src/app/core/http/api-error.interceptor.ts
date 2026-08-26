import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ErrorDetail, ErrorResponse } from '../../api';
import { NotificationsService } from '../notifications/notifications.service';

const AUTH_PATH = '/auth/';
const CONNECTION_MESSAGE = 'No se ha podido conectar con el servidor.';

export class ApiError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number,
    public readonly details?: ErrorDetail[],
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const apiErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const notifications = inject(NotificationsService);
  const isAuthRequest = req.url.includes(AUTH_PATH);

  return next(req).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse) {
        const body = error.error as ErrorResponse | null;

        if (body?.error) {
          const apiError = new ApiError(
            body.error.code,
            body.error.message,
            error.status,
            body.error.details ?? undefined,
          );
          // Con details es validación: el mensaje va al campo, no a una barra.
          // Auth lo pinta su propia pantalla y el 401 lo resuelve el refresco.
          if (!apiError.details?.length && !isAuthRequest && error.status !== 401) {
            notifications.error(apiError.message);
          }
          return throwError(() => apiError);
        }

        if (!isAuthRequest) {
          notifications.error(CONNECTION_MESSAGE);
        }
      }
      return throwError(() => error);
    }),
  );
};
