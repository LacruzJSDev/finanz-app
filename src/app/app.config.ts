import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

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
  ],
};
