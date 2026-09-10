import { booleanAttribute, Component, ElementRef, inject, input, OnDestroy } from '@angular/core';

export type AppButtonVariant = 'filled' | 'outlined' | 'text' | 'icon' | 'fab';

/** A semantic action control for native buttons and links. */
@Component({
  selector: 'button[appButton], a[appButton]',
  templateUrl: './button.html',
  styleUrl: './button.scss',
  host: {
    class: 'app-button',
    '[class.app-button--filled]': "variant() === 'filled'",
    '[class.app-button--outlined]': "variant() === 'outlined'",
    '[class.app-button--text]': "variant() === 'text'",
    '[class.app-button--icon]': "variant() === 'icon'",
    '[class.app-button--fab]': "variant() === 'fab'",
    '[class.app-button--loading]': 'loading()',
    '[attr.aria-busy]': "loading() ? 'true' : null",
    '[attr.aria-disabled]': "disabled() || loading() ? 'true' : null",
    '[attr.disabled]': "isButton && (disabled() || loading()) ? '' : null",
    '[attr.tabindex]': '!isButton && (disabled() || loading()) ? -1 : null',
  },
})
export class AppButton implements OnDestroy {
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  protected readonly isButton = this.element.tagName === 'BUTTON';
  readonly variant = input<AppButtonVariant>('filled');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly loading = input(false, { transform: booleanAttribute });

  private readonly preventDisabledActivation = (event: Event) => {
    if (this.disabled() || this.loading()) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  };

  constructor() {
    this.element.addEventListener('click', this.preventDisabledActivation, true);
  }

  ngOnDestroy(): void {
    this.element.removeEventListener('click', this.preventDisabledActivation, true);
  }
}
