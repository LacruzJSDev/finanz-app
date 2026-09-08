import { Injectable, Injector, Type, inject } from '@angular/core';
import { ComponentPortal } from '@angular/cdk/portal';
import { Overlay } from '@angular/cdk/overlay';
import { AppSheet } from './app-sheet';
import { AppSheetRef } from './app-sheet-ref';
import { APP_SHEET_CONFIG } from './app-sheet.tokens';

export interface AppSheetOpenConfig<D = unknown> {
  data?: D;
  variant?: 'selector' | 'confirm' | 'form' | 'full-height-form';
}

@Injectable({ providedIn: 'root' })
export class AppSheetService {
  private readonly overlay = inject(Overlay);
  private readonly injector = inject(Injector);

  open<T, D = unknown, R = unknown>(
    component: Type<T>,
    config: AppSheetOpenConfig<D> = {},
  ): AppSheetRef<R> {
    const overlayRef = this.overlay.create({
      hasBackdrop: true,
      backdropClass: 'app-sheet-backdrop',
      panelClass: 'app-sheet-panel',
      width: '100%',
      scrollStrategy: this.overlay.scrollStrategies.block(),
      positionStrategy: this.overlay.position().global().centerHorizontally().bottom('0'),
    });
    const ref = new AppSheetRef<R>(overlayRef);
    const injector = Injector.create({
      parent: this.injector,
      providers: [{ provide: APP_SHEET_CONFIG, useValue: { component, data: config.data, ref } }],
    });
    overlayRef.backdropClick().subscribe(() => ref.requestDismiss());
    overlayRef.keydownEvents().subscribe((event) => {
      if (event.key === 'Escape') ref.requestDismiss();
    });
    overlayRef.attach(new ComponentPortal(AppSheet, null, injector));
    return ref;
  }
}
