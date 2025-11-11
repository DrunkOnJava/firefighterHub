# Supabase Real-time & Architecture Audit Report
**Date:** 2025-11-08  
**Auditor:** Claude (Supabase Specialist)

---

## 🔴 CRITICAL ISSUES

### 1. **WRONG REAL-TIME PATTERN: Using Broadcast Instead of postgres_changes**

**Severity:** CRITICAL  
**Files Affected:**
- `src/hooks/useFirefighters.ts` (lines 144-156)
- `src/hooks/useScheduledHolds.ts` (lines 74-87)

**Problem:**
You're using **Broadcast channels** (application-level pub/sub) when you should be using **`postgres_changes`** (database change data capture). This is a fundamental architecture mistake.

```typescript
// ❌ WRONG - Current implementation
const channel = supabase
  .channel(`firefighters:${currentShift}`, {
    config: { private: true, broadcast: { self: false, ack: false } }
  })
  .on("broadcast", { event: "*" }, (payload) => {
    console.log("🔄 Firefighters changed:", payload.payload.type);
    loadFirefighters();
  })
```

**Why This is Wrong:**
1. **Broadcast** requires manual `channel.send()` calls from your application - you're never sending these events
2. **Broadcast** is for real-time messaging between clients (chat, multiplayer games, cursors)
3. **postgres_changes** automatically detects INSERT/UPDATE/DELETE on database tables
4. Your real-time subscriptions are essentially **dead** - they never fire because nothing is broadcasting

**Correct Pattern:**
```typescript
// ✅ CORRECT - Use postgres_changes
const channel = supabase
  .channel(`firefighters_${currentShift}`)
  .on(
    "postgres_changes",
    {
      event: "*",
      schema: "public",
      table: "firefighters",
      filter: `shift=eq.${currentShift}`,
    },
    (payload) => {
      console.log("🔄 Firefighters changed:", payload.eventType);
      loadFirefighters();
    }
  )
  .subscribe((status, err) => {
    // subscription handlers
  });
```

**Evidence of Correct Pattern:**
- `src/hooks/useScheduledHoldsRealtime.ts` (lines 105-121) - ✅ Uses `postgres_changes` correctly
- `src/components/ActivityLog.tsx` (lines 68-76) - ✅ Uses `postgres_changes` correctly
- `src/components/Reports.tsx` (lines 99-112) - ✅ Uses `postgres_changes` correctly

**Impact:**
- Real-time updates for firefighters roster **do not work**
- Real-time updates for scheduled holds in old hook **do not work**
- Users must manually refresh to see changes
- Exponential backoff retry logic is wasted effort on a broken pattern

---

### 2. **Hardcoded Environment Variables in Client Code**

**Severity:** HIGH  
**File:** `src/hooks/useScheduledHolds.ts` (lines 292-296)

**Problem:**
```typescript
const authHeader = session?.access_token
  ? `Bearer ${session.access_token}`
  : `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`;

const response = await fetch(
  `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/schedule-hold`,
  // ...
);
```

**Why This is Wrong:**
1. **Exposes anon key in client bundle** (already public, but anti-pattern)
2. **Bypasses Supabase client library** - no retry logic, connection pooling, type safety
3. **Manual fetch** when Supabase client has `.functions.invoke()` built-in
4. **Duplicates configuration** - URL/keys already in `src/lib/supabase.ts`

**Correct Pattern:**
```typescript
// ✅ Use Supabase client's function invocation
const { data, error } = await supabase.functions.invoke('schedule-hold', {
  body: {
    firefighter_id: firefighter.id,
    firefighter_name: firefighter.name,
    hold_date: holdDate,
    fire_station: stationToUse,
    shift: currentShift,
    duration: duration,
    start_time: startTime,
    is_voluntary: isVoluntary,
  }
});

if (error) throw error;
```

**Benefits:**
- Automatic auth header injection
- Type-safe request/response
- Built-in retry logic
- Consistent error handling
- No hardcoded values

---

### 3. **Duplicate Real-Time Subscription Logic**

**Severity:** MEDIUM  
**Files:**
- `src/hooks/useFirefighters.ts` (lines 98-244) - 147 lines of retry logic
- `src/hooks/useScheduledHolds.ts` (lines 57-177) - 121 lines of retry logic
- `src/hooks/useScheduledHoldsRealtime.ts` (lines 59-251) - 193 lines of retry logic

