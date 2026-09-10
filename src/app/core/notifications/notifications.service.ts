import { Injectable, inject, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export interface ToastHandle {
  onAction(): Observable<void>;
}
export interface ToastPort {
  open(
    message: string,
    config?: { kind?: 'info' | 'error'; action?: string; duration?: number },
  ): ToastHandle;
}

export const NOTIFICATION_TOAST = new InjectionToken<ToastPort>('NOTIFICATION_TOAST');

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private readonly toast = inject(NOTIFICATION_TOAST);

  error(message: string): void {
    this.toast.open(message, { kind: 'error' });
  }

  info(message: string): void {
    this.toast.open(message);
  }
}
