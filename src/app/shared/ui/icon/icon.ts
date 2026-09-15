import { Component, computed, input } from '@angular/core';
import { LucideDynamicIcon } from '@lucide/angular';
import { resolveAppIcon } from '../../icons/icon-registry';

@Component({
  selector: 'app-icon',
  imports: [LucideDynamicIcon],
  templateUrl: './icon.html',
  styleUrl: './icon.scss',
  host: { '[style.width.px]': 'size()', '[style.height.px]': 'size()' },
})
export class AppIcon {
  readonly name = input<string | null>();
  readonly size = input(24);
  readonly label = input<string>();
  protected readonly icon = computed(() => {
    const data = resolveAppIcon(this.name());
    return { ...data, name: data.name ?? 'app-icon' };
  });
}
