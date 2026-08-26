import { Injectable, inject, signal } from '@angular/core';
import { tap } from 'rxjs';
import {
  AccountGroupsService as AccountGroupsApi,
  CreateInvitationRequest,
  InvitationRead,
} from '../../api';

@Injectable({ providedIn: 'root' })
export class InvitationsService {
  private readonly api = inject(AccountGroupsApi);

  private readonly invitationsSignal = signal<InvitationRead[]>([]);
  readonly invitations = this.invitationsSignal.asReadonly();
  private readonly invitationSignal = signal<InvitationRead | null>(null);
  readonly invitation = this.invitationSignal.asReadonly();

  createInvitation(groupId: string, payload: CreateInvitationRequest) {
    return this.api.createInvitationApiV1AccountGroupsGroupIdInvitationsPost(groupId, payload).pipe(
      tap((invitation) => {
        this.invitationsSignal.update((invitations) => [...invitations, invitation]);
        this.invitationSignal.set(invitation);
      }),
    );
  }

  acceptInvitation(groupId: string, invitationId: string) {
    return this.api
      .acceptInvitationApiV1AccountGroupsGroupIdInvitationsInvitationIdAcceptPost(
        groupId,
        invitationId,
      )
      .pipe(
        tap((invitation) => {
          this.invitationsSignal.update((invitations) =>
            invitations.map((i) => (i.id === invitation.id ? invitation : i)),
          );
          this.invitationSignal.set(invitation);
        }),
      );
  }

  getInvitationByCode(code: string) {
    return this.api.getInvitationApiV1AccountGroupsInvitationsCodeGet(code).pipe(
      tap((invitation) => {
        this.invitationSignal.set(invitation);
      }),
    );
  }
}
