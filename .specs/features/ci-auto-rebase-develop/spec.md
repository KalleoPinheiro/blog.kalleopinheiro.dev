---
name: spec
description: Auto-rebase feature branches on develop before push
---

# Spec — Auto-Rebase on Develop (Pre-Push)

**Feature ID:** CI-AUTO-REBASE-DEVELOP

**Problem:** Every feature branch → develop PR has conflicts because develop has moved forward since the feature branch was created.

**Solution:** Add pre-push hook to automatically rebase feature branches on latest `develop` before allowing push to origin.

---

## Requirements

**CI-ARD-001:** Rebase on develop in pre-push hook
- When pushing feature branch, fetch latest develop
- Rebase feature branch on origin/develop
- If rebase succeeds, allow push
- If rebase fails, abort and log diagnostic steps

**CI-ARD-002:** Skip for non-feature branches
- Only apply to branches matching `feature/*` pattern
- Skip for main, develop, and other non-feature branches

**CI-ARD-003:** Error handling
- If rebase conflicts, abort rebase and exit 1 (block push)
- Log instructions for manual resolution (same as main workflow)
- User fixes locally, pushes again, hook retries

**CI-ARD-004:** Documentation
- Update CONTRIBUTING.md with pre-push hook behavior
- Show what happens automatically + how to resolve conflicts

---

## Acceptance Criteria

- [ ] `.husky/pre-push` rebases feature branches on develop before push
- [ ] Non-feature branches (main, develop) skip the hook
- [ ] Rebase conflicts block push with diagnostic message
- [ ] Feature branch pushed to origin has no conflicts with develop
- [ ] CONTRIBUTING.md documents the hook behavior

---

## Out of Scope

- Manual workflow step (handled by CI-AUTO-REBASE for main)
- GitHub branch protection rules
- Automated conflict resolution
