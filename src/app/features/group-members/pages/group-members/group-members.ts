import { Component, computed, effect, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { GroupMembersService } from '../../../../core/group-members/group-members.service';
import { AuthService } from '../../../../core/auth/auth.service';
import { GroupMemberRead } from '../../../../core/models';
import { PageContent } from '../../../../shared/ui/page-content/page-content';
import { PageLoader } from '../../../../shared/ui/page-loader/page-loader';
import { EmptyState } from '../../../../shared/ui/empty-state/empty-state';
import { MembersList } from '../../components/tables/members-list/members-list';
import {
  ChangeMemberRoleForm,
  ChangeMemberRoleFormData,
} from '../../components/forms/change-member-role-form/change-member-role-form';
import {
  RemoveMemberForm,
  RemoveMemberFormData,
} from '../../components/forms/remove-member-form/remove-member-form';

@Component({
  selector: 'app-group-members',
  imports: [MembersList, PageContent, PageLoader, EmptyState],
  templateUrl: './group-members.html',
  host: { class: 'page-section' },
})
export class GroupMembers {
  private readonly bottomSheet = inject(MatBottomSheet);
  private readonly groupMembersService = inject(GroupMembersService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  /** El id del grupo lo hereda del armazón que la enruta. */
  readonly id = input.required<string>();

  protected readonly loading = this.groupMembersService.loading;
  protected readonly members = this.groupMembersService.members;

  // Quién eres dentro de este grupo sale de la propia lista: es el miembro cuyo
  // usuario coincide con el de la sesión.
  protected readonly viewer = computed(() => {
    const userId = this.authService.currentUser()?.id;
    return this.members().find((member) => member.user_id === userId);
  });

  constructor() {
    effect(() => {
      this.groupMembersService.getGroupMembers(this.id()).subscribe();
    });
  }

  changeRole(member: GroupMemberRead): void {
    this.bottomSheet.open<ChangeMemberRoleForm, ChangeMemberRoleFormData>(ChangeMemberRoleForm, {
      data: { groupId: this.id(), member },
    });
  }

  remove(member: GroupMemberRead): void {
    const ref = this.bottomSheet.open<RemoveMemberForm, RemoveMemberFormData>(RemoveMemberForm, {
      data: {
        groupId: this.id(),
        member,
        isViewer: member.user_id === this.viewer()?.user_id,
      },
    });

    // Si te has ido, esta pantalla ya no es tuya: quedarte en ella solo daría
    // 403 en la siguiente carga.
    ref.afterDismissed().subscribe((result) => {
      if (result === 'left') this.router.navigateByUrl('/grupos');
    });
  }
}
