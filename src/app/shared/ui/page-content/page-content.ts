import { Component } from '@angular/core';

/**
 * La parte de la página que scrollea. Lo que la página quiera dejar fijo —un
 * selector segmentado, por ejemplo— lo pone fuera, como hermano.
 *
 * Es un componente y no una clase suelta porque la clase se olvidaba: sin ella
 * la página mide todo su contenido, el armazón lo recorta y no hay scroll por
 * ningún lado. Escribiendo `app-page-` sale en el autocompletado.
 */
@Component({
  selector: 'app-page-content',
  template: '<ng-content />',
  styleUrl: './page-content.scss',
})
export class PageContent {}