**Problem:**
Same exponential backoff + retry logic **copy-pasted 3 times** with minor variations. This is a DRY violation.

**Correct Pattern - Extract Shared Hook:**
```typescript
// ✅ Create src/hooks/useRealtimeSubscription.ts
export function useRealtimeSubscription({
  channelName,
  table,
  filter,
  onDataChange,
  showToast,
}: {
  channelName: string;
  table: string;
  filter?: string;
  onDataChange: () => void;
  showToast: (message: string, type: ToastType) => void;
}) {
  // Single implementation of exponential backoff logic
  // Used by all hooks
}

// Then in useFirefighters:
useRealtimeSubscription({
  channelName: `firefighters_${currentShift}`,
  table: 'firefighters',
  filter: `shift=eq.${currentShift}`,
  onDataChange: loadFirefighters,
  showToast,
});
```

---

### 4. **Incorrect Channel Configuration for postgres_changes**

**Severity:** MEDIUM  
**File:** `src/hooks/useFirefighters.ts` (line 146)

**Problem:**
```typescript
config: { private: true, broadcast: { self: false, ack: false } }
```

When using `postgres_changes`, you **do not need** `broadcast` config. This is mixing two different real-time features.

**Correct Pattern:**
```typescript
// ✅ For postgres_changes, no channel config needed
const channel = supabase
  .channel(`firefighters_${currentShift}`)
  .on("postgres_changes", { /* ... */ }, handler)
  .subscribe();

// OR if you need presence:
const channel = supabase
  .channel(`firefighters_${currentShift}`, {
    config: {
      presence: { key: userId }
    }
  })
  .on("postgres_changes", { /* ... */ }, handler)
  .subscribe();
```

**Documentation Reference:**
- Broadcast: https://supabase.com/docs/guides/realtime/broadcast
- postgres_changes: https://supabase.com/docs/guides/realtime/postgres-changes

---

### 5. **Inconsistent Channel Cleanup Patterns**

**Severity:** LOW  
**Files:** Multiple

**Problem - Mixed async/sync cleanup:**
```typescript
// ❌ useFirefighters.ts - async cleanup (wrong in useEffect)
await supabase.removeChannel(currentChannel);

// ✅ useScheduledHoldsRealtime.ts - sync cleanup (correct)
channelRef.current?.unsubscribe();

// ❌ useScheduledHolds.ts - sync removeChannel
supabase.removeChannel(channel);
```

**Correct Pattern:**
```typescript
// ✅ ALWAYS use .unsubscribe() in cleanup
return () => {
  channelRef.current?.unsubscribe();
  // Don't await in useEffect cleanup - it can't be async
};
```

**Why:**
- `unsubscribe()` is the modern Supabase v2 API
- `removeChannel()` is legacy/deprecated
- useEffect cleanup **cannot be async** - promises are ignored

---

## 🟡 ANTI-PATTERNS

### 6. **Massive Hooks Violating Single Responsibility Principle**

**Files:**
- `useFirefighters.ts` - **895 lines** (data fetch + mutations + logging + real-time)
- `useScheduledHolds.ts` - **483 lines** (same issues)

**Your own comments acknowledge this:**
```typescript
// TECHNICAL DEBT: This hook is doing too much - violates Single Responsibility Principle
// Consider splitting into: useFirefightersData, useFirefighterMutations, useFirefighterRealtimeSync
```

**You've partially fixed this for scheduled holds:**
- ✅ `useScheduledHoldsData.ts` - Data fetching only
- ✅ `useScheduledHoldsMutations.ts` - CUD operations only
- ✅ `useScheduledHoldsRealtime.ts` - Real-time sync only

**But `useFirefighters.ts` still violates SRP.** Apply the same refactoring pattern.

---

### 7. **Connection Health Check Creates Extra Channel**

**File:** `src/hooks/useConnectionStatus.ts` (lines 45-79)

**Problem:**
Creates a dedicated channel **just** to monitor connection health:
```typescript
const healthCheckChannel = supabase.channel('connection_health_check');
```

**Why This is Wasteful:**
- Each channel counts toward Supabase connection limits (200 on free tier)
- You already have 2 channels per shift (firefighters + scheduled_holds)
- With 3 shifts, that's 6 channels + 1 health check = **7 channels per browser tab**
- 30 users = 210 connections (over capacity)

