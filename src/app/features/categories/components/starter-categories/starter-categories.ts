import { Component, computed, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

/**
 * La oferta de empezar con un cuadro de categorías ya hecho. Va al final de la
 * lista, no arriba: quien ya tiene las suyas no debería tropezarse con ella
 * cada vez que entra, y a quien no tiene ninguna la lista vacía le deja el
 * hueco justo delante.
 */
@Component({
  selector: 'app-starter-categories',
  imports: [MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './starter-categories.html',
  styleUrl: './starter-categories.scss',
})
export class StarterCategories {
  /** Cuántas quedan por crear, que tras un intento a medias no son todas. */
  readonly count = input.required<number>();

  readonly creating = input(false);
  readonly create = output<void>();

  protected readonly summary = computed(() =>
    this.count() === 1
      ? '1 categoría con sus subcategorías.'
      : `${this.count()} categorías con sus subcategorías.`,
  );
}
