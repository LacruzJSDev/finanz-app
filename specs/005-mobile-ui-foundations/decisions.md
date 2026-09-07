# Decisions: 005 - Mobile UI Foundations

## D001: `STYLES.md` is a contract, not a duplicate stylesheet

**Decision:** Document visual intent, component usage, and constraints in `STYLES.md`; keep concrete CSS and Sass tokens in source files.

**Rationale:** Future changes need a concise decision source without maintaining a second copy of implementation details.

## D002: Field groups stay CSS primitives

**Decision:** Keep the shared form surface as a semantic global class rather than introducing an Angular content-projection wrapper.

**Rationale:** A wrapper would not remove form structure decisions and would complicate projected-child styling under Angular encapsulation.
