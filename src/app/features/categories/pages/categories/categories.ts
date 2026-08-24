import { Component, effect, inject, input } from '@angular/core';
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

@Component({
  selector: 'app-categories',
  imports: [CategoriesList],
  templateUrl: './categories.html',
})
export class Categories {
  private readonly bottomSheet = inject(MatBottomSheet);
  protected readonly categoriesService = inject(CategoriesService);

  readonly id = input.required<string>(); // group_id

  protected readonly categories = this.categoriesService.categories;

  constructor() {
    effect(() => {
      this.categoriesService.getCategories(this.id())?.subscribe();
    });
  }

  openCreateCategoryForm(): void {
    this.bottomSheet.open<CreateCategoryForm, CreateCategoryFormData>(CreateCategoryForm, {
      data: {
        groupId: this.id(),
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
}
