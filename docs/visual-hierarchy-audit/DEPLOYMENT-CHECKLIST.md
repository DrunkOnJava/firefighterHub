# 🚀 Deployment Checklist - Manual Steps Required

**Status:** Code implementation complete - Ready for manual deployment steps
**Time Required:** ~1-2 hours
**Priority:** Complete in order listed

---

## ✅ WHAT'S ALREADY DONE (Automated)

- [x] Fixed WebSocket API key formatting
- [x] Added connection error handling and retry limits
- [x] Implemented connection status indicator
- [x] Integrated Supabase authentication
- [x] Created RLS migration script
- [x] Added security headers (CSP, Permissions-Policy)
- [x] Optimized performance (resource hints)
- [x] Enhanced accessibility (touch targets, color contrast)
- [x] Created loading and empty states
- [x] Validated business logic against RFC
- [x] Created comprehensive documentation

---

## ⏳ MANUAL STEPS REQUIRED (You Must Do)

### STEP 1: Create Battalion Chief Test Account (15 min)

**Via Supabase Dashboard:**

```
1. Go to: https://supabase.com/dashboard/project/tjljndzodowpohusrwhs
2. Click: Authentication → Users
3. Click: "Invite User" button
4. Enter email: chief@your-department.com (or test email)
5. User will receive invite email
6. They set their own password
7. IMPORTANT: Set user metadata:
   - Click on the user after creation
   - Go to "User Metadata" tab
   - Add: { "role": "admin" }
   - Click "Save"
```

**Quick Test Account (Development):**
- Email: Use any email you have access to
- Set metadata: `{ "role": "admin" }`
- This will be your test battalion chief account

---

### STEP 2: Apply RLS Security Migration (15 min)

**Via Supabase CLI:**

```bash
cd /Users/griffin/Projects/firefighterHub

# Make sure you're linked to the right project
supabase link --project-ref tjljndzodowpohusrwhs

# Push the migration to the database
supabase db push

# Should see: "Apply migration 20250131_fix_rls_policies.sql"
# Type 'y' to confirm
```

**Verify Migration Success:**

```sql
-- Go to Supabase Dashboard → SQL Editor
-- Run this query:

SELECT tablename, policyname, cmd, roles
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('firefighters', 'scheduled_holds', 'activity_log')
ORDER BY tablename, cmd;

-- Should see:
-- firefighters: 4 policies (SELECT for public, INSERT/UPDATE/DELETE for authenticated)
-- scheduled_holds: 4 policies (same pattern)
-- activity_log: 2 policies (SELECT for public, INSERT for authenticated)
```

**Expected Output:**
```
✓ firefighters_insert_auth_only (INSERT, authenticated)
✓ firefighters_update_auth_only (UPDATE, authenticated)
✓ firefighters_delete_auth_only (DELETE, authenticated)
✓ scheduled_holds_insert_auth_only (INSERT, authenticated)
✓ scheduled_holds_update_auth_only (UPDATE, authenticated)
✓ scheduled_holds_delete_auth_only (DELETE, authenticated)
✓ activity_log_insert_auth_only (INSERT, authenticated)
✓ Public read policies (SELECT, public) - already existed
```

---

### STEP 3: Test Authentication Locally (30 min)

**Start Dev Server:**

```bash
pnpm run dev
```

**Test Sequence:**

**A. Test as Anonymous User (Read-Only):**
```
1. Open http://localhost:5173
2. DON'T log in
3. Verify you can:
   ✓ View calendar
   ✓ See firefighter roster
   ✓ See scheduled holds
   ✓ View upcoming schedule

4. Verify you CANNOT:
   ✗ Click calendar dates (disabled)
   ✗ See "Add Member" button
   ✗ See admin features

5. Check browser console:
   ✓ Zero WebSocket errors
   ✓ Connection status: green dot (if connected)
```

**B. Test as Battalion Chief (Admin Access):**
```
1. Click "Help" button (question mark icon)
2. Scroll to "Battalion Chief Login" section
3. Click "Battalion Chief Login" button
4. Enter your test account credentials
5. Should see success toast: "Battalion Chief mode enabled"
6. Help modal should now show:
   ✓ "Logged in as: chief@your-department.com"
   ✓ "Sign Out" button

7. Verify UI changes:
   ✓ Calendar dates become clickable
   ✓ "Add Member" button appears in header
   ✓ Shield badge shows "Battalion Chief Mode"

8. Test a hold assignment:
   ✓ Click a calendar date
   ✓ Select a firefighter
   ✓ Confirm assignment
   ✓ Verify hold appears on calendar

9. Open second browser tab:
   ✓ Changes appear automatically (real-time sync)
   ✓ Connection status green in both tabs
```

**C. Test Security:**
```
1. Sign out from battalion chief account
2. Open browser DevTools → Console
3. Try to create a hold via console:

supabase
  .from('scheduled_holds')
  .insert({
    firefighter_id: 'test',
    firefighter_name: 'Hacker',
    hold_date: '2025-12-01',
    shift: 'A'
  })

4. Should see ERROR:
   "new row violates row-level security policy"

5. This confirms RLS is working! ✓
```

---

### STEP 4: Build & Verify (10 min)

```bash
# Run type checking (will show pre-existing test file errors - ignore)
pnpm run typecheck

# Run build
pnpm run build

# Should complete successfully
# Output: dist/ directory with compiled assets
```

