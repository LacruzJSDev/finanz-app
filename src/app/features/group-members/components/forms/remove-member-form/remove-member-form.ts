import { Component, computed, inject, signal } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { GroupMembersService } from '../../../../../core/group-members/group-members.service';
import { GroupMemberRead } from '../../../../../core/models';

export interface RemoveMemberFormData {
  groupId: string;
  member: GroupMemberRead;
  /** Salir uno mismo y echar a otro son el mismo endpoint, no el mismo acto. */
  isViewer: boolean;
}

@Component({
  selector: 'app-remove-member-form',
  imports: [MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './remove-member-form.html',
  styleUrl: './remove-member-form.scss',
  host: { class: 'bottom-sheet-form' },
})
export class RemoveMemberForm {
  private readonly bottomSheetRef = inject(MatBottomSheetRef<RemoveMemberForm>);
  private readonly groupMembersService = inject(GroupMembersService);
  protected readonly data = inject<RemoveMemberFormData>(MAT_BOTTOM_SHEET_DATA);

  protected readonly submitting = signal(false);

  protected readonly title = computed(() =>
    this.data.isViewer ? 'Abandonar el grupo' : 'Expulsar del grupo',
  );

  protected readonly confirmLabel = computed(() => (this.data.isViewer ? 'Abandonar' : 'Expulsar'));

  protected readonly message = computed(() =>
    this.data.isViewer
      ? 'Dejarás de ver las cuentas y los movimientos de este grupo. Para volver necesitarás que alguien te invite otra vez.'
      : `${this.data.member.name} dejará de ver las cuentas y los movimientos de este grupo. Puedes volver a invitarle más adelante.`,
  );

  submit(): void {
    if (this.submitting()) return;
    this.submitting.set(true);
    this.bottomSheetRef.disableClose = true;

    this.groupMembersService
      .expelGroupMember(this.data.groupId, this.data.member.user_id)
      .subscribe({
        next: () => this.bottomSheetRef.dismiss(this.data.isViewer ? 'left' : 'expelled'),
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
