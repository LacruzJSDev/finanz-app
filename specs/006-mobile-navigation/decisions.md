# Decisions: 006 - Mobile Navigation Redesign

## D001: Four icon-based primary destinations

**Decision:** The mobile bottom navigation contains icon controls for Summary, Groups, Accounts, and Budgets. Categories remains under Group detail. The top-bar page title provides visible context; every icon has an accessible name and the active route has a visible indicator.

**Rationale:** These are the current four primary product areas. Categories is group administration, not a peer destination. Removing labels keeps all navigation targets visually homogeneous and avoids repeating the page context already present in the top bar.

## D002: Page action remains contextual

**Decision:** Add/edit remains a page-provided FAB between primary destinations rather than becoming a persistent destination.

**Rationale:** Its meaning changes by page and it should not compete with stable wayfinding.

## D003: The active-group trigger belongs to the layout, not the top bar

**Decision:** Render an isolated, centred floating group trigger above bottom navigation when the existing `showGroup` page-context signal permits it. Do not add group UI to the top bar. Both controls float over content with translucent surfaces; `Shell` publishes `--app-page-bottom-clearance` as 6rem without the trigger and 9rem with it, plus the safe-area inset, and `PageContent` consumes it as end padding.

**Rationale:** Long page and group names already make the top bar width-constrained. Keeping this chrome floating preserves the useful vertical space on mobile while its translucency retains visual continuity with content behind it. End padding belongs to the scroll container so its final content remains reachable, instead of turning into a fixed empty band in the layout.

## D004: Second-level return uses a leading icon

**Decision:** A second-level route may provide an explicit parent return action through the existing page context. The top bar renders it as one leading icon button with a destination-specific accessible label.

**Rationale:** A fixed-width icon target preserves hierarchy and uses far less horizontal space than a text action. It is absent from first-level pages, where the title receives the full available width.
