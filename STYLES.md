# FinanzApp visual contract

This document defines the visual and interaction intent for the frontend. Sass
and component styles remain the source of truth for the rendered implementation.

## Foundations

- The layout is mobile-first and single-column. Content may widen at larger
  viewports, but it must not require horizontal scrolling.
- Use independent `--app-*` tokens in `src/styles/_tokens.scss` for color,
  typography, spacing, shape and motion. New components consume only these app tokens.
- Surfaces use AppCard and grouped forms use AppInputGroup. Their own component
  SCSS owns borders, spacing and states.
- Body text uses app typography roles. Labels are short, clear and
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

`button[appButton]` / `a[appButton]` supply filled, outlined, text, icon and FAB
variants. Their semantic host preserves form/link behavior. Loading blocks
activation while retaining the action's accessible name.

`app-card` supplies outlined/filled/elevated surfaces and row/column composition.
Its `spacing` input is independent of `layout`: `standard` uses 16px padding;
`compact` uses 12px vertically and 16px horizontally, through spacing tokens.
Record cards and disclosures share `compact`; content determines their height.
Navigation and trailing actions remain separate semantic controls.

`app-input-group` supplies one surface, border, projected-row separators and
focus treatment. It knows no control internals. Forms own validation and data.
`app-field` supplies static labels, required markers, hint/error descriptions and
the reserved message line. `app-text-input` is a CVA control with a `multiline`
option for textareas; it keeps native editing semantics while owning its input anatomy. `app-select`
is a CVA string/null control with an app-owned trigger and CDK overlay panel;
Angular Aria listbox behavior supplies keyboard navigation while option content,
selected/focused states and geometry remain application-owned. `app-date-picker`
is also a CVA control and exposes `Date | null`; feature forms perform explicit
local `Date`/ISO mapping at their API boundary. Its popup is centered on the trigger
and constrained to the viewport. Clickable month/year headings expose 12-month
and paged 12-year grids; intermediate choices never commit the form value.

`app-icon` is the only shared icon renderer. Persisted identifiers are resolved
through the owned registry and rendered with Lucide SVG. Pickers and domain
wrappers construct options; the shared select owns interaction and popup layout.

## Style ownership

The top-bar title alone uses the brand family, Space Grotesk, through
`--app-font-top-bar-title`. Other typography roles retain Geist. Font loading
is declared in `src/index.html`.

- `styles.scss`: composition only.
- `_tokens.scss`: independent semantic values; `_base.scss` / `_reset.scss`: document defaults.
- Shared component SCSS: control anatomy, variants and state.
- Layout SCSS: viewport, chrome and safe-area placement.
- Feature SCSS: domain-specific composition and meaning, not shared control skins.

## Integration boundary

Core services own data and generated API contracts. Shared UI owns reusable
geometry, interaction, accessibility and app tokens; it does not know business
models. Features own option construction, permissions, validation and payload
mapping. CDK overlay, Angular Aria and Lucide are internal implementation
dependencies: they provide behavior or rendering infrastructure, not the visual
contract and not feature-facing styling. Overlay panels use application-owned
classes and tokens, with no dependency on library-internal selectors.

## Validation expectation

`AppSwitch.change` and Forms values update immediately. Use `changeSettled` for
actions that remove the control (category archiving): it fires after the thumb
transition, with a fallback for reduced motion or interrupted transitions.
Category browsing renders one active/archived list inside one page scroll owner.
Income and expense amounts use positive/danger semantic tokens, never primary
as a substitute for positive. Motion must respect reduced-motion preferences.

Before a foundation change is considered complete, run formatting, boundary
linting and a production build, then inspect the principal shell and overlay
states at 320px and 375px when visual tooling is available. Current milestone
status is tracked in `specs/008-design-system/plan.md`; implementation status
does not by itself claim every screen or physical-device behavior is validated.
