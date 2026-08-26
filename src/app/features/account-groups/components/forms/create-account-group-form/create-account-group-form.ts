import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountGroupsService } from '../../../../../core/account-groups/account-groups.service';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { IconPicker } from '../../../../../shared/icons/icon-picker/icon-picker';
import { IconName } from '../../../../../shared/icons/icons';
import { ColorPicker } from '../../../../../shared/colors/color-picker/color-picker';
import { AVAILABLE_COLORS, ColorName } from '../../../../../shared/colors/colors';

@Component({
  selector: 'app-create-account-group-form',
  imports: [
    ReactiveFormsModule,
    IconPicker,
    ColorPicker,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: 'create-account-group-form.html',
  host: { class: 'bottom-sheet-form' },
})
export class CreateAccountGroupForm {
  private readonly fb = inject(FormBuilder);
  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    color: [AVAILABLE_COLORS[0] as ColorName],
    icon: ['home' as IconName],
  });
  private readonly bottomSheetRef = inject(MatBottomSheetRef<CreateAccountGroupForm>);

  protected readonly accountGroupsService = inject(AccountGroupsService);

  selectIcon(icon: IconName): void {
    this.form.controls.icon.setValue(icon);
  }

  selectColor(color: ColorName): void {
    this.form.controls.color.setValue(color);
  }

  createGroupForm() {
    if (this.form.invalid) return;
    const raw = this.form.getRawValue();
    this.accountGroupsService.createAccountGroup(raw).subscribe(() => {
      this.form.reset();
      this.bottomSheetRef.dismiss();
    });
  }
}
