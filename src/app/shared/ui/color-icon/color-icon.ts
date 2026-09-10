import { Component, computed, input } from '@angular/core';
import { AppIcon } from '../icon';
import { resolveIcon } from '../../icons/icons';

/** Icono sobre un fondo teñido con su color. */
@Component({
  selector: 'app-color-icon',
  imports: [AppIcon],
  templateUrl: './color-icon.html',
  styleUrl: './color-icon.scss',
  host: { class: 'field-mark' },
})
export class ColorIcon {
  readonly icon = input<string | null>();
  readonly color = input<string | null>();
  readonly size = input(20);

  protected readonly resolvedIcon = computed(() => resolveIcon(this.icon()));

  protected readonly resolvedColor = computed(() => this.color() ?? 'var(--app-color-muted)');
}
