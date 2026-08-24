import { Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AVAILABLE_ICONS, IconName } from '../icons';
import { IconLabelPipe } from '../icon-label.pipe';

@Component({
  selector: 'app-icon-picker',
  imports: [MatIconModule, IconLabelPipe],
  templateUrl: './icon-picker.html',
})
export class IconPicker {
  protected readonly icons = AVAILABLE_ICONS;

  readonly selected = input<IconName | null>(null);
  readonly iconChange = output<IconName>();
}
