import { OverlayRef } from '@angular/cdk/overlay';
import { Observable, ReplaySubject } from 'rxjs';

/** Referencia de una hoja de la aplicación; no depende de Angular Material. */
export class AppSheetRef<R = unknown> {
  private readonly dismissed = new ReplaySubject<unknown>(1);
  private readonly opener =
    document.activeElement instanceof HTMLElement ? document.activeElement : null;
  disableClose = false;

  constructor(private readonly overlayRef: OverlayRef) {}

  dismiss(result?: unknown): void {
    this.dismissed.next(result);
    this.dismissed.complete();
    this.overlayRef.dispose();
    this.opener?.focus({ preventScroll: true });
  }

  requestDismiss(): void {
    if (!this.disableClose) this.dismiss();
  }

  afterDismissed(): Observable<unknown> {
    return this.dismissed.asObservable();
  }
}
