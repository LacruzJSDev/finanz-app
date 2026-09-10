import { Component, input, numberAttribute } from '@angular/core';

/** A compact, accessible activity indicator for content and actions. */
@Component({
  selector: 'app-loader',
  templateUrl: './loader.html',
  styleUrl: './loader.scss',
})
export class AppLoader {
  readonly diameter = input(36, { transform: numberAttribute });
  readonly label = input('Cargando');
}
