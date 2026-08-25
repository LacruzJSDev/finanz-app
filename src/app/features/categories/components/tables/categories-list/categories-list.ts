import { Component, computed, input, output } from '@angular/core';
import { CategoryRead } from '../../../../../api';
import { CategoryCard } from '../../category-card/category-card';

@Component({
  selector: 'app-categories-list',
  imports: [CategoryCard],
  templateUrl: './categories-list.html',
  styleUrl: 'categories-list.scss',
})
export class CategoriesList {
  readonly categories = input.required<CategoryRead[]>();
  readonly editClick = output<CategoryRead>();
  readonly archiveClick = output<CategoryRead>();

  protected readonly rootCategories = computed(() =>
    this.categories().filter((c) => c.parent_id === null),
  );

  childrenOf(parentId: string): CategoryRead[] {
    return this.categories().filter((c) => c.parent_id === parentId);
  }
}
