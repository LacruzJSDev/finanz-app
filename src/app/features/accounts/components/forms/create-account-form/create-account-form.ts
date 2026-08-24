import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { eurosToCents } from '../../../../../shared/money/money';
import { AccountsService } from '../../../../../core/accounts/accounts.service';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { IconPicker } from '../../../../../shared/icons/icon-picker/icon-picker';
import { IconName } from '../../../../../shared/icons/icons';

export interface CreateAccountFormData {
  groupId: string;
}

@Component({
  selector: 'app-create-account-form',
  imports: [ReactiveFormsModule, IconPicker],
  templateUrl: 'create-account-form.html',
})
export class CreateAccountForm {
  private readonly fb = inject(FormBuilder);
  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    opening_balance: [0, [Validators.required]],
    icon: ['home' as IconName],
  });
  private readonly bottomSheetRef = inject(MatBottomSheetRef<CreateAccountForm>);
  private readonly data = inject<CreateAccountFormData>(MAT_BOTTOM_SHEET_DATA);

  protected readonly accountsService = inject(AccountsService);

  selectIcon(icon: IconName): void {
    this.form.controls.icon.setValue(icon);
  }

  submit() {
    if (this.form.invalid) return;
    const raw = this.form.getRawValue();

    this.accountsService
      .createAccount(this.data.groupId, {
        name: raw.name,
        opening_balance: eurosToCents(raw.opening_balance),
        icon: raw.icon,
      })
      ?.subscribe(() => {
        this.form.reset();
        this.bottomSheetRef.dismiss();
      });
  }
}
