# Decisions: 000 - SDD Foundation

## D001: Use repository-local SDD documentation

Status: accepted
Date: 2026-09-02

### Context

The frontend needs durable project context without coupling its workflow to a single conversation or external SDD framework runtime.

### Decision

Store a lightweight, versioned SDD system in `specs/`, using `specs/constitution/CONSTITUTION.md` and `specs/features/NNN-slug/` as the canonical layout.

### Consequences

Feature branches include their own specifications, tasks, decisions, and validation. Existing `ARCHITECTURE.md` remains the authoritative dependency-boundary document.

## D002: One worktree per feature by default

Status: accepted
Date: 2026-09-02

### Context

The project needs isolated feature development without creating merge overhead for every small agent task.

### Decision

Create one branch and linked worktree per feature. Keep atomic tasks on that feature branch unless the plan explicitly proves they can run in parallel without overlapping files.

### Consequences

The primary checkout remains on `dev`. Feature work does not disturb its dependencies or state. Parallel task branches are exceptional and require an explicit plan update.

## D003: Cost-aware agent allocation

Status: accepted
Date: 2026-09-02

### Context

Routine task execution and final review have different reasoning requirements and costs.

### Decision

Use `openai/gpt-5.6-luna-fast` for documentation, contract, visual, and bounded implementation agents. Use `openai/gpt-5.6-sol` for primary coordination and `openai/gpt-5.6-terra` for independent final review.

### Consequences

The workflow reserves expensive reasoning for planning and verification while keeping isolated task execution economical.

## D004: Stop before repeated autonomous retries

Status: accepted
Date: 2026-09-02

### Context

Repeated review and validation retries can spend model budget without producing new evidence. The workflow needs a predictable human checkpoint for recurring blockers.

### Decision

Agents may run one follow-up review for a feature. They must then stop on a repeated blocker, ambiguous scope, required permission expansion, or untrustworthy validation. The stop report states the evidence, remaining work, cost or risk, and options; only explicit user direction resumes the blocked path.

### Consequences

The user retains control of cost and tradeoffs. Some feature documentation may remain review-pending until the user chooses whether to resolve, accept, or defer a blocker.
