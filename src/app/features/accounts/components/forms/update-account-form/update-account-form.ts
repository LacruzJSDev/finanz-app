import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountsService } from '../../../../../core/accounts/accounts.service';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AccountRead, AccountTypeEnum } from '../../../../../core/models';
import { IconPicker } from '../../../../../shared/icons/icon-picker/icon-picker';
import { IconName } from '../../../../../shared/icons/icons';
import { ColorPicker } from '../../../../../shared/colors/color-picker/color-picker';
import { AVAILABLE_COLORS, ColorName } from '../../../../../shared/colors/colors';
import { AccountTypeLabelPipe } from '../../../pipes/account-type-label.pipe';
import { applyServerErrors } from '../../../../../core/forms/apply-server-errors';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

export interface UpdateAccountFormData {
  account: AccountRead;
}

@Component({
  selector: 'app-update-account-form',
  imports: [
    ReactiveFormsModule,
    IconPicker,
    ColorPicker,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    AccountTypeLabelPipe,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
  ],
  templateUrl: 'update-account-form.html',
  host: { class: 'bottom-sheet-form' },
})
export class UpdateAccountForm {
  private readonly fb = inject(FormBuilder);
  private readonly bottomSheetRef = inject(MatBottomSheetRef<UpdateAccountForm>);
  private readonly data = inject<UpdateAccountFormData>(MAT_BOTTOM_SHEET_DATA);
  protected readonly accountTypes = Object.values(AccountTypeEnum);

  readonly form = this.fb.nonNullable.group({
    name: [this.data.account.name, [Validators.required]],
    type: [this.data.account.type],
    color: [(this.data.account.color ?? AVAILABLE_COLORS[0]) as ColorName],
    icon: [(this.data.account.icon ?? 'home') as IconName],
    is_active: [this.data.account.is_active],
  });

  protected readonly accountsService = inject(AccountsService);

  protected readonly submitting = signal(false);
  protected readonly formError = signal<string | null>(null);

  selectIcon(icon: IconName): void {
    this.form.controls.icon.setValue(icon);
  }

  selectColor(color: ColorName): void {
    this.form.controls.color.setValue(color);
  }

  submit() {
    if (this.form.invalid || this.submitting()) return;
    this.submitting.set(true);
    this.formError.set(null);
    this.bottomSheetRef.disableClose = true;

    this.accountsService.updateAccount(this.data.account.id, this.form.getRawValue()).subscribe({
      next: () => this.bottomSheetRef.dismiss(),
      error: (error: unknown) => {
        this.submitting.set(false);
        this.bottomSheetRef.disableClose = false;
        this.formError.set(applyServerErrors(this.form, error));
      },
    });
  }
}
