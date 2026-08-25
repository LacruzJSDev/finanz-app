import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CategoriesService } from '../../../../../core/categories/categories.service';
import { CategoryRead, CreateCategoryRequest } from '../../../../../api';
import { IconPicker } from '../../../../../shared/icons/icon-picker/icon-picker';
import { IconName } from '../../../../../shared/icons/icons';
import { ColorPicker } from '../../../../../shared/colors/color-picker/color-picker';
import { AVAILABLE_COLORS, ColorName } from '../../../../../shared/colors/colors';

export interface CreateCategoryFormData {
  groupId: string;
  rootCategories: CategoryRead[]; // posibles padres: solo categorías raíz, el backend rechaza anidar más de un nivel
}

@Component({
  selector: 'app-create-category-form',
  imports: [
    ReactiveFormsModule,
    IconPicker,
    ColorPicker,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './create-category-form.html',
  host: { class: 'bottom-sheet-form' },
})
export class CreateCategoryForm {
  private readonly fb = inject(FormBuilder);
  private readonly categoriesService = inject(CategoriesService);
  private readonly bottomSheetRef = inject(MatBottomSheetRef<CreateCategoryForm>);
  protected readonly data = inject<CreateCategoryFormData>(MAT_BOTTOM_SHEET_DATA);

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    parent_id: [''],
    color: [AVAILABLE_COLORS[0] as ColorName],
    icon: ['home' as IconName],
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

    const payload: CreateCategoryRequest = {
      name: raw.name,
      parent_id: raw.parent_id || undefined, // '' (raíz) -> no se manda, nunca un uuid vacío
      color: raw.color,
      icon: raw.icon,
    };

    this.categoriesService.createCategory(this.data.groupId, payload).subscribe(() => {
      this.bottomSheetRef.dismiss();
    });
  }
}
