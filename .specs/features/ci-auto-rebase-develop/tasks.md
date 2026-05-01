---
name: tasks
description: Atomic tasks for pre-push auto-rebase hook
---

# Tasks — Auto-Rebase on Develop

## Task 1: Update .husky/pre-push with rebase logic

**Objective:** Add rebase-on-develop step before validation checks.

**Verification:**

- [ ] `.husky/pre-push` is executable
- [ ] Rebase logic checks if branch matches `feature/*` pattern
- [ ] Non-feature branches skip the hook silently
- [ ] Rebase on origin/develop runs before pnpm check
- [ ] On conflict, hook aborts rebase, logs diagnostic steps, exits 1
- [ ] On success, hook logs "✅ Rebased on develop successfully" and continues

**File Modified:** `.husky/pre-push`

**Commit Message:**

```
chore(ci): add pre-push rebase on develop for feature branches

Auto-rebase feature branches on latest develop before push to prevent
conflicts when opening PR to develop. Non-feature branches (main,
develop) skip the hook silently.

If rebase conflicts occur, hook blocks push and logs manual resolution
steps.
```

---

## Task 2: Update CONTRIBUTING.md with hook behavior

**Objective:** Document pre-push hook behavior + how it prevents conflicts.

**Verification:**

- [ ] New section titled "Pre-Push Rebase Hook"
- [ ] Explains when/why rebase happens (on push for feature branches)
- [ ] Shows what user sees (diagnostic message if conflicts)
- [ ] Shows manual fix commands (git rebase, resolve, continue, push)
- [ ] Mentions hook skips main/develop branches
- [ ] Clear, no jargon

**File Modified:** `CONTRIBUTING.md`

**Commit Message:**

```
docs: document pre-push auto-rebase hook in CONTRIBUTING.md

Explain pre-push hook behavior for feature branches and provide
step-by-step manual conflict resolution instructions.
```

---

## Task 3: Test hook with feature branch conflict

**Objective:** Verify hook rebases and blocks push on conflicts.

**Verification Checklist:**

- [ ] Create test feature branch: `feature/test-prepush-rebase`
- [ ] Make 1-2 commits
- [ ] Push to origin (should rebase and succeed)
- [ ] Make commit to develop on GitHub (or via separate branch)
- [ ] Make another commit to feature branch locally
- [ ] Try to push (hook should detect conflict, block push, log message)
- [ ] Verify: conflict log appears, push blocked
- [ ] Resolve conflicts locally as instructed
- [ ] Push again (hook retries, should succeed)
- [ ] Verify: feature branch is clean, no merge commits

**Manual Test:**

```bash
# Create test feature branch
git checkout main
git pull origin main
git checkout -b feature/test-prepush-rebase
echo "test" > test.txt
git add test.txt
git commit -m "test: prepush rebase"
git push origin feature/test-prepush-rebase  # Should rebase and succeed

# (On GitHub or separate branch: add commit to develop)
# Back on feature branch:
echo "more" >> test.txt
git add test.txt
git commit -m "test: another commit"
git push origin feature/test-prepush-rebase  # Should block if conflict

# Clean up
git checkout main
git pull origin main
git branch -D feature/test-prepush-rebase
git push origin --delete feature/test-prepush-rebase
```

---

## Task Dependencies

- T1 → T2 (docs after code)
- T1, T2 → T3 (test after both committed)

**Blocking:** None — complements CI-AUTO-REBASE (main workflow).

**Time Estimate:** ~15 minutes

---

## Success Criteria

- [ ] All 3 tasks completed
- [ ] Hook tested with real feature branch push
- [ ] No broken CI runs
- [ ] Feature branch → develop PRs are conflict-free
