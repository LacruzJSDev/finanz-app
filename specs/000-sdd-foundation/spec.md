# Feature: 000 - SDD Foundation

Status: approved by human review
Branch: `chore/sdd-foundation`

## Problem

Frontend work needed durable project memory without relying on conversation context.

## Goals

- Establish repository-local SDD documentation and an agent workflow for substantial frontend work.
- Preserve the frontend architecture, mobile-first Material design system, and API generation boundary.
- Protect integration branches and require explicit approval for Git writes.

## Non-goals

- Change application behavior, the API, or generated API client output.
- Add CI automation or remote branch protection.

## Acceptance Criteria

- [x] Project instructions and SDD guidance define durable documentation ownership and lifecycle.
- [x] OpenCode configuration and API-contract reference are project-local and do not commit secrets.
- [x] Git, worktree, validation, and stop-condition rules are documented.

## Open Questions

- Context7 requires a local `CONTEXT7_API_KEY`; browser-level verification occurs after an OpenCode restart.
