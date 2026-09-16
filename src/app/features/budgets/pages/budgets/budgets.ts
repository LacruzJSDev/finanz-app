import { Component, computed, effect, inject, signal } from '@angular/core';
import { AppSheetService } from '../../../../shared/ui/app-sheet';
import { Router } from '@angular/router';
import { canManageGroupData } from '../../../../core/account-groups/permissions';
import { BudgetsService } from '../../../../core/budgets/budgets.service';
import { CategoriesService } from '../../../../core/categories/categories.service';
import { BudgetProgressRead, CategoryRead } from '../../../../core/models';
import { GroupContextService } from '../../../../core/ui/group-context.service';
import { PageContextService } from '../../../../core/ui/page-context.service';
import { EmptyState } from '../../../../shared/ui/empty-state/empty-state';
import { PageContent } from '../../../../shared/ui/page-content/page-content';
import { PageLoader } from '../../../../shared/ui/page-loader/page-loader';
import { dateToIso, startOfMonth } from '../../../../shared/date/date';
import { MonthStepper } from '../../../account-stats';
import { BudgetCard } from '../../components/budget-card/budget-card';
import { BudgetForm, BudgetFormData } from '../../components/budget-form/budget-form';
import {
  DeleteBudgetForm,
  DeleteBudgetFormData,
} from '../../components/delete-budget-form/delete-budget-form';

@Component({
  selector: 'app-budgets',
  imports: [BudgetCard, EmptyState, MonthStepper, PageContent, PageLoader],
  templateUrl: './budgets.html',
  styleUrl: './budgets.scss',
  host: { class: 'page-container' },
})
export class Budgets {
  private readonly bottomSheet = inject(AppSheetService);
  private readonly budgetsService = inject(BudgetsService);
  private readonly categoriesService = inject(CategoriesService);
  private readonly groupContextService = inject(GroupContextService);
  private readonly pageContextService = inject(PageContextService);
  private readonly router = inject(Router);
  protected readonly budgets = this.budgetsService.budgets;
  protected readonly loading = this.budgetsService.loading;
  protected readonly activeGroupId = this.groupContextService.activeGroupId;
  protected readonly month = signal(startOfMonth(new Date()));
  protected readonly canManage = computed(() =>
    canManageGroupData(this.groupContextService.activeRole()),
  );
  protected readonly activeCategories = computed(() =>
    this.categoriesService.categories().filter((category) => category.is_active),
  );
  protected readonly budgetGroups = computed(() => {
    const categories = this.categoriesService.categories();
    const byId = new Map(categories.map((category) => [category.id, category]));
    const groups = new Map<
      string,
      { root: CategoryRead | null; budgets: BudgetProgressRead[]; hasRootBudget: boolean }
    >();

    for (const budget of this.budgets()) {
      const category = byId.get(budget.category_id) ?? null;
      const root = category?.parent_id ? (byId.get(category.parent_id) ?? category) : category;
      const rootId = root?.id ?? budget.category_id;
      const group = groups.get(rootId) ?? { root, budgets: [], hasRootBudget: false };
      group.budgets.push(budget);
      group.hasRootBudget ||= budget.category_id === root?.id;
      groups.set(rootId, group);
    }

    return [...groups.values()]
      .map((group) => ({
        ...group,
        budgets: [...group.budgets].sort((a, b) => {
          const aIsRoot = a.category_id === group.root?.id;
          const bIsRoot = b.category_id === group.root?.id;
          if (aIsRoot !== bIsRoot) return aIsRoot ? -1 : 1;
          return a.category_name.localeCompare(b.category_name, 'es');
        }),
      }))
      .sort((a, b) =>
        (a.root?.name ?? a.budgets[0]?.category_name ?? '').localeCompare(
          b.root?.name ?? b.budgets[0]?.category_name ?? '',
          'es',
        ),
      );
  });

  protected categoryFor(budget: BudgetProgressRead): CategoryRead | null {
    return (
      this.categoriesService.categories().find((category) => category.id === budget.category_id) ??
      null
    );
  }

  constructor() {
    this.pageContextService.setTitle('Presupuestos');
    effect(() => {
      const groupId = this.activeGroupId();
      if (!groupId) {
        this.router.navigateByUrl('grupos');
        return;
      }
      this.budgetsService.getBudgets(groupId, dateToIso(this.month())).subscribe();
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
        month: dateToIso(this.month()),
      },
      variant: 'full-height-form',
    });
  }

  deleteBudget(budget: BudgetProgressRead): void {
    const groupId = this.activeGroupId();
    if (!groupId || !this.canManage()) return;
    this.bottomSheet.open<DeleteBudgetForm, DeleteBudgetFormData>(DeleteBudgetForm, {
      data: {
        groupId,
        categoryId: budget.category_id,
        categoryName: budget.category_name,
        month: dateToIso(this.month()),
      },
      variant: 'confirm',
    });
  }
}
