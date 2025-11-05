# Branch Protection Setup Guide

**Purpose:** Make "All checks passed" actually mean something by enforcing quality gates in the PR UI.

---

## The Problem

Currently PRs show green checkmarks even when critical quality checks haven't run or aren't enforced because:
- ✅ Rulesets enforce at merge-time but don't mark checks as "Required" in PR UI
- ✅ Checks show `isRequired: null` instead of `isRequired: true`
- ✅ Result: False-green PRs can be merged with failing quality

---

## The Solution: Classic Branch Protection

GitHub's classic branch protection (web UI) makes checks show as "Required" in the PR UI, providing clear visual feedback.

---

## Setup Instructions

### Step 1: Navigate to Branch Protection

Visit: https://github.com/DrunkOnJava/firefighterHub/settings/branch_protection_rules/new

### Step 2: Configure Main Branch Protection

**Branch name pattern:** `main`

**Enable these settings:**

#### ☑️ Require a pull request before merging
- Required number of approvals: `1`
- ☑️ Dismiss stale pull request approvals when new commits are pushed
- ☑️ Require review from Code Owners (optional - if you have CODEOWNERS file)
- ☑️ Require approval of the most recent reviewable push

#### ☑️ Require status checks to pass before merging
- ☑️ Require branches to be up to date before merging

**Add these checks as Required (EXACT names):**

**From Core CI workflow:**
- `build`
- `typecheck`
- `lint`

**From Quality CI (PR) workflow (after new workflows are deployed):**
- `Quality CI (PR) / build`
- `Quality CI (PR) / Design Token Validation`
- `Quality CI (PR) / Accessibility (axe+pa11y)`
- `Quality CI (PR) / Lighthouse`
- `Quality CI (PR) / Visual Regression`

**Note:** Check names must match EXACTLY as they appear in the "Checks" tab of a PR. Case-sensitive, spaces matter.

#### ☑️ Require linear history
Prevents merge commits, keeps history clean.

#### ☑️ Do not allow bypassing the above settings
Ensures even admins must follow the rules.

#### ☑️ Restrict who can push to matching branches
(Optional - only if you want to limit direct push access)

### Step 3: Save Changes

Click "Create" at the bottom of the page.

---

## Verification

After enabling branch protection, verify it's working:

### Test 1: Check Required Badges Show in PR UI

```bash
# Open any PR
gh pr view 43 --web

# Look for green "Required" badges next to each check name
# Should see: ✓ build Required
#             ✓ lint Required
#             ✓ typecheck Required
```

### Test 2: Verify isRequired is True

```bash
gh pr view 43 --json statusCheckRollup --jq '.statusCheckRollup[] | select(.isRequired == true) | .name'

# Should output:
# build
# typecheck
# lint
# Quality CI (PR) / build
# Quality CI (PR) / Design Token Validation
# ... etc
```

### Test 3: Ensure Merge Blocked Without Checks

```bash
# Try to merge a PR before checks complete (should fail)
gh pr merge 43 --squash

# Expected: Error message about required checks not passing
```

---

## Expected Check Names (After New Workflows Deploy)

### Core CI
These run on every PR and push to main:
- `build`
- `typecheck`
- `lint`
- ~~`test`~~ (currently disabled - will add back after fixing 40 failing tests)

### Quality CI (PR)
These run only on PRs touching src/:
- `Quality CI (PR) / build`
- `Quality CI (PR) / Design Token Validation`
- `Quality CI (PR) / Accessibility (axe+pa11y)`
- `Quality CI (PR) / Lighthouse`
- `Quality CI (PR) / Visual Regression`

### Quality CI (main)
These run on pushes to main (post-merge audit):
- `Quality CI (main) / build`
- `Quality CI (main) / Design Token Validation`
- `Quality CI (main) / Accessibility (axe+pa11y)`
- `Quality CI (main) / Lighthouse`
- `Quality CI (main) / Visual Regression`

---

## What Gets Enforced

