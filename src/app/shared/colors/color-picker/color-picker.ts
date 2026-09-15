import { Component, effect, input, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AVAILABLE_COLORS, COLOR_LABELS, ColorName } from '../colors';
import { AppSelect, AppSelectOption } from '../../ui/select';

@Component({
  selector: 'app-color-picker',
  imports: [ReactiveFormsModule, AppSelect],
  templateUrl: './color-picker.html',
  styleUrl: './color-picker.scss',
})
export class ColorPicker {
  protected readonly colors = AVAILABLE_COLORS;
  protected readonly labels = COLOR_LABELS;
  protected readonly options: readonly AppSelectOption[] = AVAILABLE_COLORS.map((color) => ({
    value: color,
    label: COLOR_LABELS[color],
    color,
  }));

  readonly selected = input<ColorName | null>(null);
  readonly colorChange = output<ColorName>();
  protected readonly control = new FormControl<string | null>(null);

  constructor() {
    effect(() => this.control.setValue(this.selected(), { emitEvent: false }));
    this.control.valueChanges.subscribe((value) => {
      if (value) this.colorChange.emit(value as ColorName);
    });
  }
}
