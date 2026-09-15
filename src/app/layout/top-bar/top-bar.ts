import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AppIcon } from '../../shared/ui/icon';
import { AppMenu, AppMenuItem, AppMenuTrigger } from '../../shared/ui/menu';
import { AppButton } from '../../shared/ui/button';
import { Avatar } from '../../shared/ui/avatar/avatar';
import { PageContextService } from '../../core/ui/page-context.service';
import { GroupContextService } from '../../core/ui/group-context.service';
import { AuthService } from '../../core/auth/auth.service';

const NO_GROUP_SELECTED = 'Grupo no seleccionado';

@Component({
  selector: 'app-top-bar',
  imports: [AppIcon, AppButton, AppMenu, AppMenuItem, AppMenuTrigger, Avatar],
  templateUrl: 'top-bar.html',
  styleUrl: 'top-bar.scss',
})
export class TopBar {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly pageContextService = inject(PageContextService);
  protected readonly groupContextService = inject(GroupContextService);

  protected readonly title = this.pageContextService.title;
  protected readonly detail = this.pageContextService.detail;
  protected readonly showGroup = this.pageContextService.showGroup;
  protected readonly parent = this.pageContextService.parent;
  // De AuthService y no de UsersService: este se actualiza al hacer login,
  // mientras que UsersService solo se llena con getMe() en el arranque.
  protected readonly user = this.authService.currentUser;

  protected readonly groupName = computed(
    () => this.groupContextService.activeGroup()?.name ?? NO_GROUP_SELECTED,
  );

  // El grupo es contexto global, así que lo compone la barra; la página solo
  // aporta su propio dato. Si no hay, queda el grupo solo y la línea nunca
  // se vacía, que es lo que mantenía el alto estable.
  protected readonly contextLine = computed(() => {
    const detail = this.detail();
    if (!this.showGroup()) return detail ?? '';
    return detail ? `${this.groupName()} · ${detail}` : this.groupName();
  });

  joinGroup(): void {
    this.router.navigateByUrl('/invitaciones');
  }

  goToParent(): void {
    const parent = this.parent();
    if (parent) this.router.navigateByUrl(parent.url);
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => this.router.navigateByUrl('/login'),
      error: () => this.router.navigateByUrl('/login'),
    });
  }
}
