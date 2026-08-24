import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { ErrorDetail, ErrorResponse } from '../../api';

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
  return next(req).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse) {
        const body = error.error as ErrorResponse | null;
        if (body?.error) {
          return throwError(
            () =>
              new ApiError(
                body.error.code,
                body?.error.message,
                error.status,
                body?.error.details ?? undefined,
              ),
          );
        }
      }
      return throwError(() => error);
    }),
  );
};
