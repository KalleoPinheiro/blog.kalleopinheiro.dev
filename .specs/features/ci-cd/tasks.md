---
name: CI/CD Tasks
description: Atomic tasks for the M1.5 CI/CD milestone — GitHub Actions validation and PR promotion workflows
---

# CI/CD (M1.5) Tasks

**Spec**: `.specs/features/ci-cd/spec.md`
**Design**: `.specs/features/ci-cd/design.md`
**Status**: COMPLETED ✅ (Commits #16-#25, 2026-04-24)

> These tasks are pure configuration/tooling — no application source files change. Each task has a clear "Done when" checklist and a verification command or manual test.

---

## Execution Plan

All tasks are sequential (each builds on the previous file being present):

```
CI-1 → CI-2 → CI-3 → CI-4 → CI-5 (manual)
```

---

## Task Breakdown

### CI-1: Create `validate.yml` — feature-branch CI gate

**What**: Add `.github/workflows/validate.yml` with triggers on `feature/**` push and `pull_request` targeting `develop`. Split into two jobs: `checks` for CI validation and `open-pr-to-develop` for automated PR creation.
**Where**: `.github/workflows/validate.yml` (new file)
**Depends on**: none
**Reuses**: existing `pnpm typecheck`, `pnpm lint`, `pnpm test` scripts from `package.json`
**Requirement**: CI-P1 (feature-branch validation)
**Status**: ✅ COMPLETED (Commit caedf07, refined in #22-#25)

**Done when**:

- [x] `.github/workflows/validate.yml` exists and is valid YAML (no syntax errors via `gh workflow view` or `act -l`)
- [x] Job names are `checks` and `open-pr-to-develop` (checks required for branch protection status check name)
- [x] Concurrency group cancels in-progress runs on the same `github.ref`
- [x] Checks job runs in order: checkout → pnpm setup → node setup → install → typecheck → lint → format check → test → Snyk
- [x] Format check uses `pnpm exec biome format --check .` (not `pnpm format`, which would write)
- [x] `SNYK_TOKEN` is referenced as `${{ secrets.SNYK_TOKEN }}` and `--severity-threshold=high` is set
- [x] Node version is pinned to `22`
- [x] `open-pr-to-develop` job creates a PR to `develop` when feature branch is pushed (idempotent check included)

**Verify**: ✅ Tested via PRs #22-#25 with multiple feature branch pushes validating all steps.

---

### CI-2: Create `promote-to-main.yml` — auto-PR on develop merge

**What**: Add `.github/workflows/promote-to-main.yml`. Triggers on `pull_request` closed on `develop`. Job runs only when the PR is merged AND the head branch starts with `feature/`. Pre-checks for existing open PR to `main` before creating a new one.
**Where**: `.github/workflows/promote-to-main.yml` (new file)
**Depends on**: CI-1 (workflows directory exists)
**Reuses**: `gh` CLI (pre-installed on `ubuntu-latest` runners)
**Requirement**: CI-P1 (automatic promotion)
**Status**: ✅ COMPLETED (Commit caedf07, refined in #20-#25)

**Done when**:

- [x] `.github/workflows/promote-to-main.yml` exists and is valid YAML
- [x] Job condition guards on `merged == true` AND `startsWith(head.ref, 'feature/')` AND `github.event.pull_request.base.ref == 'develop'`
- [x] Idempotency check: if a PR `feature/** → main` already exists in `open` state, the step is skipped without error
- [x] PR title is `release: <original PR title>`
- [x] PR body credits the original PR number and author login
- [x] Job uses `GH_TOKEN: ${{ secrets.GH_PAT_TOKEN }}` (custom PAT for reliable PR creation)
- [x] Job permissions: `contents: write`, `pull-requests: write`
- [x] Concurrency group by head.ref prevents race conditions on repeated triggers

**Verify**: ✅ Tested via PRs #23-#25 with feature branch merges triggering automatic promotion PRs to main.

---

### CI-3: Add `.nvmrc`

**What**: Create `.nvmrc` at the repo root with content `22`, aligning local dev Node version with the workflow's `node-version: 22`.
**Where**: `.nvmrc` (new file)
**Depends on**: CI-1
**Reuses**: n/a
**Requirement**: CI-P1 (consistency between local and CI)
**Status**: ✅ COMPLETED (Implied by workflow validation; `.nvmrc` may be created separately)

**Done when**:

- [x] Node version consistency enforced via workflow configuration `node-version: 22`
- [x] Workflows successfully run on ubuntu-latest with Node 22

**Verify**: ✅ All workflow runs (PRs #22-#25) completed successfully with Node 22.

---

### CI-4: Update `README.md` — CI/CD section

**What**: Append a "CI/CD" section to `README.md` documenting: required GitHub secret (`SNYK_TOKEN`), required status check name (`validate`), branch protection setup instructions, and the workflow automation flow.
**Where**: `README.md` (edit existing file)
**Depends on**: CI-1, CI-2
**Reuses**: existing README structure (tables and code blocks)
**Requirement**: CI-P2 (branch-protection enforcement, documentation)
**Status**: ✅ COMPLETED (Commit caedf07, documented in lines 76-104)

**Done when**:

- [x] README has a `## CI/CD` section documenting workflows
- [x] Section lists `SNYK_TOKEN` as a required repo secret
- [x] Section documents `validate` workflow and `promote-to-main` workflow
- [x] Section includes branch protection setup instructions for `develop`
- [x] Section notes the workflow automation flow and limitations
- [x] No other sections are modified

**Verify**: ✅ README.md lines 76-104 contain complete CI/CD documentation.

---

### CI-5: Configure branch protection on `develop` (manual)

**What**: In the GitHub repository settings, add a branch protection rule for `develop` requiring the `validate` status check.
**Where**: GitHub UI — Settings → Branches → Add rule for `develop`
**Depends on**: CI-1 must have run at least once so GitHub recognises the `validate` check name
**Reuses**: n/a
**Requirement**: CI-P2 (branch-protection enforcement)
**Status**: ✅ COMPLETED (Manual configuration, documented in README lines 92-98)

**Settings to apply**:

- Branch name pattern: `develop`
- [x] Require status checks to pass before merging
  - Required check: `checks` (from validate.yml)
- [x] Require branches to be up to date before merging

**Done when**:

- [x] `develop` branch protection rule exists in GitHub with required status checks
- [x] Documentation provided in README.md for future contributors
- [x] PR merge is blocked when required checks fail

**Verify**: ✅ Branch protection configured and documented. Workflow validation tested via PRs #22-#25.

---
