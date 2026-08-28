import { Injectable, inject, signal } from '@angular/core';
import { finalize, tap } from 'rxjs';
import {
  CategoriesService as CategoryApi,
  CategoryRead,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '../../api';
import { LatestRequest } from '../http/latest-request';

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  private readonly api = inject(CategoryApi);

  private readonly categoriesSignal = signal<CategoryRead[]>([]);
  readonly categories = this.categoriesSignal.asReadonly();
  private readonly categorySignal = signal<CategoryRead | null>(null);
  readonly category = this.categorySignal.asReadonly();
  private readonly loadingSignal = signal(false);
  readonly loading = this.loadingSignal.asReadonly();

  private readonly categoriesRequest = new LatestRequest();

  getCategories(groupId: string) {
    const token = this.categoriesRequest.next();
    this.loadingSignal.set(true);
    return this.api.getCategoriesApiV1CategoriesGet(groupId).pipe(
      tap((res) => {
        if (!this.categoriesRequest.isCurrent(token)) return;
        this.categoriesSignal.set(res.items);
      }),
      finalize(() => {
        if (this.categoriesRequest.isCurrent(token)) this.loadingSignal.set(false);
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
