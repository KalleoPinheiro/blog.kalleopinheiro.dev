---
name: design
description: Architecture for pre-push auto-rebase hook
---

# Design — Pre-Push Auto-Rebase Hook

## Architecture

### Hook Sequence

```
user: git push origin feature/branch
        ↓
.husky/pre-push triggered
        ↓
1. Check if branch matches feature/* pattern
2. If not feature/* → skip (allow push)
3. If feature/* → continue
4. Fetch origin/develop (latest)
5. Git rebase origin/develop
   ├─ No conflicts → allow push
   └─ Conflicts → abort, log error, exit 1 (BLOCK push)
```

### Git Commands

```bash
# Get current branch name
branch=$(git rev-parse --abbrev-ref HEAD)

# Check if feature branch
if [[ ! $branch =~ ^feature/ ]]; then
  exit 0  # Skip non-feature branches
fi

# Fetch latest develop
git fetch origin develop

# Rebase on develop (abort if conflicts)
git rebase origin/develop || {
  git rebase --abort
  echo "❌ Rebase failed: conflicts detected on $branch"
  echo "Manual fix required:"
  echo "  git fetch origin develop"
  echo "  git rebase origin/develop"
  echo "  # resolve conflicts"
  echo "  git rebase --continue"
  echo "  git push origin $branch"
  exit 1
}

echo "✅ Rebased on develop, push allowed"
```

## Implementation Details

### Pre-Push Hook (`.husky/pre-push`)

Current hook runs validation checks. Add rebase step before validation:

```bash
#!/bin/sh
# .husky/pre-push

# Get current branch
branch=$(git rev-parse --abbrev-ref HEAD)

# Only rebase feature/* branches
if [[ $branch =~ ^feature/ ]]; then
  echo "🔄 Rebasing $branch on develop..."
  git fetch origin develop
  
  if ! git rebase origin/develop; then
    git rebase --abort
    echo "❌ Rebase failed: conflicts detected on $branch"
    echo ""
    echo "Manual fix required:"
    echo "  1. git fetch origin develop"
    echo "  2. git rebase origin/develop"
    echo "  3. Resolve conflicts in your editor"
    echo "  4. git add ."
    echo "  5. git rebase --continue"
    echo "  6. git push origin $branch"
    exit 1
  fi
  
  echo "✅ Rebased on develop successfully"
fi

# Continue with existing validation (pnpm check)
pnpm check
```

### Rationale

- **Local execution**: Prevents conflicts before they reach GitHub
- **Feature-only scope**: Doesn't interfere with main/develop branch management
- **Early feedback**: User sees conflicts immediately, not in PR
- **Complements main workflow**: Works with promote-to-main.yml (if rebase fails locally, user fixes; if it somehow happens at GitHub, promote workflow catches it)
- **No external dependencies**: Uses only git commands already available

### Error Handling

- **Rebase conflicts** → Abort, log diagnostic steps, block push (exit 1)
- **Fetch fails** → Git exits 1 automatically
- **Non-feature branches** → Skip hook silently (exit 0)

### Workflow

1. Developer pushes feature branch
2. Pre-push hook runs
3. Hook fetches latest develop and tries to rebase
4. If conflicts → Hook aborts, logs instructions, blocks push
5. Developer resolves locally, pushes again
6. Hook retries rebase, succeeds, allows push
7. PR to develop is now conflict-free

---

## Testing Strategy

### Happy Path

1. Create feature branch from main
2. Make 1-2 commits
3. Commit another change to develop (on GitHub or via separate clone)
4. Try to push feature branch
5. Observe: pre-push hook rebases automatically, push succeeds
6. Verify: feature branch is now on top of develop

### Conflict Case

1. Create two feature branches from main
2. Make commits to both
3. Merge first feature to develop (on GitHub)
4. Try to push second feature branch locally
5. Observe: pre-push hook detects conflicts, blocks push, logs diagnostic steps
6. User runs diagnostic commands locally, resolves conflicts
7. User retries push
8. Observe: hook retries rebase, succeeds, push allowed

---

## Deployment

No infrastructure changes. Husky hook modification only.

- `.husky/pre-push` is already version-controlled (see git status)
- Hook runs locally on every push (zero cost at GitHub level)
- Safe to deploy immediately after code review
