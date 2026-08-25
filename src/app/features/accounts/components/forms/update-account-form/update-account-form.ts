import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountsService } from '../../../../../core/accounts/accounts.service';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { AccountRead } from '../../../../../api';
import { IconPicker } from '../../../../../shared/icons/icon-picker/icon-picker';
import { IconName } from '../../../../../shared/icons/icons';

export interface UpdateAccountFormData {
  account: AccountRead;
}

@Component({
  selector: 'app-update-account-form',
  imports: [ReactiveFormsModule, IconPicker],
  templateUrl: 'update-account-form.html',
})
export class UpdateAccountForm {
  private readonly fb = inject(FormBuilder);
  private readonly bottomSheetRef = inject(MatBottomSheetRef<UpdateAccountForm>);
  private readonly data = inject<UpdateAccountFormData>(MAT_BOTTOM_SHEET_DATA);
  readonly form = this.fb.nonNullable.group({
    name: [this.data.account.name, [Validators.required]],
    is_active: [this.data.account.is_active, [Validators.required]],
    icon: [(this.data.account.icon ?? 'home') as IconName],
  });

  protected readonly accountsService = inject(AccountsService);

  selectIcon(icon: IconName): void {
    this.form.controls.icon.setValue(icon);
  }

  submit() {
    if (this.form.invalid) return;
    const raw = this.form.getRawValue();
    this.accountsService.updateAccount(this.data.account.id, raw).subscribe(() => {
      this.form.reset();
      this.bottomSheetRef.dismiss();
    });
  }
}
