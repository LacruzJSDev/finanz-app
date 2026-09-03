# Plan: 003 - Monthly Statistics

Branch: `feature/budgets`

## Tasks

| Task | Scope | Depends on | Status |
| --- | --- | --- | --- |
| T001 | Add the isolated core read boundary for group monthly category analysis, including loading and stale-response handling | - | complete |
| T002 | Add the private lazy group Analysis route and group-card access; render selected-month group totals and category distributions | T001 | complete |
| T003 | Preserve and align account-scoped monthly Analysis, including account-card access | - | complete |
| T004 | Add selected-month navigation and reload behavior to Budgets | - | complete |
| T005 | Validate touched behavior, import boundaries, and production build; record evidence | T001-T004 | complete |

## Blockers

None.
