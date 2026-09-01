import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

/** La barra de la parte pública: la marca y las dos puertas de entrada. */
@Component({
  selector: 'app-public-header',
  imports: [RouterLink, MatButtonModule, MatIconModule],
  templateUrl: './public-header.html',
  styleUrl: './public-header.scss',
})
export class PublicHeader {}
