import { Component, computed, input, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { GroupRead } from '../../../../core/models';
import { ColorIcon } from '../../../../shared/ui/color-icon/color-icon';

@Component({
  selector: 'app-account-group-card',
  imports: [MatCardModule, ColorIcon],
  templateUrl: 'account-group-card.html',
  styleUrl: 'account-group-card.scss',
})
export class AccountGroupCard {
  readonly accountGroup = input.required<GroupRead>();
  readonly activeGroupId = input.required<string | null>();

  protected readonly isWorkingGroup = computed(
    () => this.activeGroupId() === this.accountGroup().id,
  );

  protected readonly memberCount = computed(() => this.accountGroup().members?.length ?? 0);

  readonly showClick = output<GroupRead>();
}
