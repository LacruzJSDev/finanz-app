import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AppUpdateService {
  private readonly updates = inject(SwUpdate);
  private readonly snackBar = inject(MatSnackBar);

  listen(): void {
    if (!this.updates.isEnabled) return;

    this.updates.versionUpdates
      .pipe(filter((event): event is VersionReadyEvent => event.type === 'VERSION_READY'))
      .subscribe(() => {
        this.snackBar
          .open('Hay una versión nueva de FinanzApp.', 'Actualizar', { duration: 0 })
          .onAction()
          .subscribe(() => document.location.reload());
      });
  }
}
