import { OverlayRef } from '@angular/cdk/overlay';
import { Observable, ReplaySubject } from 'rxjs';

/** Referencia de una hoja de la aplicación; no depende de Angular Material. */
export class AppSheetRef<R = unknown> {
  private readonly dismissed = new ReplaySubject<unknown>(1);
  private readonly opener =
    document.activeElement instanceof HTMLElement ? document.activeElement : null;
  disableClose = false;
  private dismissing = false;

  constructor(private readonly overlayRef: OverlayRef) {}

  dismiss(result?: unknown): void {
    if (this.dismissing) return;
    this.dismissing = true;
    const surface = this.overlayRef.overlayElement.querySelector<HTMLElement>('.app-sheet');
    let timer: ReturnType<typeof setTimeout> | undefined;
    let finished = false;
    const onTransitionEnd = (event: TransitionEvent) => {
      if (event.target === surface && event.propertyName === 'transform') finish();
    };
    const finish = () => {
      if (finished) return;
      finished = true;
      if (timer) clearTimeout(timer);
      surface?.removeEventListener('transitionend', onTransitionEnd);
      this.overlayRef.dispose();
      this.opener?.focus({ preventScroll: true });
      this.dismissed.next(result);
      this.dismissed.complete();
    };
    if (
      !surface ||
      (typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches)
    ) {
      finish();
      return;
    }
    surface.style.removeProperty('transform');
    surface.classList.add('app-sheet--closing');
    surface.addEventListener('transitionend', onTransitionEnd);
    timer = setTimeout(finish, 180);
  }

  requestDismiss(): void {
    if (!this.disableClose) this.dismiss();
  }

  afterDismissed(): Observable<unknown> {
    return this.dismissed.asObservable();
  }
}
