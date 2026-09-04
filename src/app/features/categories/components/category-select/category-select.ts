import { Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CategoryRead } from '../../../../core/models';
import { ColorIcon } from '../../../../shared/ui/color-icon/color-icon';

/** Selector de categorías con la misma marca de color e icono en valor y opciones. */
@Component({
  selector: 'app-category-select',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatSelectModule, ColorIcon],
  templateUrl: './category-select.html',
  styleUrl: './category-select.scss',
})
export class CategorySelect {
  readonly categories = input.required<readonly CategoryRead[]>();
  readonly control = input.required<FormControl<string>>();
  readonly label = input('Categoría');
  readonly emptyLabel = input('Sin categoría');

  protected selectedCategory(): CategoryRead | undefined {
    return this.categories().find((category) => category.id === this.control().value);
  }
}
