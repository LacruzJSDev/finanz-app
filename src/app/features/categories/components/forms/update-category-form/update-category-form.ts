import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CategoriesService } from '../../../../../core/categories/categories.service';
import { CategoryRead, UpdateCategoryRequest } from '../../../../../api';
import { IconPicker } from '../../../../../shared/icons/icon-picker/icon-picker';
import { IconName } from '../../../../../shared/icons/icons';
import { ColorPicker } from '../../../../../shared/colors/color-picker/color-picker';
import { AVAILABLE_COLORS, ColorName } from '../../../../../shared/colors/colors';

export interface UpdateCategoryFormData {
  category: CategoryRead;
  rootCategories: CategoryRead[]; // posibles padres, ya sin incluir la propia categoría
  hasChildren: boolean; // si tiene subcategorías propias, no puede pasar a tener padre (máx. 2 niveles)
}

@Component({
  selector: 'app-update-category-form',
  imports: [
    ReactiveFormsModule,
    IconPicker,
    ColorPicker,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
  ],
  templateUrl: './update-category-form.html',
  host: { class: 'bottom-sheet-form' },
})
export class UpdateCategoryForm {
  private readonly fb = inject(FormBuilder);
  private readonly categoriesService = inject(CategoriesService);
  private readonly bottomSheetRef = inject(MatBottomSheetRef<UpdateCategoryForm>);
  protected readonly data = inject<UpdateCategoryFormData>(MAT_BOTTOM_SHEET_DATA);

  readonly form = this.fb.nonNullable.group({
    name: [this.data.category.name, [Validators.required]],
    parent_id: [this.data.category.parent_id ?? ''],
    color: [(this.data.category.color ?? AVAILABLE_COLORS[0]) as ColorName],
    icon: [(this.data.category.icon ?? 'home') as IconName],
    is_active: [this.data.category.is_active, [Validators.required]],
  });

  selectIcon(icon: IconName): void {
    this.form.controls.icon.setValue(icon);
  }

  selectColor(color: ColorName): void {
    this.form.controls.color.setValue(color);
  }

  submit(): void {
    if (this.form.invalid) return;
    const raw = this.form.getRawValue();

    const payload: UpdateCategoryRequest = {
      name: raw.name,
      // hasChildren fuerza null aunque el select esté oculto: una categoría con
      // subcategorías propias siempre tiene que quedarse como raíz.
      parent_id: this.data.hasChildren ? null : raw.parent_id || null,
      color: raw.color,
      icon: raw.icon,
      is_active: raw.is_active,
    };

    this.categoriesService.updateCategory(this.data.category.id, payload).subscribe(() => {
      this.bottomSheetRef.dismiss();
    });
  }
}
