# Validation: 007 - App Sheets

## Automated checks

- `npx tsc --noEmit -p tsconfig.app.json`: passed.
- `npm run lint:boundaries`: passed.
- Prettier on touched source and specification files: passed.
- `git diff --check`: passed.
- Search confirms no application import of `@angular/material/bottom-sheet` and no private Material overlay selectors.

## Manual validation pending

- Drag/scroll handoff on a physical mobile browser.
- Focus restoration, keyboard navigation, Escape, and backdrop dismissal.
- Long forms with safe-area and virtual keyboard at 320px and 375px widths.
