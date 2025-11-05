# Repository Rulesets

This directory contains ruleset configurations for the FirefighterHub repository.

## Available Rulesets

### 1. Main Branch Protection (`main-branch-protection.json`)

**Purpose:** Protect the production branch from accidental or unauthorized changes

**Rules:**
- ✅ **Pull Request Required:** All changes must go through PR review
- ✅ **Required Reviews:** Minimum 1 approval required
- ✅ **Dismiss Stale Reviews:** Approvals dismissed when new commits pushed
- ✅ **Last Push Approval:** Someone other than last pusher must approve
- ✅ **Required Thread Resolution:** All PR comments must be resolved
- ✅ **Required Status Checks:**
  - `typecheck` - TypeScript compilation must pass
  - `lint` - ESLint must pass
  - `test` - All unit tests must pass
  - `build` - Production build must succeed
- ✅ **Strict Status Checks:** Branch must be up-to-date before merge
- ✅ **Block Deletion:** Main branch cannot be deleted
- ✅ **Block Force Push:** No force pushes allowed
- ✅ **Linear History:** Requires squash or rebase merge (no merge commits)

**Bypass:** Repository administrators only

**Target:** `main` branch

---

### 2. Feature Branch Standards (`feature-branch-standards.json`)

**Purpose:** Enforce naming conventions and commit standards for feature branches

**Rules:**
- ✅ **Branch Creation:** Allowed for all users
- ✅ **Branch Updates:** Allow fetch and merge
- ✅ **Linear History:** Enforce clean commit history
- ✅ **Conventional Commits:** Commit messages must follow format:
  ```
  <type>(<scope>): <description>

  Types: feat, fix, docs, style, refactor, test, chore, perf, ci, build, revert
  Length: 1-100 characters
  ```
- ✅ **Valid Email:** Block commits from noreply.github.com (except bots)

**Bypass:** Repository administrators

**Targets:**
- `feature/**`
- `feat/**`
- `fix/**`
- `bugfix/**`
- `hotfix/**`
- `refactor/**`
- `chore/**`
- `docs/**`

---

### 3. Sensitive Files Protection (`sensitive-files-protection.json`)

**Purpose:** Prevent accidental commit of secrets, credentials, and sensitive data

**Rules:**
- ✅ **Block File Paths:**
  - Environment files (`.env`, `.env.local`, `.env.production`)
  - Secrets directories (`secrets/**/*`, `credentials/**/*`)
  - Private keys (`.pem`, `.key`, `.p12`, `.pfx`, `id_rsa`, `id_dsa`)
  - SQL dumps (`*.sql`, `dump.sql`, `backup.sql`)
- ✅ **Block File Extensions:**
  - `.env` - Environment files
  - `.pem` - SSL certificates
  - `.key` - Private keys
  - `.p12`, `.pfx` - Certificate files
- ✅ **Max File Size:** 10MB (prevents large binary commits)
- ✅ **Max Path Length:** 255 characters (Windows compatibility)

**Bypass:** Repository administrators only

**Target:** All pushes to repository and entire fork network

---

## How to Import Rulesets

### Method 1: Via GitHub Web UI (Recommended)

1. Go to: https://github.com/DrunkOnJava/firefighterHub/settings/rules
2. Click **New ruleset** → **Import a ruleset**
3. Upload the JSON file
4. Review and click **Create**

### Method 2: Via GitHub CLI (Coming Soon)

```bash
# GitHub CLI doesn't currently support ruleset import
# Use web UI for now
```

### Method 3: Via GitHub API

```bash
# Import main branch protection
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Accept: application/vnd.github+json" \
  https://api.github.com/repos/DrunkOnJava/firefighterHub/rulesets \
  -d @.github/rulesets/main-branch-protection.json

# Import feature branch standards
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Accept: application/vnd.github+json" \
  https://api.github.com/repos/DrunkOnJava/firefighterHub/rulesets \
  -d @.github/rulesets/feature-branch-standards.json

# Import sensitive files protection
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Accept: application/vnd.github+json" \
  https://api.github.com/repos/DrunkOnJava/firefighterHub/rulesets \
  -d @.github/rulesets/sensitive-files-protection.json
```

---

## Ruleset Benefits

### Main Branch Protection
- 🛡️ Prevents accidental direct pushes to production
- 🔍 Ensures code review before merge
- ✅ Guarantees all tests pass
- 📏 Maintains clean commit history
- 🚫 Prevents force push disasters

### Feature Branch Standards
- 📝 Enforces conventional commit format
- 🔄 Maintains clean Git history
- 👥 Ensures proper attribution
- 📋 Improves changelog generation
- 🔍 Makes commits searchable

### Sensitive Files Protection
- 🔒 Prevents credential leaks
- 💾 Blocks oversized files
- 📁 Enforces path length limits
- 🚫 Stops secret commits
- 🌐 Applies to entire fork network

---

## Testing Rulesets

### Test Main Branch Protection

