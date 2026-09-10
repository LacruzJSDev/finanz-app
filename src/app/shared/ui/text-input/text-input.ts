import { booleanAttribute, Component, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AppField } from '../field';

export type AppTextInputType = 'email' | 'number' | 'password' | 'search' | 'tel' | 'text' | 'url';

let nextInputId = 0;

/** Native text input or textarea with a bounded, Reactive Forms-compatible API. */
@Component({
  selector: 'app-text-input',
  imports: [AppField],
  templateUrl: './text-input.html',
  styleUrl: './text-input.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AppTextInput),
      multi: true,
    },
  ],
})
export class AppTextInput implements ControlValueAccessor {
  readonly label = input.required<string>();
  readonly type = input<AppTextInputType>('text');
  readonly appearance = input<'standard' | 'amount'>('standard');
  readonly required = input(false, { transform: booleanAttribute });
  readonly readonly = input(false, { alias: 'readonly', transform: booleanAttribute });
  readonly placeholder = input<string>('');
  readonly autocomplete = input<string>('');
  readonly error = input<string | null>(null);
  readonly hint = input<string | null>(null);
  readonly name = input<string | null>(null);
  readonly min = input<number | string | null>(null);
  readonly max = input<number | string | null>(null);
  readonly step = input<number | string | null>(null);
  readonly inputmode = input<string | null>(null);
  readonly maxlength = input<number | string | null>(null);
  readonly multiline = input(false, { transform: booleanAttribute });
  readonly inputId = `app-text-input-${++nextInputId}`;

  protected readonly value = signal<string | number>('');
  protected readonly disabled = signal(false);

  private onChange: (value: string | number | null) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  writeValue(value: string | number | null): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (value: string | number | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  protected updateValue(event: Event): void {
    if (this.disabled() || this.readonly()) return;
    const element = event.target as HTMLInputElement | HTMLTextAreaElement;
    this.value.set(element.value);
    if (this.type() === 'number') {
      const numberValue = element.value === '' ? null : Number(element.value);
      this.onChange(Number.isFinite(numberValue) ? numberValue : null);
      return;
    }
    this.onChange(element.value);
  }

  protected markTouched(): void {
    this.onTouched();
  }
}
