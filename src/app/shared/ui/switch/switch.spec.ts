import { TestBed } from '@angular/core/testing';
import { AppSwitch } from './switch';

describe('AppSwitch', () => {
  it('anchors its hidden native input to the label instead of the document', async () => {
    const fixture = TestBed.createComponent(AppSwitch);
    await fixture.whenStable();
    const label = fixture.nativeElement.querySelector('label') as HTMLElement;
    const input = fixture.nativeElement.querySelector('input') as HTMLElement;
    expect(getComputedStyle(label).position).toBe('relative');
    expect(getComputedStyle(input).position).toBe('absolute');
  });
  it('settles a destructive action only after the thumb transition, once', async () => {
    const fixture = TestBed.createComponent(AppSwitch);
    await fixture.whenStable();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    const thumb = fixture.nativeElement.querySelector('.app-switch__visual span') as HTMLElement;
    thumb.style.transitionDuration = '180ms';
    const immediate = vi.fn();
    const settled = vi.fn();
    fixture.componentInstance.change.subscribe(immediate);
    fixture.componentInstance.changeSettled.subscribe(settled);
    input.click();
    expect(input.checked).toBe(true);
    expect(immediate).toHaveBeenCalledOnce();
    expect(settled).not.toHaveBeenCalled();
    const end = new Event('transitionend', { bubbles: true });
    Object.defineProperty(end, 'propertyName', { value: 'transform' });
    thumb.dispatchEvent(end);
    thumb.dispatchEvent(end);
    expect(settled).toHaveBeenCalledOnce();
    expect(settled).toHaveBeenCalledWith({ checked: true });
  });

  it('resynchronizes checked input and preserves disabled native semantics', async () => {
    const fixture = TestBed.createComponent(AppSwitch);
    fixture.componentRef.setInput('checked', false);
    await fixture.whenStable();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.click();
    await fixture.whenStable();
    fixture.componentRef.setInput('checked', true);
    await fixture.whenStable();
    fixture.componentRef.setInput('checked', false);
    fixture.componentRef.setInput('disabled', true);
    await fixture.whenStable();
    expect(input.checked).toBe(false);
    input.click();
    expect(input.checked).toBe(false);
  });
});