**Correct Pattern:**
Monitor existing channel states instead of creating a new one:
```typescript
// ✅ Reuse existing channels
export function useConnectionStatus(existingChannel: RealtimeChannel) {
  const [status, setStatus] = useState<ConnectionStatus>('connecting');
  
  useEffect(() => {
    const checkHealth = () => {
      if (existingChannel.state === 'joined') {
        setStatus('connected');
      } else if (existingChannel.state === 'errored') {
        setStatus('disconnected');
      }
    };
    
    const interval = setInterval(checkHealth, 10000);
    return () => clearInterval(interval);
  }, [existingChannel]);
}
```

---

### 8. **Optimistic Updates Without Rollback Error Handling**

**File:** `src/hooks/useScheduledHolds.ts` (lines 261-283, 340-350)

**Problem:**
Optimistic update, then error handling removes the temp hold, **but doesn't restore original state:**
```typescript
setScheduledHolds((prev) => [...prev, optimisticHold]); // Optimistic

try {
  const response = await fetch(/* ... */);
  // ...
} catch (error) {
  // ❌ Only removes temp hold, doesn't rollback side effects
  setScheduledHolds((prev) => prev.filter((h) => h.id !== tempId));
}
```

**Missing Rollback:**
- If hold creation fails, you need to restore **exact previous state**
- Current implementation might leave UI in inconsistent state if other holds were added/removed during the async operation

**Correct Pattern:**
```typescript
// ✅ Capture state snapshot for rollback
const previousHolds = scheduledHolds;
setScheduledHolds((prev) => [...prev, optimisticHold]);

try {
  // mutation
} catch (error) {
  setScheduledHolds(previousHolds); // Full rollback
  showToast("Could not schedule hold. Please try again.", "error");
}
```

---

### 9. **Unused RPC Function**

**File:** `src/hooks/useScheduledHoldsMutations.ts` (line 47)  
**Migration:** `supabase/migrations/20251029000000_secure_schedule_hold_function.sql`

**Problem:**
You created a **SECURITY DEFINER** PostgreSQL function `schedule_hold_secure()` but:
1. It's only called from `useScheduledHoldsMutations.ts`
2. But the main code path uses **Edge Function** (`schedule-hold` via fetch)
3. The RPC function has `TODO` comments about auth that will never be implemented

**Decision Needed:**
- **Option A:** Use RPC function everywhere (faster, no cold starts)
- **Option B:** Use Edge Function everywhere (more flexible, easier debugging)
- **Current state:** Both exist, causing confusion

**Recommendation:** Use **RPC function** for simple CRUD, **Edge Functions** for complex business logic (emails, webhooks, external APIs).

---

### 10. **No Real-Time Connection Limits or Rate Limiting**

**Problem:**
With current architecture:
- **Per browser tab:** 7 channels (2 firefighters + 2 holds + 2 activity + 1 health)
- **Supabase free tier limit:** 200 concurrent connections
- **Capacity:** ~28 simultaneous users before hitting limits

**Missing Safeguards:**
```typescript
// ❌ No connection pooling
// ❌ No channel sharing between components
// ❌ No warning when approaching limits
```

**Correct Pattern - Channel Multiplexing:**
```typescript
// ✅ Single shared channel per shift
const channel = supabase
  .channel(`shift_${currentShift}`)
  .on("postgres_changes", { table: "firefighters", ... }, handler1)
  .on("postgres_changes", { table: "scheduled_holds", ... }, handler2)
  .on("postgres_changes", { table: "activity_log", ... }, handler3)
  .subscribe();
```

**Benefits:**
- 1 channel per shift instead of 3
- 3 total channels instead of 7 per tab
- ~66 simultaneous users instead of ~28

---

## ✅ THINGS YOU'RE DOING CORRECTLY

### Excellent Patterns Found:

1. **✅ Shift-based filtering in real-time subscriptions**
   ```typescript
   filter: `shift=eq.${currentShift}`
   ```
   Prevents cross-shift data leakage.

2. **✅ Exponential backoff with max retries**
   ```typescript
   const delay = Math.min(1000 * Math.pow(2, retryCount), 30000);
   ```
   Proper connection recovery strategy.

3. **✅ Toast deduplication**
   ```typescript
   const lastToastAt: Record<string, number> = {};
   ```
   Prevents notification spam during reconnections.

