# Feature: 006 - Mobile Navigation Redesign

Status: implemented — pending manual visual validation
Branch: `dev`

## Problem

The current mobile navigation exposes primary destinations as icon-only controls without visible active state, detail pages lack an explicit hierarchy-preserving return action, and the active group is visible but not clearly actionable.

## Goals

- Make the four primary destinations icon-based, route-active, and consistently sized: Summary, Groups, Accounts, and Budgets.
- Preserve the contextual page action as a central add/edit FAB.
- Make switching the active working group visible without consuming top-bar width or adding a new primary destination.
- Make route-section controls communicate navigation semantics and active state.

## Non-goals

- Change the current route ownership or move Categories back to primary navigation.
- Add analytics or categories to primary navigation.
- Change data loading, permissions, or account/group business behavior.
- Introduce desktop navigation as part of this work.

## Behavioral Rules

- Bottom navigation uses real router links, uniform icon targets, and an active state that is also exposed to assistive technology. The visible page title supplies current context; each icon retains an accessible name.
- Categories remains a group-detail section at `/grupos/:id/categorias`; its route is not a bottom-navigation destination.
- The contextual FAB appears only when a page supplies an action and does not replace a primary destination.
- The top bar keeps its existing page title, optional page detail, and account menu. It does not render an additional group switcher or group-name chip.
- A second-level page may provide one explicit parent return action through the existing `PageContextService`. The top bar renders it as a leading icon button, with an accessible label naming its destination, before the identity block.
- The return button has a 44px minimum target. It is omitted from first-level pages so the title retains the maximum available width there.
- An isolated layout-owned group trigger floats above the bottom navigation when the existing `PageContextService.showGroup` signal is true. It shows the active group name with truncation, has an accessible name, and opens the existing group-switcher sheet.
- The group trigger and bottom navigation float over the scrollable page without shrinking the shell. The layout publishes a bottom-clearance CSS variable consumed by `PageContent`: `6rem` when only the navigation is visible and `9rem` when the group trigger is also visible, both plus the safe-area inset. This lets the last scrollable content clear the chrome without creating a permanent layout band. Their surfaces remain translucent so content is still visible underneath. Group-detail routes that already set `showGroup: false` do not show the trigger.
- Profile/session actions remain in the account menu; the floating trigger is exclusively for changing the active working group.
- Account and group detail section controls are labelled navigation, not unlabelled local toggles.

## Acceptance Criteria

- [ ] Bottom navigation exposes four consistently sized icon destinations, retains accessible names, and reflects the active route.
- [ ] Interactive targets and fixed chrome meet the shared mobile foundations contract.
- [ ] The top bar remains stable with long page titles, contains no group-switching affordance, and renders a 44px leading return target only on second-level routes.
- [ ] Each return action names and navigates to its explicit parent destination while browser back behavior remains unchanged.
- [ ] The floating group trigger is visible only where `showGroup` permits it, remains usable with long group names, is centred above bottom navigation, preserves visibility of the content underneath, and exposes a `9rem` scroll clearance; pages without it retain `6rem`.
- [ ] Group switching cannot leave a user on a group-scoped route with contradictory context.
- [ ] Section navigation has an accessible name and communicates its active route.
- [ ] Build, boundary checking, keyboard checks, and 320px/375px visual checks pass.

## Open Questions

None.
