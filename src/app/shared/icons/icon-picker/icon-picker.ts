import { Component, effect, input, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ICON_GROUPS, ICON_LABELS, IconName } from '../icons';
import { AppSelect, AppSelectOption } from '../../ui/select';

@Component({
  selector: 'app-icon-picker',
  imports: [ReactiveFormsModule, AppSelect],
  templateUrl: './icon-picker.html',
  styleUrl: './icon-picker.scss',
})
export class IconPicker {
  protected readonly groups = ICON_GROUPS;
  protected readonly labels = ICON_LABELS;
  protected readonly options: readonly AppSelectOption[] = ICON_GROUPS.flatMap((group) =>
    group.icons.map((icon) => ({
      value: icon.name,
      label: icon.label,
      icon: icon.name,
      group: group.label,
    })),
  );

  readonly selected = input<IconName | null>(null);
  readonly iconChange = output<IconName>();
  protected readonly control = new FormControl<string | null>(null);

  constructor() {
    effect(() => this.control.setValue(this.selected(), { emitEvent: false }));
    this.control.valueChanges.subscribe((value) => {
      if (value) this.iconChange.emit(value as IconName);
    });
  }
}
