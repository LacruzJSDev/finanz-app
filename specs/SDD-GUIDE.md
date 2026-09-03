# SDD Guide

SDD is durable project memory. It must preserve intent, execution state, decisions, and validation without becoming permanent agent context.

## Structure

```text
specs/
├── SDD-GUIDE.md
└── NNN-feature-name/
    ├── spec.md
    ├── plan.md
    ├── decisions.md
    └── validation.md
```

Create only the documents that provide useful durable information.

Small fixes do not require SDD. Create a new numbered SDD for substantial features or independent follow-up work.

## Single Source of Truth

Each piece of information has one owner:

| Information | Owner |
| --- | --- |
| What the feature must do | `spec.md` |
| Tasks and execution state | `plan.md` |
| Lasting decisions and rationale | `decisions.md` |
| Validation evidence | `validation.md` |
| How it currently works | Source code |
| Cross-feature architecture | `ARCHITECTURE.md` |

Reference information owned elsewhere instead of duplicating it.

Example: `T006 — Budget history; blocked by D001.`

## `spec.md`

Defines product intent and observable behavior.

```md
# Feature: NNN - Name

Status:
Branch:

## Problem
## Goals
## Non-goals
## Behavioral Rules
## Acceptance Criteria
## Open Questions
```

Include only sections that are useful.

Do not include implementation steps, task state, decision rationale, validation results, or unrelated future backlog.

## `plan.md`

Defines what remains to be implemented and in what order.

```md
# Plan: NNN - Name

Branch:

## Tasks

| Task | Scope | Depends on | Status |
| --- | --- | --- | --- |

## Blockers
```

Tasks describe outcomes, not individual edits.

Keep completed tasks concise. Do not turn the plan into an implementation history.

Reference requirements or decisions instead of copying them.

## `decisions.md`

Stores lasting decisions whose rationale may matter to future work.

```md
# Decisions: NNN - Name

## D001: Title

**Decision:** What was decided.

**Rationale:** Why.
```

Do not record routine implementation choices, debugging history, command results, or information obvious from code.

Cross-feature architecture decisions belong in architecture documentation instead.

## `validation.md`

Stores concise evidence of executed validation.

```md
# Validation: NNN - Name

Status:

| Check | Result |
| --- | --- |

## Known Issues
```

Record tests, builds, static checks and relevant warnings.

Do not store future tasks, roadmap, implementation history, review planning, or full command output.

## Lifecycle

When creating a substantial feature:

1. Read this guide.
2. Create the numbered feature directory.
3. Create `spec.md`.
4. Create a concise `plan.md`.
5. Add `decisions.md` or `validation.md` only when needed.

During implementation:

- Work from the current plan task and relevant source files.
- Consult `spec.md` when behavior or scope needs verification.
- Consult only relevant decisions when they affect the current work.
- Update SDD at meaningful checkpoints, not after every edit.
- Do not reread unchanged SDD documents unnecessarily.

At completion:

- Ensure acceptance criteria are accounted for.
- Record relevant validation.
- Remove obsolete blockers and temporary notes.
- Move independent follow-up work to a new SDD.

## Feature Boundaries

Do not use one SDD as an indefinite backlog.

Create a new SDD when follow-up work has independent value, new acceptance criteria, separate scheduling, or requires a distinct product decision.

Prefer:

`002-budgets` → `003-budget-statistics` → `004-budget-history`

over continuously expanding `002-budgets`.

## Context Discipline

SDD is external memory, not mandatory context.

Load only what the current decision requires:

- New SDD → this guide + feature requirements.
- Resume feature → `plan.md` first.
- Implement task → relevant plan task + source files.
- Behavioral uncertainty → relevant `spec.md` section.
- Decision uncertainty → relevant decision.
- Architecture change → relevant `ARCHITECTURE.md` section.
- Review → `git diff` + relevant acceptance criteria + validation.

Do not automatically load the complete SDD set.

Do not store or repeatedly load:

- command transcripts,
- large diffs,
- debugging history,
- temporary hypotheses,
- large code excerpts,
- information already clear from source code.

## Rule of Ownership

Before writing documentation, ask:

> Where would a future agent naturally look for this?

Then write it only there:

**Requirement → spec. Task → plan. Why → decisions. Proof → validation. How → code.**

SDD should reduce the context an agent needs, not reproduce it.
