# Runbook: Dependency Updates

## Overview

This runbook provides guidelines for safely updating dependencies in the FirefighterHub project.

## Package Manager

**Required**: pnpm (not npm or yarn)

```bash
# Verify pnpm is installed
pnpm --version

# If not installed
npm install -g pnpm
```

## Types of Updates

### 1. Patch Updates (Safest)

**Example**: `1.2.3` → `1.2.4`

**Risk**: Low - Bug fixes only, no new features

**When to apply**: Regularly (weekly or bi-weekly)

```bash
# Check for patch updates
pnpm outdated --depth 0

# Update all patch versions
pnpm update --latest
```

### 2. Minor Updates (Moderate Risk)

**Example**: `1.2.0` → `1.3.0`

**Risk**: Medium - New features, backward compatible

**When to apply**: Monthly or per sprint

```bash
# Update specific package to latest minor
pnpm update package-name --latest

# Test thoroughly after update
pnpm typecheck && pnpm lint && pnpm test:run && pnpm build
```

### 3. Major Updates (High Risk)

**Example**: `1.0.0` → `2.0.0`

**Risk**: High - Breaking changes, API changes

**When to apply**: Planned updates, with dedicated testing

```bash
# Check for major updates
pnpm outdated

# Review changelog before updating
# Look for BREAKING CHANGES
```

## Pre-Update Checklist

Before updating any dependencies:

- [ ] Check current branch is up to date with main
- [ ] All tests passing (`pnpm test:run`)
- [ ] No uncommitted changes
- [ ] Create feature branch: `chore/update-dependencies-YYYY-MM-DD`
- [ ] Review changelog/release notes for breaking changes

## Standard Update Workflow

### Step 1: Check for Updates

```bash
# List outdated packages
pnpm outdated

# Output example:
# Package           Current  Wanted  Latest
# react             18.2.0   18.2.0  18.3.1
# @types/react      18.2.0   18.2.0  18.3.0
# vite              5.0.0    5.0.8   5.1.0
```

### Step 2: Review Changes

For each package to update:

```bash
# View package info
pnpm info package-name

# Check changelog (GitHub)
# Example: https://github.com/vitejs/vite/releases
```

**Key things to look for**:
- ⚠️ BREAKING CHANGES
- 🐛 Bug fixes
- ✨ New features
- 🔒 Security fixes
- 📝 Migration guides

### Step 3: Create Update Branch

```bash
git checkout main
git pull origin main
git checkout -b chore/update-dependencies-2025-11-07
```

### Step 4: Update Dependencies

**Option A: Update Specific Package**
```bash
# Update to latest compatible version
pnpm update package-name

# Update to specific version
pnpm add package-name@1.2.3

# Update to latest (even if major)
pnpm add package-name@latest
```

**Option B: Update All Patch/Minor**
```bash
# Update all to latest compatible versions
pnpm update --latest
```

**Option C: Interactive Update**
```bash
# Using pnpm-outdated (install first)
pnpm add -g pnpm-outdated
pnpm-outdated
```

### Step 5: Verify Installation

```bash
# Verify pnpm-lock.yaml was updated
git status

# Check installed versions
pnpm list package-name

# Ensure no duplicate packages
pnpm dedupe
```

### Step 6: Test Everything

```bash
# 1. TypeScript compilation
pnpm typecheck

# 2. Linting
pnpm lint

# 3. Unit tests
pnpm test:run

# 4. Build
pnpm build

# 5. Dev server
pnpm dev
# Manually test critical features

# 6. E2E tests
pnpm test:e2e
```

### Step 7: Check for Vulnerabilities

```bash
# Security audit
pnpm audit

# Fix automatically if possible
pnpm audit fix

# Check for high-severity issues
pnpm audit --audit-level high
```

### Step 8: Commit and Create PR

```bash
# Stage changes
git add package.json pnpm-lock.yaml

# Commit with descriptive message
git commit -m "chore(deps): update dependencies

- react: 18.2.0 → 18.3.1
- vite: 5.0.0 → 5.1.0
- @types/react: 18.2.0 → 18.3.0

All tests passing. No breaking changes."

# Push
git push -u origin chore/update-dependencies-2025-11-07

# Create PR
gh pr create --title "chore(deps): update dependencies" \
             --body "Updates multiple dependencies. All tests passing."
```

## Critical Dependencies

### Supabase Client

**Special care needed** - affects database connections, real-time subscriptions

