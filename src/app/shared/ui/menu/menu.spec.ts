import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { OverlayContainer } from '@angular/cdk/overlay';
import { AppMenu, AppMenuItem, AppMenuTrigger } from './menu';

@Component({
  imports: [AppMenu, AppMenuItem, AppMenuTrigger],
  template: `
    <button [appMenuTriggerFor]="menu">Account</button>
    <ng-template #menu>
      <app-menu aria-label="Account">
        <button appMenuItem (triggered)="calls = calls + 1">Join</button>
        <button appMenuItem [disabled]="true" (triggered)="calls = calls + 10">Disabled</button>
      </app-menu>
    </ng-template>
  `,
})
class Host {
  calls = 0;
}

describe('AppMenu', () => {
  it('opens its owned menu, activates an item, and dismisses', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const trigger = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    trigger.click();
    await fixture.whenStable();
    const overlay = TestBed.inject(OverlayContainer).getContainerElement();
    const item = overlay.querySelector('[role="menuitem"]') as HTMLButtonElement;
    expect(item).toBeTruthy();
    item.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.calls).toBe(1);
    expect(overlay.querySelector('[role="menu"]')).toBeNull();
  });
});
