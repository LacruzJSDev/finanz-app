import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TestBed } from '@angular/core/testing';
import { AppTextInput } from './text-input';

@Component({
  imports: [ReactiveFormsModule, AppTextInput],
  template: `<app-text-input label="Name" [formControl]="control" />`,
})
class Host {
  readonly control = new FormControl('initial', { nonNullable: true });
}

@Component({
  imports: [ReactiveFormsModule, AppTextInput],
  template: `<app-text-input label="Amount" type="number" [formControl]="control" />`,
})
class NumberHost {
  readonly control = new FormControl<number | null>(null);
}

describe('AppTextInput', () => {
  it('reflects programmatic writes and resets through ControlValueAccessor', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;

    expect(input.value).toBe('initial');
    fixture.componentInstance.control.setValue('updated');
    await fixture.whenStable();
    expect(input.value).toBe('updated');
    fixture.componentInstance.control.reset('');
    await fixture.whenStable();
    expect(input.value).toBe('');
  });

  it('propagates native changes, blur, and disabled state', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;

    input.value = 'typed';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('blur'));
    await fixture.whenStable();
    expect(fixture.componentInstance.control.value).toBe('typed');
    expect(fixture.componentInstance.control.touched).toBe(true);

    fixture.componentInstance.control.disable();
    await fixture.whenStable();
    expect(input.disabled).toBe(true);
    fixture.componentInstance.control.enable();
    await fixture.whenStable();
    expect(input.disabled).toBe(false);
  });

  it('emits numbers for numeric inputs and null for an empty value', async () => {
    const fixture = TestBed.createComponent(NumberHost);
    await fixture.whenStable();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;

    input.value = '12.5';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    expect(fixture.componentInstance.control.value).toBe(12.5);
    input.value = '';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    expect(fixture.componentInstance.control.value).toBeNull();
    fixture.componentInstance.control.setValue(42);
    await fixture.whenStable();
    expect(input.value).toBe('42');
  });
});
