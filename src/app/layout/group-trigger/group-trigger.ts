import { Component, computed, inject } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatIconModule } from '@angular/material/icon';
import { GroupContextService } from '../../core/ui/group-context.service';
import { PageContextService } from '../../core/ui/page-context.service';
import { GroupSwitcher } from '../group-switcher/group-switcher';

@Component({
  selector: 'app-group-trigger',
  imports: [MatIconModule],
  template: `
    @if (showGroup()) {
      <button
        type="button"
        class="group-trigger"
        (click)="open()"
        [attr.aria-label]="'Cambiar de grupo. Grupo activo: ' + groupName()"
      >
        <mat-icon>groups</mat-icon><span>{{ groupName() }}</span
        ><mat-icon>expand_less</mat-icon>
      </button>
    }
  `,
  styleUrl: './group-trigger.scss',
  host: { '[class.group-trigger-host--visible]': 'showGroup()' },
})
export class GroupTrigger {
  private readonly bottomSheet = inject(MatBottomSheet);
  private readonly pageContextService = inject(PageContextService);
  private readonly groupContextService = inject(GroupContextService);
  protected readonly showGroup = this.pageContextService.showGroup;
  protected readonly groupName = computed(
    () => this.groupContextService.activeGroup()?.name ?? 'Grupo no seleccionado',
  );
  open(): void {
    this.bottomSheet.open(GroupSwitcher);
  }
}
