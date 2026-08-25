import { Pipe, PipeTransform } from '@angular/core';
import { AVAILABLE_ICONS, IconName } from './icons';

const DEFAULT_ICON: IconName = 'home';

@Pipe({ name: 'iconOrDefault' })
export class IconOrDefaultPipe implements PipeTransform {
  transform(icon: string | null | undefined): IconName {
    return icon && (AVAILABLE_ICONS as readonly string[]).includes(icon)
      ? (icon as IconName)
      : DEFAULT_ICON;
  }
}
