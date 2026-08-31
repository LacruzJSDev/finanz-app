import { Component, input, output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { AVAILABLE_COLORS, COLOR_LABELS, ColorName } from '../colors';
import { ColorMark } from '../../ui/color-mark/color-mark';

@Component({
  selector: 'app-color-picker',
  imports: [MatFormFieldModule, MatSelectModule, ColorMark],
  templateUrl: './color-picker.html',
  styleUrl: './color-picker.scss',
})
export class ColorPicker {
  protected readonly colors = AVAILABLE_COLORS;
  protected readonly labels = COLOR_LABELS;

  readonly selected = input<ColorName | null>(null);
  readonly colorChange = output<ColorName>();
}
