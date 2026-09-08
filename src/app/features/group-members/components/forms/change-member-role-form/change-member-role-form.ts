import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { APP_SHEET_DATA, AppSheetRef } from '../../../../../shared/ui/app-sheet';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { GroupMembersService } from '../../../../../core/group-members/group-members.service';
import { AccountGroupMemberRoleEnum, GroupMemberRead } from '../../../../../core/models';
import { applyServerErrors } from '../../../../../core/forms/apply-server-errors';
import { MemberRoleLabelPipe } from '../../../pipes/member-role-label.pipe';

export interface ChangeMemberRoleFormData {
  groupId: string;
  member: GroupMemberRead;
}

@Component({
  selector: 'app-change-member-role-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MemberRoleLabelPipe,
  ],
  templateUrl: './change-member-role-form.html',
  host: { class: 'bottom-sheet-form' },
})
export class ChangeMemberRoleForm {
  private readonly fb = inject(FormBuilder);
  private readonly groupMembersService = inject(GroupMembersService);
  private readonly sheetRef = inject(AppSheetRef<ChangeMemberRoleForm>);
  protected readonly data = inject<ChangeMemberRoleFormData>(APP_SHEET_DATA);

  protected readonly submitting = signal(false);
  protected readonly formError = signal<string | null>(null);

  // Los tres roles, `owner` incluido: no hay endpoint de transferir propiedad,
  // se promueve a otro a propietario y el grupo pasa a tener dos.
  protected readonly roles = Object.values(AccountGroupMemberRoleEnum);

  readonly form = this.fb.nonNullable.group({
    role: [this.data.member.role, [Validators.required]],
  });

  submit(): void {
    if (this.form.invalid || this.submitting()) return;
    this.submitting.set(true);
    this.formError.set(null);
    this.sheetRef.disableClose = true;

    this.groupMembersService
      .changeGroupMemberRole(this.data.groupId, this.data.member.user_id, this.form.getRawValue())
      .subscribe({
        next: () => this.sheetRef.dismiss(),
        error: (error: unknown) => {
          this.submitting.set(false);
          this.sheetRef.disableClose = false;
          this.formError.set(applyServerErrors(this.form, error));
        },
      });
  }
}
