import { AppButton } from '../../../../shared/ui/button';
import { AppCard } from '../../../../shared/ui/card';
import { Component, computed, input, output } from '@angular/core';
import { AppIcon } from '../../../../shared/ui/icon';
import { AppProgress } from '../../../../shared/ui/progress';
import { BudgetProgressRead } from '../../../../core/models';
import { CentsToEurosPipe } from '../../../../shared/money/cents-to-euros.pipe';
import { ColorIcon } from '../../../../shared/ui/color-icon/color-icon';

@Component({
  selector: 'app-budget-card',
  imports: [CentsToEurosPipe, ColorIcon, AppButton, AppCard, AppIcon, AppProgress],
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
