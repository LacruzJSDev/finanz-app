import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

/**
 * Una lista sin nada dentro. Dice qué falta y, si hay forma de llenarla, cómo.
 *
 * No sirve para "esto no existe": una URL que apunta a algo que no está no es
 * un estado que pintar, es una vuelta a la lista de la que salió.
 */
@Component({
  selector: 'app-empty-state',
  imports: [MatIconModule],
  templateUrl: './empty-state.html',
  styleUrl: './empty-state.scss',
})
export class EmptyState {
  readonly icon = input.required<string>();
  readonly message = input.required<string>();

  /** Cómo se llena. Se omite cuando no hay nada que el usuario pueda hacer. */
  readonly hint = input<string>();
}
