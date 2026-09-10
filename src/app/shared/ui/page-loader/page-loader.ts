import { Component } from '@angular/core';
import { AppLoader } from '../loader';

/** Carga en curso, en el mismo sitio que ocuparía el contenido. */
@Component({
  selector: 'app-page-loader',
  imports: [AppLoader],
  templateUrl: './page-loader.html',
  styleUrl: './page-loader.scss',
})
export class PageLoader {}
