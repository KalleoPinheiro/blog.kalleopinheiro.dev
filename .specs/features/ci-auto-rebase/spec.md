---
name: spec
description: Auto-rebase feature branches before promotion to main
---

# Spec — Auto-Rebase Feature Branches

**Feature ID:** CI-AUTO-REBASE

**Problem:** Every PR merge to `develop` causes conflicts when the promotion workflow tries to create a PR to `main` (feature branch has diverged from `develop`).

**Solution:** Auto-rebase feature branch on latest `develop` before promotion PR creation.

---

## Requirements

**CI-AR-001:** Rebase on `develop` before PR creation
- When promotion workflow runs, fetch latest `develop`
- Rebase feature branch on origin/develop
- Force-push rebased branch to origin

**CI-AR-002:** Error handling
- If rebase has conflicts, log diagnostic steps
- Workflow fails (exit 1) and user fixes manually
- Manual fix: resolve conflicts locally, push, workflow retries

**CI-AR-003:** Documentation
- Document auto-rebase behavior in CONTRIBUTING.md
- Show conflict resolution steps
- Mention workflow retry option

**CI-AR-004:** Verification
- Workflow YAML is valid
- Rebase step runs after checkout, before PR creation
- Force-push uses `--force-with-lease` (safe, idempotent)

---

## Acceptance Criteria

- [ ] `.github/workflows/promote-to-main.yml` has rebase + force-push step
- [ ] Error message logs git commands for manual fix
- [ ] `CONTRIBUTING.md` documents auto-rebase behavior + fix steps
- [ ] Feature branch merges to `develop` → rebase happens → promotion PR created (no conflicts)

---

## Out of Scope

- Automated conflict resolution (user fixes manually)
- Alternative branching strategies (GitHub Flow is fixed)
- Vercel preview URL handling (already working)
