import { Injectable, inject, signal } from '@angular/core';
import { finalize, tap } from 'rxjs';
import {
  AccountGroupsService as AccountGroupsApi,
  CreateInvitationRequest,
  InvitationDetailRead,
  InvitationRead,
} from '../../api';
import { LatestRequest } from '../http/latest-request';

@Injectable({ providedIn: 'root' })
export class InvitationsService {
  private readonly api = inject(AccountGroupsApi);

  private readonly invitationsSignal = signal<InvitationRead[]>([]);
  readonly invitations = this.invitationsSignal.asReadonly();

  // La consultada por código es de otro tipo: trae el grupo entero embebido,
  // que es lo que permite decir a qué grupo te unes antes de aceptar.
  private readonly invitationSignal = signal<InvitationDetailRead | null>(null);
  readonly invitation = this.invitationSignal.asReadonly();

  private readonly loadingSignal = signal(false);
  readonly loading = this.loadingSignal.asReadonly();

  private readonly invitationsRequest = new LatestRequest();

  getGroupInvitations(groupId: string) {
    const token = this.invitationsRequest.next();
    this.loadingSignal.set(true);
    return this.api.getGroupInvitationsApiV1AccountGroupsGroupIdInvitationsGet(groupId).pipe(
      tap((res) => {
        if (!this.invitationsRequest.isCurrent(token)) return;
        this.invitationsSignal.set(res.items);
      }),
      finalize(() => {
        if (this.invitationsRequest.isCurrent(token)) this.loadingSignal.set(false);
      }),
    );
  }

  createInvitation(groupId: string, payload: CreateInvitationRequest) {
    return this.api.createInvitationApiV1AccountGroupsGroupIdInvitationsPost(groupId, payload).pipe(
      // Al principio: el backend devuelve la lista por `created_at` descendente.
      tap((invitation) => {
        this.invitationsSignal.update((invitations) => [invitation, ...invitations]);
        this.invitationSignal.set(null);
      }),
    );
  }

  revokeInvitation(groupId: string, invitationId: string) {
    return this.api
      .revokeInvitationApiV1AccountGroupsGroupIdInvitationsInvitationIdDelete(groupId, invitationId)
      .pipe(
        tap(() => {
          this.invitationsSignal.update((invitations) =>
            invitations.filter((invitation) => invitation.id !== invitationId),
          );
        }),
      );
  }

  acceptInvitation(groupId: string, invitationId: string) {
    return this.api.acceptInvitationApiV1AccountGroupsGroupIdInvitationsInvitationIdAcceptPost(
      groupId,
      invitationId,
    );
  }

  /** Quien llega con un código todavía no pertenece al grupo. */
  getInvitationByCode(code: string) {
    return this.api.getInvitationApiV1AccountGroupsInvitationsCodeGet(code).pipe(
      tap((invitation) => {
        this.invitationSignal.set(invitation);
      }),
    );
  }
}
