import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PublicHeader } from '../public-header/public-header';

/**
 * El armazón de la parte pública, hermano de [Shell](../shell/shell.ts). Existe
 * para que la cabecera la componga la ruta y no la página: una feature no puede
 * importar de layout, y esta es la forma de que comparta cromo sin romper esa
 * dirección.
 */
@Component({
  selector: 'app-public-shell',
  imports: [RouterOutlet, PublicHeader],
  templateUrl: './public-shell.html',
  styleUrl: './public-shell.scss',
})
export class PublicShell {}
