import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountGroupsService } from '../../../../../core/account-groups/account-groups.service';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { IconPicker } from '../../../../../shared/icons/icon-picker/icon-picker';
import { IconName } from '../../../../../shared/icons/icons';

@Component({
  selector: 'app-create-account-group-form',
  imports: [ReactiveFormsModule, IconPicker],
  templateUrl: 'create-account-group-form.html',
})
export class CreateAccountGroupForm {
  private readonly fb = inject(FormBuilder);
  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    icon: ['home' as IconName],
  });
  private readonly bottomSheetRef = inject(MatBottomSheetRef<CreateAccountGroupForm>);

  protected readonly accountGroupsService = inject(AccountGroupsService);

  selectIcon(icon: IconName): void {
    this.form.controls.icon.setValue(icon);
  }

  createGroupForm() {
    if (this.form.invalid) return;
    const raw = this.form.getRawValue();
    this.accountGroupsService.createAccountGroup(raw)?.subscribe(() => {
      this.form.reset();
      this.bottomSheetRef.dismiss();
    });
  }
}
