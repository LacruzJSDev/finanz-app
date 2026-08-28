import { Component, computed, input, output, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { CategoryRead } from '../../../../core/models';
import { ColorIcon } from '../../../../shared/ui/color-icon/color-icon';

@Component({
  selector: 'app-category-card',
  imports: [MatIconModule, MatButtonModule, MatSlideToggleModule, MatExpansionModule, ColorIcon],
  templateUrl: 'category-card.html',
  styleUrl: 'category-card.scss',
})
export class CategoryCard {
  readonly category = input.required<CategoryRead>();
  readonly children = input<CategoryRead[]>([]);

  /** Categorías que no se pueden archivar ni desarchivar ahora mismo. */
  readonly blockedIds = input<ReadonlySet<string>>(new Set());

  protected readonly hasChildren = computed(() => this.children().length > 0);

  private readonly openedByUser = signal(false);

  // Si al archivar la última subcategoría se quedara desplegado, el panel pasa
  // a `disabled` estando abierto: sin nada dentro y sin poder plegarlo.
  protected readonly expanded = computed(() => this.hasChildren() && this.openedByUser());

  protected isBlocked(category: CategoryRead): boolean {
    return this.blockedIds().has(category.id);
  }

  protected onExpandedChange(isExpanded: boolean): void {
    this.openedByUser.set(isExpanded);
  }

  /** Aparece suelta en vez de anidada bajo su padre, así que hay que decir qué es. */
  protected readonly isSubcategory = computed(() => this.category().parent_id !== null);

  readonly editClick = output<CategoryRead>();
  readonly toggleActive = output<CategoryRead>();
}
