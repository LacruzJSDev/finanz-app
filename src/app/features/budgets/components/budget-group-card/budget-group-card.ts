import { DecimalPipe } from '@angular/common';
import { Component, computed, input, output, signal } from '@angular/core';
import { BudgetProgressRead, CategoryRead } from '../../../../core/models';
import { AppButton } from '../../../../shared/ui/button';
import { ColorIcon } from '../../../../shared/ui/color-icon/color-icon';
import { AppDisclosure } from '../../../../shared/ui/disclosure';
import { AppIcon } from '../../../../shared/ui/icon';
import { CentsToEurosPipe } from '../../../../shared/money/cents-to-euros.pipe';
import { AppProgress } from '../../../../shared/ui/progress';

/** Una categoría raíz y los presupuestos de sus hijas dentro de una sola superficie. */
@Component({
  selector: 'app-budget-group-card',
  imports: [
    AppButton,
    AppDisclosure,
    AppIcon,
    AppProgress,
    CentsToEurosPipe,
    ColorIcon,
    DecimalPipe,
  ],
  templateUrl: './budget-group-card.html',
  styleUrl: './budget-group-card.scss',
})
export class BudgetGroupCard {
  readonly root = input<CategoryRead | null>(null);
  readonly budgets = input.required<BudgetProgressRead[]>();
  readonly categories = input.required<readonly CategoryRead[]>();
  readonly canManage = input(false);
  readonly editClick = output<BudgetProgressRead>();
  readonly deleteClick = output<BudgetProgressRead>();

  protected readonly expanded = signal(true);
  protected readonly rootBudget = computed(
    () => this.budgets().find((budget) => budget.category_id === this.root()?.id) ?? null,
  );
  protected readonly childBudgets = computed(() =>
    this.budgets().filter((budget) => budget.category_id !== this.rootBudget()?.category_id),
  );
  protected readonly expandable = computed(() => this.childBudgets().length > 0);
  protected readonly displayRootName = computed(
    () => this.root()?.name ?? this.rootBudget()?.category_name ?? this.budgets()[0]?.category_name,
  );

  protected categoryFor(budget: BudgetProgressRead): CategoryRead | null {
    return this.categories().find((category) => category.id === budget.category_id) ?? null;
  }

  protected progress(budget: BudgetProgressRead): number {
    return Math.min(100, Math.max(0, budget.percentage));
  }

  protected progressTone(budget: BudgetProgressRead): 'positive' | 'warning' | 'danger' {
    return budget.percentage >= 100 ? 'danger' : budget.percentage >= 75 ? 'warning' : 'positive';
  }
}
