# Decisions: 004 - Account Transaction Filters

## D001: Use the group transaction query with account scope

**Decision:** Filtered account movement lists use `GET /api/v1/transactions/` with both `group_id` and `account_id`, rather than filtering the account-specific list in the client.

**Rationale:** The account-specific endpoint only supports pagination. The group query is the API boundary that supports category and note filters while the account id preserves the page's scope.

## D002: Category selection uses root categories and a distinct uncategorized option

**Decision:** The selector offers active root categories plus `Todas` and `Sin categoría`; it never combines a category id with the uncategorized filter.

**Rationale:** The API expands a root category to its subcategories and rejects `category_id` with `uncategorized`, so this maps the available contract directly to a clear control.

## D003: Search is limited to notes and debounced

**Decision:** The text input searches `notes` through `q` after a short debounce; blank text omits `q`.

**Rationale:** `q` is defined by the API as a notes substring. Debouncing prevents a request per keystroke without delaying deliberate category changes.
