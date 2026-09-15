import {
  Component,
  forwardRef,
  input,
  output,
  OnChanges,
  SimpleChanges,
  OnDestroy,
  ElementRef,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-switch',
  templateUrl: './switch.html',
  styleUrl: './switch.scss',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => AppSwitch), multi: true },
  ],
  host: { '[class.app-switch--before]': "labelPosition() === 'before'" },
})
export class AppSwitch implements ControlValueAccessor, OnChanges, OnDestroy {
  readonly labelPosition = input<'before' | 'after'>('after');
  readonly checked = input(false);
  readonly disabled = input(false);
  readonly ariaLabel = input<string | null>(null);
  readonly change = output<{ checked: boolean }>();
  /** For actions which remove this control, such as archiving its row. */
  readonly changeSettled = output<{ checked: boolean }>();
  private readonly thumb = viewChild<ElementRef<HTMLElement>>('thumb');
  private pendingValue: boolean | null = null;
  private settleTimer?: ReturnType<typeof setTimeout>;

  protected value: boolean | null = null;
  protected isDisabled = false;
  private onChange: (value: boolean) => void = () => undefined;
  protected onTouched: () => void = () => undefined;

  protected setValue(value: boolean): void {
    if (this.isDisabled || this.disabled()) return;
    this.value = value;
    this.onChange(value);
    this.onTouched();
    this.change.emit({ checked: value });
    clearTimeout(this.settleTimer);
    this.pendingValue = value;
    const element = this.thumb()?.nativeElement;
    const style = element ? getComputedStyle(element) : null;
    const seconds = (text: string) => {
      const value = text.endsWith('ms') ? parseFloat(text) : parseFloat(text) * 1000;
      return Number.isFinite(value) ? value : 0;
    };
    const duration = Math.max(0, ...(style?.transitionDuration.split(',').map(seconds) ?? [0]));
    const delay = Math.max(0, ...(style?.transitionDelay.split(',').map(seconds) ?? [0]));
    this.settleTimer = setTimeout(
      () => this.finishTransition(),
      duration + delay + (duration > 1 ? 40 : 0),
    );
  }

  protected onTransitionEnd(event: TransitionEvent): void {
    if (event.propertyName === 'transform') this.finishTransition();
  }
  private finishTransition(): void {
    clearTimeout(this.settleTimer);
    if (this.pendingValue === null) return;
    const checked = this.pendingValue;
    this.pendingValue = null;
    if (this.disabled() || this.isDisabled) return;
    this.changeSettled.emit({ checked });
  }
  ngOnDestroy(): void {
    clearTimeout(this.settleTimer);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['checked'] || (changes['disabled'] && !this.disabled()))
      this.value = this.checked();
  }

  writeValue(value: boolean | null): void {
    this.value = value === true;
  }
  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}
