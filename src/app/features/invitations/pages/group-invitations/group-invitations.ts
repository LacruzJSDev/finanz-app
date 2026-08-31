import { Component, computed, effect, inject, input } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { InvitationsService } from '../../../../core/invitations/invitations.service';
import { AccountGroupsService } from '../../../../core/account-groups/account-groups.service';
import { AuthService } from '../../../../core/auth/auth.service';
import { canManageInvitations, roleInGroup } from '../../../../core/account-groups/permissions';
import { NotificationsService } from '../../../../core/notifications/notifications.service';
import { InvitationRead } from '../../../../core/models';
import { PageContent } from '../../../../shared/ui/page-content/page-content';
import { PageLoader } from '../../../../shared/ui/page-loader/page-loader';
import { EmptyState } from '../../../../shared/ui/empty-state/empty-state';
import { InvitationCard } from '../../components/invitation-card/invitation-card';
import {
  RevokeInvitationForm,
  RevokeInvitationFormData,
} from '../../components/forms/revoke-invitation-form/revoke-invitation-form';

@Component({
  selector: 'app-group-invitations',
  imports: [InvitationCard, PageContent, PageLoader, EmptyState],
  templateUrl: './group-invitations.html',
  host: { class: 'page-section' },
})
export class GroupInvitations {
  private readonly bottomSheet = inject(MatBottomSheet);
  private readonly invitationsService = inject(InvitationsService);
  private readonly accountGroupsService = inject(AccountGroupsService);
  private readonly authService = inject(AuthService);
  private readonly notifications = inject(NotificationsService);

  /** El id del grupo lo hereda del armazón que la enruta. */
  readonly id = input.required<string>();

  protected readonly loading = this.invitationsService.loading;
  protected readonly invitations = this.invitationsService.invitations;

  // Manda el rol en este grupo, no en el de trabajo: la pantalla gestiona
  // cualquiera. Sin `owner`/`admin` el backend responde 403 al listar, así que
  // ni se pide.
  protected readonly canManage = computed(() => {
    const group = this.accountGroupsService.groups().find((g) => g.id === this.id());
    return canManageInvitations(roleInGroup(group, this.authService.currentUser()?.id));
  });

  constructor() {
    effect(() => {
      if (!this.canManage()) return;
      this.invitationsService.getGroupInvitations(this.id()).subscribe();
    });
  }

  async copy(invitation: InvitationRead): Promise<void> {
    await navigator.clipboard.writeText(invitation.code);
    this.notifications.info('Código copiado.');
  }

  revoke(invitation: InvitationRead): void {
    this.bottomSheet.open<RevokeInvitationForm, RevokeInvitationFormData>(RevokeInvitationForm, {
      data: { groupId: this.id(), invitation },
    });
  }
}
