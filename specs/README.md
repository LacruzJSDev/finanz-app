# SDD Documentation

`specs/` is the durable record for FinanzApp frontend behavior and implementation work. It complements, but does not replace, `ARCHITECTURE.md`.

## Ownership

- `constitution/CONSTITUTION.md`: non-negotiable product, engineering, and workflow principles.
- `templates/`: required document shapes for new work.
- `features/NNN-slug/`: a feature's accepted behavior, plan, decisions, task evidence, review, and validation.

`README.md` explains how to find documentation. `ARCHITECTURE.md` explains dependency direction and code ownership. A feature specification explains user behavior. A task explains one bounded change.

## Feature Lifecycle

1. Create `features/NNN-slug/` from the templates before changing behavior.
2. Write and approve `spec.md` before implementation.
3. Record contract research and technical sequencing in `plan.md`.
4. Split the plan into small `tasks/Txxx-slug.md` files with non-overlapping writable files where possible.
5. Implement one task at a time and record actual validation evidence in that task.
6. Record enduring decisions in `decisions.md` and final feature validation in `validation.md`.
7. Obtain an independent review before merging the feature branch into `dev`.

## Naming

- Feature directories use zero-padded identifiers: `001-budgets`, `002-group-activity`.
- Feature branches mirror the directory: `feat/001-budgets`.
- Foundation work uses `000-sdd-foundation` and branch `chore/sdd-foundation`.
- Task files use `T001-short-description.md` and retain their identifier even when their text changes.

## Document Rules

- New or changed user-visible behavior requires a feature specification.
- Fixes belong to their affected feature unless they establish a new behavior area.
- Do not duplicate enduring rules in task files; link to the constitution or architecture document instead.
- Documentation changes are part of the same branch and review as the code they govern.
- A conversation is never the only record of an accepted decision or validation result.
