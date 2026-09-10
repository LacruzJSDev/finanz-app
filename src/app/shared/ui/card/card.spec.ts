import { TestBed } from '@angular/core/testing';
import { AppCard } from './card';

describe('AppCard spacing', () => {
  it('keeps spacing independent of layout', async () => {
    const fixture = TestBed.createComponent(AppCard);
    fixture.componentRef.setInput('layout', 'row');
    await fixture.whenStable();
    const card = fixture.nativeElement as HTMLElement;
    expect(card.classList.contains('app-card--compact')).toBe(false);
    fixture.componentRef.setInput('spacing', 'compact');
    await fixture.whenStable();
    expect(card.classList.contains('app-card--compact')).toBe(true);
    fixture.componentRef.setInput('layout', 'column');
    await fixture.whenStable();
    expect(card.classList.contains('app-card--compact')).toBe(true);
    expect(card.classList.contains('app-card--column')).toBe(true);
  });
});
