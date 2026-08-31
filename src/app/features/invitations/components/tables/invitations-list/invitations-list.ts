import { Component, input, output } from '@angular/core';
import { InvitationRead } from '../../../../../core/models';
import { InvitationCard } from '../../invitation-card/invitation-card';

@Component({
  selector: 'app-invitations-list',
  imports: [InvitationCard],
  templateUrl: './invitations-list.html',
  styleUrl: './invitations-list.scss',
})
export class InvitationsList {
  /** Ya vienen ordenadas por el backend, de la más reciente a la más vieja. */
  readonly invitations = input.required<InvitationRead[]>();

  /** Si quien mira gobierna el grupo: sin eso no hay nada que copiar ni revocar. */
  readonly canManage = input(false);

  readonly copyClick = output<InvitationRead>();
  readonly revokeClick = output<InvitationRead>();
}