```bash
# Current version
pnpm list @supabase/supabase-js

# Before updating
# 1. Check Supabase changelog
# 2. Test real-time subscriptions
# 3. Verify connection limits
# 4. Check authentication flow

# Update
pnpm add @supabase/supabase-js@latest

# Test real-time
# 1. Open app in multiple tabs
# 2. Make changes in one tab
# 3. Verify updates appear in other tabs
# 4. Check browser console for connection errors
```

### React & React DOM

**Always update together** to matching versions

```bash
# Check versions match
pnpm list react react-dom

# Update both
pnpm add react@latest react-dom@latest @types/react@latest @types/react-dom@latest

# Test thoroughly
pnpm test:run
pnpm test:e2e
```

### Vite

**Build tool** - affects development and production builds

```bash
# Update Vite
pnpm add -D vite@latest

# Test dev server
pnpm dev

# Test production build
pnpm build
pnpm preview

# Verify HMR works
# Make change, ensure fast refresh
```

### TypeScript

**Type checker** - may introduce new type errors

```bash
# Update TypeScript
pnpm add -D typescript@latest

# Fix type errors
pnpm typecheck

# Common issues after update:
# - Stricter null checks
# - New linting rules
# - Changed lib types
```

### Tailwind CSS

**Styling framework** - may affect visual appearance

```bash
# Update Tailwind
pnpm add -D tailwindcss@latest postcss@latest autoprefixer@latest

# Test visual appearance
pnpm dev

# Check all pages:
# - Light mode
# - Dark mode
# - Mobile responsive
# - All components
```

## Handling Breaking Changes

### Example: React 19 Update

**Breaking change**: Automatic batching affects state updates

**Migration steps**:

1. **Read migration guide**:
   ```bash
   # Open React 19 release notes
   open https://react.dev/blog/2024/04/25/react-19
   ```

2. **Update gradually**:
   ```bash
   # Update @types first
   pnpm add -D @types/react@19 @types/react-dom@19

   # Fix type errors
   pnpm typecheck

   # Then update React
   pnpm add react@19 react-dom@19
   ```

3. **Fix code**:
   ```typescript
   // Old (React 18)
   ReactDOM.render(<App />, document.getElementById('root'));

   // New (React 19)
   import { createRoot } from 'react-dom/client';
   createRoot(document.getElementById('root')!).render(<App />);
   ```

4. **Test extensively**:
   ```bash
   pnpm test:run
   pnpm test:e2e
   # Manual testing of all features
   ```

### Example: Vite 6 Update

**Breaking change**: Node.js 18+ required

**Migration steps**:

1. **Check Node version**:
   ```bash
   node --version  # Should be 18+
   ```

2. **Update Vite config** (if needed):
   ```typescript
   // vite.config.ts
   export default defineConfig({
     // New Vite 6 options
   });
   ```

3. **Update plugins**:
   ```bash
   pnpm add -D @vitejs/plugin-react@latest
   ```

## Security Updates

### Critical Security Vulnerability

When `pnpm audit` shows critical vulnerabilities:

```bash
# 1. Review vulnerability
pnpm audit

# Example output:
# high: Prototype Pollution in minimist
# Package: minimist
# Patched in: >=1.2.6
# More info: https://github.com/advisories/GHSA-xvch-5gv4-984h

# 2. Check if direct or transitive dependency
pnpm why minimist

# 3. If direct dependency, update
pnpm add minimist@latest

# 4. If transitive, update parent package
pnpm add package-that-uses-minimist@latest

# 5. If no fix available, check for overrides
# Add to package.json:
{
  "pnpm": {
    "overrides": {
      "minimist": "^1.2.6"
    }
  }
}

# 6. Re-audit
pnpm audit
```

### Automated Security Updates

Consider using **Dependabot** for automatic security updates:

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 5
    labels:
      - "dependencies"
      - "security"
```

## Rollback Procedure

If an update causes issues:

### Immediate Rollback

```bash
# 1. Revert the commit
git revert HEAD

# 2. Push
git push origin your-branch

# 3. Or reset (if not pushed/shared)
git reset --hard HEAD~1
```

### Selective Rollback

```bash
# Restore previous package.json and lockfile
git checkout HEAD~1 -- package.json pnpm-lock.yaml

# Reinstall
pnpm install

# Commit
git commit -m "chore(deps): revert problematic update"
```

### Pin Specific Version

```bash
# In package.json, change:
"react": "^18.3.1"  # Caret allows minor updates

# To:
"react": "18.2.0"  # Exact version, no updates

