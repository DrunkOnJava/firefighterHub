# Multi-Shift Support Documentation

## Overview

The Hold List Manager now supports three separate shifts: **A**, **B**, and **C**. Each shift maintains its own independent rotation order, schedules, and team members.

## Key Features

### 1. Shift Selector

A prominent shift selector appears at the top of the main content area, allowing users to quickly switch between shifts.

**Location**: Top-right of the main content area (below header)

**Behavior**:
- Clicking a shift button switches the entire application to that shift
- Active shift is highlighted with its distinctive color
- Screen reader announces shift changes

**Shift Colors**:
- **Shift A**: Blue
- **Shift B**: Green
- **Shift C**: Orange

### 2. Independent Data Per Shift

Each shift has completely separate:
- **Team roster**: Different firefighters per shift
- **Rotation order**: Independent position tracking
- **Scheduled holds**: Separate hold calendars
- **Activity logs**: Shift-specific history

### 3. Shift Indicators

Visual indicators throughout the app show which shift data belongs to:
- Shift badges on firefighter cards
- Shift name in page subtitle
- Color-coded shift selector
- Filtered activity logs

## Database Schema

### Migration: `20251014045433_add_shift_support.sql`

Adds `shift` column to three tables:

#### `firefighters` Table
```sql
shift text NOT NULL DEFAULT 'C'
CHECK (shift IN ('A', 'B', 'C'))
```

#### `scheduled_holds` Table
```sql
shift text NOT NULL DEFAULT 'C'
CHECK (shift IN ('A', 'B', 'C'))
```

#### `activity_log` Table
```sql
shift text
CHECK (shift IN ('A', 'B', 'C') OR shift IS NULL)
```

### Indexes
- `idx_firefighters_shift_order` on `(shift, order_position)`
- `idx_scheduled_holds_shift_date` on `(shift, hold_date)`
- `idx_activity_log_shift` on `shift`

## Usage Guide

### Switching Shifts

1. **Desktop**: Click the shift button (A, B, or C) in the shift selector
2. **Mobile**: Same - shift selector is always visible
3. **Keyboard**: Tab to shift selector, use arrow keys or Space/Enter

### Adding Firefighters to a Shift

1. Switch to the desired shift (A, B, or C)
2. Enable "Manage Team" mode
3. Click "Add Team Member"
4. Enter name and station number
5. Firefighter is automatically added to the current shift

### Scheduling Holds for a Shift

1. Switch to the desired shift
2. Enable "Manage Team" mode
3. Click a date on the calendar
4. Select a firefighter from that shift's rotation
5. Hold is scheduled for that shift only

### Viewing Activity by Shift

1. Switch to the desired shift
2. Click the Activity Log button
3. View shows only actions for the selected shift

## Component Changes

### New Components

#### `ShiftSelector.tsx`
- Main shift toggle component
- Color-coded buttons for A, B, C
- Responsive design
- Accessibility support

#### `ShiftBadge.tsx`
- Visual indicator showing which shift
- Used on firefighter cards
- Color-coded by shift

### Modified Components

#### `App.tsx`
- Added `currentShift` state
- Passes shift to all hooks
- Announces shift changes
- Filters counts by shift

#### `useFirefighters.ts`
- Accepts `currentShift` parameter
- Filters queries by shift
- Includes shift in inserts
- Logs activity with shift

#### `useScheduledHolds.ts`
- Accepts `currentShift` parameter
- Filters queries by shift
- Includes shift in inserts

### Type Definitions

```typescript
export type Shift = 'A' | 'B' | 'C';

export interface Firefighter {
  // ... other fields
  shift: Shift;
}

export interface ScheduledHold {
  // ... other fields
  shift: Shift;
}
```

## Data Migration

### Existing Data

All existing data is automatically assigned to **Shift C** by default:
- Existing firefighters → Shift C
- Existing holds → Shift C
- Existing activity logs → Shift C

This preserves your current data while allowing you to add Shift A and B teams.

### Starting Fresh with Shifts

If you want to start fresh:

1. **Option 1 - Gradual Migration**:
   - Keep existing data as Shift C
   - Add new team members to Shifts A and B
   - Slowly migrate if needed

2. **Option 2 - Clean Start**:
   - Delete all existing data (if desired)
   - Add teams to each shift from scratch

## Best Practices

### Naming Conventions

Consider using shift-specific naming if team members work multiple shifts:
- ❌ "John Smith" (ambiguous if on multiple shifts)
- ✅ "John Smith - A" or "John Smith (A Shift)"

### Scheduling Workflow

1. **Start of shift cycle**: Switch to Shift A
2. **Add all Shift A team members** and schedule their holds
3. **Switch to Shift B**, repeat
4. **Switch to Shift C**, repeat

### Rotation Management

Each shift maintains independent rotation:
- Shift A can be at position 5
- Shift B can be at position 12
- Shift C can be at position 3
- They don't affect each other

## Common Scenarios

### Scenario 1: Setting Up Three Shifts

```
Day 1 - Setup Shift A:
1. Select Shift A
2. Add all A shift firefighters
3. Schedule known holds for Shift A

Day 2 - Setup Shift B:
1. Select Shift B
2. Add all B shift firefighters
3. Schedule known holds for Shift B

Day 3 - Setup Shift C:
1. Select Shift C (your existing data)
2. Verify/update existing firefighters
3. Schedule additional holds if needed
```

### Scenario 2: Daily Operations

```
Each Day:
1. Check which shift is working today
2. Switch to that shift
3. Manage holds for that shift only
4. Next shift's data remains unchanged
```

### Scenario 3: Cross-Shift Coverage

If someone from Shift A covers for Shift B:
1. Switch to Shift B
2. Schedule the Shift A firefighter for that date
3. Note: The firefighter stays in Shift A roster
4. Only the schedule entry is in Shift B

## Troubleshooting

### Issue: Can't see my firefighters
**Solution**: Check if you're on the correct shift. Switch shifts to see other teams.

### Issue: Holds appear on wrong shift
**Solution**: Holds are shift-specific. Verify which shift you were viewing when you scheduled the hold.

### Issue: Activity log is empty
**Solution**: Activity logs are filtered by shift. Switch shifts to see other activity.

### Issue: Rotation positions seem wrong
**Solution**: Each shift has independent rotation positions. Position 1 on Shift A is different from Position 1 on Shift B.

## Technical Notes

### Query Performance

Shift filtering uses indexed queries for optimal performance:
```sql
SELECT * FROM firefighters
WHERE shift = 'A'
ORDER BY order_position;
```

The composite indexes ensure fast lookups even with thousands of records.

### Real-time Updates

Supabase real-time subscriptions work across shifts:
- Changes in Shift A trigger updates for users viewing Shift A
- Changes in Shift B don't affect Shift A viewers
- Each user sees only their selected shift's data

### State Management

The app maintains shift state at the top level (`App.tsx`):
```typescript
const [currentShift, setCurrentShift] = useState<Shift>('C');
```

This ensures consistent shift filtering across all components.

## Future Enhancements

Potential additions for shift management:

1. **Shift Templates**: Copy rotation from one shift to another
2. **Cross-Shift Reports**: View all shifts simultaneously
3. **Shift Notifications**: Alerts when it's time to switch
4. **Bulk Operations**: Move firefighters between shifts
5. **Shift Statistics**: Compare hold distribution across shifts

## Support

For issues or questions about the shift system:
1. Check this documentation
2. Verify your shift selection in the UI
3. Check the database migration was applied
4. Review browser console for errors
