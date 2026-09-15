import { AppButton } from '../../shared/ui/button';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppIcon } from '../../shared/ui/icon';

/** La barra de la parte pública: la marca y las dos puertas de entrada. */
@Component({
  selector: 'app-public-header',
  imports: [RouterLink, AppButton, AppIcon],
  templateUrl: './public-header.html',
  styleUrl: './public-header.scss',
})
export class PublicHeader {}
