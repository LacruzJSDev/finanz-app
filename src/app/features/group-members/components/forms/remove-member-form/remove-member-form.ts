import { AppButton } from '../../../../../shared/ui/button';
import { Component, computed, inject, signal } from '@angular/core';
import { APP_SHEET_DATA, AppSheetRef } from '../../../../../shared/ui/app-sheet';
import { AppLoader } from '../../../../../shared/ui/loader';
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
  imports: [AppButton, AppLoader],
  templateUrl: './remove-member-form.html',
  styleUrl: './remove-member-form.scss',
  host: { class: 'bottom-sheet-form' },
})
export class RemoveMemberForm {
  private readonly sheetRef = inject(AppSheetRef<RemoveMemberForm>);
  private readonly groupMembersService = inject(GroupMembersService);
  protected readonly data = inject<RemoveMemberFormData>(APP_SHEET_DATA);

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
    this.sheetRef.disableClose = true;

    this.groupMembersService
      .expelGroupMember(this.data.groupId, this.data.member.user_id)
      .subscribe({
        next: () => this.sheetRef.dismiss(this.data.isViewer ? 'left' : 'expelled'),
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
