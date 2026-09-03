# FinanzApp SDD

`specs/` stores durable Specification-Driven Development (SDD) memory for substantial frontend features.

It complements the source code and `ARCHITECTURE.md`; it does not replace them.

## Structure

```text
specs/
├── README.md
├── SDD-GUIDE.md
└── NNN-feature-name/
    ├── spec.md
    ├── plan.md
    ├── decisions.md
    └── validation.md
```

Feature directories use stable, zero-padded identifiers such as `002-budgets`.

Not every feature requires every document. Create only documents that contain useful durable information.

## Documentation Ownership

- `spec.md` — product intent, scope and observable behavior.
- `plan.md` — implementation tasks and current execution state.
- `decisions.md` — lasting decisions and rationale.
- `validation.md` — concise evidence of executed validation.
- `ARCHITECTURE.md` — cross-feature architecture and dependency direction.
- Source code — current implementation details.

See `SDD-GUIDE.md` when creating, restructuring, or materially changing SDD documentation.

## Context

SDD is external memory, not mandatory agent context.

During implementation, load only the document or section required for the current decision. Do not automatically load the complete feature documentation or `SDD-GUIDE.md`.