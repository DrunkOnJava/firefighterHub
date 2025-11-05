# Copilot PR Workflow Approval Guide

## Why Approval Is Needed

GitHub Copilot creates PRs from branches in the main repository (not forks), but because it's a new contributor (`app/copilot-swe-agent`), repository settings require manual approval for workflow runs.

**Error:** `action_required` conclusion on all workflow runs

## How to Approve (Manual Process)

Since the GitHub API doesn't support approving non-fork workflow runs, you must approve via the web interface:

### Quick Approval Steps

1. **All PRs are now open in your browser** (PRs #43-51)
2. On each PR page, look for the yellow banner that says:
   - "This workflow requires approval to run"
   - Or check the "Checks" tab
3. Click **"Approve and run"** button
4. Repeat for all 9 PRs

### Batch Approval Script (if needed)

```bash
# Reopen all PRs in browser
for pr in 43 44 45 46 47 48 49 50 51; do
  gh pr view $pr --web
  sleep 2
done
```

## Alternative: Adjust Repository Settings

To prevent this for future Copilot PRs:

1. Go to: `Settings → Actions → General`
2. Scroll to: **"Fork pull request workflows from outside collaborators"**
3. Current setting: "Require approval for all outside collaborators"
4. Change to: "Require approval for first-time contributors who are new to GitHub"
   - This trusts GitHub Apps like Copilot automatically

**⚠️ Security Note:** Only do this if you trust GitHub Copilot. The current setting is more secure.

## PRs Requiring Approval

| PR# | Title | Issue | Phase | Priority |
|-----|-------|-------|-------|----------|
| #43 | Enhance calendar day cell visual hierarchy | #18 | Phase 2 | High |
| #44 | Strengthen typography scale | #19 | Phase 2 | High |
| #45 | Standardize spacing values | #20 | Phase 2 | High |
| #46 | Color-blind safe shift indicators | #21 | Phase 2 | Medium |
| #47 | Standardize icon sizes | #24 | Phase 3 | Medium |
| #48 | Elevation shadow system | #26 | Phase 3 | Medium |
| #49 | Standardize modal overlay | #22 | Phase 3 | Medium |
| #50 | Unified loading states | #25 | Phase 3 | Medium |
| #51 | Border radius hierarchy | #23 | Phase 3 | Medium |

## After Approval

Once workflows are approved and running:

### 1. Monitor for Failures

```bash
# Check all Copilot PR statuses
gh pr list --author "app/copilot-swe-agent" --json number,title,statusCheckRollup --jq '.[] | {pr: .number, checks: (.statusCheckRollup | map(.conclusion) | unique)}'
```

### 2. Review Passing PRs

```bash
# View a specific PR
gh pr view <number>

# View diff
gh pr diff <number>

# Check CI status
gh pr checks <number>
```

### 3. Merge Acceptable PRs

Recommended merge order (to minimize conflicts):

**Phase 2 (High Priority):**
1. PR #46 (Color-blind indicators) - Most isolated change
2. PR #44 (Typography) - Foundation for other PRs
3. PR #45 (Spacing) - Another foundation
4. PR #43 (Calendar cells) - Builds on typography/spacing

**Phase 3 (Medium Priority):**
5. PR #47 (Icon sizes)
6. PR #48 (Shadow system)
7. PR #49 (Modal overlay)
8. PR #50 (Loading states)
9. PR #51 (Border radius)

### 4. Handle Merge Conflicts

If later PRs have conflicts:

```bash
# Close the conflicting PR
gh pr close <number> --comment "Closing due to merge conflicts. Will re-run Copilot on updated main branch."

# Re-open the related issue
gh issue reopen <issue-number>

# Copilot will create a new PR automatically
```

## Known Issues

### Supabase Test Connection

Multiple PRs report firewall blocking `test.supabase.co` during test runs:

```
Firewall rules blocked me from connecting to: test.supabase.co
```

**Solutions:**

1. **Add to allowlist** (recommended):
   - Go to: `Settings → Copilot → Coding agent`
   - Add `test.supabase.co` to custom allowlist

2. **Or configure in setup steps**:
   - Update `.github/workflows/copilot-setup-steps.yml`
   - Add `test.supabase.co` to network configuration

3. **Or accept test failures**:
   - Tests will fail but code quality is still validated by typecheck/lint
   - Can run tests locally after merge

## Automation Opportunities

Future improvements to avoid manual approval:

1. **Grant Copilot app write permissions** (if comfortable)
2. **Create workflow approval bot** (custom GitHub Action)
3. **Use separate Copilot account** with collaborator access
4. **Adjust fork PR settings** as mentioned above

---

**Last Updated:** November 5, 2025
**Status:** 9 PRs awaiting manual workflow approval
