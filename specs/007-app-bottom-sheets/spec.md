# Feature: 007 - App Sheets

Status: implemented — pending manual mobile validation
Branch: `dev`

## Problem

Angular Material Bottom Sheet owns a container whose interaction model cannot express the product requirement: the complete sheet must follow a deliberate downward gesture while preserving natural scrolling inside long content. Its reusable visual wrapper also did not belong in `core`.

## Goals

- Provide an application-owned sheet built on Angular CDK Overlay rather than `MatBottomSheet`.
- Keep the overlay primitive, sheet component, reference, data token, and styles in `shared/ui`.
- Let the full sheet follow a safe downward drag, not only its handle.
- Size each sheet from its content: short content opens compactly; longer content grows until a safe mobile maximum and then scrolls internally.
- Preserve accessible modal behavior, focus restoration, backdrop, Escape, close prevention during submission, and result handling.

## Non-goals

- Rebuild form payloads, validation, or business behavior.
- Add a dirty-form confirmation policy.
- Turn every dialog-like interaction into a sheet.
- Depend on Angular Material private overlay DOM or styling classes.

## Behavioral Rules

- Features and layout open sheets only through the public application sheet API.
- The shared sheet uses CDK Overlay for backdrop, positioning, portal attachment, and scroll blocking; it does not use `MatBottomSheet` or Material bottom-sheet configuration.
- A sheet takes its intrinsic content height up to its available safe viewport height. It must not open at full height when its content is short. Once content exceeds that maximum, only the sheet body scrolls.
- The maximum height accounts for safe-area insets, the virtual keyboard viewport, and a visible top margin.
- A downward drag may begin anywhere on the sheet surface when its scroll body is already at `scrollTop === 0`; controls and content that are actively scrolling retain their native interaction.
- A drag closes only when its distance or velocity crosses the documented threshold. Otherwise the whole sheet returns to rest.
- Backdrop click, Escape, the gesture, and any close affordance all respect close prevention while a form submits.
- The sheet is an accessible modal: it has a label, traps keyboard focus, receives initial focus appropriately, and restores focus to its opener when closed.

## Acceptance Criteria

- [x] No feature or layout component injects or opens `MatBottomSheet`.
- [x] Sheet primitives live in `shared/ui/app-sheet` and have no domain or `core` dependency.
- [x] Short selector and confirmation sheets open to their content height; long forms expand up to the safe viewport maximum and then scroll internally.
- [x] The whole sheet can be dragged down without breaking form controls or an already-scrolled body.
- [x] Close prevention works consistently for backdrop, Escape, gesture, and explicit close affordances.
- [ ] Focus, keyboard navigation, backdrop, safe areas, virtual keyboard behavior, and 320px/375px layouts pass manual validation.
- [x] No application style targets private Angular Material overlay or bottom-sheet classes.

## Open Questions

None.
