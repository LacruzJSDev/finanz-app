import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AppDisclosure } from './disclosure';

@Component({
  imports: [AppDisclosure],
  template: `<app-disclosure>
    <span appDisclosureTitle>Category</span>
    <button appDisclosureActions (click)="edits = edits + 1">Edit</button>
    <p>Children</p>
  </app-disclosure>`,
})
class Host {
  edits = 0;
}

describe('AppDisclosure', () => {
  it('keeps actions outside the disclosure trigger and does not toggle on edits', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const trigger = fixture.nativeElement.querySelector('.disclosure-trigger') as HTMLButtonElement;
    const action = fixture.nativeElement.querySelector(
      '[appDisclosureActions]',
    ) as HTMLButtonElement;
    expect(trigger.contains(action)).toBe(false);
    action.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.edits).toBe(1);
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    const card = fixture.nativeElement.querySelector('app-card') as HTMLElement;
    expect(card.classList.contains('app-card--compact')).toBe(true);
    expect(getComputedStyle(card).getPropertyValue('--app-card-gap').trim()).toBe('0px');
    trigger.click();
    await fixture.whenStable();
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(card.classList.contains('disclosure-card--expanded')).toBe(true);
    trigger.click();
    await fixture.whenStable();
    expect(card.classList.contains('disclosure-card--expanded')).toBe(false);
    expect(getComputedStyle(card).getPropertyValue('--app-card-gap').trim()).toBe('0px');
  });
});
