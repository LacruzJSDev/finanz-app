import { Component, computed, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AVAILABLE_ICONS } from '../../icons/icons';

/** Icono sobre un fondo teñido con su color. */
@Component({
  selector: 'app-color-icon',
  imports: [MatIconModule],
  templateUrl: './color-icon.html',
  styleUrl: './color-icon.scss',
})
export class ColorIcon {
  readonly icon = input<string | null>();
  readonly color = input<string | null>();
  readonly size = input(20);

  /** Sin icono, o con uno que no está en el catálogo, se ve que no hay elección hecha. */
  protected readonly resolvedIcon = computed(() => {
    const icon = this.icon();
    return icon && (AVAILABLE_ICONS as readonly string[]).includes(icon) ? icon : 'block';
  });

  protected readonly resolvedColor = computed(
    () => this.color() ?? 'var(--mat-sys-on-surface-variant)',
  );
}
