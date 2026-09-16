import {
  booleanAttribute,
  Component,
  ElementRef,
  forwardRef,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Listbox, Option } from '@angular/aria/listbox';
import { CdkConnectedOverlay, CdkOverlayOrigin, OverlayModule } from '@angular/cdk/overlay';
import { AppField } from '../field';
import { AppIcon } from '../icon';
import { ColorMark } from '../color-mark/color-mark';

export interface AppSelectOption {
  value: string;
  label: string;
  icon?: string;
  color?: string;
  disabled?: boolean;
  group?: string;
  /** Visual nesting depth for related options. Does not change listbox semantics. */
  depth?: number;
  /** Keeps semantically neutral choices neutral when selected. */
  muted?: boolean;
}

let nextSelectId = 0;

/** A single-value, Forms-compatible select with an owned trigger and popup. */
@Component({
  selector: 'app-select',
  imports: [
    AppField,
    AppIcon,
    ColorMark,
    CdkConnectedOverlay,
    CdkOverlayOrigin,
    Listbox,
    Option,
    OverlayModule,
  ],
  templateUrl: './select.html',
  styleUrl: './select.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AppSelect),
      multi: true,
    },
  ],
})
export class AppSelect implements ControlValueAccessor {
  readonly label = input.required<string>();
  readonly options = input<readonly AppSelectOption[]>([]);
  readonly required = input(false, { transform: booleanAttribute });
  readonly placeholder = input('');
  readonly hint = input<string | null>(null);
  readonly error = input<string | null>(null);
  readonly disabled = signal(false);
  readonly inputId = `app-select-${++nextSelectId}`;

  protected readonly open = signal(false);
  protected readonly value = signal<string | null>(null);
  protected readonly listValue = signal<string[]>([]);
  protected readonly trigger = viewChild<ElementRef<HTMLButtonElement>>('trigger');
  protected readonly listbox = viewChild<Listbox<string>>('listbox');

  private onChange: (value: string | null) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  protected selectedOption(): AppSelectOption | undefined {
    const value = this.value();
    return this.options().find((option) => option.value === value);
  }

  protected descriptionId(): string {
    return `${this.inputId}-description`;
  }

  protected panelId(): string {
    return `${this.inputId}-panel`;
  }

  protected toggle(): void {
    if (this.disabled()) return;
    if (this.open()) {
      this.close();
    } else {
      this.openPanel();
    }
  }

  protected openPanel(): void {
    if (this.disabled()) return;
    this.listValue.set(this.value() !== null ? [this.value() as string] : []);
    this.open.set(true);
  }

  protected close(restoreFocus = true): void {
    if (!this.open()) return;
    this.open.set(false);
    this.onTouched();
    if (restoreFocus) queueMicrotask(() => this.trigger()?.nativeElement.focus());
  }

  protected onTriggerKeydown(event: KeyboardEvent): void {
    if (this.disabled()) return;
    if (
      event.key === 'ArrowDown' ||
      event.key === 'ArrowUp' ||
      event.key === 'Enter' ||
      event.key === ' '
    ) {
      event.preventDefault();
      if (!this.open()) this.openPanel();
      return;
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      this.close();
    }
  }

  protected choose(option: AppSelectOption): void {
    if (!this.open() || option.disabled || this.disabled()) return;
    this.value.set(option.value);
    this.listValue.set([option.value]);
    this.onChange(option.value);
    this.close();
  }

  protected onBackdropClick(): void {
    this.close();
  }

  protected onOverlayAttach(): void {
    queueMicrotask(() => {
      const selectedIndex = this.options().findIndex((option) => option.value === this.value());
      this.listbox()?.gotoIndex(selectedIndex >= 0 ? selectedIndex : 0);
    });
  }

  protected onListValueChange(values: readonly string[]): void {
    const option = this.options().find((candidate) => candidate.value === values[0]);
    if (option) this.choose(option);
  }

  protected chooseActive(event: KeyboardEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const value = (event.target as HTMLElement).closest('[data-value]')?.getAttribute('data-value');
    const option = this.options().find((candidate) => candidate.value === value);
    if (option) this.choose(option);
  }

  protected onOverlayKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    event.stopPropagation();
    this.close();
  }

  protected closeFromTab(event: KeyboardEvent): void {
    event.stopPropagation();
    this.close(false);
    // Let the browser advance from the trigger, not from the detached overlay.
    this.trigger()?.nativeElement.focus();
  }

  writeValue(value: string | null): void {
    this.value.set(value);
    this.listValue.set(value !== null ? [value] : []);
  }

  registerOnChange(fn: (value: string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
    if (isDisabled) this.open.set(false);
  }
}