### Design Token Validation
**Enforces:**
- ✅ Zero arbitrary Tailwind values (bg-[#hex], w-[123px], etc.)
- ✅ ≥95% token usage (components importing from styles/)

**Result:** Hard fail on violations, PRs blocked

### Accessibility
**Enforces:**
- ✅ Zero critical/serious axe-core violations
- ✅ Zero pa11y WCAG 2.0 AA errors
- ✅ Lighthouse accessibility = 100/100

**Result:** Hard fail on violations, PRs blocked

### Lighthouse Performance
**Enforces:**
- ⚠️ Performance ≥90% (warning only)
- ⚠️ Best practices ≥90% (warning only)
- ✅ Accessibility = 100% (hard fail)

**Result:** Performance/BP warn, A11y blocks

### Visual Regression
**Enforces:**
- ✅ Average pixel diff <1.0%
- ✅ Compares current vs base branch (main)
- ✅ Tests 1920×1080 and 375×667 viewports

**Result:** Hard fail if visual changes >1%, PRs blocked

---

## Benefits

### Before Setup
- ❌ PRs show green with no required checks
- ❌ Can merge with arbitrary Tailwind values
- ❌ Can merge with accessibility violations
- ❌ Can merge with significant visual regressions
- ❌ No token usage enforcement
- ❌ False sense of "passing"

### After Setup
- ✅ PR UI shows "Required" badges on all gates
- ✅ Cannot merge without passing design tokens
- ✅ Cannot merge with accessibility violations
- ✅ Cannot merge with >1% visual diff
- ✅ Token usage ≥95% enforced
- ✅ True quality gates

---

## Rollout Plan

### Phase 1: Deploy New Workflows (Now)
```bash
# Commit new workflows
git add .github/workflows/quality-*.yml
git commit -m "refactor(ci): implement single-build fan-out quality pipeline"
git push origin main
```

### Phase 2: Enable Branch Protection (Manual)
Follow instructions above to enable classic branch protection.

### Phase 3: Verify on Test PR
```bash
# Create test PR
git checkout -b test/verify-branch-protection
echo "// test" >> src/App.tsx
git add src/App.tsx
git commit -m "test: verify branch protection"
git push -u origin test/verify-branch-protection
gh pr create --title "Test: Verify Branch Protection" --body "Verifying required checks show in UI"

# Check the PR
gh pr view --web
# Should see "Required" badges on all checks
```

### Phase 4: Clean Up
```bash
# Remove old workflow
git rm .github/workflows/quality-checks.yml.old
git commit -m "chore: remove old quality-checks workflow"

# Close test PR
gh pr close --delete-branch
```

---

## Troubleshooting

### Check Names Don't Appear in "Add required checks" Dropdown

**Cause:** GitHub only shows checks that have run in the last 7 days.

**Fix:**
1. Merge the new workflows to main
2. Create a test PR to trigger the workflows
3. Wait for checks to complete
4. Then add them as required

### PRs Still Show Green Without Required Badges

**Cause:** Branch protection not saved correctly.

**Fix:**
1. Go to Settings → Branches
2. Verify your rule is listed and "Active"
3. Edit the rule and ensure all checks are listed
4. Save again

### "This check hasn't run yet" Error

**Cause:** Check name typo or workflow hasn't triggered.

**Fix:**
1. Copy check name EXACTLY from a PR's "Checks" tab
2. Paste into required checks (don't type manually)
3. Verify workflow file job names match

---

## Maintenance

### When Adding New Quality Checks

1. Add job to `quality-reusable.yml`
2. Deploy to main
3. Trigger a PR to run the new check
4. Add check name to branch protection
5. Verify on next PR

### When Renaming Workflow Jobs

1. Update job name in `quality-reusable.yml`
2. Update required check list in branch protection
3. Communicate to team (old PRs may show outdated check names)

---

**Status:** Ready to implement
**Time to complete:** ~10 minutes (manual branch protection setup)
**Impact:** Eliminates false-green PRs, enforces real quality standards
