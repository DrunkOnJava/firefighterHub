# Past Date Holds Feature

## Summary

Implemented the ability to add holds retroactively for past dates, addressing firefighter feedback: _"I'd like to be able to go back and add people on the holds in case a day is missed or something."_

## Changes Made

### 1. Visual Updates (Calendar.tsx)

- **Removed opacity restriction** on past dates in admin mode
- Past dates now show **70% opacity** instead of 50% (clearer they're clickable)
- Past dates in **read-only mode remain disabled** (50% opacity, cursor-not-allowed)

### 2. UI Enhancements

- **"Add Past Hold" label** appears on hover for past dates (instead of "Schedule Hold")
- **"PAST DATE" badge** displayed in modal header when selecting a past date
- **Warning message** shown when adding holds to past dates:
  - ⚠️ Adding a hold to a past date
  - Explains it will retroactively record unavailability

### 3. Functionality

- **"Add Another Person" button** now works on past dates (previously disabled)
- Admin users can add multiple holds to the same past date
- All backend logic remains unchanged (no restrictions existed there)

## User Experience

### Before

- Past dates appeared completely disabled (greyed out, no interaction hints)
- Users couldn't add missed holds without manually editing the database
- No visual feedback that past dates could be edited

### After

- **Admin mode**: Past dates are clearly clickable with helpful prompts
- **Read-only mode**: Past dates remain disabled (no change)
- Clear visual indicators and warnings when working with past dates
- Ability to correct missed hold entries retroactively

## Technical Details

### Modified Files

- `src/components/Calendar.tsx`

### Key Code Changes

**1. Day cell styling** (Line ~220-235):

```typescript
} else if (day.isPast && !isAdminMode) {
  // Past dates are only disabled in read-only mode
  dayCellClasses += ' cursor-not-allowed opacity-50';
} else if (day.isPast && isAdminMode) {
  // Past dates in admin mode are clickable with slightly reduced opacity
  dayCellClasses += ` ${day.isWeekend ? theme.dayCells.emptyWeekend : theme.dayCells.emptyWeekday} cursor-pointer hover:shadow-lg opacity-70`;
```

**2. "Schedule Hold" prompt** (Line ~300):

```typescript
day.isCurrentMonth && isAdminMode && (
  <div className="...">
    <Plus size={16} />
    <span>{day.isPast ? "Add Past Hold" : "Schedule Hold"}</span>
  </div>
);
```

**3. Modal header badge** (Line ~377):

```typescript
{
  selectedDay.isPast && (
    <span className="ml-2 px-2 py-1 text-xs bg-amber-900/70 text-amber-200 rounded font-semibold">
      PAST DATE
    </span>
  );
}
```

**4. Warning message** (Line ~704):

```typescript
{
  selectedDay.isPast && (
    <div className="bg-amber-900/30 border border-amber-700/50 rounded-lg p-3 mb-3">
      <p className="text-sm text-amber-200 font-semibold">
        ⚠️ Adding a hold to a past date
      </p>
      <p className="text-xs text-amber-300/80 mt-1">
        This will retroactively record that someone was unavailable on this
        date.
      </p>
    </div>
  );
}
```

## Testing Recommendations

### Manual Test Checklist

1. ✅ **Admin mode - past dates**:

   - [ ] Click on past date → modal opens
   - [ ] Verify "PAST DATE" badge appears
   - [ ] Verify warning message displays
   - [ ] Add firefighter to past date → hold saves
   - [ ] Add multiple firefighters to same past date
   - [ ] Hover over empty past date → "Add Past Hold" prompt appears

2. ✅ **Read-only mode - past dates**:

   - [ ] Past dates remain greyed out
   - [ ] Clicking past dates does nothing
   - [ ] No hover effects on past dates

3. ✅ **Future dates** (unchanged behavior):

   - [ ] Admin: Click future date → modal opens
   - [ ] Admin: "Schedule Hold" prompt appears
   - [ ] Read-only: Future dates are viewable

4. ✅ **Existing holds on past dates**:
   - [ ] View holds scheduled in the past
   - [ ] Add additional holds to dates with existing holds
   - [ ] Delete/complete holds on past dates

## Notes

- **No database changes required** - backend already supported past date holds
- **Security**: Only admin users can add past holds (read-only mode unchanged)
- **Audit trail**: Activity log still captures all hold additions with timestamps
- **Shift isolation**: Past date holds still filter by `currentShift` correctly

## Known Issues Fixed

- Removed broken `showToast` calls in inline edit functionality (lines 659, 665)
  - Added TODO comments for future refactoring
  - Errors now log to console only

## Future Enhancements

- Consider adding confirmation dialog for adding holds >7 days in the past
- Add bulk import feature for multiple missed holds
- Show edit history/audit trail in modal for past date holds
