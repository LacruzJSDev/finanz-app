# FinanzApp-owned design system

Status: implementation and Material removal complete; review closed by user acceptance. Unverified checks remain documented in T007.
Branch: `design-system-consolidation`.
This is the single execution plan, replacing provisional plans 008–012.
STYLES.md describes the implemented contract.

## Intended outcome

An application consuming FinanzApp components that can be redesigned through
tokens and shared component styles without editing every page. Scope includes
public/authenticated UI, forms, navigation, charts, states and overlays.

At completion, active code and shipped assets contain no Angular Material
dependency, generated theme, `--mat-*`/`--mdc-*` tokens, Material controls or
Material Icons font. Stored icon identifiers remain compatible through an owned map.

Initially preserve current colors, typography, cards, grouped fields, static
labels, navigation and mobile behavior. SVG drawings may change while preserving
meaning, size and alignment. A full visual redesign is a later product decision.

## Implementation decisions

- Standalone components in `src/app/shared/ui/<component>/`, separate TS/HTML/SCSS
  and local public exports. Extend existing components, especially AppSheet.
- SCSS and app-owned CSS variables; no additional styling framework.
- Semantic native elements with controlled appearance/border/background/font/size
  resets. Preserve editing, autocomplete, keyboard, semantics, focus and
  forced-colors accessibility rather than indiscriminately resetting everything.
- CDK for overlays/accessibility; Angular Aria for supported interaction patterns,
  starting with select/menu. Verify compatible versions/public APIs. Dependencies
  remain internal and do not dictate appearance.
- Owned select and calendar triggers/panels. No native dropdowns or native/Material
  calendars. Headless infrastructure does not replace accessibility verification.
- Lucide SVG behind AppIcon; verify Angular compatibility, import only used icons
  and an explicit picker catalog. Never import the entire library. Measure bundle
  size before claiming savings.
- Keep Reactive Forms. Value controls implement CVA; Field/InputGroup do not.
- Preserve architecture: core owns data, shared knows no business models, features
  own forms/permissions/domain composition. No domains-folder or route restructure.

