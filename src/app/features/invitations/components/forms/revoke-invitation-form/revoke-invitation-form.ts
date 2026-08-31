import { Component, inject, signal } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { InvitationsService } from '../../../../../core/invitations/invitations.service';
import { InvitationRead } from '../../../../../core/models';

export interface RevokeInvitationFormData {
  groupId: string;
  invitation: InvitationRead;
}

@Component({
  selector: 'app-revoke-invitation-form',
  imports: [MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './revoke-invitation-form.html',
  styleUrl: './revoke-invitation-form.scss',
  host: { class: 'bottom-sheet-form' },
})
export class RevokeInvitationForm {
  private readonly bottomSheetRef = inject(MatBottomSheetRef<RevokeInvitationForm>);
  private readonly invitationsService = inject(InvitationsService);
  protected readonly data = inject<RevokeInvitationFormData>(MAT_BOTTOM_SHEET_DATA);

  protected readonly submitting = signal(false);

  submit(): void {
    if (this.submitting()) return;
    this.submitting.set(true);
    this.bottomSheetRef.disableClose = true;

    this.invitationsService.revokeInvitation(this.data.groupId, this.data.invitation.id).subscribe({
      next: () => this.bottomSheetRef.dismiss(),
      error: () => {
        this.submitting.set(false);
        this.bottomSheetRef.disableClose = false;
      },
    });
  }

  cancel(): void {
    this.bottomSheetRef.dismiss();
  }
}
