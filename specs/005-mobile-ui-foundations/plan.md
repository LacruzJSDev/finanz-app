# Plan: 005 - Mobile UI Foundations

Branch: `dev`

## Tasks

| Task | Scope                                                                                                                        | Depends on | Status                                                      |
| ---- | ---------------------------------------------------------------------------------------------------------------------------- | ---------- | ----------------------------------------------------------- |
| T001 | Write `STYLES.md` with visual tokens, responsive rules, component patterns, Material boundaries, and validation expectations | -          | complete                                                    |
| T002 | Align theme tokens, global reset, page scrolling, safe areas, focus, and touch-target rules with the contract                | T001       | complete                                                    |
| T003 | Consolidate field-group styling and migrate overlay styling to owned `panelClass` values and public Material APIs            | T001       | complete                                                    |
| T004 | Validate global visual foundations at narrow mobile widths and run static checks                                             | T002-T003  | partial — static checks complete; visual inspection pending |

## Blockers

None.
