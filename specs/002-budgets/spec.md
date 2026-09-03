# Feature: 002 - Budgets

Status: implementation in progress
Branch: `feature/budgets`

## Problem

Active-group categories need a view for defining and monitoring monthly spending limits.

## Goals

- Show active-group budgets with amount, spending, remaining amount, and consumed percentage.
- Let `owner` and `admin` set, replace, or remove an active category budget.
- Preserve existing mobile navigation and design patterns.

## Non-goals

- Show budget-configuration history.
- Create budgets for archived categories or edit categories.
- Add budgets to the dashboard or account details.
- Reproduce server financial calculations in the client.

## Behavioral Rules

- The current list comes only from `GET /api/v1/budgets/?group_id=...`.
- Set uses `PUT /api/v1/budgets/{category_id}` with a positive cents value; remove uses `DELETE /api/v1/budgets/{category_id}`.
- The list changes only after the API confirms an operation; errors use the existing HTTP-interceptor path.
- The UI does not infer budgets for categories absent from the API response.
- Any active-group member can view budgets; only `owner` and `admin` can manage them. The API remains the final authorization authority.

## Acceptance Criteria

- [ ] The lazy `/presupuestos` route loads within the private shell.
- [ ] An active group shows API-provided budget progress.
- [ ] Owners and admins can create, replace, and remove a budget; other members are view-only.
- [ ] Loading, empty, and interceptor-delegated error states are present.
- [ ] Relevant tests, boundary checking, and build pass.

## Open Questions

- Budget-configuration history presentation is not defined and remains out of scope under D001.
