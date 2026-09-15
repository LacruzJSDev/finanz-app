# Plan: 007 - App Sheets

Branch: `dev`

## Tasks

| Task | Scope                                                                                                                                               | Depends on | Status                                 |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | -------------------------------------- |
| T001 | Define the shared application sheet API, reference, data token, result lifecycle, and close-prevention contract                                     | 005 T003   | complete                               |
| T002 | Build the shared CDK Overlay sheet with intrinsic height, safe maximum height, internal scroll, focus management, and full-surface drag arbitration | T001       | complete                               |
| T003 | Migrate all selectors, confirmations, and forms from Material bottom sheet to the shared API; remove the Material-specific provider and styles      | T001-T002  | complete                               |
| T004 | Validate content-driven sizing, drag/scroll handoff, submission close prevention, focus, keyboard, safe area, virtual keyboard, and mobile widths   | T003       | partial — manual mobile checks pending |

## Blockers

None.
