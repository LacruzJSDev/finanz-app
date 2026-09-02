# Feature: 000 - SDD Foundation

Status: approved by human review
Branch: `chore/sdd-foundation`
Owner: frontend-orchestrator

## Problem

Frontend changes and decisions currently depend too much on conversation context. The project needs a durable, inexpensive multi-agent workflow that preserves its architecture and visual language while the API evolves.

## Goals

- Establish versioned local specifications as the source of truth for future frontend work.
- Configure specialized OpenCode agents with bounded responsibilities and cost-aware models.
- Make current Angular and Material documentation available through authenticated Context7.
- Define a branch and worktree workflow that protects `dev` and supports feature isolation.

## Non-goals

- Change frontend product behavior.
- Modify the API, API deployment, or API repository.
- Regenerate the API client.
- Add CI automation or change GitHub branch protection in this feature.

## Users And Permissions

Developers and coding agents use this workflow. Only explicitly approved Git operations can alter branches, worktrees, commits, or remotes.

## User Flows

1. A coordinator creates `specs/features/NNN-slug/` before a new feature branch receives code.
2. A contract audit validates the spec against the read-only API contract.
3. A planner creates small task files with ownership boundaries.
4. Luna implements one task and records factual validation evidence.
5. Terra performs an independent final review before the feature is considered ready for `dev`.

## Behavioral Rules

- `main` and `dev` are integration branches; agents do not implement work there.
- Each feature uses one branch and linked worktree by default.
- Tasks may run in parallel only with explicit non-overlapping files and dependencies.
- Context7 is required when uncertain Angular, Material, CDK, or third-party API documentation affects a change.
- The API is read-only and generated frontend API code is never hand-edited.

## UX And Accessibility

This foundation does not alter the application UI. Future agents must preserve the existing Material 3, mobile-first, accessible design system.

## Acceptance Criteria

- [x] The repository contains the documented SDD directory structure and reusable templates.
- [x] The constitution defines product, architecture, design, validation, and documentation principles.
- [x] OpenCode loads project instructions, specialized agents, Context7, and the remote read-only API reference.
- [x] Agents have explicit task, review, and Git/worktree rules.
- [x] The foundation documents its own tasks, decisions, validation, and review.

## Risks And Open Questions

- Context7 requires `CONTEXT7_API_KEY` in the local environment; the repository must not contain the secret.
- Exact browser-level verification of Context7 happens after OpenCode restarts with the new configuration.
