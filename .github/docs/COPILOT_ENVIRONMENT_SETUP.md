# GitHub Copilot Environment Configuration Guide

This guide provides the complete environment setup for the **ui-ux-implementation-specialist** custom agent.

## Overview

The `copilot` environment provides the agent with:
- Non-sensitive configuration variables for build/test optimization
- Access to design tools and services (if needed)
- Testing and validation tool configurations
- Performance monitoring settings

## Environment Variables (Non-Sensitive)

These variables configure the agent's development environment for optimal UI/UX work.

### Required Variables

Add these in: **Repository Settings → Environments → copilot → Environment variables**

| Variable Name | Value | Purpose |
|---------------|-------|---------|
| `NODE_ENV` | `development` | Ensures dev mode for testing |
| `VITE_DEV_MODE` | `true` | Enable Vite dev optimizations |
| `FORCE_COLOR` | `1` | Enable colored output in CI logs |
| `CI` | `true` | Indicate CI environment |

### Testing & Validation Variables

| Variable Name | Value | Purpose |
|---------------|-------|---------|
| `PLAYWRIGHT_BROWSERS_PATH` | `~/.cache/ms-playwright` | Cache Playwright browsers |
| `VITEST_REPORTER` | `verbose` | Detailed test output |
| `ACCESSIBILITY_TEST_MODE` | `strict` | Enable strict a11y testing |
| `WCAG_LEVEL` | `AA` | Target WCAG compliance level |

### Build & Performance Variables

| Variable Name | Value | Purpose |
|---------------|-------|---------|
| `VITE_BUILD_ANALYZE` | `true` | Enable bundle analysis |
| `VITE_SOURCEMAP` | `true` | Generate sourcemaps for debugging |
| `TAILWIND_MODE` | `jit` | Use JIT compilation |
| `NODE_OPTIONS` | `--max-old-space-size=4096` | Increase Node.js memory limit |

### Design Tool Integration Variables

| Variable Name | Value | Purpose |
|---------------|-------|---------|
| `DESIGN_SYSTEM_VERSION` | `1.0.0` | Track design system version |
| `COLOR_CONTRAST_CHECK` | `enabled` | Auto-check WCAG contrast |
| `RESPONSIVE_BREAKPOINTS` | `375,768,1024,1920` | Test breakpoints |
| `TOUCH_TARGET_MIN` | `44` | Minimum touch target size (px) |

## Environment Secrets (Sensitive)

These secrets are for optional integrations. Only add if you use these services.

### Optional: Design Tool APIs

Add these in: **Repository Settings → Environments → copilot → Environment secrets**

| Secret Name | Example Value | Purpose | Required? |
|-------------|---------------|---------|-----------|
| `FIGMA_API_TOKEN` | `figd_***` | Figma design file access | Optional |
| `CHROMATIC_PROJECT_TOKEN` | `chpt_***` | Visual regression testing | Optional |
| `PERCY_TOKEN` | `***` | Percy visual testing | Optional |
| `LIGHTHOUSE_CI_TOKEN` | `***` | Lighthouse CI integration | Optional |

### Optional: Deployment Services

| Secret Name | Example Value | Purpose | Required? |
|-------------|---------------|---------|-----------|
| `VERCEL_TOKEN` | `***` | Deploy preview builds | Optional |
| `VERCEL_ORG_ID` | `team_***` | Vercel organization | Optional |
| `VERCEL_PROJECT_ID` | `prj_***` | Vercel project | Optional |

**Note:** FirefighterHub already uses Vercel. If you want Copilot to deploy preview builds, add these secrets.

### Optional: Monitoring & Analytics

| Secret Name | Example Value | Purpose | Required? |
|-------------|---------------|---------|-----------|
| `SENTRY_AUTH_TOKEN` | `***` | Error tracking integration | Optional |
| `DATADOG_API_KEY` | `***` | Performance monitoring | Optional |

## Firewall Configuration

### Recommended Allowlist (Keep Enabled)

The default allowlist allows access to:
- ✅ npm registry (registry.npmjs.org)
- ✅ pnpm registry (registry.npmjs.org)
- ✅ CDN services (unpkg.com, cdn.jsdelivr.net)
- ✅ GitHub packages
- ✅ Common OS package repos
- ✅ Certificate authorities

**Action:** Keep **"Recommended allowlist"** enabled in repository settings.

### Custom Allowlist (Optional Additions)

Add these domains if you use additional services:

**Repository Settings → Copilot → Coding Agent → Custom allowlist**

