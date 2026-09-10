import { Component, computed, input } from '@angular/core';
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

  protected readonly options = computed<readonly AppSelectOption[]>(() => [
    { value: '', label: this.emptyLabel() },
    ...this.categories().map((category) => ({
      value: category.id,
      label: category.name,
      icon: category.icon ?? undefined,
      color: category.color ?? undefined,
    })),
  ]);

}
