---
name: CI/CD Specification
description: M1.5 — GitHub Actions workflows for feature-branch validation (unit tests, lint, format, typecheck, Snyk SAST) and automatic PR promotion from develop to main
---

# CI/CD (M1.5) Specification

## Problem Statement

All quality gates (`pnpm check`, Snyk) currently run manually. The documented branching strategy (GitHub Flow with rebase: `feature/**` → `develop` → `main`) has no automation enforcing it. Broken code can reach `develop`, and the promotion of validated work to `main` is a fully manual step prone to being forgotten or skipped.

## Goals

- [ ] Every push to a `feature/**` branch automatically runs unit tests, linting, format check, typecheck, and Snyk SAST — and blocks PR merge to `develop` until all checks pass.
- [ ] A Pull Request from the same `feature/**` branch to `main` is automatically created the moment that branch merges into `develop`, so the release path is always one reviewer click away.
- [ ] The feature branch is preserved after merging to `develop` (per AD-008 and CLAUDE.md) so it can be used in the auto-promoted PR.
- [ ] No duplicate PRs are created if the promotion workflow is triggered more than once for the same branch.
- [ ] The implementation adds no new npm scripts or dependencies — all workflows consume existing `pnpm` scripts.

## Out of Scope

| Feature | Reason |
|---|---|
| Deployment workflows | Vercel auto-deploys on push to `main` (AD-005) |
| Release tagging automation | CLAUDE.md specifies manual tag creation after `main` merge |
| E2E test execution in CI | `tests/e2e/` is a placeholder; no tests exist yet |
| Coverage upload (Codecov, etc.) | Deferred — coverage thresholds are already enforced locally via Vitest |
| Notification integrations (Slack, email) | Out of scope for this milestone |
| `promote-to-main` PR re-triggering `validate` | Default `GITHUB_TOKEN` cannot trigger further workflow runs (GitHub security boundary); contributors push a commit or re-run manually |

---

## User Stories

### P1: Feature-branch validation ⭐ MVP

**User Story**: As a maintainer, I want every push to a `feature/**` branch to automatically run the full CI gate, so that broken code is caught before it can reach `develop`.

**Why P1**: Without this, the quality contract described in CLAUDE.md is advisory only — a single unreviewed merge can break `develop` for everyone.

**Acceptance Criteria**:

1. WHEN a commit is pushed to any `feature/**` branch THEN a GitHub Actions workflow SHALL start automatically within 1 minute.
2. WHEN the workflow runs THEN it SHALL execute in order: `pnpm typecheck`, `pnpm lint`, `pnpm exec biome format --check .`, `pnpm test`, Snyk SAST (`snyk code test --severity-threshold=high`).
3. WHEN any step fails THEN the workflow SHALL exit non-zero and mark the check as failed.
4. WHEN a PR from `feature/**` targets `develop` THEN the `validate` check SHALL appear as a required status check on the PR.
5. WHEN a duplicate push arrives on the same branch (e.g. after a rebase force-push) THEN any in-progress run for that branch SHALL be cancelled before the new run starts.
6. WHEN `pnpm format --check` detects unformatted files THEN the step SHALL fail with a non-zero exit code (not silently fix files).

**Independent Test**: Push a commit with a TypeScript type error to a `feature/ci-smoke` branch → workflow fails at the typecheck step. Fix the error → workflow passes all steps.

---

### P1: Automatic develop→main PR promotion ⭐ MVP

**User Story**: As a maintainer, I want a PR from the merged `feature/**` branch to `main` to be created automatically when the feature merges into `develop`, so that I never forget the final promotion step.

**Why P1**: Without automation the feature branch stalls in `develop` and `main` falls behind, defeating the branching strategy.

**Acceptance Criteria**:

1. WHEN a `feature/**` branch is merged into `develop` THEN a workflow SHALL automatically open a PR with base `main` and head `<feature-branch>`.
2. WHEN the PR is created THEN its title SHALL be prefixed with `release:` followed by the original PR title, and its body SHALL credit the original PR number and author.
3. WHEN a PR from the same `feature/**` branch to `main` already exists (open state) THEN no additional PR SHALL be created (idempotent).
4. WHEN a non-`feature/**` branch merges into `develop` (e.g. `fix/**`, `docs/**`) THEN no PR to `main` SHALL be opened.
5. WHEN the promotion workflow fails (e.g. permissions error) THEN it SHALL exit non-zero and surface the failure in the Actions tab.

**Independent Test**: Merge `feature/ci-smoke` into `develop` → a PR `feature/ci-smoke → main` appears within 1 minute with the correct title and body. Trigger the workflow again → no second PR is created.

---

### P2: Branch-protection enforcement

**User Story**: As a maintainer, I want `develop` to require the `validate` check before any merge, so that the automation is not bypassable.

**Why P2**: GitHub Actions jobs are only enforceable if branch-protection rules require them. Without this, the workflow runs informatively but does not block bad merges.

**Acceptance Criteria**:

1. WHEN branch protection is configured on `develop` THEN the `validate` job name SHALL be listed as a required status check.
2. WHEN a PR to `develop` is in "failed" or "pending" check state THEN GitHub SHALL prevent merging (no bypass for non-admins).
3. WHEN the protection settings are applied THEN they SHALL be documented in `README.md` so contributors can reproduce them.

**Independent Test**: Attempt to merge a PR with a failing `validate` check into `develop` → GitHub UI shows "Required status checks must pass before merging."

---
