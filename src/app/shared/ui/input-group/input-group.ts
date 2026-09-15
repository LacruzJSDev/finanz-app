import { Component, ViewEncapsulation } from '@angular/core';

/** Groups projected controls into one surface without knowing their internals. */
@Component({
  selector: 'app-input-group',
  templateUrl: './input-group.html',
  styleUrl: './input-group.scss',
  encapsulation: ViewEncapsulation.None,
})
export class AppInputGroup {}
