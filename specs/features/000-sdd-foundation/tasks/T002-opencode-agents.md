# T002: Configure OpenCode SDD agents and Context7

Status: completed
Feature: `000-sdd-foundation`
Depends on: none
Assigned role: task-implementer

## Objective

Configure project-local OpenCode instructions, specialized agents, SDD commands, Context7, and read-only API contract reference.

## Allowed Files

- `opencode.json`
- `AGENTS.md`
- `.opencode/**`
- `specs/features/000-sdd-foundation/tasks/T002-opencode-agents.md`

## Forbidden Files

- `src/app/api/**`
- API repository and any file outside the active frontend worktree

## Acceptance Criteria

- [x] Context7 uses an environment variable rather than a committed secret.
- [x] Specialized agents use bounded roles and cost-aware Luna, Sol, and Terra models.
- [x] Review agents are read-only and task agents require an assigned task.
- [x] Commands exist for specification, task execution, and review.
- [x] Git write operations require confirmation.
- [x] Command-target agents are available both directly and as subagents.

## Validation Commands

```text
node -e "JSON.parse(require('node:fs').readFileSync('opencode.json', 'utf8'))"
opencode agent list
```

## Implementation Evidence

Files changed:

- `opencode.json`
- `AGENTS.md`
- `.opencode/agents/**`
- `.opencode/commands/**`

Commands run:

- `node -e "JSON.parse(require('node:fs').readFileSync('opencode.json', 'utf8'))"`
- `opencode agent list`
- `opencode mcp list`
- `opencode run --agent feature-reviewer ...`

Results:

- JSON parsing passed. A fresh OpenCode process discovered all custom agents and connected Context7 with the local environment variable. Direct review invocation exposed the primary-agent restriction, so command-target agents use `mode: all`. Noninteractive `opencode run` rejects an unapproved compound Git inspection command; normal interactive sessions ask before executing it.

## Review

Status: approved by human review
Findings: none
