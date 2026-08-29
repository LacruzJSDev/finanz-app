import { Component, computed, input, output } from '@angular/core';
import { CategoryRead } from '../../../../../core/models';
import { CategoryCard } from '../../category-card/category-card';

@Component({
  selector: 'app-categories-list',
  imports: [CategoryCard],
  templateUrl: './categories-list.html',
  styleUrl: 'categories-list.scss',
})
export class CategoriesList {
  /** Ya filtradas por la página (activas o archivadas). */
  readonly categories = input.required<CategoryRead[]>();

  /** Categorías que no se pueden archivar ni desarchivar ahora mismo. */
  readonly blockedIds = input<ReadonlySet<string>>(new Set());

  /** Si quien mira puede gestionar categorías, o solo verlas. */
  readonly canManage = input(false);

  readonly editClick = output<CategoryRead>();
  readonly toggleActive = output<CategoryRead>();

  // Van al primer nivel las raíces y también las hijas cuyo padre no está en
  // este filtro: si no, una subcategoría archivada con el padre activo no se
  // vería en ninguna de las dos listas.
  protected readonly topLevel = computed(() => {
    const visible = this.categories();
    const visibleIds = new Set(visible.map((c) => c.id));
    return visible.filter((c) => c.parent_id === null || !visibleIds.has(c.parent_id));
  });

  childrenOf(parentId: string): CategoryRead[] {
    return this.categories().filter((c) => c.parent_id === parentId);
  }
}
