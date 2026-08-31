import { Component, effect, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { LowerCasePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { InvitationsService } from '../../../../core/invitations/invitations.service';
import { AccountGroupsService } from '../../../../core/account-groups/account-groups.service';
import { GroupContextService } from '../../../../core/ui/group-context.service';
import { PageContextService } from '../../../../core/ui/page-context.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';
import { InvitationStatusEnum } from '../../../../core/models';
import { PageContent } from '../../../../shared/ui/page-content/page-content';
import { PageLoader } from '../../../../shared/ui/page-loader/page-loader';
import { ColorIcon } from '../../../../shared/ui/color-icon/color-icon';
import { MemberRoleLabelPipe } from '../../../group-members';

@Component({
  selector: 'app-accept-invitation',
  imports: [
    ReactiveFormsModule,
    LowerCasePipe,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    PageContent,
    PageLoader,
    ColorIcon,
    MemberRoleLabelPipe,
  ],
  templateUrl: './accept-invitation.html',
  styleUrl: './accept-invitation.scss',
  host: { class: 'page-container' },
})
export class AcceptInvitation {
  private readonly fb = inject(FormBuilder);
  private readonly invitationsService = inject(InvitationsService);
  private readonly accountGroupsService = inject(AccountGroupsService);
  private readonly groupContextService = inject(GroupContextService);
  private readonly pageContextService = inject(PageContextService);
  private readonly notifications = inject(NotificationsService);
  private readonly router = inject(Router);

  /** Llega en la URL cuando se abre un enlace compartido; si no, se pega a mano. */
  readonly code = input<string>();

  protected readonly invitation = this.invitationsService.invitation;
  protected readonly looking = signal(false);
  protected readonly accepting = signal(false);
  protected readonly Pending = InvitationStatusEnum.Pending;

  readonly form = this.fb.nonNullable.group({
    code: ['', [Validators.required]],
  });

  constructor() {
    // No lleva el grupo de trabajo en la línea de contexto: quien llega aquí
    // puede no tener ninguno todavía, y desde luego no es el de la invitación.
    this.pageContextService.setTitle('Unirse a un grupo', { showGroup: false });
    this.pageContextService.setAction(null);

    effect(() => {
      const code = this.code();
      if (code) this.look(code);
    });
  }

  submitCode(): void {
    if (this.form.invalid) {
      this.form.controls.code.markAsTouched();
      return;
    }
    this.look(this.form.getRawValue().code.trim());
  }

  private look(code: string): void {
    this.looking.set(true);
    // Sin manejar el fallo: el interceptor de core/http ya convierte la
    // respuesta en ApiError y la enseña en una barra con el mensaje del
    // backend. Escribir aquí otro sería inventarse un texto que compite con
    // el suyo y decir dos veces lo mismo.
    this.invitationsService.getInvitationByCode(code).subscribe({
      next: () => this.looking.set(false),
      error: () => this.looking.set(false),
    });
  }

  accept(): void {
    const invitation = this.invitation();
    if (!invitation || this.accepting()) return;
    this.accepting.set(true);

    this.invitationsService.acceptInvitation(invitation.group_id, invitation.id).subscribe({
      // Al entrar, el grupo pasa a ser el de trabajo: es lo que acabas de pedir,
      // y deja la aplicación apuntando a algo que ya puedes usar.
      next: () => {
        this.accountGroupsService.getAccountGroups().subscribe(() => {
          this.groupContextService.setActiveGroupId(invitation.group_id);
          this.router.navigateByUrl('/cuentas');
        });
        this.notifications.info(`Te has unido a ${invitation.group.name}.`);
      },
      error: () => this.accepting.set(false),
    });
  }
}
