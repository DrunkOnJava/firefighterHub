# User Feedback - Critical Bug Fixes

## Issues Reported

### 1. BC Mode: Can't Move Members Manually ❌
**Location:** `FirefighterItem.tsx:62`
**Problem:** `draggable={isAdminMode}` - drag-drop only works in admin mode
**Impact:** BC users can't reorder roster manually
**Fix:** Change to `draggable={true}` - allow ALL users to drag-drop

### 2. Calendar: Station Selection Not Visible ✅ FALSE ALARM
**Location:** `HoldForm.tsx:217-220`
**Status:** Station selector ALREADY EXISTS
**Issue:** User may not have noticed it (UX issue, not missing feature)
**Recommendation:** Make station selector more prominent (larger label, different styling)

### 3. Calendar: Skip Button Doesn't Work ❌
**Location:** `HoldForm.tsx:117-119`
**Problem:**
```tsx
onClick={() => {
  onFirefighterSelect(null); // ❌ Doesn't skip person!
}}
```
**Expected:** Move top person to bottom of rotation + show next person
**Fix:** Need to call `onSkipFirefighter(firefighter.id)` callback

---

## Implementation Plan

### Fix 1: Enable Drag-Drop for BC Mode (5 min)

**File:** `src/components/FirefighterItem.tsx`

```tsx
// BEFORE (line 62)
draggable={isAdminMode}

// AFTER
draggable={true}  // Allow all users to reorder
```

**Also update lines 63-73:**
```tsx
// BEFORE
onDragStart={(e) => isAdminMode && onDragStart?.(e, firefighter.id)}
onDragOver={(e) => {
  if (!isAdminMode) return;
  e.preventDefault();
  onDragOver?.(e, firefighter.id);
}}
onDrop={(e) => {
  if (!isAdminMode) return;
  e.preventDefault();
  onDrop?.(e, firefighter.id);
}}

// AFTER
onDragStart={(e) => onDragStart?.(e, firefighter.id)}
onDragOver={(e) => {
  e.preventDefault();
  onDragOver?.(e, firefighter.id);
}}
onDrop={(e) => {
  e.preventDefault();
  onDrop?.(e, firefighter.id);
}}
```

**Also update line 76:**
```tsx
// BEFORE
className={`... ${isAdminMode ? "cursor-move" : ""} ...`}

// AFTER  
className={`... cursor-move ...`}  // Always show drag cursor
```

---

### Fix 2: Implement Skip Functionality (20 min)

#### Step 1: Add Skip Callback to Interfaces

**File:** `src/components/calendar/HoldForm.tsx`

```tsx
interface HoldFormProps {
  // ... existing props
  onSkipFirefighter?: (firefighterId: string) => void;  // NEW
}

export function HoldForm({
  // ... existing params
  onSkipFirefighter,  // NEW
}: HoldFormProps) {
```

**File:** `src/components/calendar/DayModal.tsx`

```tsx
interface DayModalProps {
  // ... existing props
  onSkipFirefighter: (firefighterId: string) => void;  // NEW
}
```

#### Step 2: Implement Skip Handler

**File:** `src/hooks/useFirefighters.ts` (or wherever roster management lives)

```tsx
const skipFirefighter = async (firefighterId: string) => {
  const firefighter = firefighters.find(ff => ff.id === firefighterId);
  if (!firefighter) return;

  // Get other available firefighters
  const otherAvailable = firefighters.filter(
    ff => ff.id !== firefighterId && ff.is_available
  );

  // Reorder: skipped person goes to bottom
  const reordered = [
    ...otherAvailable.map((ff, i) => ({ ...ff, order_position: i })),
    { ...firefighter, order_position: otherAvailable.length }
  ];

  // Update database
  await Promise.all(
    reordered.map(ff =>
      supabase
        .from('firefighters')
        .update({ order_position: ff.order_position })
        .eq('id', ff.id)
    )
  );

  // Log activity
  await logActivity(
    firefighter.name,
    'skipped',
    `Skipped in rotation, moved to position ${otherAvailable.length + 1}`,
    firefighter.id
  );

  // Refresh data
  loadFirefighters();
};
```

#### Step 3: Wire Up Skip Button

**File:** `src/components/calendar/HoldForm.tsx:117-119`

```tsx
// BEFORE
<button
  onClick={() => {
    onFirefighterSelect(null);  // ❌ Wrong
  }}
>
  Skip to Next Person
</button>

// AFTER
<button
  onClick={() => {
    if (nextInRotation) {
      onSkipFirefighter?.(nextInRotation.id);  // ✅ Actually skip
      // onFirefighterSelect will auto-update with new rotation
    }
  }}
>
  Skip to Next Person
</button>
```

---

### Fix 3: Improve Station Selector Visibility (10 min)

**File:** `src/components/calendar/HoldForm.tsx:211-221`

```tsx
// BEFORE
<label className={`block ${tokens.typography.body.secondary} ${theme.textSecondary} mb-2`}>
  Hold Station
</label>

// AFTER
<label className={`block ${tokens.typography.body.primary} ${theme.textPrimary} font-semibold mb-2 text-base`}>
  Hold Station *
</label>
```

**Add visual emphasis:**
```tsx
<div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border-2 border-blue-200 dark:border-blue-800">
  <label className="block font-bold text-blue-900 dark:text-blue-100 mb-2">
    🏢 Hold Station *
  </label>
  <StationSelector
    selectedStation={selectedStation}
    onStationChange={onStationChange}
  />
</div>
```

---

## Testing Checklist

After fixes:

- [ ] BC user can drag-drop roster items
- [ ] Drag cursor shows for all users
- [ ] Skip button moves person to bottom
- [ ] Next person auto-appears after skip
- [ ] Station selector is prominent
- [ ] Activity log shows "skipped" action
- [ ] Order positions recalculate correctly

---

## Additional Feature: Voluntary Hold Pickup

**User Request:** "People can pick up voluntarily and get moved to the bottom"

**Implementation (FUTURE):**

1. Add "Volunteer for Hold" button in calendar modal
2. Same logic as skip: move volunteer to bottom
3. Create scheduled hold with volunteer's name
4. Log as "voluntary_pickup" in activity log

**Estimated Time:** 30 minutes

---

## Time Estimates

| Fix | Time |
|-----|------|
| BC mode drag-drop | 5 min |
| Skip functionality | 20 min |
| Station visibility | 10 min |
| **Total** | **35 min** |

---

## Priority Order

1. ✅ Fix BC mode drag (CRITICAL - 5 min)
2. ✅ Fix skip button (HIGH - 20 min)
3. ✅ Improve station selector (NICE-TO-HAVE - 10 min)
4. ⏳ Voluntary holds (FUTURE - 30 min)

Let's execute!
