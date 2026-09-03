# FinanzApp Frontend Agent Guide

## Scope

- Work only in the active frontend worktree.
- Treat the API repository and remote API reference as read-only contract context.
- Never modify `../api`, the API remote reference, or backend configuration.
- Do not edit `src/app/api/` manually. Regenerate it only with `npm run generate:api` when the API contract changes.

## Working Model

- Use one primary agent for implementation. Do not delegate by default.
- Use free models for exploration, documentation lookup, and narrow mechanical work.
- Use Luna for normal implementation.
- Do not use Fast unless the user explicitly requests it.
- Escalate to Terra or another more expensive model only when the user requests it or the current model reaches a genuine blocker.
- Reuse findings already obtained in the current task. Do not rediscover unchanged information.
- Read only the minimum context required to make the next safe decision.
- A concise user request is sufficient for a small change.
- Create or maintain SDD documents only when they provide durable value for a multi-step feature or lasting decision.

## Context Budget

- Treat context as a limited resource.
- Prefer targeted reads over broad repository scans.
- Do not load documentation merely because it exists.
- Do not reread unchanged files unless their contents are needed for the current decision.
- Do not keep temporary debugging output, command logs, large diffs, generated files, or unrelated documentation in working context.
- Stop gathering context as soon as there is enough evidence to proceed safely.
- Prefer summaries and exact references over copying large sections of existing documents.
- Never expand context pre-emptively for hypothetical future needs.

## SDD As Durable Memory

- Treat SDD documents as durable external memory, not mandatory prompt context.
- SDD documents are consulted on demand.
- Do not read every SDD document at the start of every turn or implementation step.
- Do not reread an unchanged SDD document during the same task unless a decision depends on it.
- When switching agents or resuming work, load only the smallest SDD subset required to restore current state.
- Prefer updating durable facts and decisions instead of recording chronological activity.

### `spec.md`

- `spec.md` is the source of truth for feature intent, scope, user-visible behavior, constraints, and acceptance criteria.
- Read it when starting or resuming the feature.
- During implementation, reread only the relevant section when scope or expected behavior is unclear.
- Do not use `spec.md` as an implementation log.
- Keep implementation details out unless they are part of a durable requirement.

### `plan.md`

- `plan.md` is a concise execution map, not a transcript.
- Keep it implementation-oriented and short.
- Record only:
  - affected areas,
  - ordered implementation steps,
  - important constraints,
  - validation strategy,
  - unresolved blockers.
- Do not record exploratory history, command output, temporary hypotheses, or completed micro-steps.
- Once a plan item is completed, prefer marking its state briefly instead of expanding its history.
- Implementation agents should use the existing plan rather than repeat repository-wide planning.

### `tasks.md`

- Keep `tasks.md` compact.
- Record only:
  - current milestone,
  - completed milestones,
  - blockers,
  - next actionable task.
- Do not record every edit or tool call.
- Remove obsolete temporary tasks instead of accumulating history indefinitely.

### `decisions.md`

- Record only lasting product, architecture, API, UX, or technical decisions that future work may need.
- Each decision should be concise and include rationale only when it helps prevent future reconsideration.
- Do not record temporary debugging choices or implementation details that are obvious from the code.
- Read `decisions.md` only when the current change may touch a recorded decision.

### `ARCHITECTURE.md`

- Read `ARCHITECTURE.md` only when:
  - adding a layer,
  - crossing a feature boundary,
  - changing dependency direction,
  - changing state ownership,
  - or changing data flow.
- Do not load it for ordinary local implementation work.

## Exploration

- Start from files explicitly named or directly implied by the task.
- Prefer targeted `glob`, `grep`, and file reads.
- When changing an existing feature, inspect its local files before searching globally.
- When introducing or changing a UI pattern, inspect at most 1-2 directly comparable existing components unless more evidence is required.
- Do not perform repository-wide style surveys.
- Do not inspect generated files, build artifacts, dependencies, or unrelated features unless required.
- Do not reopen files already understood unless they changed or a specific detail must be verified.
- Stop exploring once implementation can proceed safely.

