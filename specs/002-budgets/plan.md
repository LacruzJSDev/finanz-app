# Plan: 002 - Budgets

Branch: `feature/budgets`

## Tasks

| Task | Scope | Depends on | Status |
| --- | --- | --- | --- |
| T001 | Add budget state boundary and request replacement handling | - | implementation complete, review pending |
| T002 | Add lazy route, page, progress cards, and navigation | T001 | implementation complete, review pending |
| T003 | Add budget management bottom sheet | T001, T002 | implementation complete, review pending |
| T004 | Record executed validation | T001-T003 | implementation complete, review pending |
| T005 | Inventory daily transactions, account balances, and upcoming plans; add required `core` boundaries, request replacement, and empty states without removing unrelated generated endpoints | T001-T004 | pending; independent feature candidate |
| T006 | Decide history placement, then show API-ordered current and closed periods through `core` without reconstructing validity ranges | T001-T004 | pending; independent feature candidate, blocked by product presentation decision |

## Blockers

- T006 needs a product decision on whether history is inline, in a bottom sheet, or on a dedicated route.

## Follow-up Candidates

- T005: Statistics integration has separate endpoint inventory, state, and UI scope.
- T006: Budget history has distinct acceptance criteria and a pending product decision.
