# FinanzApp visual contract

This document defines the visual and interaction intent for the frontend. Sass
and component styles remain the source of truth for the rendered implementation.

## Foundations

- The layout is mobile-first and single-column. Content may widen at larger
  viewports, but it must not require horizontal scrolling.
- Use the Angular Material 3 system tokens for color, typography, elevation and
  shape. App-specific spacing uses the shared `--app-space-*` tokens.
- Surfaces use the Material surface roles and borders use `outline-variant`.
  Prefer the existing card and grouped-card primitives over one-off panels.
- Body text uses the Material typography roles. Labels are short, clear and
  consistently aligned; uppercase labels are reserved for form labels.

## Responsive and viewport rules

- Interactive controls have a minimum 44px touch target, even when the visible
  icon or affordance is smaller.
- Fixed chrome (bottom navigation, floating actions and similar controls) must
  include the relevant `safe-area-inset-*` padding or offset.
- Private pages use a bounded viewport with one explicit scroll owner;
  public pages scroll as a document. Scroll regions keep enough bottom space for
  fixed chrome.
- Verify layouts at 320px and 375px wide, including long labels and keyboard
  focus states.

## Interaction and accessibility

- Keyboard focus is always visible with `:focus-visible`; do not remove the
  browser focus indicator without supplying an equivalent high-contrast ring.
- Color is not the only error indicator. Invalid grouped fields expose a
  visible border/focus/error treatment and retain their error text.
- Preserve semantic headings, labels and button names. Do not use a decorative
  affordance as the only interactive target.
- Respect reduced-motion preferences for transitions introduced by app styles.

## Shared primitives

`.grouped-card` is the global field-group primitive. It supplies the surface,
border, row separators and spacing around projected/direct child fields. Keep it
as CSS; domain forms remain responsible for their own structure and validation.

## Angular Material boundary

Use public Material Sass mixins/tokens and public component configuration. App
overlay appearance is applied through application-owned `panelClass` values such
as `.app-bottom-sheet` and `.app-select-panel`. Never style `.mat-mdc-*`,
`.cdk-overlay-*` or other Material implementation selectors in application
stylesheets.

## Validation expectation

Before a foundation change is considered complete, run formatting, boundary
linting and a production build, then inspect the principal shell and overlay
states at 320px and 375px when visual tooling is available.
