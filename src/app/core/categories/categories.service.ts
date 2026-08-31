import { Injectable, inject, signal } from '@angular/core';
import { concat, concatMap, finalize, forkJoin, ignoreElements, tap } from 'rxjs';
import {
  CategoriesService as CategoryApi,
  CategoryRead,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '../../api';
import { LatestRequest } from '../http/latest-request';

/**
 * Una categoría a crear junto con sus subcategorías. El color no se repite en
 * las hijas: lo heredan de la madre, que es lo que hace que en la lista se vea
 * de un vistazo qué va con qué.
 */
export interface CategoryTemplate {
  name: string;
  color: string;
  icon: string;
  children: readonly { name: string; icon: string }[];
}

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

  /**
   * Alta en bloque a partir de plantillas. El servidor las crea de una en una
   * y las hijas necesitan el id de su madre, así que va por tandas: cada raíz
   * espera a la anterior —para que el orden acabe siendo el de la plantilla— y
   * sus hijas salen todas juntas.
   *
   * Cada alta va actualizando la señal por su cuenta, así que la lista se llena
   * a la vista mientras dura. Si una falla, las anteriores se quedan hechas:
   * son categorías normales y corrientes que se pueden editar o archivar.
   */
  createCategoriesFromTemplates(groupId: string, templates: readonly CategoryTemplate[]) {
    return concat(
      ...templates.map((template) =>
        this.createCategory(groupId, {
          name: template.name,
          color: template.color,
          icon: template.icon,
        }).pipe(
          concatMap((parent) =>
            forkJoin(
              template.children.map((child) =>
                this.createCategory(groupId, {
                  name: child.name,
                  icon: child.icon,
                  color: template.color,
                  parent_id: parent.id,
                }),
              ),
            ),
          ),
        ),
      ),
    ).pipe(ignoreElements());
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
