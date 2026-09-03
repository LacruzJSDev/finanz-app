# Feature: 003 - Monthly Statistics

Status: complete
Branch: `feature/budgets`

## Problem

The application already exposes current financial attention, account-level category summaries, and budget progress, but users cannot inspect how the active group's money was distributed in a selected month. Budget progress is also limited to the current month despite API support for a selected month.

## Goals

- Add one group-level monthly Analysis view for active-group income and spending distribution.
- Keep account statistics scoped to an individual account within its existing detail section.
- Let members inspect budget progress for the current or a previous month.
- Make group and account Analysis discoverable from their respective cards without expanding primary mobile navigation.
- Preserve the existing Dashboard as an immediate attention and forecast surface.

## Non-goals

- Add an Analytics item to bottom navigation.
- Duplicate group analysis metrics on Dashboard.
- Build historical spending or account-balance trend charts.
- Add transaction-level drill-down, report-builder filters, or comparisons between periods.
- Show budget-configuration history from `GET /api/v1/budgets/{category_id}/history`.
- Recreate server financial calculations in the client.

## Behavioral Rules

- Group Analysis represents the group identified by `/grupos/:id`, independently of the active group context, and defaults to the current month; users may move backward by whole months but not into the future. It is reached from the group card's Analysis action.
- Group Analysis uses root-category totals for the selected inclusive month range and is not limited to an account.
- Account Analysis at `/cuentas/:id/analisis` keeps the same monthly control and uses the selected account as its scope; it is reached from the account card's Analysis action.
- Budget month selection requests the API's progress representation for a date within the chosen month; it does not infer progress locally.
- Dashboard continues to use the existing group Overview model for current attention and forecast. Its Analysis link does not load or render duplicate analysis data.
- Statistics requests are made only through `core`; generated API services remain private to that layer.
- First-load, no-data, and error behavior follows the existing page loader, empty-state, and interceptor notification patterns.

## Acceptance Criteria

- [x] `/grupos/:id/analisis` is a private, lazy-loaded page reachable from the group card without a new bottom-navigation item.
- [x] Analysis defaults to the current month and supports navigation to prior months only.
- [x] Analysis shows selected-month total spending, total income, and root-category distributions without a chart or transaction drill-down.
- [x] Account Analysis remains available at `/cuentas/:id/analisis`, is reachable from the account card, and remains scoped to that account and selected month.
- [x] Budgets supports the current month and prior months, displaying only API-provided progress for the selected month.
- [x] Dashboard retains its current overview, safe-spend, pending-expense, and projection responsibilities without an Analysis action or duplicate monthly-analysis card.
- [x] New data access respects `ARCHITECTURE.md`; relevant tests, boundary checking, and build pass.

## Open Questions

None.
