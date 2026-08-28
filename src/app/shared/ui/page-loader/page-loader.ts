import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

/** Carga en curso, en el mismo sitio que ocuparía el contenido. */
@Component({
  selector: 'app-page-loader',
  imports: [MatProgressSpinnerModule],
  template: '<mat-spinner diameter="36" />',
  styleUrl: './page-loader.scss',
})
export class PageLoader {}
