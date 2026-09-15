import { AVAILABLE_ICONS } from './icons';
import { APP_ICONS, resolveAppIcon } from './icon-registry';

describe('SVG icon compatibility', () => {
  it('maps every stored catalog identifier to a concrete SVG', () => {
    for (const name of AVAILABLE_ICONS) {
      expect(APP_ICONS[name], name).toBeDefined();
      expect(APP_ICONS[name].node.length, name).toBeGreaterThan(0);
    }
  });
  it('uses a stable fallback for missing and unknown identifiers', () => {
    expect(resolveAppIcon(null)).toBe(APP_ICONS['block']);
    expect(resolveAppIcon('unknown-icon')).toBe(APP_ICONS['block']);
  });
});
