import { Component, input, output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ICON_GROUPS, ICON_LABELS, IconName } from '../icons';
import { IconMark } from '../../ui/icon-mark/icon-mark';

@Component({
  selector: 'app-icon-picker',
  imports: [MatFormFieldModule, MatSelectModule, IconMark],
  templateUrl: './icon-picker.html',
  styleUrl: './icon-picker.scss',
})
export class IconPicker {
  protected readonly groups = ICON_GROUPS;
  protected readonly labels = ICON_LABELS;

  readonly selected = input<IconName | null>(null);
  readonly iconChange = output<IconName>();
}
