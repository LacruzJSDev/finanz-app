import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { GroupContextService } from '../../core/ui/group-context.service';
import { PageContextService } from '../../core/ui/page-context.service';
import { BottomNav } from './bottom-nav';

describe('BottomNav contextual action', () => {
  it('collapses the action slot and disables the FAB when the action disappears', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: GroupContextService, useValue: { activeGroupId: signal('group') } },
      ],
    });
    const context = TestBed.inject(PageContextService);
    const onClick = vi.fn();
    context.setAction({ icon: 'add', onClick });
    const fixture = TestBed.createComponent(BottomNav);
    await fixture.whenStable();
    const slot: HTMLElement = fixture.nativeElement.querySelector('.fab-slot');
    const button: HTMLButtonElement = slot.querySelector('button')!;
    button.click();
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(slot.classList.contains('fab-slot--hidden')).toBe(false);

    context.setAction(null);
    await fixture.whenStable();
    expect(slot.classList.contains('fab-slot--hidden')).toBe(true);
    expect(slot.hasAttribute('inert')).toBe(true);
    expect(button.disabled).toBe(true);
    expect(button.getAttribute('aria-hidden')).toBe('true');
    expect(fixture.nativeElement.querySelectorAll('a').length).toBe(4);

    context.setAction({ icon: 'add', onClick });
    await fixture.whenStable();
    expect(slot.hasAttribute('inert')).toBe(false);
    expect(button.disabled).toBe(false);
  });
});
