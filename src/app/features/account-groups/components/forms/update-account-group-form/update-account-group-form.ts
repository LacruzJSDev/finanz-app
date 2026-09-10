import { AppButton } from '../../../../../shared/ui/button';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { APP_SHEET_DATA, AppSheetRef } from '../../../../../shared/ui/app-sheet';
import { AppLoader } from '../../../../../shared/ui/loader';
import { AppInputGroup } from '../../../../../shared/ui/input-group';
import { AppTextInput } from '../../../../../shared/ui/text-input';
import { AppSwitch } from '../../../../../shared/ui/switch';
import { AccountGroupsService } from '../../../../../core/account-groups/account-groups.service';
import { GroupContextService } from '../../../../../core/ui/group-context.service';
import { GroupRead, UpdateGroupRequest } from '../../../../../core/models';
import { IconPicker } from '../../../../../shared/icons/icon-picker/icon-picker';
import { IconName } from '../../../../../shared/icons/icons';
import { ColorPicker } from '../../../../../shared/colors/color-picker/color-picker';
import { AVAILABLE_COLORS, ColorName } from '../../../../../shared/colors/colors';
import { applyServerErrors } from '../../../../../core/forms/apply-server-errors';

export interface UpdateAccountGroupFormData {
  accountGroup: GroupRead;
}

@Component({
  selector: 'app-update-account-group-form',
  imports: [
    ReactiveFormsModule,
    IconPicker,
    ColorPicker,
    AppButton,
    AppInputGroup,
    AppTextInput,
    AppSwitch,
    AppLoader,
  ],
  templateUrl: 'update-account-group-form.html',
  host: { class: 'bottom-sheet-form' },
})
export class UpdateAccountGroupForm {
  private readonly fb = inject(FormBuilder);
  private readonly sheetRef = inject(AppSheetRef<UpdateAccountGroupForm>);
  protected readonly data = inject<UpdateAccountGroupFormData>(APP_SHEET_DATA);
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
    this.sheetRef.disableClose = true;
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
        this.sheetRef.dismiss();
      },
      error: (error: unknown) => {
        this.submitting.set(false);
        this.sheetRef.disableClose = false;
        this.formError.set(applyServerErrors(this.form, error));
      },
    });
  }
}
