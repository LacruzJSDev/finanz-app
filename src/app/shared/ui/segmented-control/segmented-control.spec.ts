import { TestBed } from '@angular/core/testing';
import { AppSegmentedControl } from './segmented-control';

describe('AppSegmentedControl', () => {
  it('accepts a new controlled value after user selection', async () => {
    const fixture = TestBed.createComponent(AppSegmentedControl);
    fixture.componentRef.setInput('options', [
      { value: 'a', label: 'A' },
      { value: 'b', label: 'B' },
    ]);
    fixture.componentRef.setInput('value', 'a');
    await fixture.whenStable();
    const inputs = fixture.nativeElement.querySelectorAll('input') as NodeListOf<HTMLInputElement>;
    inputs[1].click();
    await fixture.whenStable();
    fixture.componentRef.setInput('value', 'b');
    await fixture.whenStable();
    fixture.componentRef.setInput('value', 'a');
    await fixture.whenStable();
    expect(inputs[0].checked).toBe(true);
    expect(inputs[1].checked).toBe(false);
  });
});
