import { Component, input } from '@angular/core';

export type AppCardAppearance = 'outlined' | 'filled' | 'elevated';
export type AppCardLayout = 'column' | 'row';
export type AppCardSpacing = 'standard' | 'compact';

/** A surface primitive; navigation remains a native anchor when using appCard. */
@Component({
  selector: 'app-card, a[appCard]',
  templateUrl: './card.html',
  styleUrl: './card.scss',
  host: {
    '[class.app-card--outlined]': "appearance() === 'outlined'",
    '[class.app-card--filled]': "appearance() === 'filled'",
    '[class.app-card--elevated]': "appearance() === 'elevated'",
    '[class.app-card--row]': "layout() === 'row'",
    '[class.app-card--column]': "layout() === 'column'",
    '[class.app-card--compact]': "spacing() === 'compact'",
  },
})
export class AppCard {
  readonly appearance = input<AppCardAppearance>('outlined');
  readonly layout = input<AppCardLayout>('column');
  readonly spacing = input<AppCardSpacing>('standard');
}