## Planning

- Skip formal planning for trivial or narrowly scoped changes.
- For substantial changes, create the smallest plan that another agent can execute without rediscovering the repository.
- A useful plan identifies:
  - files or areas likely to change,
  - implementation sequence,
  - constraints that must remain true,
  - focused validation.
- Do not restate large portions of the spec, architecture, or source code.
- Do not duplicate information already stored in another SDD document.
- Reference existing documents instead of copying their contents.
- Do not perform implementation-level exploration twice.

## Git And Worktrees

- Never work directly on `main` or `dev`.
- Before the first edit of a task, run once:

  `git status --short && git branch --show-current && git worktree list`

- Do not repeat this check during the same task unless Git state may have changed.
- Each substantial feature owns one branch and one linked worktree.
- Small fixes can stay on the active feature branch.
- Immediately after creating a worktree, run `npm ci` when `package-lock.json` exists; otherwise run `npm install`.
- Create task branches only for genuinely independent changes with no overlapping files.
- Never create, merge, rebase, delete, commit, push, switch branches, or create worktrees without explicit user approval.

## Implementation Rules

- Preserve the dependency direction defined in `ARCHITECTURE.md`: only `core` calls generated API services.
- Use Angular standalone APIs, native signals, and the existing Angular Material 3 system.
- Preserve the established mobile-first visual language, design tokens, typography, cards, bottom sheets, contextual FABs, and responsive behavior.
- Keep state loading in services and interaction state in components.
- Before introducing a card, form, list, selector, or destructive action, inspect 1-2 directly comparable existing components.
- Reuse established Material structure, layout, action placement, and interaction patterns.
- Prefer existing abstractions over parallel implementations.
- Avoid unrelated refactors.
- Keep changes scoped to the requested task.
- Run Prettier on touched source files after editing.

## Validation

- Use the narrowest relevant validation while implementing.
- Prefer focused tests for touched behavior.
- Do not repeatedly run the full test or build suite after intermediate edits.
- Run broader validation only at a meaningful feature checkpoint, before a requested commit, for high-risk changes, or when explicitly requested.
- For a substantial final checkpoint, use as appropriate:
  - formatting of touched files,
  - `npm run lint:boundaries`,
  - relevant tests,
  - `npm run build`.
- Run the full `npm run format`, `npm run lint:boundaries`, `npm test`, and `npm run build` sequence only when full validation is justified.
- When command output is large, inspect only the relevant warning or failure section.
- Never claim validation that did not run.

## Documentation Updates

- Update SDD documents only when durable state changed.
- Do not update documentation after every source edit.
- Batch SDD updates at meaningful checkpoints.
- Prefer changing one relevant document over touching every feature document.
- Do not copy source code, full diffs, logs, stack traces, or temporary debugging notes into SDD.
- If code is self-explanatory and no durable requirement or decision changed, do not update SDD.

## Review

- Do not launch automatic reviews.
- Review is user-directed or reserved for high-risk changes such as authentication, payments, destructive migrations, or security boundaries.
- Review completed implementation from:
  - the relevant acceptance criteria,
  - `git diff`,
  - focused validation results.
- Do not reload the complete SDD set during review.
- Read only the specific spec or decision sections needed to verify the diff.
- Do not rediscover the repository unless the diff exposes a genuine architectural concern.

## Tool And Context Discipline

- Minimize unnecessary tool calls.
- Batch related searches or reads when practical.
- Prefer narrow command output over broad output.
- Do not fetch external documentation when repository evidence is sufficient.
- Context7 is opt-in.
- Use Context7 only when current third-party documentation is expected to affect an implementation decision.
- Do not use Context7 merely to confirm familiar APIs or repository-established patterns.
- Do not repeat successful commands without a concrete reason.
- Do not retry an unchanged failed command.

## Stop Conditions

- Stop on a repeated blocker, materially ambiguous scope, required permission expansion, or untrustworthy validation.
- Report evidence, remaining work, cost or risk, and concise options.
- Wait for explicit user direction before repeating the blocker, relaxing permissions, or escalating to a more expensive model.