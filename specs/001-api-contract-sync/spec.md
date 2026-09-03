# Feature: 001 - API Contract Sync

Status: approved by human review
Branch: `feat/001-api-contract-sync`

## Problem

The API `dev` contract evolved for existing flows and added new domains. The generated client and current frontend behavior needed synchronization before dependent UI work.

## Goals

- Regenerate `src/app/api/` from the API OpenAPI document without manual edits.
- Keep existing account, category, group, transaction, invitation, and payment-plan flows compatible.
- Preserve the distinction between omitted PATCH fields and intentionally cleared nullable fields.

## Non-goals

- Build budget, group-overview, or global-transaction UI.
- Change API behavior, endpoints, authentication, or the Material design system.

## Behavioral Rules

- Generated API code changes only through `npm run generate:api` against the local OpenAPI document.
- Only `core` calls generated API services.
- Existing edit forms submit their complete editable representation. Intentionally cleared nullable fields send `null`; inapplicable conditional fields remain omitted; required fields never send `null`.
- Existing screens do not expose unimplemented domains merely because generated endpoints exist.

## Acceptance Criteria

- [x] The generated client matches the API `dev` contract and is not manually edited.
- [x] Existing flows compile and retain their contract behavior.
- [x] Nullable PATCH clearing and conditional omission are preserved.
- [x] New domains remain scoped to later features.

## Open Questions

- Regeneration requires the API `dev` branch running at `localhost:8000`.
