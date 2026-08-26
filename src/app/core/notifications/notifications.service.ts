import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private readonly snackBar = inject(MatSnackBar);

  error(message: string): void {
    this.snackBar.open(message, 'Cerrar', { panelClass: 'snack-bar--error' });
  }

  info(message: string): void {
    this.snackBar.open(message, 'Cerrar');
  }
}