```bash
# Should FAIL (no PR)
git checkout main
git commit --allow-empty -m "test: direct commit to main"
git push origin main
# Expected: ❌ Rejected - Pull request required

# Should PASS (via PR)
git checkout -b test/ruleset-check
git commit --allow-empty -m "test: verify rulesets working"
git push origin test/ruleset-check
gh pr create --title "Test: Ruleset Verification" --body "Testing main branch protection"
# Expected: ✅ PR created, can merge after status checks pass
```

### Test Feature Branch Standards

```bash
# Should FAIL (bad commit message)
git checkout -b feature/test
git commit --allow-empty -m "bad commit message"
git push origin feature/test
# Expected: ❌ Rejected - Commit message must match pattern

# Should PASS (conventional commits)
git commit --allow-empty -m "feat(test): add ruleset verification"
git push origin feature/test
# Expected: ✅ Accepted
```

### Test Sensitive Files Protection

```bash
# Should FAIL (env file)
echo "SECRET_KEY=12345" > .env.local
git add .env.local
git commit -m "chore: add env file"
git push
# Expected: ❌ Rejected - Blocked file path

# Should FAIL (large file)
dd if=/dev/zero of=largefile.bin bs=1M count=11
git add largefile.bin
git commit -m "chore: add large file"
git push
# Expected: ❌ Rejected - File size exceeds 10MB
```

---

## Ruleset Priority

When multiple rulesets apply, the **most restrictive** rule wins:

**Example:** Feature branch `feature/ui-update` merging to `main`
- Main branch ruleset: Requires 1 approval
- Feature branch ruleset: Requires conventional commits
- **Result:** Both apply - needs 1 approval AND conventional commits

---

## Bypass Permissions

All rulesets allow bypass for:
- ✅ **Repository Administrators:** Full bypass capability
- ❌ **Regular Contributors:** Must follow all rules
- ❌ **Bots/CI:** Must follow all rules (except where specifically allowed)

**Copilot Agent:** Granted bypass for main branch (can create PRs directly)

---

## Enforcement Status

All rulesets are set to **Active** by default:
- **Active:** Rules enforced immediately
- **Disabled:** Rules not enforced (for testing)
- **Evaluate:** Log rule violations but don't block (testing mode)

---

## Monitoring Rulesets

### View Rule Insights

1. Go to: https://github.com/DrunkOnJava/firefighterHub/settings/rules/insights
2. See timeline of:
   - ✅ Actions that passed rules
   - ❌ Actions that failed rules
   - ⚠️ Actions where rules were bypassed

### View Active Rulesets for Branch

```bash
# View rulesets affecting main branch
gh api /repos/DrunkOnJava/firefighterHub/rules/branches/main

# View all repository rulesets
gh api /repos/DrunkOnJava/firefighterHub/rulesets
```

---

## Maintenance

### Updating Rulesets

1. Edit the JSON file
2. Go to: Repository Settings → Rules → Rulesets
3. Click ruleset name
4. Click ... → Delete ruleset
5. Import updated JSON file

### Temporarily Disable Ruleset

1. Go to ruleset settings
2. Change enforcement status to "Disabled"
3. Save changes
4. Re-enable when testing complete

---

## Best Practices

### DO:
- ✅ Test rulesets in "Evaluate" mode first
- ✅ Document bypass decisions
- ✅ Review rule insights regularly
- ✅ Update rulesets as project evolves
- ✅ Keep commit message patterns clear

### DON'T:
- ❌ Bypass rulesets without documenting why
- ❌ Make main branch rules too lenient
- ❌ Block legitimate workflows
- ❌ Forget to test after adding rulesets
- ❌ Over-complicate commit message patterns

---

## FirefighterHub-Specific Considerations

### UI/UX Audit Implementation (Issues #14-#36)

Copilot agent needs to:
- ✅ Create feature branches (allowed by feature branch ruleset)
- ✅ Follow conventional commits (already configured to do so)
- ✅ Create PRs to main (required by main branch protection)
- ✅ Pass all status checks (typecheck, lint, test, build)

### Database Migrations

When adding Supabase migrations:
- Create `migration/add-xyz` branch
- Follow conventional commit: `feat(db): add xyz migration`
- PR must pass all checks before merge

### Emergency Hotfixes

For critical production fixes:
- Use `hotfix/**` branch (covered by feature standards)
- Administrator can bypass if absolutely necessary
- Still requires conventional commit format

---

## Quick Reference

### Conventional Commit Types

```
feat:     New feature
fix:      Bug fix
docs:     Documentation changes
style:    Code style (formatting, no logic change)
refactor: Code refactoring (no feature/bug change)
test:     Adding/updating tests
chore:    Maintenance tasks
perf:     Performance improvements
ci:       CI/CD changes
build:    Build system changes
revert:   Revert previous commit
```

### Commit Message Template

```
<type>(<scope>): <description>

<body (optional)>

<footer (optional)>

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

**Last Updated:** November 4, 2025
**Total Rulesets:** 3
**Enforcement:** Active
