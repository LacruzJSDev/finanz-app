# Decisions: 001 - API Contract Sync

## D001: Separate contract synchronization from new product UI

**Decision:** Synchronize the generated client and existing behavior only; new API capabilities belong to later feature specifications.

**Rationale:** Separating migration from new UI reduces contract-change risk and keeps follow-up work focused on user outcomes.

## D002: Preserve full-form PATCH submissions

**Decision:** Keep full-form PATCH submissions. Intentionally cleared nullable values serialize as `null`, while irrelevant conditional fields remain omitted; do not add generic dirty-field tracking.

**Rationale:** Existing edit sheets represent complete editable resources, and partial dirty-field tracking has no current product value.