```
# Design Tools (if using)
api.figma.com
www.figma.com

# Visual Testing (if using)
api.chromatic.com
percy.io

# Performance Monitoring (if using)
api.sentry.io
api.datadoghq.com

# Font Services (if using custom fonts)
fonts.googleapis.com
fonts.gstatic.com

# Icon Libraries (if using external)
api.iconify.design

# Documentation Sites (for reference)
developer.mozilla.org
tailwindcss.com
reactjs.org
```

**To add:**
1. Go to Repository Settings → Copilot → Coding Agent
2. Click **Custom allowlist**
3. Add each domain
4. Click **Add Rule**
5. Click **Save changes**

### Firewall: Keep Enabled

**❌ Do NOT disable the firewall** unless absolutely necessary.

Keeping it enabled:
- ✅ Prevents accidental data exfiltration
- ✅ Limits attack surface
- ✅ Maintains security posture

Only disable if:
- Using private package registry that can't be allowlisted
- Using self-hosted runners with custom network setup

## Setup Instructions

### Step 1: Create Copilot Environment

1. Go to: `https://github.com/DrunkOnJava/firefighterHub/settings/environments`
2. Click **New environment**
3. Name it: `copilot` (exactly this name)
4. Click **Configure environment**

### Step 2: Add Environment Variables

For each variable in the "Required Variables" section:

1. Click **Add environment variable**
2. **Name:** `NODE_ENV`
3. **Value:** `development`
4. Click **Add variable**
5. Repeat for all required variables

**Quick script to document values:**
```bash
# Copy this checklist as you add each variable:
□ NODE_ENV = development
□ VITE_DEV_MODE = true
□ FORCE_COLOR = 1
□ CI = true
□ PLAYWRIGHT_BROWSERS_PATH = ~/.cache/ms-playwright
□ VITEST_REPORTER = verbose
□ ACCESSIBILITY_TEST_MODE = strict
□ WCAG_LEVEL = AA
□ VITE_BUILD_ANALYZE = true
□ VITE_SOURCEMAP = true
□ TAILWIND_MODE = jit
□ NODE_OPTIONS = --max-old-space-size=4096
□ DESIGN_SYSTEM_VERSION = 1.0.0
□ COLOR_CONTRAST_CHECK = enabled
□ RESPONSIVE_BREAKPOINTS = 375,768,1024,1920
□ TOUCH_TARGET_MIN = 44
```

### Step 3: Add Environment Secrets (Optional)

Only if you're using these services:

1. **Figma Integration** (for design file access):
   ```
   Secret Name: FIGMA_API_TOKEN
   Value: [Your Figma personal access token]
   ```
   Get token from: https://www.figma.com/developers/api#access-tokens

2. **Vercel Deployment** (for preview builds):
   ```
   Secret Name: VERCEL_TOKEN
   Value: [Your Vercel token]

   Secret Name: VERCEL_ORG_ID
   Value: [Your Vercel team ID]

   Secret Name: VERCEL_PROJECT_ID
   Value: [Your project ID]
   ```
   Get from: `pnpm vercel project ls`

3. **Visual Regression Testing** (optional):
   ```
   Secret Name: CHROMATIC_PROJECT_TOKEN
   Value: [Your Chromatic token]
   ```

### Step 4: Verify Setup

Run the setup workflow manually:

```bash
# Trigger the workflow
gh workflow run "Copilot Setup Steps" --ref main

# Watch the run
gh run watch

# Verify success
gh run list --workflow="Copilot Setup Steps" --limit 1
```

**Expected output:**
```
✅ Checkout code
✅ Set up Node.js
✅ Install pnpm
✅ Install dependencies
✅ Install Playwright browsers
✅ Verify TypeScript compilation
✅ Verify linting
✅ Run unit tests
✅ Verify production build
✅ Install accessibility tools
✅ Environment summary
```

### Step 5: Configure Firewall (Optional)

If you need to allow additional domains:

1. Go to: Repository Settings → Copilot → Coding Agent
2. Ensure **"Recommended allowlist"** is **ON**
3. Click **Custom allowlist**
4. Add each domain you need
5. Click **Save changes**

---

## Environment Variable Usage in Workflows

The environment variables are automatically available in the copilot-setup-steps workflow:

```yaml
# They're accessible like this:
- name: Example step using environment variable
  run: |
    echo "WCAG Level: ${{ vars.WCAG_LEVEL }}"
    echo "Min touch target: ${{ vars.TOUCH_TARGET_MIN }}px"
  env:
    # Secrets accessed with secrets context
    FIGMA_TOKEN: ${{ secrets.FIGMA_API_TOKEN }}
```

