import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Avatar } from '../../shared/ui/avatar/avatar';
import { PageContextService } from '../../core/ui/page-context.service';
import { GroupContextService } from '../../core/ui/group-context.service';
import { AuthService } from '../../core/auth/auth.service';
import { GroupSwitcher } from '../group-switcher/group-switcher';

const NO_GROUP_SELECTED = 'Grupo no seleccionado';

@Component({
  selector: 'app-top-bar',
  imports: [MatIconModule, MatMenuModule, Avatar],
  templateUrl: 'top-bar.html',
  styleUrl: 'top-bar.scss',
})
export class TopBar {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly bottomSheet = inject(MatBottomSheet);

  protected readonly pageContextService = inject(PageContextService);
  protected readonly groupContextService = inject(GroupContextService);

  protected readonly title = this.pageContextService.title;
  protected readonly detail = this.pageContextService.detail;
  protected readonly showGroup = this.pageContextService.showGroup;
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

  openGroupSwitcher(): void {
    this.bottomSheet.open(GroupSwitcher);
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => this.router.navigateByUrl('/login'),
      error: () => this.router.navigateByUrl('/login'),
    });
  }
}
