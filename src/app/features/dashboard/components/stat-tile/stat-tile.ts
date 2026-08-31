import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

/** Una cifra con su etiqueta y una nota debajo. No sabe qué mide. */
@Component({
  selector: 'app-stat-tile',
  imports: [MatCardModule],
  templateUrl: './stat-tile.html',
  styleUrl: './stat-tile.scss',
})
export class StatTile {
  readonly label = input.required<string>();
  readonly value = input.required<string>();

  /** La unidad, más pequeña y al lado de la cifra. */
  readonly unit = input<string>();

  /** De qué se compone la cifra: "6 cuentas", "1 movimiento hoy". */
  readonly note = input<string>();

  /** Para las cifras que conviene mirar, como el gasto del día. */
  readonly highlight = input(false);
}
