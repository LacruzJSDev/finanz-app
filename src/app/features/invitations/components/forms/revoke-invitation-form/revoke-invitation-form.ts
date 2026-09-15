import { AppButton } from '../../../../../shared/ui/button';
import { Component, inject, signal } from '@angular/core';
import { APP_SHEET_DATA, AppSheetRef } from '../../../../../shared/ui/app-sheet';
import { AppLoader } from '../../../../../shared/ui/loader';
import { InvitationsService } from '../../../../../core/invitations/invitations.service';
import { InvitationRead } from '../../../../../core/models';

export interface RevokeInvitationFormData {
  groupId: string;
  invitation: InvitationRead;
}

@Component({
  selector: 'app-revoke-invitation-form',
  imports: [AppButton, AppLoader],
  templateUrl: './revoke-invitation-form.html',
  styleUrl: './revoke-invitation-form.scss',
  host: { class: 'bottom-sheet-form' },
})
export class RevokeInvitationForm {
  private readonly sheetRef = inject(AppSheetRef<RevokeInvitationForm>);
  private readonly invitationsService = inject(InvitationsService);
  protected readonly data = inject<RevokeInvitationFormData>(APP_SHEET_DATA);

  protected readonly submitting = signal(false);

  submit(): void {
    if (this.submitting()) return;
    this.submitting.set(true);
    this.sheetRef.disableClose = true;

    this.invitationsService.revokeInvitation(this.data.groupId, this.data.invitation.id).subscribe({
      next: () => this.sheetRef.dismiss(),
      error: () => {
        this.submitting.set(false);
        this.sheetRef.disableClose = false;
      },
    });
  }

  cancel(): void {
    this.sheetRef.dismiss();
  }
}
