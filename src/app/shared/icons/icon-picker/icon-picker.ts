import { Component, input, output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { AVAILABLE_ICONS, ICON_LABELS, IconName } from '../icons';

@Component({
  selector: 'app-icon-picker',
  imports: [MatFormFieldModule, MatSelectModule, MatIconModule],
  templateUrl: './icon-picker.html',
  styleUrl: './icon-picker.scss',
})
export class IconPicker {
  protected readonly icons = AVAILABLE_ICONS;
  protected readonly labels = ICON_LABELS;

  readonly selected = input<IconName | null>(null);
  readonly iconChange = output<IconName>();
}
