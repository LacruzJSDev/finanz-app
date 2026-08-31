import { Component, computed, input, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { InvitationRead, InvitationStatusEnum } from '../../../../core/models';
import { MemberRoleLabelPipe } from '../../../group-members';
import { InvitationStatusLabelPipe } from '../../pipes/invitation-status-label.pipe';

@Component({
  selector: 'app-invitation-card',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MemberRoleLabelPipe,
    InvitationStatusLabelPipe,
  ],
  templateUrl: 'invitation-card.html',
  styleUrl: 'invitation-card.scss',
})
export class InvitationCard {
  readonly invitation = input.required<InvitationRead>();

  /** Si quien mira gobierna el grupo. Sin eso no hay nada que copiar ni revocar. */
  readonly canManage = input(false);

  readonly copyClick = output<InvitationRead>();
  readonly revokeClick = output<InvitationRead>();

  protected readonly isPending = computed(
    () => this.invitation().status === InvitationStatusEnum.Pending,
  );

  // Una aceptada ya es el registro de que alguien entró: borrarla reescribiría
  // un hecho, y el backend responde 409. Para deshacer eso está expulsar.
  protected readonly canRevoke = computed(
    () => this.canManage() && this.invitation().status !== InvitationStatusEnum.Accepted,
  );

  protected readonly statusClass = computed(() => `invitation-status--${this.invitation().status}`);
}
