# Toast Deduplication Implementation

**Date**: November 2, 2024  
**Status**: ✅ Complete  
**Time**: ~15 minutes

## Overview

Implemented toast notification deduplication in real-time subscription hooks to prevent notification spam on flappy/unstable network connections.

## Problem

When network connections are unstable, real-time subscriptions can rapidly reconnect and disconnect, triggering duplicate error toasts every few seconds. This creates a poor UX with notification spam.

Example scenario:

1. Network drops → "Live updates temporarily unavailable" toast
2. Auto-reconnect after 1s → Connection fails again
3. Another toast → "Live updates temporarily unavailable"
4. Retry after 2s → Fails again
5. Another toast... (spam continues)

## Solution

### Pattern

Added a `showToastOnce()` wrapper function that:

- Tracks the last time each unique message was shown
- Suppresses duplicate messages within a 10-second window
- Allows the same message to show again after the debounce period expires

### Implementation Details

**In `useScheduledHoldsRealtime.ts`:**

1. Added ref for tracking toast timestamps:

```typescript
const lastToastAtRef = useRef<Record<string, number>>({}); // Dedupe toasts
```

2. Created dedupe helper function (wrapped in `useCallback`):

```typescript
const showToastOnce = useCallback(
  (message: string, type: ToastType, debounceMs = 10000) => {
    const now = Date.now();
    const lastShown = lastToastAtRef.current[message] || 0;

    if (now - lastShown >= debounceMs) {
      showToast(message, type);
      lastToastAtRef.current[message] = now;
    }
  },
  [showToast]
);
```

3. Replaced all `showToast()` calls in subscription handlers with `showToastOnce()`

   - "Real-time updates reconnected" (success)
   - "Live updates temporarily unavailable..." (error)
   - "Unable to restore live updates..." (max retries error)

4. Added `showToastOnce` to useEffect dependency array

**In `useFirefighters.ts`:**

1. Added local `lastToastAt` object inside useEffect:

```typescript
const lastToastAt: Record<string, number> = {}; // Dedupe toasts
```

2. Created local `showToastOnce` function (no useCallback needed - inside useEffect):

```typescript
const showToastOnce = (
  message: string,
  type: ToastType,
  debounceMs = 10000
) => {
  const now = Date.now();
  const lastShown = lastToastAt[message] || 0;

  if (now - lastShown >= debounceMs) {
    showToast(message, type);
    lastToastAt[message] = now;
  }
};
```

3. Replaced all `showToast()` calls in real-time subscription handlers:
   - "Real-time updates reconnected" (success)
   - "Live updates temporarily unavailable..." (error - 2 locations)
   - "Unable to establish live updates..." (max retries error - 2 locations)

## Benefits

### User Experience

- ✅ **No toast spam**: Same error message won't show more than once per 10 seconds
- ✅ **Better readability**: Users can actually read error messages without new toasts covering them
- ✅ **Reduced anxiety**: Fewer rapid-fire errors = less user panic during network issues

### Technical

- ✅ **Configurable debounce**: Default 10s can be adjusted per message if needed
- ✅ **Message-specific tracking**: Different messages can still show simultaneously
- ✅ **Automatic cleanup**: Tracking object resets on component unmount via useEffect cleanup
- ✅ **Zero dependencies**: Uses only refs and basic timestamp comparison

## Testing

### Build Verification

```bash
pnpm build
# ✓ built in 2.00s
# ✓ 554.21 kB bundle (no size increase)
```

### TypeScript

- ✅ Zero new TypeScript errors
- ✅ Only pre-existing unused parameter warning (unrelated)

### Manual Testing Scenarios

1. **Stable network** (expected: normal operation)

   - Should see "✅ Real-time subscription active" console logs
   - No toasts should appear
   - Data updates should work normally

2. **Simulated network flapping** (expected: dedupe works)

   - Open DevTools → Network tab
   - Toggle "Offline" on/off rapidly
   - Should see ONE error toast, not spam
   - Reconnection toast should appear once after stable connection restored

3. **Max retries scenario** (expected: final error shows once)
   - Block network for extended period (>30 seconds)
   - Should see max retries error toast ONCE
   - Console should show retry attempts with backoff delays

## Files Modified

1. **`src/hooks/useScheduledHoldsRealtime.ts`** (203 → 225 lines)

   - Added `useCallback` import
   - Added `lastToastAtRef` ref
   - Added `showToastOnce` wrapped in useCallback
   - Replaced 5 `showToast()` calls with `showToastOnce()`
   - Updated useEffect dependencies

2. **`src/hooks/useFirefighters.ts`** (788 → 807 lines)
   - Added `lastToastAt` local object in useEffect
   - Added `showToastOnce` local function
   - Replaced 5 `showToast()` calls with `showToastOnce()`

## Configuration

Default debounce: **10 seconds** (10000ms)

To adjust for specific messages:

```typescript
showToastOnce("Custom message", "error", 5000); // 5 second debounce
```

## Next Steps

1. **Manual testing** (30 min) - Use Chrome DevTools to validate:

   - Rapid shift switching (race condition guards)
   - Network flapping (toast dedupe)
   - Page refresh (clean startup)

2. **Document useCallback requirement** (5 min)
   - Add JSDoc notes explaining `showToast` must be useCallback-wrapped
   - Add example showing proper usage

## Notes

- Toast dedupe only applies to **real-time subscription handlers**
- Other toast calls (mutations, user actions) remain unchanged
- Messages are tracked by exact string match (case-sensitive)
- Tracking object persists for component lifetime, resets on unmount

---

**Implementation Complete** ✅  
Toast notification spam is now prevented during network instability.
