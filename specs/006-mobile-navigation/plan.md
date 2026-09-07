# Plan: 006 - Mobile Navigation Redesign

Branch: `dev`

## Tasks

| Task | Scope                                                                                                                                                                                                        | Depends on | Status                                              |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- | --------------------------------------------------- |
| T001 | Replace icon-only primary navigation with uniformly sized, route-active icon navigation while preserving the contextual FAB                                                                                  | 005 T002   | complete                                            |
| T002 | Extend the existing `PageContextService` with optional explicit parent-return metadata and render it as a leading top-bar icon only on second-level routes                                                   | T001       | complete                                            |
| T003 | Build a centred, layout-owned floating group trigger that reuses the existing `showGroup` signal and group-switcher sheet; publish 6rem/9rem dynamic scroll clearance without adding group UI to the top bar | T001       | complete                                            |
| T004 | Make group switching route-safe and convert detail section controls to accessible route navigation                                                                                                           | T002-T003  | complete                                            |
| T005 | Validate navigation hierarchy, keyboard behavior, narrow-width layouts, and route transitions                                                                                                                | T001-T004  | partial — manual visual and keyboard checks pending |

## Blockers

None.
