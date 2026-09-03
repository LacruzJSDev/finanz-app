import { Component, computed, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { GroupRead } from '../../../../core/models';
import { ColorIcon } from '../../../../shared/ui/color-icon/color-icon';

@Component({
  selector: 'app-account-group-card',
  imports: [MatButtonModule, MatCardModule, MatIconModule, ColorIcon],
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
