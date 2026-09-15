import { Injectable, inject } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs';
import { NOTIFICATION_TOAST } from '../notifications/notifications.service';

@Injectable({ providedIn: 'root' })
export class AppUpdateService {
  private readonly updates = inject(SwUpdate);
  private readonly toast = inject(NOTIFICATION_TOAST);

  listen(): void {
    if (!this.updates.isEnabled) return;

    this.updates.versionUpdates
      .pipe(filter((event): event is VersionReadyEvent => event.type === 'VERSION_READY'))
      .subscribe(() => {
        this.toast
          .open('Hay una versión nueva de FinanzApp.', { action: 'Actualizar', duration: 0 })
          .onAction()
          .subscribe(() => document.location.reload());
      });
  }
}
