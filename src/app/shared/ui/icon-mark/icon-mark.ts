import { Component, computed, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { resolveIcon } from '../../icons/icons';

/**
 * El icono solo, sin fondo ni color: es el icono como valor que se elige, no
 * la marca de identidad de una cuenta o una categoría. Para eso está
 * [ColorIcon](../color-icon/color-icon.ts).
 */
@Component({
  selector: 'app-icon-mark',
  imports: [MatIconModule],
  templateUrl: './icon-mark.html',
  styleUrl: './icon-mark.scss',
  host: { class: 'field-mark' },
})
export class IconMark {
  readonly icon = input<string | null>();
  readonly size = input(20);

  protected readonly resolvedIcon = computed(() => resolveIcon(this.icon()));
}
