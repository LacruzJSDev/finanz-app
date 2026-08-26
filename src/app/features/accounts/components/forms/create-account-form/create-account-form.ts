import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { eurosToCents } from '../../../../../shared/money/money';
import { AccountsService } from '../../../../../core/accounts/accounts.service';
import { AccountTypeEnum } from '../../../../../api';
import { IconPicker } from '../../../../../shared/icons/icon-picker/icon-picker';
import { IconName } from '../../../../../shared/icons/icons';
import { ColorPicker } from '../../../../../shared/colors/color-picker/color-picker';
import { AVAILABLE_COLORS, ColorName } from '../../../../../shared/colors/colors';
import { AccountTypeLabelPipe } from '../../../pipes/account-type-label.pipe';

export interface CreateAccountFormData {
  groupId: string;
}

@Component({
  selector: 'app-create-account-form',
  imports: [
    ReactiveFormsModule,
    IconPicker,
    ColorPicker,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    AccountTypeLabelPipe,
  ],
  templateUrl: 'create-account-form.html',
  host: { class: 'bottom-sheet-form' },
})
export class CreateAccountForm {
  private readonly fb = inject(FormBuilder);
  protected readonly accountTypes = Object.values(AccountTypeEnum);

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    type: [AccountTypeEnum.Bank as AccountTypeEnum],
    opening_balance: [0, [Validators.required]],
    currency: ['EUR', [Validators.required, Validators.maxLength(3)]],
    color: [AVAILABLE_COLORS[0] as ColorName],
    icon: ['home' as IconName],
  });
  private readonly bottomSheetRef = inject(MatBottomSheetRef<CreateAccountForm>);
  private readonly data = inject<CreateAccountFormData>(MAT_BOTTOM_SHEET_DATA);

  protected readonly accountsService = inject(AccountsService);

  selectIcon(icon: IconName): void {
    this.form.controls.icon.setValue(icon);
  }

  selectColor(color: ColorName): void {
    this.form.controls.color.setValue(color);
  }

  submit() {
    if (this.form.invalid) return;
    const raw = this.form.getRawValue();

    this.accountsService
      .createAccount(this.data.groupId, {
        name: raw.name,
        type: raw.type,
        opening_balance: eurosToCents(raw.opening_balance),
        currency: raw.currency,
        color: raw.color,
        icon: raw.icon,
      })
      .subscribe(() => {
        this.form.reset();
        this.bottomSheetRef.dismiss();
      });
  }
}
