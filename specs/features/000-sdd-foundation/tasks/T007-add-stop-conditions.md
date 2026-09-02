# T007: Add bounded-autonomy stop conditions

Status: completed
Feature: `000-sdd-foundation`
Depends on: T006
Assigned role: task-implementer

## Objective

Prevent agents from spending budget in repeated validation or review loops without explicit user direction.

## Allowed Files

- `AGENTS.md`
- `.opencode/agents/frontend-orchestrator.md`
- `.opencode/agents/feature-reviewer.md`
- `specs/constitution/CONSTITUTION.md`
- `specs/features/000-sdd-foundation/plan.md`
- `specs/features/000-sdd-foundation/decisions.md`
- `specs/features/000-sdd-foundation/tasks/T007-add-stop-conditions.md`

## Forbidden Files

- `src/app/api/**`
- API repository and any file outside the active frontend worktree

## Acceptance Criteria

- [x] A repeated blocker, ambiguous scope, permission expansion, or untrustworthy validation stops autonomous retries.
- [x] The stop report requires evidence, remaining work, cost or risk, and options for the user.
- [x] Only one follow-up review may run without explicit user direction.
- [x] The policy is present in the constitution, shared agent guide, and relevant specialist agents.

## Validation Commands

```text
git diff --check
```

## Implementation Evidence

Files changed:

- `AGENTS.md`
- `.opencode/agents/frontend-orchestrator.md`
- `.opencode/agents/feature-reviewer.md`
- `specs/constitution/CONSTITUTION.md`
- `specs/features/000-sdd-foundation/plan.md`
- `specs/features/000-sdd-foundation/decisions.md`
- `specs/features/000-sdd-foundation/tasks/T007-add-stop-conditions.md`

Commands run:

- `git diff --check`

Results:

- Stop conditions were added after repeated review blockers in this foundation feature. No additional review is launched automatically; it requires explicit user direction.

## Review

Status: approved by human review
Findings: none
