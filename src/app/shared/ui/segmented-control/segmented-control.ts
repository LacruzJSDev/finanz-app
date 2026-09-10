import { Component, forwardRef, input, output, OnChanges, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface AppSegmentOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-segmented-control',
  templateUrl: './segmented-control.html',
  styleUrl: './segmented-control.scss',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => AppSegmentedControl), multi: true },
  ],
})
export class AppSegmentedControl implements ControlValueAccessor, OnChanges {
  readonly options = input.required<readonly AppSegmentOption[]>();
  readonly value = input<string | null>(null);
  readonly change = output<{ value: string }>();
  readonly valueChange = output<string>();
  protected selected: string | null = null;
  protected disabled = false;
  protected readonly groupName = `app-segment-${Math.random().toString(36).slice(2)}`;
  private onChange: (value: string) => void = () => undefined;
  protected onTouched: () => void = () => undefined;

  protected choose(value: string): void {
    if (this.disabled) return;
    this.selected = value;
    this.onChange(value);
    this.onTouched();
    this.change.emit({ value });
    this.valueChange.emit(value);
  }
  protected isSelected(value: string): boolean {
    return (this.selected ?? this.value()) === value;
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value']) this.selected = this.value();
  }
  writeValue(value: string | null): void {
    this.selected = value;
  }
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
