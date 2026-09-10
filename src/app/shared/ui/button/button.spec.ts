import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AppButton } from './button';

@Component({
  imports: [AppButton],
  template: `
    <form (submit)="$event.preventDefault(); submits = submits + 1">
      <button appButton type="submit" [loading]="busy()">Guardar</button>
    </form>
    <a appButton href="#destination" [disabled]="busy()" (click)="activations = activations + 1"
      >Abrir</a
    >
  `,
})
class Host {
  busy = signal(false);
  submits = 0;
  activations = 0;
}

describe('AppButton native interaction', () => {
  it('preserves form submission and prevents it while loading', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    button.click();
    expect(fixture.componentInstance.submits).toBe(1);
    fixture.componentInstance.busy.set(true);
    await fixture.whenStable();
    expect(button.disabled).toBe(true);
    expect(button.textContent).toContain('Guardar');
    expect(button.querySelector('[aria-hidden="true"]')?.textContent).not.toContain('Guardar');
    button.click();
    expect(fixture.componentInstance.submits).toBe(1);
  });

  it('blocks disabled link navigation and consumer click handlers', async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.busy.set(true);
    await fixture.whenStable();
    const link: HTMLAnchorElement = fixture.nativeElement.querySelector('a');
    const click = new MouseEvent('click', { bubbles: true, cancelable: true });
    expect(link.dispatchEvent(click)).toBe(false);
    expect(fixture.componentInstance.activations).toBe(0);
    expect(link.getAttribute('tabindex')).toBe('-1');
    fixture.componentInstance.busy.set(false);
    await fixture.whenStable();
    expect(link.hasAttribute('aria-disabled')).toBe(false);
    expect(link.hasAttribute('tabindex')).toBe(false);
  });
});
