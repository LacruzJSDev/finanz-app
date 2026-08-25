import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { GroupRead } from '../../../../api';

@Component({
  selector: 'app-account-group-card',
  imports: [MatCardModule, MatButtonModule],
  templateUrl: 'account-group-card.html',
  styleUrl: 'account-group-card.scss',
})
export class AccountGroupCard {
  readonly accountGroup = input.required<GroupRead>();
  readonly activeGroupId = input.required<string | null>();

  readonly showClick = output<GroupRead>();
  readonly activeClick = output<GroupRead>();
}
