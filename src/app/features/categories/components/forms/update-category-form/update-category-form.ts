import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { CategoriesService } from '../../../../../core/categories/categories.service';
import { CategoryRead, UpdateCategoryRequest } from '../../../../../api';
import { IconPicker } from '../../../../../shared/icons/icon-picker/icon-picker';
import { IconName } from '../../../../../shared/icons/icons';

export interface UpdateCategoryFormData {
  category: CategoryRead;
  rootCategories: CategoryRead[]; // posibles padres, ya sin incluir la propia categoría
  hasChildren: boolean; // si tiene subcategorías propias, no puede pasar a tener padre (máx. 2 niveles)
}

@Component({
  selector: 'app-update-category-form',
  imports: [ReactiveFormsModule, IconPicker],
  templateUrl: './update-category-form.html',
})
export class UpdateCategoryForm {
  private readonly fb = inject(FormBuilder);
  private readonly categoriesService = inject(CategoriesService);
  private readonly bottomSheetRef = inject(MatBottomSheetRef<UpdateCategoryForm>);
  protected readonly data = inject<UpdateCategoryFormData>(MAT_BOTTOM_SHEET_DATA);

  readonly form = this.fb.nonNullable.group({
    name: [this.data.category.name, [Validators.required]],
    parent_id: [this.data.category.parent_id ?? ''],
    color: [this.data.category.color ?? '#000000'],
    icon: [(this.data.category.icon ?? 'home') as IconName],
    is_active: [this.data.category.is_active, [Validators.required]],
  });

  selectIcon(icon: IconName): void {
    this.form.controls.icon.setValue(icon);
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
