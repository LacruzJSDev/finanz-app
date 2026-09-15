import { OverlayRef } from '@angular/cdk/overlay';
import { AppSheetRef } from './app-sheet-ref';

describe('AppSheetRef dismissal motion', () => {
  it('waits for the sheet transform transition and emits once', () => {
    const host = document.createElement('div');
    const surface = document.createElement('section');
    surface.className = 'app-sheet';
    const child = document.createElement('div');
    surface.append(child);
    host.append(surface);
    document.body.append(host);
    const dispose = vi.fn();
    const ref = new AppSheetRef({ overlayElement: host, dispose } as unknown as OverlayRef);
    const results: unknown[] = [];
    ref.afterDismissed().subscribe((result) => results.push(result));

    ref.dismiss('saved');
    expect(dispose).not.toHaveBeenCalled();
    child.dispatchEvent(new Event('transitionend', { bubbles: true }));
    expect(dispose).not.toHaveBeenCalled();
    const transition = new Event('transitionend');
    Object.defineProperty(transition, 'propertyName', { value: 'transform' });
    surface.dispatchEvent(transition);
    ref.dismiss('ignored');

    expect(dispose).toHaveBeenCalledOnce();
    expect(results).toEqual(['saved']);
    host.remove();
  });
});
