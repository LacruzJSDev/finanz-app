import { NgComponentOutlet } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EnvironmentInjector,
  Injector,
  OnDestroy,
  ViewChild,
  inject,
} from '@angular/core';
import { FocusTrap, FocusTrapFactory } from '@angular/cdk/a11y';
import { APP_SHEET_CONFIG, APP_SHEET_DATA } from './app-sheet.tokens';
import { AppSheetRef } from './app-sheet-ref';

@Component({
  selector: 'app-sheet',
  imports: [NgComponentOutlet],
  templateUrl: './app-sheet.html',
  styleUrl: './app-sheet.scss',
})
export class AppSheet implements AfterViewInit, OnDestroy {
  protected readonly config = inject(APP_SHEET_CONFIG);
  private readonly environmentInjector = inject(EnvironmentInjector);
  private readonly focusTrapFactory = inject(FocusTrapFactory);
  @ViewChild('surface', { static: true }) private readonly surface!: ElementRef<HTMLElement>;
  @ViewChild('body', { static: true }) private readonly body!: ElementRef<HTMLElement>;
  protected readonly childInjector: Injector;
  private focusTrap?: FocusTrap;
  private dragging = false;
  private startY = 0;
  private startTime = 0;
  private touchStartY = 0;
  private touchStartTime = 0;

  constructor() {
    this.childInjector = Injector.create({
      parent: this.environmentInjector,
      providers: [
        { provide: APP_SHEET_DATA, useValue: this.config.data },
        { provide: AppSheetRef, useValue: this.config.ref },
      ],
    });
  }

  ngAfterViewInit(): void {
    this.focusTrap = this.focusTrapFactory.create(this.surface.nativeElement);
    void this.focusTrap.focusInitialElementWhenReady();
    this.surface.nativeElement.addEventListener('touchstart', this.startTouch, { passive: true });
    this.surface.nativeElement.addEventListener('touchmove', this.moveTouch, { passive: false });
    this.surface.nativeElement.addEventListener('touchend', this.endTouch, { passive: true });
    this.surface.nativeElement.addEventListener('touchcancel', this.cancelTouch, { passive: true });
  }

  ngOnDestroy(): void {
    this.focusTrap?.destroy();
    this.surface.nativeElement.removeEventListener('touchstart', this.startTouch);
    this.surface.nativeElement.removeEventListener('touchmove', this.moveTouch);
    this.surface.nativeElement.removeEventListener('touchend', this.endTouch);
    this.surface.nativeElement.removeEventListener('touchcancel', this.cancelTouch);
  }

  protected startDrag(event: PointerEvent): void {
    if (event.pointerType === 'touch') return;
    if (event.button !== 0 || this.config.ref.disableClose || this.isInteractive(event.target))
      return;
    if (this.body.nativeElement.scrollTop > 0) return;
    this.startY = event.clientY;
    this.startTime = performance.now();
  }

  protected moveDrag(event: PointerEvent): void {
    if (event.pointerType === 'touch') return;
    if (!this.startTime) return;
    const distance = Math.max(0, event.clientY - this.startY);
    if (!this.dragging && distance < 8) return;
    this.dragging = true;
    this.surface.nativeElement.setPointerCapture(event.pointerId);
    this.surface.nativeElement.classList.add('app-sheet--dragging');
    this.surface.nativeElement.style.transform = `translateY(${distance}px)`;
  }

  protected endDrag(event: PointerEvent): void {
    if (event.pointerType === 'touch') return;
    if (!this.startTime) return;
    const distance = Math.max(0, event.clientY - this.startY);
    const velocity = distance / Math.max(1, performance.now() - this.startTime);
    this.startTime = 0;
    this.dragging = false;
    this.surface.nativeElement.classList.remove('app-sheet--dragging');
    if (distance >= 96 || velocity >= 0.55) {
      this.config.ref.requestDismiss();
      return;
    }
    this.surface.nativeElement.style.removeProperty('transform');
  }

  protected cancelDrag(): void {
    this.startTime = 0;
    this.dragging = false;
    this.surface.nativeElement.classList.remove('app-sheet--dragging');
    this.surface.nativeElement.style.removeProperty('transform');
  }

  private readonly startTouch = (event: TouchEvent): void => {
    if (
      this.config.ref.disableClose ||
      this.isInteractive(event.target) ||
      this.body.nativeElement.scrollTop > 0
    )
      return;
    const touch = event.touches.item(0);
    if (!touch) return;
    this.touchStartY = touch.clientY;
    this.touchStartTime = performance.now();
  };

  private readonly moveTouch = (event: TouchEvent): void => {
    if (!this.touchStartTime) return;
    const touch = event.touches.item(0);
    if (!touch) return;
    const distance = Math.max(0, touch.clientY - this.touchStartY);
    if (distance < 4) return;
    event.preventDefault();
    this.surface.nativeElement.classList.add('app-sheet--dragging');
    this.surface.nativeElement.style.transform = `translateY(${distance}px)`;
  };

  private readonly endTouch = (event: TouchEvent): void => {
    if (!this.touchStartTime) return;
    const touch = event.changedTouches.item(0);
    const distance = touch ? Math.max(0, touch.clientY - this.touchStartY) : 0;
    const velocity = distance / Math.max(1, performance.now() - this.touchStartTime);
    this.touchStartTime = 0;
    this.surface.nativeElement.classList.remove('app-sheet--dragging');
    if (distance >= 96 || velocity >= 0.55) {
      this.config.ref.requestDismiss();
      return;
    }
    this.surface.nativeElement.style.removeProperty('transform');
  };

  private readonly cancelTouch = (): void => {
    this.touchStartTime = 0;
    this.surface.nativeElement.classList.remove('app-sheet--dragging');
    this.surface.nativeElement.style.removeProperty('transform');
  };

  private isInteractive(target: EventTarget | null): boolean {
    return (
      target instanceof Element &&
      !!target.closest('button, input, textarea, select, a, [role="button"]')
    );
  }
}
