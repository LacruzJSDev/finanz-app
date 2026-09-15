import { Component, inject, InjectionToken, input } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AppButton } from '../button';
import { AppIcon } from '../icon';

export type AppToastKind = 'info' | 'error';

export interface AppToastData {
  message: string;
  action?: string;
  kind: AppToastKind;
}

export const APP_TOAST_DATA = new InjectionToken<AppToastData>('APP_TOAST_DATA');

export class AppToastRef {
  private readonly actionSubject = new Subject<void>();
  private readonly closedSubject = new Subject<void>();
  private dismissOverlay: (() => void) | null = null;
  private closed = false;

  onAction(): Observable<void> {
    return this.actionSubject.asObservable();
  }

  bindDismiss(dismiss: () => void): void {
    this.dismissOverlay = dismiss;
  }

  triggerAction(): void {
    if (this.closed) return;
    this.actionSubject.next();
    this.dismiss();
  }

  dismiss(): void {
    if (this.closed) return;
    this.closed = true;
    this.closedSubject.next();
    this.closedSubject.complete();
    this.actionSubject.complete();
    this.dismissOverlay?.();
  }

  afterDismissed(): Observable<void> {
    return this.closedSubject.asObservable();
  }
}

@Component({
  selector: 'app-toast',
  imports: [AppButton, AppIcon],
  templateUrl: './toast.html',
  styleUrl: './toast.scss',
  host: {
    '[attr.role]': "data.kind === 'error' ? 'alert' : 'status'",
    '[attr.aria-live]': "data.kind === 'error' ? 'assertive' : 'polite'",
    '[class.app-toast--error]': "data.kind === 'error'",
  },
})
export class AppToast {
  readonly data = inject(APP_TOAST_DATA);
  private readonly ref = inject(AppToastRef);

  protected dismiss(): void {
    this.ref.dismiss();
  }

  protected action(): void {
    this.ref.triggerAction();
  }
}
