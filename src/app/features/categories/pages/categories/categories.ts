import { Component, effect, inject } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { CategoriesService } from '../../../../core/categories/categories.service';
import { CategoryRead } from '../../../../api';
import { CategoriesList } from '../../components/tables/categories-list/categories-list';
import {
  CreateCategoryForm,
  CreateCategoryFormData,
} from '../../components/forms/create-category-form/create-category-form';
import {
  UpdateCategoryForm,
  UpdateCategoryFormData,
} from '../../components/forms/update-category-form/update-category-form';
import { PageContextService } from '../../../../core/ui/page-context.service';
import { GroupContextService } from '../../../../core/ui/group-context.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-categories',
  imports: [CategoriesList],
  templateUrl: './categories.html',
  host: { class: 'page-container' },
})
export class Categories {
  private readonly bottomSheet = inject(MatBottomSheet);
  protected readonly categoriesService = inject(CategoriesService);
  protected readonly pageContextService = inject(PageContextService);
  protected readonly groupContextService = inject(GroupContextService);
  protected readonly router = inject(Router);

  protected activeGroupId = this.groupContextService.activeGroupId;

  protected readonly categories = this.categoriesService.categories;

  constructor() {
    effect(() => {
      const groupId = this.activeGroupId();
      if (!groupId) {
        this.router.navigateByUrl('grupos');
        return;
      }
      this.categoriesService.getCategories(groupId).subscribe();
    });
    this.pageContextService.setTitle('Categorías');
    this.pageContextService.setAction({
      onClick: () => this.openCreateCategoryForm(),
      icon: 'add',
    });
  }

  openCreateCategoryForm(): void {
    const groupId = this.activeGroupId();
    if (!groupId) return;
    this.bottomSheet.open<CreateCategoryForm, CreateCategoryFormData>(CreateCategoryForm, {
      data: {
        groupId,
        rootCategories: this.categories().filter((c) => c.parent_id === null),
      },
    });
  }

  openUpdateCategoryForm(category: CategoryRead): void {
    const categories = this.categories();
    this.bottomSheet.open<UpdateCategoryForm, UpdateCategoryFormData>(UpdateCategoryForm, {
      data: {
        category,
        rootCategories: categories.filter((c) => c.parent_id === null && c.id !== category.id),
        hasChildren: categories.some((c) => c.parent_id === category.id),
      },
    });
  }

  archiveCategory(category: CategoryRead): void {
    this.categoriesService.updateCategory(category.id, { is_active: false }).subscribe();
  }
}
