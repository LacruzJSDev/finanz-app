import { Component, input, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { GroupMemberRead } from '../../../../core/models';
import { MemberRoleLabelPipe } from '../../pipes/member-role-label.pipe';
import { Avatar } from '../../../../shared/ui/avatar/avatar';

@Component({
  selector: 'app-member-card',
  imports: [MatCardModule, MatButtonModule, MatIconModule, MemberRoleLabelPipe, Avatar],
  templateUrl: 'member-card.html',
  styleUrl: 'member-card.scss',
})
export class MemberCard {
  readonly member = input.required<GroupMemberRead>();

  // Quién puede qué lo decide member-permissions, que tiene las reglas juntas.
  // La tarjeta solo pinta lo que le dicen.
  readonly canChangeRole = input(false);
  readonly canRemove = input(false);

  /** Sobre uno mismo la acción no es expulsar, es irse. */
  readonly isViewer = input(false);

  readonly roleClick = output<GroupMemberRead>();
  readonly removeClick = output<GroupMemberRead>();
}
