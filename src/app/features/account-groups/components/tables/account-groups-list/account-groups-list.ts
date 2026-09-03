import { Component, input, output } from '@angular/core';
import { GroupRead } from '../../../../../core/models';
import { AccountGroupCard } from '../../account-group-card/account-group-card';

@Component({
  selector: 'app-account-groups-list',
  imports: [AccountGroupCard],
  templateUrl: './account-groups-list.html',
  styleUrl: './account-groups-list.scss',
})
export class AccountGroupsList {
  /** Ya filtrados por la página (activos o archivados). */
  readonly accountGroups = input.required<GroupRead[]>();

  /** Para marcar cuál es el grupo de trabajo. */
  readonly activeGroupId = input.required<string | null>();

  readonly showClick = output<GroupRead>();
  readonly analysisClick = output<GroupRead>();
}
