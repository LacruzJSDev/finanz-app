import { Component, computed, input, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { GroupRead } from '../../../../api';
import { ColorIcon } from '../../../../shared/ui/color-icon/color-icon';

@Component({
  selector: 'app-account-group-card',
  imports: [MatCardModule, MatSlideToggleModule, ColorIcon],
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

  /** Si este grupo pasa a ser el grupo de trabajo de la sesión, o deja de serlo. */
  readonly workingGroupChange = output<boolean>();
}
