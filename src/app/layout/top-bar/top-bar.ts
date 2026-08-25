import { Component, effect, inject, signal } from '@angular/core';
import { PageContextService } from '../../core/ui/page-context.service';
import { MatChipsModule } from '@angular/material/chips';
import { GroupContextService } from '../../core/ui/group-context.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-top-bar',
  imports: [MatToolbarModule, MatChipsModule, MatDividerModule],
  templateUrl: 'top-bar.html',
  styleUrl: 'top-bar.scss',
})
export class TopBar {
  protected readonly pageContextService = inject(PageContextService);
  protected readonly groupContextService = inject(GroupContextService);

  protected readonly title = this.pageContextService.title;

  protected groupName = signal<string>('Grupo no seleccionado');

  constructor() {
    effect(() => {
      const activeGroup = this.groupContextService.activeGroup();
      if (activeGroup) {
        this.groupName.set(activeGroup.name);
      }
    });
  }
}