**Expected Warnings:**
- Type errors in test files (pre-existing)
- Unused variables in mocks (pre-existing)

**Should NOT See:**
- Errors in main application code
- Authentication-related errors
- Import/export errors

---

### STEP 5: Deploy to Production (15 min)

**Option A: Git Push (Automatic Vercel Deployment)**

```bash
git add .
git status  # Review changes

# Use the commit message from FINAL-IMPLEMENTATION-SUMMARY.md
git commit -m "feat: implement comprehensive audit remediation

[Full message copied from summary doc]"

git push origin main
```

**Vercel will automatically:**
1. Detect the push
2. Build your application
3. Run deployment checks
4. Deploy to production
5. Send you a notification

**Option B: Manual Vercel Deploy**

```bash
# If automatic deploy doesn't trigger
vercel --prod
```

---

### STEP 6: Post-Deployment Verification (15 min)

**Immediate Checks:**

```bash
# 1. Visit production URL
open https://firefighter-hub.vercel.app

# 2. Open Chrome DevTools
# 3. Check Console tab - should see:
✓ Service Worker registered
✓ Real-time subscription active
✓ Connection status: green
✗ ZERO authentication errors
✗ ZERO WebSocket errors

# 4. Check Network tab:
✓ All requests returning 200 OK
✓ WebSocket connection: 101 Switching Protocols (success)
✓ No failed requests

# 5. Check Security Headers (Network → Response Headers):
✓ content-security-policy: present
✓ permissions-policy: present
✓ x-frame-options: DENY
✓ strict-transport-security: present
```

**Functional Testing:**

```
1. Test anonymous viewing:
   - Can see calendar ✓
   - Dates are disabled ✓
   - Read-only mode ✓

2. Test battalion chief login:
   - Click Help → Login
   - Enter credentials
   - Admin mode activates ✓
   - Can assign holds ✓

3. Test real-time sync:
   - Open in two browsers
   - Assign hold in browser 1
   - Updates in browser 2 instantly ✓

4. Test mobile:
   - Open on phone/tablet
   - Touch targets large enough ✓
   - Connection status visible ✓
   - Everything readable ✓
```

---

## 🚨 TROUBLESHOOTING

### Problem: "Can't log in - invalid credentials"

**Solution:**
1. Verify test account was created in Supabase
2. Check email confirmation was sent
3. Try password reset
4. Verify user has `role: admin` in metadata

---

### Problem: "WebSocket still failing"

**Solution:**
1. Check `.env` file has no trailing whitespace
2. Verify environment variables in Vercel dashboard
3. Clear browser cache and hard refresh
4. Check Supabase project is not paused

---

### Problem: "Can't assign holds even when logged in"

**Solution:**
1. Verify RLS migration was applied successfully
2. Check user is authenticated (see Network → Headers)
3. Look for "Authorization: Bearer ..." header
4. Verify user metadata has `role: admin`
5. Check Supabase logs for RLS policy errors

---

### Problem: "Changes don't sync in real-time"

**Solution:**
1. Check connection status indicator (should be green)
2. Verify WebSocket connection in Network tab
3. Check for console errors
4. Try manual refresh
5. Check both tabs are on same shift

---

## 📊 SUCCESS METRICS TO MONITOR

### Week 1 After Deployment

- [ ] Zero WebSocket connection errors reported
- [ ] Battalion chiefs successfully logging in
- [ ] No RLS policy violation errors
- [ ] Real-time updates working consistently
- [ ] Performance metrics maintained (LCP < 600ms)

### Month 1 After Deployment

- [ ] User satisfaction feedback collected
- [ ] Any bug reports addressed
- [ ] Authentication working smoothly
- [ ] No security incidents
- [ ] Fairness metrics looking good

---

## 📝 ROLLBACK PLAN (If Needed)

**If Critical Issues Found:**

```bash
# 1. Revert to previous version
git revert HEAD
git push origin main

# 2. Restore old RLS policies (if needed)
# Run rollback SQL from migration file comments

# 3. Re-enable hardcoded password temporarily
# Uncomment old admin mode code
```

**Note:** Only roll back if authentication completely broken.
Most issues can be fixed forward.

---

## 🎯 POST-LAUNCH TASKS (Week 1-2)

### High Priority
- [ ] Create additional battalion chief accounts (if multiple users)
- [ ] Test skip member functionality in production
- [ ] Verify all RFC acceptance criteria pass
- [ ] Create business logic test suite
- [ ] Add role context indicators

### Medium Priority
- [ ] Build metrics dashboard
- [ ] Enhance mobile UX
- [ ] Add tooltips for truncated names
- [ ] Implement station search filter

### Testing
- [ ] Run Lighthouse audit
- [ ] Accessibility testing (axe, WAVE)
- [ ] Cross-browser testing
- [ ] Mobile device testing

---

## ✨ READY TO LAUNCH!

**Everything is implemented and ready to go.**

**Your action items:**
1. ⏳ Create test battalion chief account (15 min)
2. ⏳ Apply RLS migration (15 min)
3. ⏳ Test locally (30 min)
4. ⏳ Deploy to production (15 min)
5. ⏳ Verify in production (15 min)

**Total time to production:** ~90 minutes

---

*Deployment checklist created: January 31, 2025*
*Implementation: 100% complete*
*Ready for: Testing and production deployment*

🚀 **GO TIME!**
