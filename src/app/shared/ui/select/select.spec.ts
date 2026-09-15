import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TestBed } from '@angular/core/testing';
import { AppSelect, AppSelectOption } from './select';

const OPTIONS: readonly AppSelectOption[] = [
  { value: 'one', label: 'One', icon: 'check' },
  { value: 'two', label: 'A deliberately long option label that wraps on narrow screens' },
  { value: 'three', label: 'Three', disabled: true },
];

@Component({
  imports: [ReactiveFormsModule, AppSelect],
  template: `<app-select
    label="Choice"
    placeholder="Choose"
    [options]="options"
    [formControl]="control"
  />`,
})
class Host {
  readonly options = OPTIONS;
  readonly control = new FormControl<string | null>(null);
}

describe('AppSelect', () => {
  it('fills the overlay pane instead of imposing an independent minimum width', async () => {
    const fixture = await create();
    (fixture.nativeElement.querySelector('button') as HTMLButtonElement).click();
    await fixture.whenStable();
    const panel = document.body.querySelector('[role="listbox"]') as HTMLElement;
    const style = getComputedStyle(panel);
    expect(style.width).toBe('100%');
    expect(style.minWidth).toBe('0px');
    expect(style.maxWidth).toBe('100%');
  });
  async function create() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    return fixture;
  }

  it('opens with ArrowDown, selects with Enter, and restores focus', async () => {
    const fixture = await create();
    const trigger = fixture.nativeElement.querySelector('button') as HTMLButtonElement;

    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    await fixture.whenStable();
    const option = document.body.querySelector('[role="option"]') as HTMLElement;
    option.focus();
    option.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await fixture.whenStable();

    expect(fixture.componentInstance.control.value).toBe('one');
    expect(document.activeElement).toBe(trigger);
  });

  it('closes on Escape without changing the value', async () => {
    const fixture = await create();
    const trigger = fixture.nativeElement.querySelector('button') as HTMLButtonElement;

    trigger.click();
    await fixture.whenStable();
    const panel = document.body.querySelector('[role="listbox"]') as HTMLElement;
    panel.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await fixture.whenStable();

    expect(fixture.componentInstance.control.value).toBeNull();
    expect(document.body.querySelector('[role="listbox"]')).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it('closes on Tab without trapping focus and exposes a viewport-safe panel', async () => {
    const fixture = await create();
    const trigger = fixture.nativeElement.querySelector('button') as HTMLButtonElement;

    trigger.click();
    await fixture.whenStable();
    const panel = document.body.querySelector('[role="listbox"]') as HTMLElement;
    panel.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
    await fixture.whenStable();

    expect(document.body.querySelector('[role="listbox"]')).toBeNull();
    expect(panel.classList.contains('app-select__panel')).toBe(true);
  });
});
