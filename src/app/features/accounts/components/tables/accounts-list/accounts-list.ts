import { Component, input, output } from '@angular/core';
import { AccountRead } from '../../../../../core/models';
import { AccountCard } from '../../account-card/account-card';

@Component({
  selector: 'app-accounts-list',
  imports: [AccountCard],
  templateUrl: './accounts-list.html',
  styleUrl: './accounts-list.scss',
})
export class AccountsList {
  /** Ya filtradas por la página (activas o archivadas). */
  readonly accounts = input.required<AccountRead[]>();

  /** Si quien mira gobierna el grupo, o solo participa en él. */
  readonly canManage = input(false);

  readonly editClick = output<AccountRead>();
  readonly viewClick = output<AccountRead>();
  readonly analysisClick = output<AccountRead>();
}
