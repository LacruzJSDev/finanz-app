# Plan: 004 - Account Transaction Filters

Branch: `feature/budgets`

## Tasks

| Task | Scope                                                                                                                                                                                                          | Depends on | Status   |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | -------- |
| T001 | Extend the transaction-list core path to query the group transaction endpoint with account scope, category, uncategorized, and note-query parameters while preserving pagination and stale-response protection | -          | complete |
| T002 | Add account-page interaction state for root-category selection and debounced note search; reload the first page whenever the settled filter state changes                                                      | T001       | complete |
| T003 | Render the mobile-first category selector, note input, filtered empty state, and clear action using existing form and empty-state patterns                                                                     | T002       | complete |
| T004 | Cover request replacement and pagination under changing filters; run formatting, boundary checking, tests, and build                                                                                           | T001-T003  | complete |

## Constraints

- Only `core` calls the generated API client.
- Use the current account's group id and account id for every filtered request.
- Category filtering is root-category-only; uncategorized is a distinct API mode.
- Do not add date or transaction-type filters.

## Blockers

None.
