# Copilot Firewall Allowlist Recommendations

## Purpose

When GitHub Copilot runs tests and workflows, it operates behind a firewall that blocks external network connections by default. This document lists all external services that should be added to the custom allowlist.

## How to Add to Allowlist

1. Go to: `Settings → Copilot → Coding agent`
2. Or visit: https://github.com/DrunkOnJava/firefighterHub/settings/copilot/coding_agent
3. Add each domain to the "Custom allowlist" section

## Required Services

### 1. Supabase (Database & Auth) ✅ CRITICAL

**Domains to add:**
```
tjljndzodowpohusrwhs.supabase.co
test.supabase.co
*.supabase.co
```

**Why needed:**
- `tjljndzodowpohusrwhs.supabase.co` - Production database API endpoint
- `test.supabase.co` - Test database connections (currently blocked, causing warnings)
- `*.supabase.co` - Catch-all for Supabase services

**Used by:**
- Unit tests (Vitest)
- Integration tests
- Database migrations
- Real-time subscriptions
- Authentication

**Current issue:** Tests try to connect to `test.supabase.co` and get DNS blocked

---

### 2. Supabase Pooler (PostgreSQL Connection)

**Domains to add:**
```
aws-0-us-east-1.pooler.supabase.com
*.pooler.supabase.com
```

**Why needed:**
- Direct PostgreSQL database connections
- Connection pooling for concurrent queries

**Used by:**
- Database scripts (`scripts/*.ts`)
- Migration tools
- Data seeding

---

### 3. Supabase Storage (S3-Compatible)

**Domains to add:**
```
tjljndzodowpohusrwhs.storage.supabase.co
*.storage.supabase.co
```

**Why needed:**
- File uploads/downloads
- Image storage
- Avatar uploads

**Used by:**
- Storage tests
- File upload features

---

### 4. NPM Registry (Optional but Recommended)

**Domains to add:**
```
registry.npmjs.org
registry.yarnpkg.com
```

**Why needed:**
- Package installations during setup
- Dependency resolution

**Used by:**
- `pnpm install` in workflows
- MCP server installations

**Note:** Usually pre-cached, but may be needed for dynamic installs

---

### 5. External Documentation Sites (Optional)

**Domains to add:**
```
cloudconvert.com
pwabuilder.com
icalendar.org
```

**Why needed:**
- Referenced in documentation
- Validator tools
- May be accessed by tests that verify external integrations

**Used by:**
- PWA setup guides
- Calendar validation

---

### 6. GitHub (Should already be allowed)

**Domains to add:**
```
github.com
api.github.com
raw.githubusercontent.com
```

**Why needed:**
- Repository access
- GitHub API calls
- Fetching remote resources

**Note:** Usually already allowed by default, but verify if issues occur

---

## Priority Recommendations

### Tier 1: Critical (Add Immediately)
1. `tjljndzodowpohusrwhs.supabase.co` ⭐
2. `test.supabase.co` ⭐
3. `*.supabase.co` ⭐

### Tier 2: High Priority
4. `aws-0-us-east-1.pooler.supabase.com`
5. `*.pooler.supabase.com`
6. `*.storage.supabase.co`

### Tier 3: Recommended
7. `registry.npmjs.org`

### Tier 4: Optional
8. `cloudconvert.com`
9. `pwabuilder.com`
10. `icalendar.org`

---

## Minimal Allowlist (Start Here)

If you want the absolute minimum to fix current issues:

```
*.supabase.co
test.supabase.co
aws-0-us-east-1.pooler.supabase.com
```

This covers:
- ✅ Production database
- ✅ Test database
- ✅ PostgreSQL pooler
- ✅ Storage endpoints
- ✅ Real-time subscriptions

---

## Verification After Adding

1. **Re-run a Copilot PR workflow**
2. **Check for firewall warnings** in workflow logs
3. **Look for "dns block" errors**
4. **Verify tests can connect** to Supabase

### Expected Result After Fix

```bash
# Before (current):
⚠️ Firewall rules blocked me from connecting to: test.supabase.co

# After (with allowlist):
✅ All tests pass
✅ No firewall warnings
```

---

## Alternative: Configure in Setup Steps

Instead of using the allowlist, you can configure environment variables in the Copilot setup workflow to use mocked services:

**Update `.github/workflows/copilot-setup-steps.yml`:**

```yaml
- name: Configure test environment
  run: |
    echo "VITE_SUPABASE_URL=http://localhost:54321" >> $GITHUB_ENV
    echo "VITE_SUPABASE_ANON_KEY=mock-anon-key" >> $GITHUB_ENV
```

**Pros:**
- No external dependencies
- Faster tests
- No network issues

**Cons:**
- Not testing against real Supabase
- Requires setting up local Supabase instance
- More complex setup

---

## Security Considerations

**Safe to add:**
- ✅ Supabase domains (your own project)
- ✅ NPM registry (read-only)
- ✅ Documentation sites (read-only)

**Never add:**
- ❌ Unknown third-party APIs
- ❌ Untrusted domains
- ❌ Services that accept write operations without auth

All recommended domains are either:
1. Your own Supabase project (authenticated)
2. Read-only public services
3. Well-known package registries

---

## Monitoring

After adding to allowlist, monitor for:

1. **Workflow success rates** - Should improve
2. **Test pass rates** - Should reach 100% (after fixing act() warnings)
3. **Firewall warnings** - Should disappear
4. **Connection timeouts** - Should not occur

---

**Last Updated:** November 5, 2025
**Status:** `test.supabase.co` currently blocked, causing test warnings
**Action Required:** Add Tier 1 domains to allowlist immediately
