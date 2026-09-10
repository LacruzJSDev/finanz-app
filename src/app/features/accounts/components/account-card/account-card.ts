import { Component, input, output } from '@angular/core';
import { AppCard } from '../../../../shared/ui/card';
import { AppButton } from '../../../../shared/ui/button';
import { AppIcon } from '../../../../shared/ui/icon';
import { AccountRead } from '../../../../core/models';
import { CentsToEurosPipe } from '../../../../shared/money/cents-to-euros.pipe';
import { ColorIcon } from '../../../../shared/ui/color-icon/color-icon';

@Component({
  selector: 'app-account-card',
  imports: [AppCard, AppButton, AppIcon, CentsToEurosPipe, ColorIcon],
  templateUrl: 'account-card.html',
  styleUrl: 'account-card.scss',
})
export class AccountCard {
  readonly account = input.required<AccountRead>();

  /** Editar es gobierno del grupo; ver la cuenta, no. */
  readonly canManage = input(false);

  readonly editClick = output<AccountRead>();
  readonly viewClick = output<AccountRead>();
  readonly analysisClick = output<AccountRead>();

  showAnalysis(event: MouseEvent): void {
    event.stopPropagation();
    this.analysisClick.emit(this.account());
  }
}