4. **✅ Graceful cleanup with intentional disconnect tracking**
   ```typescript
   isIntentionalDisconnect = true;
   await supabase.removeChannel(currentChannel);
   ```
   Prevents false-positive reconnection attempts.

5. **✅ Type-safe Supabase client with auto-generated types**
   ```typescript
   export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
   ```

6. **✅ Environment variable trimming**
   ```typescript
   const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
   ```
   Prevents `%0A` newline bugs in WebSocket connections.

---

## 📊 SUMMARY METRICS

| Issue Category | Count | Severity |
|---------------|-------|----------|
| Wrong real-time pattern | 2 | 🔴 CRITICAL |
| Hardcoded values | 1 | 🔴 HIGH |
| Code duplication | 3 | 🟡 MEDIUM |
| Architecture violations | 5 | 🟡 MEDIUM |
| **Total Issues** | **11** | Mixed |

---

## 🔧 RECOMMENDED FIXES (Priority Order)

### Priority 1 - Fix Real-Time Subscriptions (Breaking)
1. **Replace broadcast with postgres_changes in `useFirefighters.ts`**
2. **Replace broadcast with postgres_changes in `useScheduledHolds.ts`**
3. **Remove broadcast config from channel creation**

### Priority 2 - Remove Hardcoded Values
4. **Replace manual fetch with `supabase.functions.invoke()`**
5. **Consolidate all Supabase client usage through `src/lib/supabase.ts`**

### Priority 3 - Reduce Connection Overhead
6. **Implement channel multiplexing** (1 channel per shift, not 3)
7. **Remove dedicated health check channel** (reuse existing channels)

### Priority 4 - Code Organization
8. **Extract shared `useRealtimeSubscription` hook**
9. **Refactor `useFirefighters` into 3 hooks** (data/mutations/realtime)
10. **Standardize cleanup to use `.unsubscribe()`**

### Priority 5 - Edge Cases
11. **Improve optimistic update rollback** (full state snapshots)
12. **Decide RPC vs Edge Function strategy** (document the pattern)

---

## 🧪 TESTING RECOMMENDATIONS

### Verify Real-Time Works:
```bash
# Terminal 1 - Start dev server
pnpm dev

# Terminal 2 - Watch Supabase logs
npx supabase logs --follow

# Browser - Open DevTools
# 1. Check for "✅ Real-time subscription active" logs
# 2. Make a database change via SQL Editor
# 3. Verify UI updates WITHOUT manual refresh
```

### Test Connection Recovery:
```javascript
// In browser console
// 1. Disable network (DevTools > Network > Offline)
// 2. Wait 5 seconds
// 3. Re-enable network
// 4. Should see "Real-time updates reconnected" toast
```

---

## 📚 RESOURCES

**Supabase Documentation:**
- [postgres_changes](https://supabase.com/docs/guides/realtime/postgres-changes) - Database CDC
- [Broadcast](https://supabase.com/docs/guides/realtime/broadcast) - App-level messaging
- [Edge Functions](https://supabase.com/docs/guides/functions) - Serverless compute
- [RPC Functions](https://supabase.com/docs/guides/database/functions) - PostgreSQL functions

**Best Practices:**
- [Real-time Connection Limits](https://supabase.com/docs/guides/realtime#connection-limits)
- [Channel Multiplexing](https://supabase.com/docs/guides/realtime/multiplexing)
- [Real-time Quotas](https://supabase.com/docs/guides/platform/quotas)

---

## 🚨 IMMEDIATE ACTION ITEMS

**Before pushing to production:**

1. ✅ **Verify current real-time ACTUALLY works** - I suspect it doesn't
2. 🔴 **Fix broadcast → postgres_changes** in useFirefighters.ts
3. 🔴 **Fix broadcast → postgres_changes** in useScheduledHolds.ts  
4. 🟡 **Test with 2+ browser tabs** to verify updates propagate
5. 🟡 **Monitor connection count** in Supabase dashboard

**Commands to run:**
```bash
# Type check
pnpm typecheck

# Test real-time in dev
pnpm dev

# Build for production
pnpm build

# Deploy and monitor
vercel --prod
# Then watch: https://supabase.com/dashboard/project/YOUR_PROJECT/logs
```

---

**Report completed.** Let me know which fixes you'd like me to implement first! 🚀
