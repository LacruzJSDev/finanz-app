# FinanzApp Frontend Agent Guide

## Scope

- Work only in the active frontend worktree. The API is read-only contract context.
- Never modify `../api`, the API remote reference, or backend configuration.
- Do not edit `src/app/api/` manually. Regenerate it only with `npm run generate:api` when a feature specification requires a changed API contract.

## Source Of Truth

Read, in this order, before changing code:

1. `specs/constitution/CONSTITUTION.md`
2. `specs/features/<id>/spec.md`
3. `specs/features/<id>/plan.md`
4. The assigned `specs/features/<id>/tasks/Txxx-*.md`
5. `ARCHITECTURE.md`

The feature specification defines product behavior. `ARCHITECTURE.md` defines code boundaries. Context7 is only for current third-party documentation and never overrides local specifications.

## Git And Worktrees

- Never work directly on `main` or `dev`.
- Before editing, run `git status --short`, `git branch --show-current`, and `git worktree list`.
- Each feature owns one branch and one linked worktree. Tasks are normally sequential commits on that feature branch.
- Create task branches only when tasks have no overlapping writable files and the feature plan explicitly allows parallel work.
- Never create, merge, rebase, delete, commit, push, or switch branches without explicit user approval.
- Do not modify files outside the active worktree.

## Implementation Rules

- A task must exist before implementation. Edit only the files allowed by that task unless the user approves a task update first.
- Preserve the dependency direction in `ARCHITECTURE.md`: only `core` calls generated API services.
- Use Angular standalone APIs, native signals, and the existing Angular Material 3 system.
- Preserve the established mobile-first visual language, tokens, typography, cards, bottom sheets, and responsive behavior.
- Keep state loading in services and interaction state in components.
- Use Context7 for Angular, Angular Material, CDK, and other external library APIs when documentation affects the implementation.

## Documentation And Review

- Update the assigned task with files changed and commands actually run.
- Record enduring decisions in `decisions.md`; do not hide decisions in task notes or conversations.
- Use `implementation complete, review pending` after an implementer records acceptance criteria and validation. Mark a task `completed` only after independent approval is recorded.
- An implementer cannot mark its own work reviewed. A read-only reviewer performs the final specification, architecture, visual, and test review.
- After a reviewer returns its outcome, the coordinator records that external outcome in the task and feature documentation. This administrative record is not self-approval.
- Convert every review finding into a concrete task or documented accepted risk.

## Stop Conditions

- Do not retry an unchanged failed command.
- Allow at most one follow-up review for the same feature without explicit user direction.
- Stop immediately when the same blocker appears twice, when a fix requires broader task scope or permissions, when the specification is ambiguous, or when a tool failure prevents trustworthy validation.
- Before stopping, report: what was attempted, the exact blocker and evidence, the work not performed, expected cost or risk of continuing, and concise options for the user to choose from.
- Wait for explicit user direction before creating more tasks, re-running reviews, relaxing permissions, or spending further model budget on the blocked issue.

## Validation

- Run the commands required by the task. At feature completion run `npm run lint:boundaries`, `npm test`, and `npm run build` unless a documented blocker prevents it.
- Report warnings and failures accurately. Never claim validation that did not run.
