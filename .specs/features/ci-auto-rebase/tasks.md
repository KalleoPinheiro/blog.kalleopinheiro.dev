---
name: tasks
description: Atomic tasks for auto-rebase feature implementation
---

# Tasks — Auto-Rebase Feature

## Task 1: Add rebase + force-push step to promote-to-main.yml

**Objective:** Insert rebase step after checkout, before PR creation.

**Verification:**
- [ ] Workflow YAML is valid (GitHub Actions accepts it on push)
- [ ] Checkout step with fetch-depth: 0 is present
- [ ] Rebase step runs only if no existing PR (`if: steps.existing-pr.outputs.count == '0'`)
- [ ] Error message logs diagnostic steps on rebase failure
- [ ] Force-push uses `--force-with-lease` (not `--force`)

**File Modified:** `.github/workflows/promote-to-main.yml`

**Commit Message:**
```
chore(ci): add auto-rebase step to promotion workflow

Automatically rebase feature branches on develop before creating
promotion PR to main. Prevents conflicts on main every time a feature
merges to develop.

Includes error handling: if rebase fails due to conflicts, workflow
logs diagnostic steps for manual resolution.
```

---

## Task 2: Document auto-rebase in CONTRIBUTING.md

**Objective:** Explain auto-rebase behavior + conflict resolution steps.

**Verification:**
- [ ] New section titled "Auto-Rebase in Promotion Workflow"
- [ ] Describes when/why rebase happens
- [ ] Shows manual fix commands (git rebase, resolve, push)
- [ ] Mentions workflow retry behavior
- [ ] Clear, concise, no jargon

**File Modified/Created:** `CONTRIBUTING.md`

**Commit Message:**
```
docs: add auto-rebase documentation to CONTRIBUTING.md

Document the auto-rebase behavior in the promotion workflow and
provide step-by-step manual conflict resolution instructions for
developers.
```

---

## Task 3: Test workflow with feature branch merge

**Objective:** Verify rebase happens + no conflicts on simple case.

**Verification Checklist:**
- [ ] Create test feature branch: `feature/test-rebase`
- [ ] Make 1-2 commits
- [ ] Push to origin
- [ ] Merge to develop (via PR or direct merge)
- [ ] Observe promotion workflow runs
- [ ] Check promotion PR is created (`release: ...` title)
- [ ] Rebase succeeded silently (no error logs)
- [ ] Confirm no duplicate commits (git log is clean)

**Manual Test:**

```bash
# Create test feature branch
git checkout main
git pull origin main
git checkout -b feature/test-rebase

# Make a test commit
echo "test" >> test.txt
git add test.txt
git commit -m "test: verify auto-rebase"
git push origin feature/test-rebase

# Create PR to develop (or merge directly for testing)
# After merge to develop:
# - Watch GitHub Actions for promote-to-main.yml
# - Check workflow logs for "✅ Rebased on develop and pushed"
# - Verify promotion PR appears on main

# Clean up
git checkout main
git pull origin main
git branch -D feature/test-rebase
git push origin --delete feature/test-rebase
```

---

## Task Dependencies

- T1 → T2 (docs after code)
- T1, T2 → T3 (test after both are committed)

**Blocking:** None — all independent of other M1.5+ work.

**Time Estimate:** ~20 minutes

---

## Success Criteria

- [ ] All 3 tasks completed
- [ ] Workflow tested with real feature branch merge
- [ ] No broken CI runs
- [ ] Promotion PR created cleanly on next feature merge
