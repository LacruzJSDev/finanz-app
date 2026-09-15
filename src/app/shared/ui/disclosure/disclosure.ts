import { Component, input, model } from '@angular/core';
import { AppCard } from '../card';
import { AppIcon } from '../icon';

let nextDisclosureId = 0;

@Component({
  selector: 'app-disclosure',
  imports: [AppCard, AppIcon],
  templateUrl: './disclosure.html',
  styleUrl: './disclosure.scss',
})
export class AppDisclosure {
  readonly expanded = model(false);
  readonly expandable = input(true);
  protected readonly contentId = `app-disclosure-${++nextDisclosureId}`;
}
