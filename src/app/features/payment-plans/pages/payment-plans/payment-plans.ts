import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PaymentPlansService } from '../../../../core/payment-plans/payment-plans.service';
import { AccountsService } from '../../../../core/accounts/accounts.service';
import { CategoriesService } from '../../../../core/categories/categories.service';
import { GroupContextService } from '../../../../core/ui/group-context.service';
import { PageContextService } from '../../../../core/ui/page-context.service';
import { canManageGroupData } from '../../../../core/account-groups/permissions';
import { PaymentPlanRead } from '../../../../core/models';
import { PageContent } from '../../../../shared/ui/page-content/page-content';
import { PageLoader } from '../../../../shared/ui/page-loader/page-loader';
import { EmptyState } from '../../../../shared/ui/empty-state/empty-state';
import { PaymentPlansList } from '../../components/tables/payment-plans-list/payment-plans-list';
import {
  CreatePaymentPlanForm,
  CreatePaymentPlanFormData,
} from '../../components/forms/create-payment-plan-form/create-payment-plan-form';
import {
  UpdatePaymentPlanForm,
  UpdatePaymentPlanFormData,
} from '../../components/forms/update-payment-plan-form/update-payment-plan-form';

@Component({
  selector: 'app-payment-plans',
  imports: [MatButtonModule, MatIconModule, PageContent, PageLoader, EmptyState, PaymentPlansList],
  templateUrl: './payment-plans.html',
  styleUrl: './payment-plans.scss',
  host: { class: 'page-section' },
})
export class PaymentPlans {
  private readonly bottomSheet = inject(MatBottomSheet);
  private readonly paymentPlansService = inject(PaymentPlansService);
  private readonly accountsService = inject(AccountsService);
  private readonly categoriesService = inject(CategoriesService);
  private readonly groupContextService = inject(GroupContextService);
  private readonly pageContextService = inject(PageContextService);

  readonly id = input.required<string>();

  protected readonly loading = this.paymentPlansService.loading;
  protected readonly plans = this.paymentPlansService.paymentPlans;
  protected readonly categories = this.categoriesService.categories;

  protected readonly activePlans = computed(() => this.plans().filter((plan) => plan.is_active));

  protected readonly archivedPlans = computed(() => this.plans().filter((plan) => !plan.is_active));

  protected readonly showArchived = signal(false);

  protected readonly account = this.accountsService.account;

  private readonly groupId = computed(() => this.account()?.group_id ?? null);

  protected readonly otherAccounts = computed(() =>
    this.accountsService.accounts().filter((account) => account.id !== this.id()),
  );

  protected readonly selectableCategories = computed(() =>
    this.categories().filter((category) => category.is_active),
  );

  protected readonly canManage = computed(() =>
    canManageGroupData(this.groupContextService.activeRole()),
  );

  constructor() {
    effect(() => {
      this.paymentPlansService.getPaymentPlans(this.id()).subscribe();
    });

    effect(() => {
      const groupId = this.groupId();
      if (!groupId) return;
      this.categoriesService.getCategories(groupId).subscribe();
      this.accountsService.getAccounts(groupId).subscribe();
    });

    effect(() => {
      this.pageContextService.setAction(
        this.canManage() ? { onClick: () => this.openCreateForm(), icon: 'add' } : null,
      );
    });
  }

  openCreateForm(): void {
    this.bottomSheet.open<CreatePaymentPlanForm, CreatePaymentPlanFormData>(CreatePaymentPlanForm, {
      data: {
        accountId: this.id(),
        otherAccounts: this.otherAccounts(),
        categories: this.selectableCategories(),
      },
    });
  }

  openUpdateForm(plan: PaymentPlanRead): void {
    this.bottomSheet.open<UpdatePaymentPlanForm, UpdatePaymentPlanFormData>(UpdatePaymentPlanForm, {
      data: { accountId: this.id(), plan, categories: this.selectableCategories() },
    });
  }
}
