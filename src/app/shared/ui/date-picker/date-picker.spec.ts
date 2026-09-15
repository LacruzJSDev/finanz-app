import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { OverlayContainer } from '@angular/cdk/overlay';
import { AppDatePicker } from './date-picker';

@Component({
  imports: [AppDatePicker, ReactiveFormsModule],
  template: '<app-date-picker [formControl]="control" [min]="min()" [max]="max()" />',
})
class Host {
  readonly control = new FormControl<Date | null>(new Date(2024, 1, 28));
  min = signal<Date | null>(null);
  max = signal<Date | null>(null);
}

describe('AppDatePicker calendar interaction', () => {
  async function setup() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const trigger = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    const overlay = TestBed.inject(OverlayContainer).getContainerElement();
    const settle = async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      await new Promise((resolve) => setTimeout(resolve, 20));
      await fixture.whenStable();
    };
    const key = async (key: string, shiftKey = false) => {
      document.activeElement?.dispatchEvent(
        new KeyboardEvent('keydown', { key, shiftKey, bubbles: true, cancelable: true }),
      );
      await settle();
    };
    return { fixture, trigger, overlay, settle, key };
  }

  it('focuses selected day, traverses leap day, and emits local midnight', async () => {
    const { fixture, trigger, settle, key } = await setup();
    trigger.click();
    await settle();
    expect(document.activeElement?.getAttribute('aria-label')).toContain('28 de febrero');
    await key('ArrowRight');
    expect(document.activeElement?.getAttribute('aria-label')).toContain('29 de febrero');
    (document.activeElement as HTMLButtonElement).click();
    await settle();
    const value = fixture.componentInstance.control.value!;
    expect([value.getFullYear(), value.getMonth(), value.getDate(), value.getHours()]).toEqual([
      2024, 1, 29, 0,
    ]);
    expect(document.activeElement).toBe(trigger);
  });

  it('crosses month boundaries and supports year jumps without committing on Escape', async () => {
    const { fixture, trigger, settle, key } = await setup();
    fixture.componentInstance.control.setValue(new Date(2024, 1, 29));
    await settle();
    trigger.click();
    await settle();
    await key('ArrowRight');
    expect(document.activeElement?.getAttribute('aria-label')).toContain('1 de marzo');
    await key('PageDown', true);
    expect(document.activeElement?.getAttribute('aria-label')).toContain('2025');
    await key('Escape');
    expect(document.activeElement).toBe(trigger);
    expect(fixture.componentInstance.control.value?.getMonth()).toBe(1);
  });

  it('clamps focus/navigation to limits and closes when disabled', async () => {
    const { fixture, trigger, settle, key, overlay } = await setup();
    fixture.componentInstance.min.set(new Date(2024, 1, 10));
    fixture.componentInstance.max.set(new Date(2024, 1, 20));
    await settle();
    trigger.click();
    await settle();
    expect(document.activeElement?.getAttribute('aria-label')).toContain('20 de febrero');
    await key('ArrowRight');
    expect(document.activeElement?.getAttribute('aria-label')).toContain('20 de febrero');
    expect(overlay.querySelectorAll('button[role="gridcell"]:disabled').length).toBeGreaterThan(0);
    fixture.componentInstance.control.disable();
    await settle();
    expect(overlay.querySelector('[role="dialog"]')).toBeNull();
  });

  it('renders invalid values empty without throwing', async () => {
    const { fixture, trigger, settle } = await setup();
    fixture.componentInstance.control.setValue(new Date(Number.NaN));
    await settle();
    expect(trigger.textContent).toContain('Selecciona una fecha');
  });

  it('switches year to month to day without intermediate CVA emissions', async () => {
    const { fixture, trigger, settle } = await setup();
    const initial = fixture.componentInstance.control.value?.getTime();
    trigger.click();
    await settle();
    (
      document.querySelector('.app-date-picker__heading-button:nth-child(2)') as HTMLElement
    ).click();
    await settle();
    expect(document.querySelectorAll('.app-date-picker__period-grid button')).toHaveLength(12);
    (
      document.querySelector('.app-date-picker__period-grid button:not(:disabled)') as HTMLElement
    ).click();
    await settle();
    expect(document.querySelectorAll('.app-date-picker__period-grid button')).toHaveLength(12);
    expect(fixture.componentInstance.control.value?.getTime()).toBe(initial);
    (
      document.querySelector('.app-date-picker__period-grid button:not(:disabled)') as HTMLElement
    ).click();
    await settle();
    expect(document.querySelector('.app-date-picker__weekdays')).not.toBeNull();
    expect(fixture.componentInstance.control.value?.getTime()).toBe(initial);
    (document.querySelector('[role="gridcell"]:not(:disabled)') as HTMLElement).click();
    await settle();
    expect(fixture.componentInstance.control.value?.getTime()).not.toBe(initial);
  });

  it('disables months and years without dates inside the min/max range', async () => {
    const { fixture, trigger, settle } = await setup();
    fixture.componentInstance.min.set(new Date(2024, 1, 10));
    fixture.componentInstance.max.set(new Date(2024, 1, 20));
    await settle();
    trigger.click();
    await settle();
    (
      document.querySelector('.app-date-picker__heading-button:nth-child(2)') as HTMLElement
    ).click();
    await settle();
    const year = Array.from(document.querySelectorAll('.app-date-picker__period-grid button')).find(
      (button) => button.textContent?.trim() === '2024',
    ) as HTMLButtonElement;
    expect(year.disabled).toBe(false);
    year.click();
    await settle();
    expect(document.querySelectorAll('.app-date-picker__period-grid button:disabled')).toHaveLength(
      11,
    );
  });

  it('pages to a year block that intersects the allowed range and keeps focus enabled', async () => {
    const { fixture, trigger, settle } = await setup();
    fixture.componentInstance.min.set(new Date(2030, 0, 1));
    fixture.componentInstance.max.set(new Date(2040, 11, 31));
    await settle();
    trigger.click();
    await settle();
    (
      document.querySelector('.app-date-picker__heading-button:nth-child(2)') as HTMLElement
    ).click();
    await settle();
    const next = Array.from(document.querySelectorAll('[aria-label="12 años siguientes"]')).at(
      -1,
    ) as HTMLButtonElement;
    expect(next.disabled).toBe(false);
    next.click();
    await settle();
    const focused = document.querySelector(
      '.app-date-picker__period-grid button[tabindex="0"]',
    ) as HTMLButtonElement;
    expect(focused.disabled).toBe(false);
    expect(focused.textContent?.trim()).toBe('2040');
  });
});
