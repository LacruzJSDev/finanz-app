import { Component, input, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AccountRead } from '../../../../core/models';
import { CentsToEurosPipe } from '../../../../shared/money/cents-to-euros.pipe';
import { ColorIcon } from '../../../../shared/ui/color-icon/color-icon';

@Component({
  selector: 'app-account-card',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    CentsToEurosPipe,
    ColorIcon,
  ],
  templateUrl: 'account-card.html',
  styleUrl: 'account-card.scss',
})
export class AccountCard {
  readonly account = input.required<AccountRead>();

  readonly editClick = output<AccountRead>();
  readonly viewClick = output<AccountRead>();
  readonly toggleActive = output<AccountRead>();
}
