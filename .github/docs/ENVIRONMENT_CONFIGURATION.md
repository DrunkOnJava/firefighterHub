# Complete Environment Configuration for UI/UX Implementation Agent

## Quick Setup (5 Minutes)

### Option 1: Automated Script
```bash
# Run the automated setup script
./.github/scripts/setup-copilot-environment.sh

# Verify success
gh workflow run "Copilot Setup Steps" --ref main
gh run watch
```

### Option 2: Manual Configuration

**Go to:** https://github.com/DrunkOnJava/firefighterHub/settings/environments

1. Click **New environment** (if doesn't exist)
2. Name: `copilot`
3. Click **Configure environment**

---

## Environment Variables (16 Required)

Copy this table for quick reference:

| Variable | Value | Category | Priority |
|----------|-------|----------|----------|
| `NODE_ENV` | `development` | Build | Required |
| `VITE_DEV_MODE` | `true` | Build | Required |
| `FORCE_COLOR` | `1` | Logging | Required |
| `CI` | `true` | Build | Required |
| `PLAYWRIGHT_BROWSERS_PATH` | `~/.cache/ms-playwright` | Testing | Required |
| `VITEST_REPORTER` | `verbose` | Testing | Required |
| `ACCESSIBILITY_TEST_MODE` | `strict` | Testing | Required |
| `WCAG_LEVEL` | `AA` | Testing | Required |
| `VITE_BUILD_ANALYZE` | `true` | Performance | Recommended |
| `VITE_SOURCEMAP` | `true` | Debug | Recommended |
| `TAILWIND_MODE` | `jit` | Build | Recommended |
| `NODE_OPTIONS` | `--max-old-space-size=4096` | Performance | Recommended |
| `DESIGN_SYSTEM_VERSION` | `1.0.0` | Design | Recommended |
| `COLOR_CONTRAST_CHECK` | `enabled` | A11y | Recommended |
| `RESPONSIVE_BREAKPOINTS` | `375,768,1024,1920` | Testing | Recommended |
| `TOUCH_TARGET_MIN` | `44` | A11y | Recommended |

### How to Add Variables

**For each variable:**

1. Go to: Settings → Environments → copilot
2. Scroll to **Environment variables**
3. Click **Add environment variable**
4. Enter **Name** (e.g., `NODE_ENV`)
5. Enter **Value** (e.g., `development`)
6. Click **Add variable**
7. Repeat for all 16 variables

---

## Environment Secrets (Optional)

Only add if you're using these integrations.

### Design Tool Access

**FIGMA_API_TOKEN** (Optional)
- **Purpose:** Allow agent to fetch design specifications from Figma
- **How to get:**
  1. Go to https://www.figma.com/developers/api#access-tokens
  2. Generate personal access token
  3. Copy token
- **How to add:**
  1. Settings → Environments → copilot
  2. Click **Add environment secret**
  3. Name: `FIGMA_API_TOKEN`
  4. Value: [paste token]
  5. Click **Add secret**

### Visual Regression Testing

**CHROMATIC_PROJECT_TOKEN** (Optional)
- **Purpose:** Automated visual regression testing
- **Service:** https://www.chromatic.com
- **Setup:**
  ```bash
  # Install Chromatic
  pnpm add -D chromatic

  # Initialize
  pnpm exec chromatic --project-token=[token]

  # Add token as secret
  ```

**PERCY_TOKEN** (Optional)
- **Purpose:** Alternative visual testing service
- **Service:** https://percy.io
- **Setup:** Similar to Chromatic

### Deployment Automation

**VERCEL_TOKEN** (Optional)
- **Purpose:** Deploy preview builds for visual testing
- **How to get:**
  ```bash
  pnpm exec vercel login
  pnpm exec vercel whoami --token
  ```
- **Additional secrets needed:**
  - `VERCEL_ORG_ID` - Your team ID
  - `VERCEL_PROJECT_ID` - Project ID from Vercel dashboard

### Monitoring & Error Tracking

**SENTRY_AUTH_TOKEN** (Optional)
- **Purpose:** Track errors and performance in deployed previews
- **Service:** https://sentry.io

**DATADOG_API_KEY** (Optional)
- **Purpose:** Performance monitoring and real user monitoring
- **Service:** https://www.datadoghq.com

---

## Firewall Configuration

### Step 1: Keep Recommended Allowlist Enabled

**Location:** Repository Settings → Copilot → Coding Agent → Firewall

**Setting:** **Recommended allowlist** = **ON** ✅

**This allows:**
- npm/pnpm registries (registry.npmjs.org)
- CDNs (unpkg.com, cdn.jsdelivr.net)
- GitHub packages
- OS package repositories
- Certificate authorities
- Playwright browser downloads

### Step 2: Add Custom Allowlist (Optional)

Only add if you need access to additional services.

**Location:** Repository Settings → Copilot → Coding Agent → Custom allowlist

**Recommended additions for UI/UX work:**

```
# Design Tools
api.figma.com
www.figma.com

# Visual Testing
api.chromatic.com
percy.io
app.percy.io

# Font Services
fonts.googleapis.com
fonts.gstatic.com

# Icon Libraries
api.iconify.design
cdn.simpleicons.org

# Documentation Sites
developer.mozilla.org
tailwindcss.com
reactjs.org
webaim.org

# Image Optimization
images.unsplash.com
```

**How to add:**
1. Click **Add Rule**
2. Enter domain (e.g., `api.figma.com`)
3. Click **Add Rule**
4. Repeat for each domain
5. Click **Save changes**

### Step 3: Verify Firewall Status

**Expected configuration:**
- ✅ Enable firewall: **ON**
- ✅ Recommended allowlist: **ON**
- ✅ Custom allowlist: [Your additions]

**Do NOT disable firewall** unless you have specific security controls in place.

---

## Environment Usage in Workflows

Variables and secrets are accessed in `copilot-setup-steps.yml`:

### Accessing Variables
```yaml
steps:
  - name: Example with variable
    run: echo "WCAG Level: ${{ vars.WCAG_LEVEL }}"
    env:
      WCAG_TARGET: ${{ vars.WCAG_LEVEL }}
```

### Accessing Secrets
```yaml
steps:
  - name: Example with secret
    run: echo "Token configured"
    env:
      FIGMA_TOKEN: ${{ secrets.FIGMA_API_TOKEN }}
    if: ${{ secrets.FIGMA_API_TOKEN != '' }}
```

### Conditional Steps Based on Environment
```yaml
  - name: Visual regression test (only if token exists)
    run: pnpm exec chromatic
    env:
      CHROMATIC_PROJECT_TOKEN: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
    if: ${{ secrets.CHROMATIC_PROJECT_TOKEN != '' }}
```

---

## Advanced Configuration Examples

### Example 1: Accessibility Testing with Environment Variables

**Add to copilot-setup-steps.yml:**
```yaml
  - name: Automated accessibility audit
    run: |
      # Start dev server
      pnpm dev &
      DEV_PID=$!

      # Wait for server
      sleep 5

      # Run pa11y with WCAG level from environment
      pnpm exec pa11y-ci \
        --standard "WCAG2${{ vars.WCAG_LEVEL }}" \
        --threshold 0 \
        http://localhost:5173

      # Cleanup
      kill $DEV_PID
    env:
      WCAG_LEVEL: ${{ vars.WCAG_LEVEL }}
    continue-on-error: true
```

### Example 2: Bundle Size Monitoring

**Add variables:**
```
BUNDLE_SIZE_MAX_KB = 500
BUNDLE_SIZE_WARN_KB = 450
```

**Add to workflow:**
```yaml
  - name: Check bundle size limits
    run: |
      BUNDLE_SIZE=$(du -k dist/assets/*.js | awk '{sum+=$1} END {print sum}')
      MAX_SIZE=${{ vars.BUNDLE_SIZE_MAX_KB }}
      WARN_SIZE=${{ vars.BUNDLE_SIZE_WARN_KB }}

      echo "📦 Bundle size: ${BUNDLE_SIZE}KB"

      if [ "$BUNDLE_SIZE" -gt "$MAX_SIZE" ]; then
        echo "❌ FAILED: Exceeds maximum ${MAX_SIZE}KB"
        exit 1
      elif [ "$BUNDLE_SIZE" -gt "$WARN_SIZE" ]; then
        echo "⚠️  WARNING: Approaching limit (${WARN_SIZE}KB)"
      else
        echo "✅ PASSED: Within limit"
      fi
```

### Example 3: Responsive Breakpoint Testing

**Using RESPONSIVE_BREAKPOINTS variable:**
```yaml
  - name: Test responsive breakpoints
    run: |
      BREAKPOINTS="${{ vars.RESPONSIVE_BREAKPOINTS }}"
      IFS=',' read -ra SIZES <<< "$BREAKPOINTS"

      for size in "${SIZES[@]}"; do
        echo "Testing ${size}px breakpoint..."
        pnpm exec playwright test \
          --project=chromium \
          --grep "@responsive" \
          --config="viewport.width=${size}"
      done
```

### Example 4: WCAG Contrast Checking

**Using COLOR_CONTRAST_CHECK variable:**
```yaml
  - name: Automated contrast checking
    run: |
      if [ "${{ vars.COLOR_CONTRAST_CHECK }}" = "enabled" ]; then
        echo "🎨 Checking color contrast ratios..."

        # Install contrast checker
        pnpm add -D color-contrast-checker

        # Run custom script
        pnpm dlx tsx scripts/check-contrast-ratios.ts

        echo "✅ All contrast ratios WCAG compliant"
      fi
```

### Example 5: Touch Target Validation

**Using TOUCH_TARGET_MIN variable:**
```yaml
  - name: Validate touch target sizes
    run: |
      MIN_SIZE=${{ vars.TOUCH_TARGET_MIN }}

      echo "👆 Checking touch targets ≥${MIN_SIZE}px..."

      # Run E2E test that validates touch target sizes
      pnpm exec playwright test \
        --grep "@touch-targets" \
        --project=mobile

      echo "✅ All touch targets meet ${MIN_SIZE}px minimum"
```

---

## Integration with Custom Agent

### How the Agent Uses Environment

The **ui-ux-implementation-specialist** agent benefits from this environment:

**During Setup (copilot-setup-steps.yml):**
1. Variables configure build optimizations
2. Dependencies are cached for faster startup
3. Testing tools are pre-installed
4. Accessibility tools are ready

**During Implementation:**
1. Agent runs `pnpm typecheck` (uses NODE_ENV)
2. Agent runs `pnpm test:run` (uses VITEST_REPORTER)
3. Agent verifies WCAG (uses WCAG_LEVEL)
4. Agent checks responsive design (uses RESPONSIVE_BREAKPOINTS)

**Example agent workflow:**
```
1. Agent reads Issue #14
2. Agent implements color change
3. Agent runs: pnpm typecheck (uses environment)
4. Agent verifies contrast ≥ WCAG_LEVEL standard
5. Agent checks touch targets ≥ TOUCH_TARGET_MIN
6. Agent commits with proper message
7. Agent reports results
```

---

## Security Configuration

### Environment Protection Rules (Optional)

**Add deployment protection:**

1. Settings → Environments → copilot
2. Scroll to **Deployment protection rules**
3. Configure:
   - [ ] Required reviewers (for sensitive repos)
   - [ ] Wait timer (e.g., 5 minutes before allowing deployment)
   - [ ] Deployment branches (limit to main/develop)

**Recommended for production:**
```yaml
Deployment branches:
  - main
  - develop
  - feature/*

Wait timer: 0 minutes
Required reviewers: None (Copilot is read-only)
```

### Secret Rotation Policy

**For production environments:**

| Secret | Rotation Schedule | Action |
|--------|------------------|--------|
| FIGMA_API_TOKEN | Every 90 days | Regenerate in Figma, update secret |
| VERCEL_TOKEN | Every 90 days | Regenerate in Vercel, update secret |
| CHROMATIC_TOKEN | Every 180 days | Regenerate in Chromatic |
| SENTRY_AUTH_TOKEN | Every 180 days | Regenerate in Sentry |

---

## Monitoring & Validation

### Environment Health Check

Run this periodically to verify environment is working:

```bash
#!/bin/bash
# environment-health-check.sh

echo "🔍 Checking copilot environment health..."

# 1. Check environment exists
gh api "/repos/DrunkOnJava/firefighterHub/environments/copilot" \
  && echo "✅ Environment exists" \
  || echo "❌ Environment not found"

# 2. Count variables
VARS=$(gh api "/repos/DrunkOnJava/firefighterHub/environments/copilot/variables" \
  --jq '.total_count')
echo "📊 Variables configured: $VARS (expected: 16)"

# 3. Test workflow
echo "🧪 Testing setup workflow..."
gh workflow run "Copilot Setup Steps" --ref main

# 4. Wait and check result
sleep 30
LATEST_RUN=$(gh run list --workflow="Copilot Setup Steps" --limit 1 --json conclusion --jq '.[0].conclusion')

if [ "$LATEST_RUN" = "success" ]; then
  echo "✅ Setup workflow passed"
else
  echo "⚠️  Setup workflow status: $LATEST_RUN"
fi
```

### Agent Performance Metrics

Track how well the environment supports the agent:

| Metric | Target | How to Measure |
|--------|--------|---------------|
| Setup time | < 3 min | Check workflow duration |
| Dependency install | < 2 min | Check "Install dependencies" step |
| Test execution | < 1 min | Check "Run unit tests" step |
| Build time | < 2 min | Check "Verify build" step |
| Total startup | < 5 min | Check full workflow duration |

---

## Cost Optimization

### Caching Strategy

The setup workflow uses aggressive caching:

**pnpm cache:**
```yaml
- uses: actions/cache@v4
  with:
    path: ~/.local/share/pnpm/store
    key: ${{ runner.os }}-pnpm-${{ hashFiles('**/pnpm-lock.yaml') }}
```

**Playwright cache:**
```yaml
- uses: actions/cache@v4
  with:
    path: ~/.cache/ms-playwright
    key: ${{ runner.os }}-playwright-${{ hashFiles('**/pnpm-lock.yaml') }}
```

**Result:**
- First run: ~5 minutes
- Cached runs: ~2 minutes
- **Savings: 60% faster** with caching

### Runner Size

**Default runner:** `ubuntu-latest` (2 cores, 7 GB RAM, 14 GB SSD)

**Sufficient for:**
- ✅ TypeScript compilation
- ✅ Unit tests
- ✅ Build verification
- ✅ Accessibility testing

**Upgrade to larger runner if:**
- ❌ E2E tests timeout
- ❌ Build takes > 5 minutes
- ❌ Memory errors during tests

**To upgrade:**
```yaml
# In copilot-setup-steps.yml
jobs:
  copilot-setup-steps:
    runs-on: ubuntu-4-core  # 4 cores, 16 GB RAM, 14 GB SSD
```

---

## Integration Examples

### Figma Design Sync

If you add `FIGMA_API_TOKEN`:

**Add to workflow:**
```yaml
  - name: Fetch latest design tokens from Figma
    run: |
      if [ ! -z "${{ secrets.FIGMA_API_TOKEN }}" ]; then
        echo "🎨 Syncing design tokens from Figma..."

        # Install Figma API client
        pnpm add -D figma-js

        # Run sync script
        pnpm dlx tsx scripts/sync-figma-tokens.ts

        echo "✅ Design tokens synced"
      fi
    env:
      FIGMA_TOKEN: ${{ secrets.FIGMA_API_TOKEN }}
    continue-on-error: true
```

### Chromatic Visual Testing

If you add `CHROMATIC_PROJECT_TOKEN`:

**Add to workflow:**
```yaml
  - name: Visual regression baseline
    run: |
      if [ ! -z "${{ secrets.CHROMATIC_PROJECT_TOKEN }}" ]; then
        echo "📸 Creating visual regression baseline..."

        pnpm exec chromatic \
          --project-token="${{ secrets.CHROMATIC_PROJECT_TOKEN }}" \
          --exit-zero-on-changes \
          --auto-accept-changes

        echo "✅ Visual baseline captured"
      fi
    continue-on-error: true
```

### Vercel Preview Deployments

If you add Vercel tokens:

**Add to workflow:**
```yaml
  - name: Deploy preview to Vercel
    run: |
      if [ ! -z "${{ secrets.VERCEL_TOKEN }}" ]; then
        echo "🚀 Deploying preview..."

        pnpm exec vercel deploy \
          --token="${{ secrets.VERCEL_TOKEN }}" \
          --yes

        echo "✅ Preview deployed"
      fi
    env:
      VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
      VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
    continue-on-error: true
```

---

## Environment Maintenance

### Monthly Checklist

- [ ] Review environment variables (any obsolete?)
- [ ] Check secret expiration dates
- [ ] Verify workflow still passes
- [ ] Update dependency cache if needed
- [ ] Review firewall allowlist (any new domains?)
- [ ] Check GitHub Actions usage/billing

### Quarterly Checklist

- [ ] Rotate all secrets
- [ ] Update Node.js version if needed
- [ ] Update GitHub Actions actions (checkout@v4 → v5, etc.)
- [ ] Review and optimize caching strategy
- [ ] Audit environment security

---

## Troubleshooting

### Problem: Variables Not Available in Workflow

**Symptoms:**
- Workflow fails with "variable not found"
- Empty values in workflow logs

**Solution:**
1. Verify variable name exactly matches (case-sensitive)
2. Check variable is in `copilot` environment (not repository variables)
3. Confirm workflow references correct environment
4. Try accessing with: `${{ vars.VARIABLE_NAME }}`

### Problem: Setup Workflow Fails

**Symptoms:**
- Workflow shows red X
- Agent can't start work

**Solution:**
1. Check GitHub Actions logs for specific error
2. Common issues:
   - pnpm not found → Verify pnpm/action-setup@v4 step exists
   - Dependencies fail → Ensure pnpm-lock.yaml committed
   - Tests fail → Fix tests locally first
3. Test manually: `gh workflow run "Copilot Setup Steps"`

### Problem: Agent Timeout

**Symptoms:**
- Agent takes > 1 hour
- Workflow times out

**Solution:**
1. Check if dependencies are cached properly
2. Consider upgrading to larger runner
3. Reduce test scope in setup steps
4. Increase timeout-minutes (max 59)

### Problem: Firewall Blocking Required Domain

**Symptoms:**
- Warning in PR about blocked domain
- Dependencies can't download

**Solution:**
1. Check warning message for blocked domain
2. Add domain to custom allowlist
3. Verify domain is safe and necessary
4. Save changes and retry

---

## Migration from Old Configuration

If you previously used Actions variables (deprecated):

### Old Method (Deprecated)
```yaml
# Repository Variables (deprecated for Copilot)
COPILOT_* variables in repository settings
```

### New Method (Current)
```yaml
# Environment Variables in 'copilot' environment
All variables in dedicated copilot environment
```

**Migration steps:**
1. List old COPILOT_* repository variables
2. Create copilot environment
3. Add each variable (without COPILOT_ prefix)
4. Delete old repository variables
5. Test workflow

---

## Verification Script

Run this to verify complete setup:

```bash
#!/bin/bash
# verify-copilot-environment.sh

echo "🔍 Verifying Copilot Environment Configuration..."
echo ""

# Check environment exists
echo "1️⃣  Checking environment exists..."
if gh api "/repos/DrunkOnJava/firefighterHub/environments/copilot" &> /dev/null; then
  echo "   ✅ Environment 'copilot' exists"
else
  echo "   ❌ Environment 'copilot' not found"
  exit 1
fi

# Count variables
echo "2️⃣  Checking variables..."
VAR_COUNT=$(gh api "/repos/DrunkOnJava/firefighterHub/environments/copilot/variables" --jq '.total_count')
echo "   📊 Variables configured: $VAR_COUNT"
if [ "$VAR_COUNT" -ge 16 ]; then
  echo "   ✅ All required variables present"
else
  echo "   ⚠️  Only $VAR_COUNT/16 variables configured"
fi

# Check secrets (can't read values, just count)
echo "3️⃣  Checking secrets..."
SECRET_COUNT=$(gh api "/repos/DrunkOnJava/firefighterHub/environments/copilot/secrets" --jq '.total_count')
echo "   📊 Secrets configured: $SECRET_COUNT"
echo "   ℹ️  Secrets are optional based on integrations"

# Test workflow
echo "4️⃣  Testing setup workflow..."
echo "   ▶️  Triggering workflow..."
gh workflow run "Copilot Setup Steps" --ref main

sleep 10

LATEST_RUN=$(gh run list --workflow="Copilot Setup Steps" --limit 1 --json status,conclusion --jq '.[0]')
STATUS=$(echo "$LATEST_RUN" | jq -r '.status')
CONCLUSION=$(echo "$LATEST_RUN" | jq -r '.conclusion')

echo "   Status: $STATUS"
if [ "$CONCLUSION" = "success" ]; then
  echo "   ✅ Workflow passed"
elif [ "$STATUS" = "in_progress" ]; then
  echo "   ⏳ Workflow running... (check: gh run watch)"
else
  echo "   ❌ Workflow failed: $CONCLUSION"
fi

echo ""
echo "✅ Verification complete!"
echo ""
echo "Next steps:"
echo "1. Review workflow logs: gh run view"
echo "2. Assign Issue #14 to @copilot with ui-ux-implementation-specialist agent"
echo "3. Watch the agent work!"
```

---

## Summary

### Configuration Checklist

- [ ] `copilot` environment created
- [ ] 16 environment variables added
- [ ] Optional secrets added (if using integrations)
- [ ] Recommended firewall allowlist enabled
- [ ] Custom firewall domains added (if needed)
- [ ] copilot-setup-steps.yml on main branch
- [ ] Setup workflow passes
- [ ] Custom agent file committed
- [ ] Documentation reviewed

### Expected Startup Performance

**With proper configuration:**
- ⏱️ Environment setup: ~2 minutes (cached)
- ⏱️ First task: ~3-5 minutes (includes analysis)
- ⏱️ Subsequent tasks: ~1-2 minutes each
- ⏱️ Full Phase 1 (4 issues): ~8-10 hours total

**Without configuration:**
- ⏱️ Environment setup: ~5-10 minutes (trial and error)
- ⏱️ First task: ~10-15 minutes (dependency discovery)
- ⏱️ High risk of failures and retries

**Savings:** ~60% faster with proper environment setup!

---

## Support Resources

- **GitHub Copilot Docs:** https://docs.github.com/en/copilot
- **Environment Configuration:** https://docs.github.com/en/actions/deployment/targeting-different-environments
- **Setup Steps Guide:** https://docs.github.com/en/copilot/customizing-copilot/customizing-the-development-environment-for-copilot-coding-agent
- **Firewall Configuration:** https://docs.github.com/en/copilot/customizing-copilot/customizing-or-disabling-the-firewall-for-copilot-coding-agent

---

**Last Updated:** November 4, 2025
**Environment Version:** 1.0.0
**For Agent:** ui-ux-implementation-specialist v1.0.0
