# Decisions: 007 - App Sheets

## D001: Application-owned sheet on CDK Overlay

**Decision:** Replace `MatBottomSheet` with a shared application sheet built on Angular CDK Overlay and Portal.

**Rationale:** The product needs whole-sheet drag behavior and sizing that Material Bottom Sheet does not expose as a public interaction contract. CDK retains Angular-owned overlay primitives without imposing Material's sheet container.

## D002: Sheet primitives belong to shared UI

**Decision:** The application sheet component, service, reference, data token, and styling live in `shared/ui/app-sheet`.

**Rationale:** They are reusable presentation and interaction primitives with no domain data or global application state. `core` remains reserved for data, state, and context.

## D003: Drag hands off to scrolling

**Decision:** The entire sheet is draggable only for a downward gesture beginning while its scroll body is at the top; interactive controls and normal content scrolling keep their native behavior.

**Rationale:** This gives the expected native-sheet gesture without turning normal form interaction or reading into accidental dismissal.

## D004: Height follows content before scrolling

**Decision:** Sheets use intrinsic content height until reaching a safe viewport maximum. Only overflow beyond that maximum becomes internally scrollable; full-height is an explicit exceptional mode, not the default.

**Rationale:** A selector or confirmation should feel compact, while a long form needs the extra space. A fixed default height wastes mobile space for short content and needlessly constrains long content.
