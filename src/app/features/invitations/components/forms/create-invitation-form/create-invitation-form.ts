import { AppButton } from '../../../../../shared/ui/button';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { APP_SHEET_DATA, AppSheetRef } from '../../../../../shared/ui/app-sheet';
import { AppInputGroup } from '../../../../../shared/ui/input-group';
import { AppSelect, AppSelectOption } from '../../../../../shared/ui/select';
import { AppIcon } from '../../../../../shared/ui/icon';
import { AppLoader } from '../../../../../shared/ui/loader';
import { InvitationsService } from '../../../../../core/invitations/invitations.service';
import { AccountGroupMemberRoleEnum } from '../../../../../core/models';
import { applyServerErrors } from '../../../../../core/forms/apply-server-errors';
import { MemberRoleLabelPipe } from '../../../../group-members';

export interface CreateInvitationFormData {
  groupId: string;
}

@Component({
  selector: 'app-create-invitation-form',
  imports: [ReactiveFormsModule, AppInputGroup, AppSelect, AppButton, AppIcon, AppLoader],
  templateUrl: './create-invitation-form.html',
  styleUrl: './create-invitation-form.scss',
  host: { class: 'bottom-sheet-form' },
})
export class CreateInvitationForm {
  private readonly fb = inject(FormBuilder);
  private readonly invitationsService = inject(InvitationsService);
  private readonly sheetRef = inject(AppSheetRef<CreateInvitationForm>);
  protected readonly data = inject<CreateInvitationFormData>(APP_SHEET_DATA);

  protected readonly submitting = signal(false);
  protected readonly formError = signal<string | null>(null);

  /** El código que ha salido. Mientras es null, el sheet es el formulario. */
  protected readonly code = signal<string | null>(null);
  protected readonly copied = signal(false);

  protected readonly roles = Object.values(AccountGroupMemberRoleEnum);
  protected readonly roleOptions: readonly AppSelectOption[] = this.roles.map((role) => ({
    value: role,
    label: new MemberRoleLabelPipe().transform(role),
  }));

  readonly form = this.fb.nonNullable.group({
    role: [AccountGroupMemberRoleEnum.Member as AccountGroupMemberRoleEnum, [Validators.required]],
  });

  submit(): void {
    if (this.form.invalid || this.submitting()) return;
    this.submitting.set(true);
    this.formError.set(null);
    this.sheetRef.disableClose = true;

    this.invitationsService.createInvitation(this.data.groupId, this.form.getRawValue()).subscribe({
      // No se cierra al terminar: el código es lo único que sirve para invitar
      // a alguien, y cerrar el sheet sin enseñarlo dejaría al usuario con una
      // invitación creada y nada que compartir.
      next: (invitation) => {
        this.submitting.set(false);
        this.sheetRef.disableClose = false;
        this.code.set(invitation.code);
      },
      error: (error: unknown) => {
        this.submitting.set(false);
        this.sheetRef.disableClose = false;
        this.formError.set(applyServerErrors(this.form, error));
      },
    });
  }

  async copy(): Promise<void> {
    const code = this.code();
    if (!code) return;
    await navigator.clipboard.writeText(code);
    this.copied.set(true);
  }

  close(): void {
    this.sheetRef.dismiss();
  }
}
