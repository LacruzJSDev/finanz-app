import { Pipe, PipeTransform } from '@angular/core';
import { ICON_LABELS, IconName } from './icons';

@Pipe({ name: 'iconLabel' })
export class IconLabelPipe implements PipeTransform {
  transform(icon: IconName): string {
    return ICON_LABELS[icon];
  }
}