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
import { canManageGroupData } from '../../../../core/account-groups/permissions';
import { Router } from '@angular/router';
import { PageContent } from '../../../../shared/ui/page-content/page-content';
import { PageLoader } from '../../../../shared/ui/page-loader/page-loader';
import { EmptyState } from '../../../../shared/ui/empty-state/empty-state';
import { StarterCategories } from '../../components/starter-categories/starter-categories';
import { pendingStarterCategories } from '../../starter-categories';

/** Las archivadas se listan aparte para no estorbar en el uso diario. */
type CategoryFilter = 'active' | 'archived';

@Component({
  selector: 'app-categories',
  imports: [
    CategoriesList,
    MatButtonToggleModule,
    PageContent,
    PageLoader,
    EmptyState,
    StarterCategories,
  ],
  templateUrl: './categories.html',
  styleUrl: './categories.scss',
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

  protected readonly creatingStarters = signal(false);

  // Mismo corte que en cuentas: gestionarlas exige owner o admin, consultarlas
  // está abierto a cualquier rol.
  protected readonly canManage = computed(() =>
    canManageGroupData(this.groupContextService.activeRole()),
  );

  // Sobre la lista entera, archivadas incluidas: una «Vivienda» archivada
  // sigue siendo la misma categoría, y volver a crearla la duplicaría.
  protected readonly pendingStarters = computed(() => pendingStarterCategories(this.categories()));

  // Solo en las activas: las sugeridas nacen activas, y ofrecerlas desde la
  // lista de archivadas sería crear en un sitio lo que no se ve en él. Y solo
  // mientras quede algo por crear, con lo que el botón desaparece solo en
  // cuanto el paquete está puesto; en marcha se queda para no dejar el spinner
  // a medias cuando la última raíz ya está creada.
  protected readonly canOfferStarters = computed(
    () =>
      this.canManage() &&
      this.filter() === 'active' &&
      (this.creatingStarters() || this.pendingStarters().length > 0),
  );

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
    effect(() => {
      this.pageContextService.setAction(
        this.canManage() ? { onClick: () => this.openCreateCategoryForm(), icon: 'add' } : null,
      );
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

  createStarterCategories(): void {
    const groupId = this.activeGroupId();
    // Solo las que faltan, así que repetir la operación tras un fallo a medias
    // termina el paquete en vez de duplicar lo que ya se creó.
    const pending = this.pendingStarters();
    if (!groupId || !pending.length || this.creatingStarters()) return;

    this.creatingStarters.set(true);
    this.categoriesService.createCategoriesFromTemplates(groupId, pending).subscribe({
      // Del fallo ya avisa el interceptor; aquí solo queda soltar el botón,
      // con lo que se haya creado hasta ese punto ya en la lista.
      error: () => this.creatingStarters.set(false),
      complete: () => this.creatingStarters.set(false),
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
