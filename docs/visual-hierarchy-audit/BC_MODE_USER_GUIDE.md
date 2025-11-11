# BC Mode User Guide - New Features

## Quick Reference

### 1. Manual Roster Reordering (NOW ENABLED)

**How to reorder firefighters:**
1. Go to the Roster view (right sidebar)
2. Click and hold on any firefighter row
3. Drag to desired position
4. Release to drop

**What happens:**
- Roster immediately updates
- Order positions recalculated (0,1,2,3...)
- All users see the change in real-time
- Change is logged in Activity Log

---

### 2. Skip Next Person in Calendar

**When scheduling a hold from calendar:**

#### Step 1: Select a day on the calendar
Click any day to open the hold scheduling modal.

#### Step 2: You'll see the next person in rotation highlighted
```
╔══════════════════════════════════════╗
║ NEXT IN ROTATION:                    ║
║ ┌────────────────────────────────┐   ║
║ │ ⭐ John Doe                     │   ║
║ │ Position: 1 • Station 3        │   ║
║ └────────────────────────────────┘   ║
║                                      ║
║ [Skip to Next Person]                ║
╚══════════════════════════════════════╝
```

#### Step 3: Choose your action
- **To schedule the highlighted person:** Click their card → Select station → Confirm
- **To skip to next person:** Click "Skip to Next Person" button
- **To select someone else:** Scroll down to "OR SELECT SOMEONE ELSE" section

#### What happens when you skip:
- Person moves to bottom of rotation
- Activity log records "voluntary_hold"
- Toast notification: "{Name} moved to end of rotation"
- List refreshes showing new next-in-rotation

---

### 3. Station Selection (REQUIRED)

When scheduling a hold, you MUST select which station:

```
╔══════════════════════════════════════╗
║ Scheduling: John Doe                 ║
║                                      ║
║ Hold Station                         ║
║ ┌────────────────────────────────┐   ║
║ │ Station 3             ▼        │   ║
║ └────────────────────────────────┘   ║
║                                      ║
║ Duration                             ║
║ ┌────────────────────────────────┐   ║
║ │ 24 hours              ▼        │   ║
║ └────────────────────────────────┘   ║
║                                      ║
║ Start Time                           ║
║ ┌────────────────────────────────┐   ║
║ │ 08:00                          │   ║
║ └────────────────────────────────┘   ║
║                                      ║
║ [ ] Add another hold after this      ║
║                                      ║
║ [Back]              [Confirm]        ║
╚══════════════════════════════════════╝
```

**Note:** Confirm button is DISABLED until you select a station.

---

## Voluntary Hold Policy Support

### New Policy
Per your update: "People can pick up voluntarily and get moved to the bottom of the list."

### How to handle voluntary holds:

**Option 1: Use Skip Functionality**
1. Open calendar day
2. Person volunteers? Click "Skip to Next Person"
3. Schedule the actual hold for the person who volunteered
4. They're now at bottom of rotation

**Option 2: Manual Reorder (if needed)**
1. Go to Roster
2. Drag volunteer to bottom
3. Schedule hold normally

---

## Activity Log Tracking

All actions are tracked:

### New Action Type
- **voluntary_hold**: Person skipped or volunteered for hold

### Existing Action Types  
- **hold_completed**: Hold finished
- **added**: Firefighter added
- **deleted**: Firefighter removed
- **transferred**: Shift transfer
- **reactivated**: Brought back from deactivated

### Viewing Activity Log
1. Click "Activity Log" button in header
2. Filter by action type if needed
3. All skip/volunteer actions will show as "voluntary_hold"

---

## Common Workflows

### Scenario 1: Scheduled Hold (Normal)
1. Open calendar day
2. Next person is correct → Click their card
3. Select station
4. Confirm
5. ✅ Hold scheduled, person moves to bottom

### Scenario 2: Voluntary Hold
1. Open calendar day
2. Person volunteers? → Click "Skip to Next Person"
3. Repeat until volunteer is next
4. Click volunteer's card
5. Select station
6. Confirm
7. ✅ Volunteer scheduled, already at bottom

### Scenario 3: Specific Person Needed (Not Next)
1. Open calendar day
2. Scroll down to "OR SELECT SOMEONE ELSE"
3. Click desired person
4. Select station
5. Confirm
6. ✅ Person scheduled, moves to bottom

### Scenario 4: Manual Roster Adjustment
1. Go to Roster view
2. Drag and drop to reorder
3. ✅ New order saved immediately

---

## Tips

### Use "Add Another" Checkbox
When scheduling multiple holds in one day:
1. Select first person → Station → Check "Add another" → Confirm
2. Modal stays open
3. Select next person → Station → Confirm
4. Repeat as needed

### Real-Time Updates
All changes sync immediately:
- Other users see reorders instantly
- Calendar updates across all devices
- Activity log updates in real-time

### Undo Accidental Skip
If you skip someone by mistake:
1. Go to Roster
2. Drag them back to position 1
3. They're back at top of rotation

---

## Keyboard Shortcuts

- **Tab**: Navigate between fields
- **Enter**: Confirm selection
- **Escape**: Close modal
- **Arrow Keys**: Scroll through firefighter list

---

## Questions?

Check the full technical summary: `BC_MODE_FIXES_SUMMARY.md`
