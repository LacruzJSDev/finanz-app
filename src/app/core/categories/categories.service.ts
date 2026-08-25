import { Injectable, inject, signal } from '@angular/core';
import { tap } from 'rxjs';
import {
  CategoriesService as CategoryApi,
  CategoryRead,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '../../api';

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  private readonly api = inject(CategoryApi);

  private readonly categoriesSignal = signal<CategoryRead[]>([]);
  readonly categories = this.categoriesSignal.asReadonly();
  private readonly categorySignal = signal<CategoryRead | null>(null);
  readonly category = this.categorySignal.asReadonly();

  getCategories(groupId: string) {
    return this.api.getCategoriesApiV1CategoriesGet(groupId).pipe(
      tap((res) => {
        this.categoriesSignal.set(res.items);
      }),
    );
  }

  createCategory(groupId: string, payload: CreateCategoryRequest) {
    return this.api.createCategoryApiV1CategoriesPost(groupId, payload).pipe(
      tap((category) => {
        this.categoriesSignal.update((categories) => [...categories, category]);
      }),
    );
  }

  updateCategory(categoryId: string, payload: UpdateCategoryRequest) {
    return this.api.updateCategoryApiV1CategoriesCategoryIdPatch(categoryId, payload).pipe(
      tap((category) => {
        this.categoriesSignal.update((categories) => {
          return categories.map((a) => (a.id === category.id ? category : a));
        });
      }),
    );
  }

  getCategoryById(categoryId: string) {
    return this.api.getCategoryApiV1CategoriesCategoryIdGet(categoryId).pipe(
      tap((category) => {
        this.categoriesSignal.update((categories) => {
          return categories.map((a) => (a.id === category.id ? category : a));
        });
        this.categorySignal.set(category);
      }),
    );
  }
}