References: [Angular Aria](https://angular.dev/guide/aria/overview),
[Aria/CDK select](https://angular.dev/guide/aria/select),
[Lucide Angular](https://lucide.dev/guide/packages/angular).

## Style ownership

| Owner                       | Responsibility                                             | Future change              |
| --------------------------- | ---------------------------------------------------------- | -------------------------- |
| `src/styles/_tokens.scss`   | Independent color, type, spacing, shape, elevation, motion | App palette/type           |
| `_reset.scss`, `_base.scss` | Document reset, fonts, focus, reduced motion               | Accessible global defaults |
| Shared component SCSS       | Anatomy, control reset, variants, states                   | All cards or inputs        |
| Layout SCSS                 | Viewport, safe area, bars, group trigger                   | Shell composition          |
| Feature SCSS                | Specific distribution, charts, domain meaning              | Dashboard statistics       |

styles.scss becomes a composition entry point. Required CDK Overlay structural
styles can remain global; use owned panel classes, not library internals.

Tokens have independent values derived initially from the current appearance,
not permanent aliases to Material tokens. Component tokens require an actual need.
Domain state can consume semantic tokens while its selection logic stays local.

Feature SCSS remains for specific composition. Repeated control/surface/state
styling belongs to shared owners, never page descendant selectors.

## Component inventory

Follow existing naming conventions; do not build variants without consumers.

| Family                         | Responsibility                                                                                                         |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| Button, IconButton, FAB        | Primary/secondary/destructive actions, disabled/loading/focus/touch targets; semantic links for navigation             |
| Icon                           | SVG, sizes, accessible/decorative state, stored-name compatibility and fallback                                        |
| Card                           | Surface/border/radius/padding/variants; distinguish navigation and cards with separate actions                         |
| List / ListItem                | Shared row geometry, leading marks, content, trailing actions; no fetching                                             |
| InputGroup                     | Shared surface/separators/focus; composed rows without control-internal selectors                                      |
| Field                          | Static label, help, required/error association and message reservation; no floating labels                             |
| TextInput / Textarea           | Styled native editing, required types, disabled/readonly, validation, Forms                                            |
| Select                         | Value/label, trigger, customizable options/panel, selected vs focused, empty and Forms; search/multiple only as needed |
| DatePicker                     | Input/trigger, calendar, month/year navigation, limits/locale/errors/Forms; no timezone shifts                         |
| Switch / SegmentedControl      | Boolean/single selection, keyboard and owned styling                                                                   |
| Loader / Progress / EmptyState | Loading/progress/empty/actions, announcements, reduced motion; no fetching                                             |
| Toast / Menu / Disclosure      | Existing notifications, pop-up actions and expansion even with one consumer                                            |
| AppSheet                       | Reuse panel; tokens, content-dependent height, gestures, focus, scroll lock                                            |
| PageContent and existing marks | Preserve scroll owner; adapt avatar/color/icon marks/stat tiles                                                        |

CategorySelect remains domain UI supplying options/marks to Select. ColorPicker,
IconPicker and AmountInput reuse controls. Forms own their model, rules, messages
and submission. PageContent does not fetch data or govern forms.

## Execution sequence

Each stage delivers integrated code and retires replaced implementation.
Verification uses real components/consumers, without a disposable visual spike
or another global audit gate.

### T001 — Tokens, Button, Card and InputGroup

Status: implemented. Integrated validation remains in T007.

1. Extract current values into independent tokens; separate base/reset/composition.
   Retain the old theme only for remaining Material consumers.
2. Implement Button/Card/InputGroup in separate files. Keep one grouped surface,
   not a card around each input.
3. Integrate Button/Card into accounts/groups and InputGroup in an existing form.
   Material fields may temporarily remain inside until T003.
4. Update STYLES.md and the AGENTS.md Material requirement.

Exit: shared components with owned styling. Temporarily change radius/color/spacing
centrally to verify propagation, then restore current values. Check 320/375px/desktop.

### T002 — Icons and remaining primitives

Status: implemented. Depends on T001.

1. Add compatible Lucide, AppIcon and stored-name mapping; adapt catalog/picker/marks
   without changing backend data.
2. Complete IconButton/FAB, rows, loaders/progress/empty states, reusing existing pieces.
3. Migrate family consumers including navigation/public screens; delete replaced
   rules/assets after the last consumer migrates.

Exit: no Material icon font/ligatures, bounded primitive variants and accessible
actions without duplicated page styling.

### T003 — Fields and grouped forms

Status: implemented. Depends on T001–T002.

1. Implement Field/TextInput/Textarea and adapt AmountInput. Associate label/help/error
   with the actual control, including projection.
2. Implement Switch/SegmentedControl; cover disabled, applicable readonly, touched,
   server errors, reset and programmatic changes.
3. Migrate text forms/grouped rows; support two-control and switch rows through owned APIs.

Exit: current static labels and working Forms, no mat-form-field group dependency
or duplicate global control styling.

### T004 — Select, categories, icons and colors

Status: implemented. Depends on T003.

1. Implement Aria/CDK Select with owned trigger/panel/marked options, separate
   value/label, distinct selected/focused states and Forms.
2. Validate opening, selection, Escape, outside click, Tab, focus restoration,
   viewport constraints and scrolling inside AppSheet.
3. Adapt CategorySelect/IconPicker/ColorPicker and remaining selects. Domain UI
   supplies data; shared controls own geometry and interaction.

Exit: no Material/native select popup; selection and long labels work with touch/keyboard.

### T005 — Owned calendar

Status: implemented. Depends on T003–T004.

1. Implement DatePicker with owned calendar/CDK overlay/focus and suitable accessible
   primitives. Do not assume Aria supplies a datepicker.
2. Define one date API and explicitly adapt Date/ISO values. Cover month/year,
   local week, today vs selected, limits, empty/invalid, adjacent dates and leap years.
   Center the popup on its trigger, with viewport-safe positioning. The month
   heading opens a 12-month grid; the year heading opens a paged 12-year grid.
   Choosing year/month drills down without committing a form value. Only choosing
   a day commits the date. Respect date limits and keyboard navigation in all views.
3. Validate calendar keyboard, month/selection announcements, close/cancel/focus,
   nested sheets; migrate transactions and payment plans.

Exit: cross-browser calendar without native/Material picker or payload/timezone
regressions. This is the highest-complexity stage.

### T006 — Overlays, shell and complete adoption

Status: implemented. Depends on T002–T005.

1. Implement Toast/Menu/Disclosure for existing uses; adapt AppSheet/confirmations
   without rebuilding the service unnecessarily.
2. Migrate shell/public/dashboard/domain cards/charts. Preserve routes, permissions,
   and service contracts.
3. Preserve compact nav with/without FAB, unlabelled buttons, centered group trigger,
   content beneath floating chrome; clearance 9rem with trigger / 6rem without plus safe area.
4. Preserve second-level topbar return, long titles, content-dependent sheets and
   background scroll lock during gestures.

Exit: all screens consume the system; shared styles have owners. No Material
family is left merely because it has few consumers.

### T007 — Final removal and redesign proof

Status: implementation review closed by user acceptance; unverified checks listed below. Depends on T006.

- Passed: formatting, boundary lint, 91 tests across 29 files, production build.
  The initial bundle is 541.73 kB, above the 500 kB warning budget.
- Browser checks: Chrome, Firefox and WebKit at 320/375px and desktop for the
  migrated select/calendar and representative screens. Nested Escape preserves
  the sheet; calendar fits the viewport. Ten authenticated page families were
  visited in Firefox/WebKit without runtime errors or document overflow.
- Redesign proof: temporary surface/radius token changes propagated to real
  card consumers without page edits; original values restored.
- Remaining: final mobile composition screenshots, full CRUD acceptance,
  physical-device safe area/keyboard/gestures and assistive-technology checks.
  Automated local transaction CRUD was blocked by the execution safety review;
  no test transaction was created. Do not mark this check as passed.

1. Remove Material imports/providers/theme/overrides/icon assets and dependency.
   Remove other packages only after proving they have no consumers; CDK/Aria may remain.
2. Check TS/HTML/SCSS/assets/config/dependencies; delete dead/duplicate styles.
   Historical docs/stored icon names are not active visual dependencies.
3. Measure final bundle and validate every page family and CRUD flow.
4. Temporarily change palette/type/radius/density through tokens and card/field
   anatomy through components; verify propagation without page edits; restore appearance.

Exit: complete redesignable system without Material; STYLES.md describes actual
owners/APIs. The user has accepted and closed this implementation review;
the unverified checks above are not claimed as passed.

## Current SCSS destinations

Delete each file after its final consumer migrates, not all at the beginning.

| Current file                                          | Destination                                                |
| ----------------------------------------------------- | ---------------------------------------------------------- |
| `_theme-colors.scss` and Material theme               | Independent tokens; remove generation                      |
| `_reset.scss`                                         | Keep/review document reset                                 |
| `_material-icons.scss`                                | Delete with fonts/links after SVG migration                |
| `_icon.scss`                                          | Icon/mark component styles                                 |
| `_card.scss`                                          | Card/shared rows                                           |
| `_grouped-card.scss`                                  | InputGroup/owned row composition                           |
| `_form-field.scss`                                    | Field/owned controls                                       |
| `_select.scss`                                        | Select/panel                                               |
| `_slide-toggle.scss`, `_button-toggle.scss`           | Switch/SegmentedControl                                    |
| `_fab.scss`                                           | FAB/IconButton and layout positioning                      |
| `_progress-spinner.scss`                              | Loader/Progress                                            |
| `_snack-bar.scss`                                     | Toast                                                      |
| `_expansion.scss`                                     | Disclosure                                                 |
| `_bottom-sheet.scss`                                  | Reusable form/sheet owner; specific content stays in forms |
| page-container/page-section/form-error in styles.scss | Layout/page and appropriate form/error owner               |

## Validation and completion

- Per stage: format touched files, boundary lint, focused behavioral tests and
  production build on a supported runtime. Resolve Node environment problems
  before attributing build aborts to application code.
- Compare real consumers at 320/375px/desktop across Chrome, Firefox and
  Safari/WebKit. Require consistent geometry/states/interaction, not identical font rasterization.
- Mobile: safe area, virtual keyboard, zoom, long content, nested panels and scroll.
  Emulation cannot certify physical-device keyboard/safe-area behavior; report
  outstanding physical checks without claiming verification.
- Accessibility: keyboard, visible/restored focus, names/errors, screen reader
  behavior for select/calendar, contrast and reduced motion.
- Verify create/edit with existing contracts/permissions. Local test data is
  authorized; no API/backend/generated-client changes.
- Captures support verification, not another documentation phase. Keep only
  milestone status and actionable blockers here.
