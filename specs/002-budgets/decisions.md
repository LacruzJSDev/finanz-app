# Decisions: 002 - Budgets

## D001: Initial budget delivery excludes history

**Decision:** The initial budget feature shows current-month progress only. `003-monthly-statistics` adds selected-month progress inspection; budget-configuration history remains excluded until its interaction and presentation are defined.

**Rationale:** The history product experience has not been decided.

## D002: Create budgets from active categories

**Decision:** Load active-group categories through `CategoriesService` when creating the first budget, because the progress endpoint excludes categories without a budget.

**Rationale:** This enables initial budget creation without bypassing `core` or duplicating generated API access.

## D003: Budgets replace Categories in bottom navigation

**Decision:** Expose budgets at `/presupuestos` from bottom navigation; manage categories at `/grupos/:id/categorias` using route-derived group and permissions.

**Rationale:** Budgets are routine active-group work, while categories are group configuration.

## D004: Archived categories expand below active categories

**Decision:** Use the existing expandable archived-items pattern below the active list.

**Rationale:** It keeps the active list primary without hiding archived-category recovery.
