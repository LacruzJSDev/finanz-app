import { Component, input, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AccountRead } from '../../../../api';
import { CentsToEurosPipe } from '../../../../shared/money/cents-to-euros.pipe';
import { IconOrDefaultPipe } from '../../../../shared/icons/icon-or-default.pipe';

@Component({
  selector: 'app-account-card',
  imports: [MatCardModule, MatButtonModule, MatIconModule, CentsToEurosPipe, IconOrDefaultPipe],
  templateUrl: 'account-card.html',
  styleUrl: 'account-card.scss',
})
export class AccountCard {
  readonly account = input.required<AccountRead>();

  readonly editClick = output<AccountRead>();
  readonly viewClick = output<AccountRead>();
}
