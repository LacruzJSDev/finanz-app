import { Component, computed, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { BudgetProgressRead } from '../../../../core/models';
import { CentsToEurosPipe } from '../../../../shared/money/cents-to-euros.pipe';
import { ColorIcon } from '../../../../shared/ui/color-icon/color-icon';

@Component({
  selector: 'app-budget-card',
  imports: [
    CentsToEurosPipe,
    ColorIcon,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressBarModule,
  ],
  templateUrl: './budget-card.html',
  styleUrl: './budget-card.scss',
})
export class BudgetCard {
  readonly budget = input.required<BudgetProgressRead>();
  readonly canManage = input(false);
  readonly editClick = output<BudgetProgressRead>();
  readonly deleteClick = output<BudgetProgressRead>();

  protected readonly progress = computed(() =>
    Math.min(100, Math.max(0, this.budget().percentage)),
  );
  protected readonly isOverBudget = computed(() => this.budget().remaining < 0);
}
