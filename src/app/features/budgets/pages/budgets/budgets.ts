import { Component, computed, effect, inject } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';
import { canManageGroupData } from '../../../../core/account-groups/permissions';
import { BudgetsService } from '../../../../core/budgets/budgets.service';
import { CategoriesService } from '../../../../core/categories/categories.service';
import { BudgetProgressRead } from '../../../../core/models';
import { GroupContextService } from '../../../../core/ui/group-context.service';
import { PageContextService } from '../../../../core/ui/page-context.service';
import { EmptyState } from '../../../../shared/ui/empty-state/empty-state';
import { PageContent } from '../../../../shared/ui/page-content/page-content';
import { PageLoader } from '../../../../shared/ui/page-loader/page-loader';
import { BudgetCard } from '../../components/budget-card/budget-card';
import { BudgetForm, BudgetFormData } from '../../components/budget-form/budget-form';
import {
  DeleteBudgetForm,
  DeleteBudgetFormData,
} from '../../components/delete-budget-form/delete-budget-form';

@Component({
  selector: 'app-budgets',
  imports: [BudgetCard, EmptyState, PageContent, PageLoader],
  templateUrl: './budgets.html',
  styleUrl: './budgets.scss',
  host: { class: 'page-container' },
})
export class Budgets {
  private readonly bottomSheet = inject(MatBottomSheet);
  private readonly budgetsService = inject(BudgetsService);
  private readonly categoriesService = inject(CategoriesService);
  private readonly groupContextService = inject(GroupContextService);
  private readonly pageContextService = inject(PageContextService);
  private readonly router = inject(Router);
  protected readonly budgets = this.budgetsService.budgets;
  protected readonly loading = this.budgetsService.loading;
  protected readonly activeGroupId = this.groupContextService.activeGroupId;
  protected readonly canManage = computed(() =>
    canManageGroupData(this.groupContextService.activeRole()),
  );
  protected readonly activeCategories = computed(() =>
    this.categoriesService.categories().filter((category) => category.is_active),
  );

  constructor() {
    this.pageContextService.setTitle('Presupuestos');
    effect(() => {
      const groupId = this.activeGroupId();
      if (!groupId) {
        this.router.navigateByUrl('grupos');
        return;
      }
      this.budgetsService.getBudgets(groupId).subscribe();
      this.categoriesService.getCategories(groupId).subscribe();
    });
    effect(() =>
      this.pageContextService.setAction(
        this.canManage() ? { icon: 'add', onClick: () => this.openBudgetForm() } : null,
      ),
    );
  }

  openBudgetForm(budget?: BudgetProgressRead): void {
    const groupId = this.activeGroupId();
    if (!groupId || !this.canManage()) return;
    this.bottomSheet.open<BudgetForm, BudgetFormData>(BudgetForm, {
      data: {
        groupId,
        categories: this.activeCategories(),
        budgets: this.budgets(),
        categoryId: budget?.category_id,
      },
    });
  }

  deleteBudget(budget: BudgetProgressRead): void {
    const groupId = this.activeGroupId();
    if (!groupId || !this.canManage()) return;
    this.bottomSheet.open<DeleteBudgetForm, DeleteBudgetFormData>(DeleteBudgetForm, {
      data: { groupId, categoryId: budget.category_id, categoryName: budget.category_name },
    });
  }
}
