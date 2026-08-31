import { Component, computed, input } from '@angular/core';

/** El color solo, como muestra redonda: el color en tanto que valor a elegir. */
@Component({
  selector: 'app-color-mark',
  templateUrl: './color-mark.html',
  styleUrl: './color-mark.scss',
  host: { class: 'field-mark' },
})
export class ColorMark {
  readonly color = input<string | null>();
  readonly size = input(16);

  /** Sin color se ve el hueco, no un círculo negro. */
  protected readonly resolvedColor = computed(
    () => this.color() ?? 'var(--mat-sys-surface-variant)',
  );
}
