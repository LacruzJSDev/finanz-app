import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatIconModule } from '@angular/material/icon';
import { CategoriesService } from '../../../../core/categories/categories.service';
import { CategoryRead } from '../../../../core/models';
import { CategoriesList } from '../../components/tables/categories-list/categories-list';
import {
  UpdateCategoryForm,
  UpdateCategoryFormData,
} from '../../components/forms/update-category-form/update-category-form';
import { AccountGroupsService } from '../../../../core/account-groups/account-groups.service';
import { AuthService } from '../../../../core/auth/auth.service';
import { canManageGroupData, roleInGroup } from '../../../../core/account-groups/permissions';
import { PageContent } from '../../../../shared/ui/page-content/page-content';
import { PageLoader } from '../../../../shared/ui/page-loader/page-loader';
import { EmptyState } from '../../../../shared/ui/empty-state/empty-state';
import { StarterCategories } from '../../components/starter-categories/starter-categories';
import { pendingStarterCategories } from '../../starter-categories';

@Component({
  selector: 'app-categories',
  imports: [CategoriesList, MatIconModule, PageContent, PageLoader, EmptyState, StarterCategories],
  templateUrl: './categories.html',
  styleUrl: './categories.scss',
  host: { class: 'page-section' },
})
export class Categories {
  private readonly bottomSheet = inject(MatBottomSheet);
  protected readonly categoriesService = inject(CategoriesService);
  private readonly accountGroupsService = inject(AccountGroupsService);
  private readonly authService = inject(AuthService);

  protected readonly loading = this.categoriesService.loading;
  /** El id lo hereda del detalle del grupo, que puede no ser el de trabajo. */
  readonly id = input.required<string>();

  protected readonly categories = this.categoriesService.categories;

  protected readonly creatingStarters = signal(false);

  protected readonly showArchived = signal(false);

  // Mismo corte que en cuentas: gestionarlas exige owner o admin, consultarlas
  // está abierto a cualquier rol.
  protected readonly canManage = computed(() =>
    canManageGroupData(
      roleInGroup(
        this.accountGroupsService.groups().find((group) => group.id === this.id()),
        this.authService.currentUser()?.id,
      ),
    ),
  );

  // Sobre la lista entera, archivadas incluidas: una «Vivienda» archivada
  // sigue siendo la misma categoría, y volver a crearla la duplicaría.
  protected readonly pendingStarters = computed(() => pendingStarterCategories(this.categories()));

  // Las sugeridas nacen activas. Solo se ofrecen mientras quede alguna, con lo
  // que el botón desaparece en cuanto el paquete está completo; durante el
  // alta se mantiene para que el spinner no desaparezca a mitad de operación.
  protected readonly canOfferStarters = computed(
    () => this.canManage() && (this.creatingStarters() || this.pendingStarters().length > 0),
  );

  protected readonly activeCategories = computed(() =>
    this.categories().filter((category) => category.is_active),
  );

  protected readonly archivedCategories = computed(() =>
    this.categories().filter((category) => !category.is_active),
  );

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
      this.categoriesService.getCategories(this.id()).subscribe();
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
    const groupId = this.id();
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
