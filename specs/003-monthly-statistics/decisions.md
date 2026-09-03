# Decisions: 003 - Monthly Statistics

## D001: Use a restrained hybrid statistics structure

**Decision:** Keep account Analysis scoped to one account and budget progress in Budgets; add one group-level monthly Analysis view. Both Analysis views are reached from the corresponding group or account card.

**Rationale:** Group-wide category distribution answers a different question from an individual account or budget. Card actions keep the analysis entry point close to the entity being inspected without crowding segmented or primary mobile navigation.

## D002: Dashboard remains an attention surface

**Decision:** Dashboard keeps current financial attention and payday projection without an Analysis action or duplicate monthly-summary card.

**Rationale:** Its existing Overview model is current-state and forecast oriented; monthly reporting belongs in a separate, on-demand view.

## D003: Analysis is monthly distribution, not a trend report

**Decision:** Analysis defaults to the current month, supports earlier whole months, and uses totals plus ordered category shares without a chart, comparisons, or transaction drill-down.

**Rationale:** The available summary contract provides category aggregates for an arbitrary range, not historical buckets or transaction references. Ordered amounts and shares communicate the available data directly.

## D004: Historical budget progress is in first delivery; configuration history is not

**Decision:** Budgets supports selecting prior months through its existing monthly progress endpoint. The category budget-history endpoint remains out of scope.

**Rationale:** Selected-month progress answers whether the user stayed within a budget in that month. Configuration history only explains changes to a cap and does not include historical spending.

## D005: Group analysis receives a semantic core boundary

**Decision:** Introduce a dedicated core service for group monthly analysis when implementing the view; retain `TransactionsService` for the existing account-scoped summary and `BudgetsService` for budget progress. Group Analysis receives the group id from its route rather than the active-group context.

**Rationale:** Group Analysis is a separate read model with its own loading and request lifecycle. Reusing the existing single summary signal would couple concurrent account and group queries.
