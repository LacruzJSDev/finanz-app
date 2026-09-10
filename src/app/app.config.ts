import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  inject,
  isDevMode,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter, withComponentInputBinding, withRouterConfig } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';

import { routes } from './app.routes';
import { provideApi } from './api/provide-api';
import { environment } from '../environments/environment';
import { firstValueFrom } from 'rxjs';
import { AuthService } from './core/auth/auth.service';
import { authRefreshInterceptor } from './core/auth/auth-refresh.interceptors';
import { apiErrorInterceptor } from './core/http/api-error.interceptor';
import { AppUpdateService } from './core/pwa/app-update.service';
import { NOTIFICATION_TOAST } from './core/notifications/notifications.service';
import { AppToastService } from './shared/ui/toast';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withRouterConfig({ paramsInheritanceStrategy: 'always' }),
    ),
    provideHttpClient(withInterceptors([apiErrorInterceptor, authRefreshInterceptor])),
    provideApi({ basePath: environment.apiUrl, withCredentials: true }),
    provideAppInitializer(() => firstValueFrom(inject(AuthService).bootstrap())),
    provideAppInitializer(() => inject(AppUpdateService).listen()),
    { provide: NOTIFICATION_TOAST, useExisting: AppToastService },
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};
