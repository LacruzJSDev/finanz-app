# Feature: 005 - Mobile UI Foundations

Status: planned
Branch: `dev`

## Problem

The application has a coherent Material 3 base, but its visual rules are split between global styles and component styles without a durable design contract. Some global customizations also target Material implementation classes, making future upgrades fragile.

## Goals

- Create `STYLES.md` as the durable visual and interaction contract for the application.
- Establish mobile-first layout, spacing, typography, surfaces, focus, safe-area, and touch-target rules.
- Keep Angular Material customization on its public token and configuration APIs.
- Make shared field groups and page scroll behavior consistent before feature-level restyling.

## Non-goals

- Change routes, API calls, state ownership, or business rules.
- Redesign individual domain screens in this feature.
- Replace Angular Material or introduce a second component library.
- Create a generic form component for domain forms.

## Behavioral Rules

- `STYLES.md` owns visual intent and usage rules; Sass and component code remain the source of truth for rendered implementation.
- The app remains single-column and mobile-first. Interactive controls retain a 44px minimum touch target; visual affordances may be smaller inside that target.
- Fixed mobile chrome and scrollable content account for `safe-area-inset-*` values where applicable.
- Field grouping remains a global visual primitive, not an Angular wrapper component. It supplies surface, border, separators, and visible focus/error treatment.
- Global Material styling uses supported Sass overrides. Overlay styling is scoped through application-owned `panelClass` values rather than `.mat-mdc-*` or other internal selectors.

## Acceptance Criteria

- [ ] `STYLES.md` documents the approved visual system and accessibility rules.
- [ ] Shared tokens and global primitives follow the contract.
- [ ] No application stylesheet targets private Material overlay implementation classes.
- [ ] Field groups, focus states, safe areas, and scroll areas meet the documented rules.
- [ ] Build, boundary checking, and visual verification at 320px and 375px pass.

## Open Questions

None.
