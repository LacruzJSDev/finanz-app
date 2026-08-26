import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MAT_BUTTON_TOGGLE_DEFAULT_OPTIONS } from '@angular/material/button-toggle';

import { routes } from './app.routes';
import { provideApi } from './api/provide-api';
import { environment } from '../environments/environment';
import { firstValueFrom } from 'rxjs';
import { AuthService } from './core/auth/auth.service';
import { authRefreshInterceptor } from './core/auth/auth-refresh.interceptors';
import { apiErrorInterceptor } from './core/http/api-error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([apiErrorInterceptor, authRefreshInterceptor])),
    provideApi({ basePath: environment.apiUrl, withCredentials: true }),
    provideAppInitializer(() => firstValueFrom(inject(AuthService).bootstrap())),
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'fill', floatLabel: 'always', subscriptSizing: 'dynamic' },
    },
    {
      provide: MAT_BUTTON_TOGGLE_DEFAULT_OPTIONS,
      useValue: { hideSingleSelectionIndicator: true },
    },
  ],
};
