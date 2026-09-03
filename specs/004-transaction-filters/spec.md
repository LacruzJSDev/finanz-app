# Feature: 004 - Account Transaction Filters

Status: complete
Branch: `feature/budgets`

## Problem

The account transaction view only loads the account-specific paginated endpoint. Users cannot narrow a long movement list by category or find a note, despite the group transaction-query endpoint supporting those filters while retaining account scope.

## Goals

- Let users filter `/cuentas/:id/movimientos` by all categories, one active root category, or uncategorized movements.
- Let users search transaction notes within the selected account.
- Preserve infinite scrolling, transaction editing, deletion, and creation behavior.
- Use the server-filtered transaction query rather than filtering loaded pages in the client.

## Non-goals

- Add date-from or date-to controls.
- Add transaction-type filters.
- Search category names, account names, amounts, or dates.
- Add filters to group Analysis, account Analysis, Dashboard, or Budgets.
- Persist filter state in the URL or between page visits.
- Add a report-builder or transaction drill-down flow.

## Behavioral Rules

- The view queries `GET /api/v1/transactions/` with the current account's group id and account id, so every result remains restricted to that account.
- The category selector has `Todas`, active root categories, and `Sin categoría`. A root category includes its subcategories; `Sin categoría` sends `uncategorized=true` and never sends `category_id`.
- The text field maps to `q` and searches transaction notes only. Blank or whitespace-only text means no text filter.
- A category or settled search change starts again at offset zero, replaces the visible list, resets infinite-scroll availability, and supersedes any older response.
- The text field debounces requests; changing category applies immediately.
- The existing first-load loader, pagination spinner, interceptor error notification, and edit/delete interactions remain in place.
- An empty filtered result communicates that no movements match the active filters and offers a way to clear them. The existing no-movements state remains for an unfiltered account.

## Acceptance Criteria

- [x] A user can choose all movements, one active root category, or uncategorized movements from the account transaction page.
- [x] A user can search account transaction notes with a debounced input.
- [x] Category and text filters are combined server-side using the account's group id and account id.
- [x] Filtering resets pagination without appending results from a previous filter state; stale responses cannot replace current results.
- [x] Infinite scrolling continues to load pages for the active filter state.
- [x] Clearing filters restores the existing unfiltered transaction list and empty state.
- [x] No date or transaction-type control is shown.
- [x] Relevant tests, boundary checking, and build pass.

## Open Questions

None.
