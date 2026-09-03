# Plan: 001 - API Contract Sync

Branch: `feat/001-api-contract-sync`

## Tasks

| Task | Scope | Depends on | Status |
| --- | --- | --- | --- |
| T001 | Audit contract and regenerate Angular client | - | completed |
| T002 | Verify `core` compatibility with regenerated contracts | T001 | completed; no changes required |
| T003 | Verify PATCH nullability behavior in edit forms | T002 | completed |
| T004 | Verify group and invitation compatibility | T002 | completed; no changes required |
| T005 | Record feature validation and follow-up boundaries | T003, T004 | completed |

## Follow-up Candidates

- Group financial overview and global transactions are independent UI features.
- Budget UI is tracked in `specs/002-budgets/`.

## Blockers

None.
