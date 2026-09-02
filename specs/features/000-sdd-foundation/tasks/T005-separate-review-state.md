# T005: Separate implementation and review states

Status: completed
Feature: `000-sdd-foundation`
Depends on: T004
Assigned role: task-implementer

## Objective

Resolve the final reviewer findings by distinguishing completed implementation from independent approval and ensuring task evidence lists every changed file.

## Allowed Files

- `AGENTS.md`
- `specs/constitution/CONSTITUTION.md`
- `specs/features/000-sdd-foundation/plan.md`
- `specs/features/000-sdd-foundation/tasks/T001-sdd-documentation.md`
- `specs/features/000-sdd-foundation/tasks/T002-opencode-agents.md`
- `specs/features/000-sdd-foundation/tasks/T003-validate-sdd-flow.md`
- `specs/features/000-sdd-foundation/tasks/T004-record-review-outcome.md`
- `specs/features/000-sdd-foundation/tasks/T005-separate-review-state.md`

## Forbidden Files

- `src/app/api/**`
- API repository and any file outside the active frontend worktree

## Acceptance Criteria

- [x] Task statuses distinguish implementation completion from independent review completion.
- [x] The constitution and agent guide define how external review outcomes are recorded.
- [x] T004 evidence lists every file changed by its implementation.
- [x] A reviewer can inspect the full feature diff before approving the follow-up.

## Validation Commands

```text
git diff --check
git diff --no-index --check -- /dev/null <each-untracked-text-file>
```

## Implementation Evidence

Files changed:

- `AGENTS.md`
- `specs/constitution/CONSTITUTION.md`
- `specs/features/000-sdd-foundation/plan.md`
- `specs/features/000-sdd-foundation/tasks/T001-sdd-documentation.md`
- `specs/features/000-sdd-foundation/tasks/T002-opencode-agents.md`
- `specs/features/000-sdd-foundation/tasks/T003-validate-sdd-flow.md`
- `specs/features/000-sdd-foundation/tasks/T004-record-review-outcome.md`
- `specs/features/000-sdd-foundation/tasks/T005-separate-review-state.md`

Commands run:

- `git diff --check`
- `git diff --no-index --check` across every changed text file

Results:

- Review states and evidence are reconciled. Standard and untracked-file whitespace validation passed. Final independent approval is pending.

## Review

Status: approved by human review
Findings: none
