import { booleanAttribute, Component, computed, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CategoryRead } from '../../../../core/models';
import { AppSelect, AppSelectOption } from '../../../../shared/ui/select';

/** Selector de categorías con la misma marca de color e icono en valor y opciones. */
@Component({
  selector: 'app-category-select',
  imports: [ReactiveFormsModule, AppSelect],
  templateUrl: './category-select.html',
  styleUrl: './category-select.scss',
})
export class CategorySelect {
  readonly categories = input.required<readonly CategoryRead[]>();
  readonly control = input.required<FormControl<string>>();
  readonly label = input('Categoría');
  readonly emptyLabel = input('Sin categoría');
  readonly allowEmpty = input(true, { transform: booleanAttribute });
  readonly placeholder = input('Elige una categoría');

  protected readonly options = computed<readonly AppSelectOption[]>(() => {
    const emptyOption: AppSelectOption[] = this.allowEmpty()
      ? [
          {
            value: '',
            label: this.emptyLabel(),
            icon: 'block',
            // ColorIcon uses this same semantic token when a movement has no category.
            color: 'var(--app-color-muted)',
            muted: true,
          },
        ]
      : [];

    return [
      ...emptyOption,
      ...this.hierarchicalCategories().map(({ category, depth }) => ({
        value: category.id,
        label: category.name,
        icon: category.icon ?? undefined,
        color: category.color ?? undefined,
        depth,
      })),
    ];
  });

  private readonly hierarchicalCategories = computed(() => {
    const categories = this.categories();
    const childrenByParent = new Map<string, CategoryRead[]>();

    for (const category of categories) {
      if (!category.parent_id) continue;
      const children = childrenByParent.get(category.parent_id) ?? [];
      children.push(category);
      childrenByParent.set(category.parent_id, children);
    }

    const roots = categories.filter((category) => !category.parent_id);
    const ordered = roots.flatMap((parent) => [
      { category: parent, depth: 0 },
      ...(childrenByParent.get(parent.id) ?? []).map((child) => ({ category: child, depth: 1 })),
    ]);
    const rootIds = new Set(roots.map((category) => category.id));
    const visibleIds = new Set(ordered.map(({ category }) => category.id));

    // Keep malformed/orphaned API data selectable instead of silently omitting it.
    return [
      ...ordered,
      ...categories
        .filter((category) => !rootIds.has(category.id) && !visibleIds.has(category.id))
        .map((category) => ({ category, depth: 0 })),
    ];
  });
}