# Then
pnpm install
```

## Update Strategies

### Strategy 1: Regular Maintenance (Recommended)

**Frequency**: Weekly

**Approach**:
```bash
# Every Monday
git checkout -b chore/weekly-updates-$(date +%Y-%m-%d)
pnpm outdated
pnpm update  # Patch/minor only
pnpm typecheck && pnpm test:run && pnpm build
# Create PR if updates exist
```

### Strategy 2: Sprint-Based Updates

**Frequency**: Per sprint (2 weeks)

**Approach**:
- Review outdated packages at sprint start
- Plan major updates as sprint tasks
- Test thoroughly before sprint end

### Strategy 3: Security-Only Updates

**Frequency**: As needed (high-priority)

**Approach**:
```bash
# Check for vulnerabilities
pnpm audit

# If critical issues
git checkout -b hotfix/security-updates
# Update only vulnerable packages
pnpm audit fix
# Test and merge immediately
```

## Testing Checklist

After any dependency update:

### Automated Tests
- [ ] `pnpm typecheck` passes
- [ ] `pnpm lint` passes
- [ ] `pnpm test:run` passes (all unit tests)
- [ ] `pnpm test:e2e` passes (E2E tests)
- [ ] `pnpm build` succeeds
- [ ] `pnpm preview` works

### Manual Testing
- [ ] Dev server starts (`pnpm dev`)
- [ ] Hot module replacement works
- [ ] Shift switching works (A/B/C)
- [ ] Calendar renders correctly
- [ ] Firefighter CRUD operations work
- [ ] Scheduled holds functionality
- [ ] Activity log updates
- [ ] Real-time subscriptions work
- [ ] Dark mode toggles correctly
- [ ] Mobile responsive layout intact
- [ ] No console errors
- [ ] No TypeScript errors in IDE

### Browser Testing (for UI dependencies)
- [ ] Chrome
- [ ] Firefox
- [ ] Safari (if available)
- [ ] Mobile browsers

## Common Issues

### Issue 1: Peer Dependency Warnings

```bash
# Warning: react@18.3.1 has unmet peer dependency typescript@>=4.9.0
```

**Solution**:
```bash
# Install missing peer dependency
pnpm add -D typescript@latest
```

### Issue 2: Lockfile Conflicts

**After merge, lockfile has conflicts**

**Solution**:
```bash
# Delete lockfile
rm pnpm-lock.yaml

# Reinstall
pnpm install

# Commit new lockfile
git add pnpm-lock.yaml
git commit -m "chore: regenerate lockfile"
```

### Issue 3: Package Not Found

```bash
# Error: Package 'some-package' not found
```

**Solution**:
```bash
# Clear pnpm cache
pnpm store prune

# Reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Issue 4: Build Fails After Update

**TypeScript errors or build errors**

**Solution**:
```bash
# 1. Check error messages
pnpm build

# 2. Fix type errors
pnpm typecheck

# 3. Clear cache and rebuild
rm -rf node_modules/.vite
pnpm build

# 4. If still failing, check changelog for breaking changes
```

## Best Practices

### Do's ✅

- Update regularly (don't wait months)
- Read changelogs before updating
- Update one major dependency at a time
- Test thoroughly before merging
- Keep pnpm-lock.yaml committed
- Document breaking changes in PR
- Run security audits regularly

### Don'ts ❌

- Don't update everything at once
- Don't skip testing after updates
- Don't commit node_modules
- Don't use `npm` or `yarn` in this project
- Don't ignore security warnings
- Don't update during critical deployments
- Don't update without reviewing changes

## Emergency Procedures

### Production is Broken After Deployment

```bash
# 1. Quick rollback via GitHub
gh pr list --state merged --limit 1
# Find the PR that introduced the bad update

# 2. Revert via GitHub UI
# Go to PR → "Revert" button → Create revert PR → Merge

# 3. Or revert locally
git revert <merge-commit-sha>
git push origin main

# 4. Investigate and fix properly
# Create new branch, fix issue, thorough testing
```

## Automation

### GitHub Actions for Dependency Checks

```yaml
# .github/workflows/dependency-check.yml
name: Dependency Check

on:
  schedule:
    - cron: '0 0 * * 1'  # Every Monday
  workflow_dispatch:

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - name: Check for outdated packages
        run: pnpm outdated
      
      - name: Security audit
        run: pnpm audit --audit-level high
```

## Resources

- [pnpm Documentation](https://pnpm.io/)
- [Dependency Update Best Practices](https://docs.npmjs.com/cli/v8/commands/npm-update)
- [Semantic Versioning](https://semver.org/)
- [Keep a Changelog](https://keepachangelog.com/)

---

**Related Documentation**:
- [CONTRIBUTING.md](../../../CONTRIBUTING.md)
- [Database Migrations Runbook](./database-migrations.md)
- [Merge Conflicts Runbook](./merge-conflicts.md)

**Last Updated**: November 7, 2025
