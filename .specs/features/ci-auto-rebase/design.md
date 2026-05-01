---
name: design
description: Architecture and implementation details for auto-rebase
---

# Design — Auto-Rebase Feature Branches

## Architecture

### Workflow Sequence

```
promote-to-main.yml triggered (on: develop merge)
  ↓
1. Checkout feature branch (fetch-depth: 0 for full history)
2. Check if promotion PR already exists to main
3. Fetch origin/develop (latest)
4. Git rebase origin/develop
   ├─ No conflicts → continue
   └─ Conflicts → log error, exit 1, STOP (user fixes + retriggers)
5. Force-push rebased branch to origin (--force-with-lease)
6. Create PR feature → main (unchanged)
```

### Git Commands

```bash
# Fetch latest develop
git fetch origin develop

# Rebase on develop (abort if conflicts)
git rebase origin/develop || {
  git rebase --abort
  echo "Rebase failed: conflicts detected"
  exit 1
}

# Force-push rebased branch
git push --force-with-lease origin feature/branch-name
```

## Implementation Details

### Checkout Step

```yaml
- name: checkout
  uses: actions/checkout@v4
  with:
    fetch-depth: 0  # Full history for rebase
```

### Rebase + Force-Push Step

Inserted before "create promotion pr" step:

```yaml
- name: rebase on develop
  if: steps.existing-pr.outputs.count == '0'  # Skip if PR already exists
  run: |
    git fetch origin develop
    git rebase origin/develop || {
      git rebase --abort
      echo "❌ Rebase failed: conflicts detected on ${{ github.event.pull_request.head.ref }}"
      echo "Manual fix required:"
      echo "  git fetch origin develop"
      echo "  git rebase origin/develop"
      echo "  # resolve conflicts"
      echo "  git rebase --continue"
      echo "  git push --force-with-lease"
      exit 1
    }
    git push --force-with-lease origin ${{ github.event.pull_request.head.ref }}
    echo "✅ Rebased on develop and pushed"
```

### Rationale for `--force-with-lease`

- **Safe:** Fails if remote branch has new commits (detects concurrent pushes)
- **Preserves intent:** Allows rebase-push pattern without raw `--force` risk
- **Workflow-safe:** Promotion workflow runs serially per branch; no concurrent pushes expected
- **Idempotent:** Can be safely retried if transient failures occur

### Error Handling

- **Rebase conflicts** → Abort, log diagnostic steps, exit 1
- **Force-push fails** → Git exits 1 automatically
- **Workflow outcome** → GitHub shows ❌ on commit; user sees error log
- **Recovery** → User fixes locally, pushes, workflow retries on next commit

### Documentation Update (CONTRIBUTING.md)

New section under CI/CD:

- Describes when/why rebase happens (after merge to `develop`)
- Shows manual fix workflow (fetch, rebase, resolve, rebase --continue, push)
- Mentions workflow retry behavior
- Links this back to commit hooks if needed in future

---

## Testing Strategy

### Happy Path

1. Create feature branch from latest main
2. Make 1-2 commits
3. Push to origin
4. Merge to develop (or PR)
5. Observe promotion workflow runs
6. Check promotion PR is created (rebase succeeded silently)
7. Confirm no extra commits added (rebase was clean)

**Verification:** Git log shows rebased commits on main base, no duplicates.

### Conflict Case (Future)

1. Create two feature branches from main
2. Make commits to both
3. Merge first feature → `develop`
4. Merge second feature → `develop` (gets conflicts in workflow)
5. Workflow fails with diagnostic message
6. User fixes locally (fetch, rebase, resolve)
7. User pushes with --force-with-lease
8. Workflow retries → promotion PR created

---

## Deployment

No infrastructure changes required. Workflow modification only.

- YAML is self-contained (no secrets needed beyond existing GH_PAT_TOKEN)
- Safe to deploy immediately after code review
- No version bumps or dependency changes
