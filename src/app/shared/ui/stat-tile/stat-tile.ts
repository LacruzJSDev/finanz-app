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

  /**
   * Qué signo tiene la cifra para quien la lee: lo que sale, lo que entra, o
   * ninguno de los dos. Un booleano solo sabía decir «míralo», y eso pintaba de
   * rojo un ingreso.
   */
  readonly tone = input<'neutral' | 'negative' | 'positive'>('neutral');
}
