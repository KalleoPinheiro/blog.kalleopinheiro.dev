# Contributing

## Development Workflow

### Setup

```bash
pnpm install
pnpm dev
```

### Branching Strategy (GitHub Flow)

1. Create feature branch from `main`:
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/your-feature
   ```

2. Make changes, commit with [Conventional Commits](https://www.conventionalcommits.org/):
   ```bash
   git commit -m "feat(scope): description"
   ```

3. Push and create PR to `main`:
   ```bash
   git push origin feature/your-feature
   # Create PR on GitHub, target: main branch
   ```

4. Code review → merge to main → auto-deploy

### Pre-Commit Checks

```bash
pnpm check  # typecheck + lint + test (MUST pass before push)
pnpm format # auto-format code
```

### Pre-Push Rebase Hook

When you push a feature branch, a pre-push hook automatically rebases your branch on the latest `main` to prevent conflicts when opening a PR. This runs silently on successful rebase.

Non-feature branches skip the hook.

#### If rebase fails

Conflicts occur when `main` has moved forward since you created your feature branch. The hook will block your push and log diagnostic steps:

```
❌ Rebase failed: conflicts detected on feature/your-branch

Manual fix required:
  1. git fetch origin main
  2. git rebase origin/main
  3. Resolve conflicts in your editor
  4. git add .
  5. git rebase --continue
  6. git push origin feature/your-branch
```

Follow these steps, then retry `git push`. The hook will rebase again and allow the push if conflicts are resolved.

---

## CI/CD

### Workflows

**validate.yml** — Runs on feature branch push and PRs to `main`
- Typecheck, lint, format check, tests, Snyk SAST
- Blocks merge if checks fail

---

## Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): subject

optional body

Co-Authored-By: Name <email>
```

**Types:** `feat`, `fix`, `chore`, `docs`, `test`, `refactor`, `perf`

**Example:**
```
feat(auth): add JWT token validation

Validates incoming JWT tokens against the public key.
Logs invalid tokens and returns 401.

Co-Authored-By: Alice <alice@example.com>
```

---

## Testing

Run tests locally before pushing:

```bash
pnpm test          # Run all tests once
pnpm test:watch    # Watch mode
pnpm test:coverage # Coverage report
```

All new code must include tests (TDD: write test first, then implementation).

---

## Documentation

- Update `README.md` for user-facing changes
- Add docs/ files for major features
- Keep this file (CONTRIBUTING.md) up-to-date with workflow changes
