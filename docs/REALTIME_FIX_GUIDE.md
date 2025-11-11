# 🔥 CRITICAL: Realtime Authorization Fix Guide

## **Problem Summary**

Your app is experiencing **authorization errors** when trying to subscribe to realtime channels:

```
⚠️ Real-time subscription error: CHANNEL_ERROR 
Error: "Unauthorized: You do not have permissions to read from this Channel topic: firefighters:A"
```

**Root Cause:** RLS policies on `realtime.messages` table only allow `authenticated` users, but your app uses the **anon key**.

---

## **Fix Option 1: SQL Editor (Dashboard) - RECOMMENDED**

### Steps:

1. **Go to Supabase Dashboard**
   - https://supabase.com/dashboard/project/tjljndzodowpohusrwhs
   
2. **Navigate to SQL Editor**
   - Left sidebar → SQL Editor

3. **Paste and Run This SQL:**

```sql
-- Fix realtime authorization for anon users
-- Root cause: App uses anon key, but policies only allowed authenticated users

-- Drop old policies
DROP POLICY IF EXISTS "allow_authenticated_read_firefighters_topics" ON realtime.messages;
DROP POLICY IF EXISTS "allow_authenticated_insert_firefighters_topics" ON realtime.messages;
DROP POLICY IF EXISTS "users_can_receive_firefighter_broadcasts" ON realtime.messages;
DROP POLICY IF EXISTS "allow_realtime_broadcasts" ON realtime.messages;

-- Create new policies that allow BOTH authenticated AND anon users
CREATE POLICY "allow_realtime_read_all_topics"
  ON realtime.messages
  FOR SELECT
  TO authenticated, anon
  USING ( 
    topic ~ '^(firefighters|scheduled_holds):[ABC]$'
  );

CREATE POLICY "allow_realtime_insert_all_topics"
  ON realtime.messages
  FOR INSERT
  TO authenticated, anon
  WITH CHECK ( 
    topic ~ '^(firefighters|scheduled_holds):[ABC]$'
  );

-- Verify RLS is enabled
ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;
```

4. **Click "Run"**

5. **Verify Success:**
   - Should see: "Success. No rows returned"
   
6. **Test the app:**
   - Reload https://firefighter-hub.vercel.app
   - Check console - errors should be gone

---

## **Fix Option 2: Use Private Channels (Alternative)**

If you want better security, modify the realtime subscriptions to use `private: true` and call `setAuth()`:

### File: `src/hooks/useFirefighters.ts` (line ~135)

**Current:**
```typescript
const channel = supabase.channel(`firefighters:${currentShift}`)
```

**Change to:**
```typescript
const channel = supabase.channel(`firefighters:${currentShift}`, {
  config: { private: true }
});

// Before subscribing, set auth
await supabase.realtime.setAuth(supabase.auth.session()?.access_token);
```

**File: `src/hooks/useScheduledHolds.ts` (similar change)**

**Then update RLS policies to require authentication:**
```sql
CREATE POLICY "allow_realtime_read_authenticated_only"
  ON realtime.messages
  FOR SELECT
  TO authenticated
  USING ( 
    topic ~ '^(firefighters|scheduled_holds):[ABC]$'
  );
```

⚠️ **Note:** This requires implementing auth, which you don't have yet.

---

## **Fix Option 3: Disable RLS on realtime.messages (NOT RECOMMENDED)**

⚠️ **Security Risk:** This makes ALL realtime messages public.

```sql
ALTER TABLE realtime.messages DISABLE ROW LEVEL SECURITY;
```

**Only use this for testing/debugging.**

---

## **Other Issues Detected**

### 1. **Service Worker POST Cache Error**

**Error:**
```
TypeError: Failed to execute 'put' on 'Cache': Request method 'POST' is unsupported
```

**Fix:** Update `public/service-worker.js` to skip caching POST requests:

```javascript
// In service-worker.js, add this check before caching:
self.addEventListener('fetch', (event) => {
  // Skip caching POST requests
  if (event.request.method !== 'GET') {
    return fetch(event.request);
  }
  
  // ... rest of caching logic
});
```

### 2. **Vercel CSP Violation**

**Error:**
```
Loading the script 'https://vercel.live/_next-live/feedback/feedback.js' violates CSP
```

**Fix:** This is a Vercel preview feature - ignore or update CSP headers in `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live;"
        }
      ]
    }
  ]
}
```

### 3. **Build Error - Missing BottomNav**

**Error:**
```
Could not resolve "./components/mobile/BottomNav" from "src/App.tsx"
```

**Status:** ✅ **File exists at `src/components/mobile/BottomNav.tsx`**

**Possible causes:**
- Case sensitivity issue (macOS vs Linux)
- Vercel build cache corruption

**Fix:**
1. Clear Vercel build cache (redeploy from dashboard)
2. Or add to `.vercelignore` and re-add:
   ```bash
   git rm --cached src/components/mobile/BottomNav.tsx
   git add src/components/mobile/BottomNav.tsx
   git commit -m "fix: force BottomNav file tracking"
   git push
   ```

---

## **Verification Checklist**

After applying fixes, verify:

- [ ] **Console errors gone** - No more "Unauthorized" errors
- [ ] **Realtime working** - Add/edit firefighter reflects across tabs
- [ ] **Toast notifications** - No more subscription error toasts
- [ ] **Build succeeds** - Vercel deployment completes
- [ ] **Service worker** - No cache errors in console

---

## **Next Steps**

1. **Execute Fix Option 1 (SQL) first** - This will immediately resolve the authorization errors
2. **Clear Vercel build cache** - Fixes the BottomNav build error
3. **Update service worker** - Fixes the POST cache error
4. **Test thoroughly** - Verify all realtime functionality works

---

## **Support**

If issues persist:
1. Check Supabase Dashboard → Project Settings → API → Realtime
2. Verify publication includes `firefighters` and `scheduled_holds` tables
3. Check RLS policies on `realtime.messages` table
4. Review browser console for detailed error messages

---

**Created:** 2025-11-08  
**Status:** 🔴 **CRITICAL - Requires immediate action**
