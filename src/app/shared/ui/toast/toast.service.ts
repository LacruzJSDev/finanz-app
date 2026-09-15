import { Injectable, Injector, inject } from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { AppToast, APP_TOAST_DATA, AppToastKind, AppToastRef } from './toast';

export interface AppToastConfig {
  action?: string;
  duration?: number;
  kind?: AppToastKind;
}

@Injectable({ providedIn: 'root' })
export class AppToastService {
  private readonly overlay = inject(Overlay);
  private readonly injector = inject(Injector);
  private current?: AppToastRef;

  open(message: string, config: AppToastConfig = {}): AppToastRef {
    this.current?.dismiss();
    const ref = new AppToastRef();
    this.current = ref;
    const overlayRef = this.overlay.create({
      hasBackdrop: false,
      disposeOnNavigation: true,
      positionStrategy: this.overlay
        .position()
        .global()
        .top('calc(var(--app-space-4) + env(safe-area-inset-top))')
        .centerHorizontally(),
      scrollStrategy: this.overlay.scrollStrategies.noop(),
    });
    ref.bindDismiss(() => overlayRef.dispose());
    overlayRef.detachments().subscribe(() => ref.dismiss());

    const childInjector = Injector.create({
      providers: [
        {
          provide: APP_TOAST_DATA,
          useValue: { message, action: config.action, kind: config.kind ?? 'info' },
        },
        { provide: AppToastRef, useValue: ref },
      ],
      parent: this.injector,
    });
    overlayRef.attach(new ComponentPortal(AppToast, null, childInjector));

    let timer: ReturnType<typeof setTimeout> | undefined;
    ref.afterDismissed().subscribe(() => {
      clearTimeout(timer);
      if (this.current === ref) this.current = undefined;
    });
    if ((config.duration ?? 5000) > 0) {
      timer = setTimeout(() => ref.dismiss(), config.duration ?? 5000);
    }
    return ref;
  }
}

export { AppToast, AppToastRef } from './toast';
