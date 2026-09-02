# FinanzApp Frontend Constitution

Version: 1.1.0
Status: active

## Purpose

FinanzApp helps people understand and manage shared personal finances with clear, trustworthy, mobile-first workflows. The frontend presents backend-owned financial rules without duplicating business logic.

## Principles

1. **Trustworthy financial information.** Amounts, dates, permissions, pending states, empty states, and API failures must be explicit. The interface must not imply a completed financial operation before the API confirms it.
2. **Frontend-only ownership.** This repository changes the Angular frontend only. The API is a read-only contract dependency. Generated OpenAPI code is regenerated, not hand-maintained.
3. **One-way architecture.** `ARCHITECTURE.md` is binding: only `core` communicates with the generated API client, features do not reach into another feature's internals, and shared code remains domain-agnostic.
4. **Native Angular and Material.** Use Angular standalone APIs, signals, Angular Material 3, and the established Material tokens. Do not add state or UI libraries without an approved decision record.
5. **Coherent mobile-first design.** Preserve the existing visual language: Geist and Space Grotesk typography, custom palettes, cards, bottom sheets, contextual FABs, and responsive single-column behavior. Accessibility and usable touch interaction are required behavior.
6. **Specifications before implementation.** A feature specification and task boundary exist before code changes. Local specifications define product behavior; Context7 only supplies current external library documentation.
7. **Small, reviewable work.** Tasks are narrow, have explicit writable files and acceptance criteria, and produce validation evidence. Parallel work is allowed only for non-overlapping files and dependencies.
8. **Independent verification.** An implementer does not approve its own task. Feature review compares code, specification, architecture, validation, and documentation.
9. **Traceable evolution.** Lasting product or technical decisions are versioned in feature documentation. Accepted behavior never exists only in a conversation or agent memory.
10. **Bounded autonomy.** Agents stop rather than loop. Repeated blockers, ambiguous specifications, expanded scope or permissions, and untrustworthy validation require a concise report and explicit user direction before more work or model spend.

## Definition Of Done

A task is `implementation complete, review pending` when its acceptance criteria pass, validation results are recorded, and relevant documentation is current. It becomes complete only when an independent reviewer has no unresolved blocking finding and the coordinator records that external outcome. A feature is complete only when its final validation and review are recorded and its branch is ready for `dev`.

## Amendments

Amend this constitution only through a documented feature decision that states the reason, affected principles, and migration needed. Increment the version in this document in the same change.
