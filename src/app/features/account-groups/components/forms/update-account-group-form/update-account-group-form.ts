import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AccountGroupsService } from '../../../../../core/account-groups/account-groups.service';
import { GroupContextService } from '../../../../../core/ui/group-context.service';
import { GroupRead, UpdateGroupRequest } from '../../../../../api';
import { IconPicker } from '../../../../../shared/icons/icon-picker/icon-picker';
import { IconName } from '../../../../../shared/icons/icons';
import { ColorPicker } from '../../../../../shared/colors/color-picker/color-picker';
import { AVAILABLE_COLORS, ColorName } from '../../../../../shared/colors/colors';
import { applyServerErrors } from '../../../../../shared/forms/apply-server-errors';

export interface UpdateAccountGroupFormData {
  accountGroup: GroupRead;
}

@Component({
  selector: 'app-update-account-group-form',
  imports: [
    ReactiveFormsModule,
    IconPicker,
    ColorPicker,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: 'update-account-group-form.html',
  host: { class: 'bottom-sheet-form' },
})
export class UpdateAccountGroupForm {
  private readonly fb = inject(FormBuilder);
  private readonly bottomSheetRef = inject(MatBottomSheetRef<UpdateAccountGroupForm>);
  protected readonly data = inject<UpdateAccountGroupFormData>(MAT_BOTTOM_SHEET_DATA);
  protected readonly accountGroupsService = inject(AccountGroupsService);
  private readonly groupContextService = inject(GroupContextService);

  protected readonly submitting = signal(false);
  protected readonly formError = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    name: [this.data.accountGroup.name, [Validators.required]],
    color: [(this.data.accountGroup.color ?? AVAILABLE_COLORS[0]) as ColorName],
    icon: [(this.data.accountGroup.icon ?? 'home') as IconName],
    is_active: [this.data.accountGroup.is_active],
  });

  selectIcon(icon: IconName): void {
    this.form.controls.icon.setValue(icon);
  }

  selectColor(color: ColorName): void {
    this.form.controls.color.setValue(color);
  }

  submit(): void {
    if (this.form.invalid || this.submitting()) return;
    this.submitting.set(true);
    this.formError.set(null);
    this.bottomSheetRef.disableClose = true;
    const raw = this.form.getRawValue();

    const payload: UpdateGroupRequest = {
      name: raw.name,
      color: raw.color,
      icon: raw.icon,
      is_active: raw.is_active,
    };

    this.accountGroupsService.updateAccountGroup(this.data.accountGroup.id, payload).subscribe({
      next: () => {
        const isWorkingGroup =
          this.groupContextService.activeGroupId() === this.data.accountGroup.id;
        if (!raw.is_active && isWorkingGroup) {
          this.groupContextService.setActiveGroupId(null);
        }
        this.bottomSheetRef.dismiss();
      },
      error: (error: unknown) => {
        this.submitting.set(false);
        this.bottomSheetRef.disableClose = false;
        this.formError.set(applyServerErrors(this.form, error));
      },
    });
  }
}
