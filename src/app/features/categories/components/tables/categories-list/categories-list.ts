import { Component, computed, input, output } from '@angular/core';
import { CategoryRead } from '../../../../../api';

@Component({
  selector: 'app-categories-list',
  imports: [],
  templateUrl: './categories-list.html',
})
export class CategoriesList {
  readonly categories = input.required<CategoryRead[]>();
  readonly rowClick = output<CategoryRead>();

  protected readonly rootCategories = computed(() =>
    this.categories().filter((c) => c.parent_id === null),
  );

  childrenOf(parentId: string): CategoryRead[] {
    return this.categories().filter((c) => c.parent_id === parentId);
  }
}
