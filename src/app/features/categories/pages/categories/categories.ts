import { Component, computed, effect, inject, signal } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { CategoriesService } from '../../../../core/categories/categories.service';
import { CategoryRead } from '../../../../core/models';
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
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

/** Las archivadas se listan aparte para no estorbar en el uso diario. */
type CategoryFilter = 'active' | 'archived';

@Component({
  selector: 'app-categories',
  imports: [CategoriesList, MatButtonToggleModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './categories.html',
  host: { class: 'page-container' },
})
export class Categories {
  private readonly bottomSheet = inject(MatBottomSheet);
  protected readonly categoriesService = inject(CategoriesService);

  protected readonly loading = this.categoriesService.loading;
  protected readonly pageContextService = inject(PageContextService);
  protected readonly groupContextService = inject(GroupContextService);
  protected readonly router = inject(Router);

  protected activeGroupId = this.groupContextService.activeGroupId;

  protected readonly categories = this.categoriesService.categories;

  protected readonly filter = signal<CategoryFilter>('active');

  protected readonly visibleCategories = computed(() => {
    const wantActive = this.filter() === 'active';
    return this.categories().filter((category) => category.is_active === wantActive);
  });

  // Categorías cuyo archivado/desarchivado dejaría el árbol incoherente. Se
  // decide aquí porque hace falta ver la lista entera, no solo la del filtro.
  protected readonly blockedIds = computed(() => {
    const all = this.categories();
    const blocked = new Set<string>();

    for (const category of all) {
      if (category.is_active) {
        // Archivar un padre dejaría subcategorías activas colgando.
        if (all.some((c) => c.parent_id === category.id && c.is_active)) {
          blocked.add(category.id);
        }
      } else if (category.parent_id) {
        // Desarchivar una subcategoría con el padre aún archivado.
        const parent = all.find((c) => c.id === category.parent_id);
        if (parent && !parent.is_active) {
          blocked.add(category.id);
        }
      }
    }

    return blocked;
  });

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

  toggleCategoryActive(category: CategoryRead): void {
    // El toggle ya sale deshabilitado en estos casos; esto cubre que la lista
    // haya cambiado entre el pintado y el clic.
    if (this.blockedIds().has(category.id)) return;

    this.categoriesService
      .updateCategory(category.id, { is_active: !category.is_active })
      .subscribe();
  }
}
