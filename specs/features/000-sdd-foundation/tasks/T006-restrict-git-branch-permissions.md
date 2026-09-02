# T006: Restrict Git branch permissions

Status: completed
Feature: `000-sdd-foundation`
Depends on: T005
Assigned role: task-implementer

## Objective

Resolve the independent review finding that broad `git branch*` permissions could allow Git branch write operations without confirmation.

## Allowed Files

- `opencode.json`
- `.opencode/agents/frontend-orchestrator.md`
- `.opencode/agents/task-implementer.md`
- `specs/features/000-sdd-foundation/plan.md`
- `specs/features/000-sdd-foundation/tasks/T006-restrict-git-branch-permissions.md`

## Forbidden Files

- `src/app/api/**`
- API repository and any file outside the active frontend worktree

## Acceptance Criteria

- [x] Only `git branch --show-current` is auto-approved for project agents.
- [x] Branch creation, deletion, and other Git write operations remain confirmation-required.
- [x] The configured task agent can still perform the pre-edit branch check.

## Validation Commands

```text
node -e "JSON.parse(require('node:fs').readFileSync('opencode.json', 'utf8'))"
opencode agent list
```

## Implementation Evidence

Files changed:

- `opencode.json`
- `.opencode/agents/frontend-orchestrator.md`
- `.opencode/agents/task-implementer.md`
- `specs/features/000-sdd-foundation/plan.md`
- `specs/features/000-sdd-foundation/tasks/T006-restrict-git-branch-permissions.md`

Commands run:

- `node -e "JSON.parse(require('node:fs').readFileSync('opencode.json', 'utf8'))"`
- `opencode agent list | rg 'git branch'`
- `git diff --check`

Results:

- JSON parsing and whitespace validation passed. Agent discovery shows only `git branch --show-current*` as the project branch permission; other branch commands remain covered by the final `ask` rule.

## Review

Status: approved by human review
Findings: none