## Advanced Configuration

### Custom Accessibility Testing

If you want the agent to run automated accessibility tests:

**Add to copilot-setup-steps.yml:**
```yaml
- name: Run accessibility audit
  run: |
    pnpm dev &
    DEV_PID=$!
    sleep 5
    pnpm exec pa11y-ci --threshold 0 http://localhost:5173
    kill $DEV_PID
  env:
    WCAG_LEVEL: ${{ vars.WCAG_LEVEL }}
  continue-on-error: true  # Don't block if fails, just report
```

### Visual Regression Testing

If using Chromatic or Percy:

**Add to copilot-setup-steps.yml:**
```yaml
- name: Visual regression test
  run: pnpm exec chromatic --exit-zero-on-changes
  env:
    CHROMATIC_PROJECT_TOKEN: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
  if: ${{ secrets.CHROMATIC_PROJECT_TOKEN != '' }}
```

### Performance Budgets

Set performance thresholds:

**Add variables:**
```
LIGHTHOUSE_PERFORMANCE_MIN = 90
LIGHTHOUSE_ACCESSIBILITY_MIN = 100
LIGHTHOUSE_BEST_PRACTICES_MIN = 100
BUNDLE_SIZE_MAX_KB = 500
```

**Add to workflow:**
```yaml
- name: Check bundle size
  run: |
    BUNDLE_SIZE=$(du -k dist/assets/*.js | awk '{sum+=$1} END {print sum}')
    if [ "$BUNDLE_SIZE" -gt "${{ vars.BUNDLE_SIZE_MAX_KB }}" ]; then
      echo "⚠️  Bundle size ${BUNDLE_SIZE}KB exceeds maximum ${{ vars.BUNDLE_SIZE_MAX_KB }}KB"
      exit 1
    fi
    echo "✅ Bundle size ${BUNDLE_SIZE}KB within limit"
```

## Troubleshooting

### Environment Not Found

**Problem:** Copilot can't access environment variables

**Solution:**
1. Verify environment is named exactly `copilot` (lowercase)
2. Check variables are added to the `copilot` environment (not repository variables)
3. Ensure copilot-setup-steps.yml is on default branch (main)

### Variables Not Available

**Problem:** Variables don't appear in workflow

**Solution:**
1. Environment variables use `${{ vars.VARIABLE_NAME }}` syntax
2. Secrets use `${{ secrets.SECRET_NAME }}` syntax
3. Both must be in the `copilot` environment specifically

### Workflow Fails

**Problem:** Setup steps fail during execution

**Solution:**
1. Check GitHub Actions logs for specific error
2. Common issues:
   - pnpm not installed → Verify pnpm/action-setup@v4 step
   - Dependencies fail → Check pnpm-lock.yaml is committed
   - Tests fail → Verify tests pass locally first
3. Test workflow manually: `gh workflow run "Copilot Setup Steps"`

## Verification Checklist

After setup, verify:

- [ ] `copilot` environment exists
- [ ] All required variables added
- [ ] Optional secrets added (if using services)
- [ ] Firewall configured (recommended allowlist ON)
- [ ] Custom allowlist added (if needed)
- [ ] Setup workflow runs successfully
- [ ] Agent can access variables in workflow
- [ ] No sensitive data in variables (use secrets!)

## Security Best Practices

### ✅ DO:
- Use secrets for API tokens and passwords
- Keep recommended firewall allowlist enabled
- Use minimal permissions in workflows
- Rotate secrets regularly
- Review Copilot session logs periodically

### ❌ DON'T:
- Put sensitive data in environment variables
- Disable firewall unless absolutely necessary
- Grant excessive permissions
- Commit secrets to repository
- Allow unlimited network access

## Environment Summary

Once configured, your copilot environment will have:

**Variables (16):**
- Build configuration (4)
- Testing configuration (4)
- Design system config (4)
- Performance settings (4)

**Secrets (0-7):** (Optional, based on integrations)
- Design tools (Figma)
- Visual testing (Chromatic/Percy)
- Deployment (Vercel)
- Monitoring (Sentry/Datadog)

**Firewall:**
- ✅ Recommended allowlist: ENABLED
- ✅ Custom allowlist: Configured as needed
- ✅ Full firewall: ENABLED

**Estimated Setup Time:** 10-15 minutes

---

**Next Step:** Test the environment by assigning Issue #14 to the custom agent!
