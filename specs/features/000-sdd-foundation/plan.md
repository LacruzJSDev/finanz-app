# Implementation Plan: 000 - SDD Foundation

Status: in progress

## Contract Research

The OpenCode configuration schema supports project instructions, file-based agents, remote MCP servers, Git references, model selection, agent depth, and permission rules. Context7 exposes a remote MCP endpoint at `https://mcp.context7.com/mcp` and accepts a bearer token through `CONTEXT7_API_KEY`.

## Architecture And State

This feature adds developer workflow files only. It does not alter `src/app`, application state, routes, API clients, or user-facing styles.

## UI Approach

No UI changes.

## Ordered Work

1. `T001`: create the SDD constitution, feature lifecycle guidance, and templates.
2. `T002`: add OpenCode project configuration, agent definitions, and workflow commands.
3. `T003`: document and validate the worktree, branch, and review workflow.
4. `T004`: reconcile feature acceptance and record independent review outcomes.
5. `T005`: separate implementation and review states, then request final approval.
6. `T006`: restrict Git branch permissions to read-only inspection.
7. `T007`: add bounded-autonomy stop conditions for retries and reviews.

## Parallelization

`T001` and `T002` may proceed independently because their writable files do not overlap. `T003` follows both because it validates their combined workflow.

## Validation Strategy

Validate JSON syntax and OpenCode configuration loading, inspect agent discovery, verify the Context7 configuration after restart, and run frontend architecture, unit test, and production build checks. Record all actual outcomes in task evidence and `validation.md`.

## Rollout Or Migration

Merge this branch into `dev` after review. Every subsequent feature begins from the updated `dev` branch and follows this structure.
