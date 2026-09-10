import { TestBed } from '@angular/core/testing';
import { AppToast, APP_TOAST_DATA, AppToastData, AppToastRef } from './toast';

describe('AppToast', () => {
  function createToast(data: AppToastData) {
    const ref = new AppToastRef();
    TestBed.configureTestingModule({
      imports: [AppToast],
      providers: [
        { provide: APP_TOAST_DATA, useValue: data },
        { provide: AppToastRef, useValue: ref },
      ],
    });
    return { fixture: TestBed.createComponent(AppToast), ref };
  }

  it('uses status for informational messages and dismisses from the close button', async () => {
    const { fixture, ref } = createToast({ message: 'Guardado', kind: 'info' });
    const dismissed = vi.fn();
    ref.afterDismissed().subscribe(dismissed);
    await fixture.whenStable();

    expect(fixture.nativeElement.getAttribute('role')).toBe('status');
    (
      fixture.nativeElement.querySelector('[aria-label="Cerrar notificación"]') as HTMLElement
    ).click();
    expect(dismissed).toHaveBeenCalledOnce();
  });

  it('uses alert for errors and emits configured actions', async () => {
    const { fixture, ref } = createToast({ message: 'Error', action: 'Reintentar', kind: 'error' });
    const action = vi.fn();
    ref.onAction().subscribe(action);
    await fixture.whenStable();

    expect(fixture.nativeElement.getAttribute('role')).toBe('alert');
    (fixture.nativeElement.querySelector('button:not([aria-label])') as HTMLElement).click();
    expect(action).toHaveBeenCalledOnce();
  });
});
