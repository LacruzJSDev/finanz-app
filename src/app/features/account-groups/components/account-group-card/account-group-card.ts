import { Component, computed, input, output } from '@angular/core';
import { AppButton } from '../../../../shared/ui/button';
import { AppCard } from '../../../../shared/ui/card';
import { AppIcon } from '../../../../shared/ui/icon';
import { GroupRead } from '../../../../core/models';
import { ColorIcon } from '../../../../shared/ui/color-icon/color-icon';

@Component({
  selector: 'app-account-group-card',
  imports: [AppButton, AppCard, AppIcon, ColorIcon],
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
  readonly analysisClick = output<GroupRead>();

  showAnalysis(event: MouseEvent): void {
    event.stopPropagation();
    this.analysisClick.emit(this.accountGroup());
  }
}
