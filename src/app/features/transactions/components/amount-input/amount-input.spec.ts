import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TestBed } from '@angular/core/testing';
import { TransactionTypeEnum } from '../../../../core/models';
import { AmountInput } from './amount-input';

@Component({
  imports: [ReactiveFormsModule, AmountInput],
  template: `<app-amount-input [control]="control" [type]="type" />`,
})
class Host {
  readonly control = new FormControl(12.5, { nonNullable: true });
  readonly type = TransactionTypeEnum.Income;
}

describe('AmountInput', () => {
  it('keeps numeric values when rendered through the owned text input', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;

    expect(input.value).toBe('12.5');
    input.value = '18.75';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    expect(fixture.componentInstance.control.value).toBe(18.75);
    input.value = '';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    expect(fixture.componentInstance.control.value).toBeNull();
  });

  it('preserves the transaction sign and currency suffix', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('.amount-sign').textContent.trim()).toBe('+');
    expect(fixture.nativeElement.querySelector('.amount-currency').textContent.trim()).toBe('€');
  });
});
