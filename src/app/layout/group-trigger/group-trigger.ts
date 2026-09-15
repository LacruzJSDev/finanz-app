import { Component, computed, inject } from '@angular/core';
import { AppIcon } from '../../shared/ui/icon';
import { GroupContextService } from '../../core/ui/group-context.service';
import { PageContextService } from '../../core/ui/page-context.service';
import { GroupSwitcher } from '../group-switcher/group-switcher';
import { AppSheetService } from '../../shared/ui/app-sheet';

@Component({
  selector: 'app-group-trigger',
  imports: [AppIcon],
  templateUrl: './group-trigger.html',
  styleUrl: './group-trigger.scss',
  host: { '[class.group-trigger-host--visible]': 'showGroup()' },
})
export class GroupTrigger {
  private readonly bottomSheet = inject(AppSheetService);
  private readonly pageContextService = inject(PageContextService);
  private readonly groupContextService = inject(GroupContextService);
  protected readonly showGroup = this.pageContextService.showGroup;
  protected readonly groupName = computed(
    () => this.groupContextService.activeGroup()?.name ?? 'Grupo no seleccionado',
  );
  open(): void {
    this.bottomSheet.open(GroupSwitcher, { variant: 'selector' });
  }
}
