---
name: CI/CD Tasks
description: Atomic tasks for the M1.5 CI/CD milestone — GitHub Actions validation and PR promotion workflows
---

# CI/CD (M1.5) Tasks

**Spec**: `.specs/features/ci-cd/spec.md`
**Design**: `.specs/features/ci-cd/design.md`
**Status**: PLANNED

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

**What**: Add `.github/workflows/validate.yml` with triggers on `feature/**` push and `pull_request` targeting `develop`. Single job `validate` that runs typecheck, lint, format check, test, and Snyk SAST.
**Where**: `.github/workflows/validate.yml` (new file)
**Depends on**: none
**Reuses**: existing `pnpm typecheck`, `pnpm lint`, `pnpm test` scripts from `package.json`
**Requirement**: CI-P1 (feature-branch validation)
**Status**: PLANNED

**Done when**:

- [ ] `.github/workflows/validate.yml` exists and is valid YAML (no syntax errors via `gh workflow view` or `act -l`)
- [ ] Job name is exactly `validate` (required for branch protection status check name)
- [ ] Concurrency group cancels in-progress runs on the same `github.ref`
- [ ] Steps run in order: checkout → pnpm setup → node setup → install → typecheck → lint → format check → test → Snyk
- [ ] Format check uses `pnpm exec biome format --check .` (not `pnpm format`, which would write)
- [ ] `SNYK_TOKEN` is referenced as `${{ secrets.SNYK_TOKEN }}` and `--severity-threshold=high` is set
- [ ] Node version is pinned to `22`

**Verify**: Push branch to `feature/ci-smoke` → observe Actions tab; all 9 steps appear and complete green.

---

### CI-2: Create `promote-to-main.yml` — auto-PR on develop merge

**What**: Add `.github/workflows/promote-to-main.yml`. Triggers on `pull_request` closed on `develop`. Job runs only when the PR is merged AND the head branch starts with `feature/`. Pre-checks for existing open PR to `main` before creating a new one.
**Where**: `.github/workflows/promote-to-main.yml` (new file)
**Depends on**: CI-1 (workflows directory exists)
**Reuses**: `gh` CLI (pre-installed on `ubuntu-latest` runners)
**Requirement**: CI-P1 (automatic promotion)
**Status**: PLANNED

**Done when**:

- [ ] `.github/workflows/promote-to-main.yml` exists and is valid YAML
- [ ] Job condition guards on `merged == true` AND `startsWith(head.ref, 'feature/')`
- [ ] Idempotency check: if a PR `feature/** → main` already exists in `open` state, the step is skipped without error
- [ ] PR title is `release: <original PR title>`
- [ ] PR body credits the original PR number and author login
- [ ] Job uses `GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}` (not a PAT)
- [ ] Job permissions: `contents: read`, `pull-requests: write`

**Verify**: Merge `feature/ci-smoke` into `develop` → a PR `feature/ci-smoke → main` opens automatically within 1 minute. Trigger the workflow a second time → no duplicate PR.

---

### CI-3: Add `.nvmrc`

**What**: Create `.nvmrc` at the repo root with content `22`, aligning local dev Node version with the workflow's `node-version: 22`.
**Where**: `.nvmrc` (new file)
**Depends on**: CI-1
**Reuses**: n/a
**Requirement**: CI-P1 (consistency between local and CI)
**Status**: PLANNED

**Done when**:

- [ ] `.nvmrc` exists at repo root with content `22`
- [ ] `node --version` after `nvm use` matches the CI-configured `22.x.x`

**Verify**: `cat .nvmrc` → `22`.

---

### CI-4: Update `README.md` — CI/CD section

**What**: Append a "CI/CD" section to `README.md` documenting: required GitHub secret (`SNYK_TOKEN`), required status check name (`validate`), branch protection setup instructions, and the `GITHUB_TOKEN` limitation for promoted PRs.
**Where**: `README.md` (edit existing file)
**Depends on**: CI-1, CI-2
**Reuses**: existing README structure (tables and code blocks)
**Requirement**: CI-P2 (branch-protection enforcement, documentation)
**Status**: PLANNED

**Done when**:

- [ ] README has a `## CI/CD` section at the end
- [ ] Section lists `SNYK_TOKEN` as a required repo secret
- [ ] Section names `validate` as the required status check to add to `develop` branch protection
- [ ] Section notes that promoted `develop→main` PRs require a manual re-run of `validate` (GITHUB_TOKEN limitation)
- [ ] No other sections are modified

**Verify**: Read `README.md` — CI/CD section present with all four items above.

---

### CI-5: Configure branch protection on `develop` (manual)

**What**: In the GitHub repository settings, add a branch protection rule for `develop` requiring the `validate` status check.
**Where**: GitHub UI — Settings → Branches → Add rule for `develop`
**Depends on**: CI-1 must have run at least once so GitHub recognises the `validate` check name
**Reuses**: n/a
**Requirement**: CI-P2 (branch-protection enforcement)
**Status**: PLANNED

**Settings to apply**:

- Branch name pattern: `develop`
- [x] Require status checks to pass before merging
  - Required check: `validate`
- [x] Require branches to be up to date before merging

**Done when**:

- [ ] `develop` branch protection rule exists in GitHub with `validate` as required status check
- [ ] Attempting to merge a PR with a failing `validate` check shows "Required status checks must pass before merging" in the GitHub UI

**Verify**: Open a draft PR from `feature/ci-smoke` to `develop` with a deliberate TypeScript error → merge button is blocked.

---
