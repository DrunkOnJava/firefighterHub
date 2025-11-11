# Calendr Design System Extraction
## Complete Analysis of Screens 19-31

---

## 🎨 Color Palette

### Extracted Colors (from SVG analysis)

#### Primary Colors
- **Primary Blue**: `#196FEB` - Main interactive elements, links, primary buttons
- **Purple/Indigo**: `#3F4AFD` - Secondary interactive elements
- **Light Blue**: `#4D94FF` - Hover states, highlights

#### Success/Positive
- **Green (Primary)**: `#2ADBA9` - Success states, completed items
- **Green (Alt)**: `#22C761` - Alternative success indicator

#### Warning/Attention
- **Yellow**: `#F7E030` - Warning states
- **Amber**: `#CFBB1C` - Secondary warning

#### Error/Destructive
- **Red**: `#E24646` - Error states, delete actions
- **Orange**: `#F5875B` - Secondary error/alert

#### Neutral/Background
- **Near Black**: `#121315` - Primary text, dark backgrounds
- **Dark Gray**: `#222325` - Secondary backgrounds
- **Medium Gray**: `#2D2F33` - Borders, dividers
- **Light Gray**: `#909091` - Muted text, disabled states
- **Near White**: `#F9F9F9` - Light backgrounds, cards

---

## 📏 Typography Scale

### Font Families
- **Primary**: System fonts (appears to use default sans-serif)
- **Fallback**: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial

### Font Sizes (extracted from SVGs)
Based on the Calendr designs, here's the inferred scale:

```css
/* Headings */
--text-3xl: 30px;    /* Page titles */
--text-2xl: 24px;    /* Section headers */
--text-xl: 20px;     /* Card titles */
--text-lg: 18px;     /* Sub-headers */

/* Body */
--text-base: 16px;   /* Body text */
--text-sm: 14px;     /* Secondary text */
--text-xs: 12px;     /* Labels, captions */

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

---

## 📐 Spacing System

### Base Unit: 4px

```css
/* Spacing scale (4px base) */
--spacing-0: 0;
--spacing-1: 4px;
--spacing-2: 8px;
--spacing-3: 12px;
--spacing-4: 16px;
--spacing-5: 20px;
--spacing-6: 24px;
--spacing-8: 32px;
--spacing-10: 40px;
--spacing-12: 48px;
--spacing-16: 64px;
--spacing-20: 80px;
```

### Common Patterns
- **Card padding**: 16-24px
- **Button padding**: 12px 16px
- **Section gaps**: 24-32px
- **Grid gaps**: 8-16px

---

## 🔲 Border Radius

```css
--radius-sm: 4px;    /* Small elements, badges */
--radius-md: 8px;    /* Buttons, inputs, cards */
--radius-lg: 12px;   /* Modals, large cards */
--radius-xl: 16px;   /* Hero sections */
--radius-full: 9999px; /* Pills, avatars */
```

---

## 🧩 Component Patterns

### Calendar Grid
- **Layout**: 7-column grid (days of week)
- **Cell min-height**: 120px
- **Gap between cells**: 8-12px
- **Border**: 1px solid #2D2F33

### Appointment Cards
- **Border-left**: 3-4px colored accent
- **Padding**: 12px 16px
- **Border-radius**: 8px
- **Status colors**:
  - Scheduled: Orange (#F5875B)
  - Completed: Green (#2ADBA9)
  - Cancelled: Red (#E24646)

### Buttons
- **Height**: 40px (md), 48px (lg)
- **Padding**: 12px 24px
- **Border-radius**: 8px
- **States**:
  - Default: Primary color background
  - Hover: Lighten 10%
  - Active: Darken 5%
  - Disabled: Gray background, 50% opacity

### Modals/Dialogs
- **Max-width**: 600px (md), 900px (lg)
- **Padding**: 24px
- **Border-radius**: 12px
- **Shadow**: 0 20px 25px -5px rgba(0,0,0,0.1)

### Form Inputs
- **Height**: 40px
- **Padding**: 8px 12px
- **Border**: 1px solid #2D2F33
- **Border-radius**: 8px
- **Focus**: 2px ring, primary color

### Badges
- **Padding**: 4px 12px
- **Font-size**: 12px
- **Border-radius**: 4px
- **Font-weight**: 600

---

## 🎯 Mapping to FirefighterHub

### Color Token Mapping

```typescript
// src/index.css - UPDATE these values

:root {
  /* Calendr → FirefighterHub mapping */
  
  /* Primary (Interactive) */
  --primary: 210 85% 51%;        /* #196FEB from Calendr */
  --primary-foreground: 0 0% 98%;
  
  /* Success (Completed holds) */
  --success: 162 77% 52%;        /* #2ADBA9 from Calendr */
  --success-foreground: 0 0% 98%;
  
  /* Warning (Scheduled holds) */
  --warning: 47 95% 57%;         /* #F7E030 from Calendr */
  --warning-foreground: 0 0% 9%;
  
  /* Destructive (Cancel/Delete) */
  --destructive: 4 79% 58%;      /* #E24646 from Calendr */
  --destructive-foreground: 0 0% 98%;
  
  /* Neutral backgrounds */
  --background: 0 0% 100%;       /* Light mode */
  --foreground: 216 7% 7%;       /* #121315 from Calendr */
  --card: 0 0% 98%;              /* #F9F9F9 from Calendr */
  --card-foreground: 216 7% 7%;
  
  /* Muted/Secondary */
  --muted: 0 0% 96.1%;
  --muted-foreground: 0 0% 57%;  /* #909091 from Calendr */
  
  /* Borders */
  --border: 210 6% 18%;          /* #2D2F33 from Calendr */
  --input: 210 6% 18%;
  --ring: 210 85% 51%;
}

.dark {
  /* Dark mode - flip Calendr colors */
  --background: 216 7% 7%;       /* #121315 */
  --foreground: 0 0% 98%;        /* #F9F9F9 */
  --card: 210 6% 13%;            /* #222325 */
  --card-foreground: 0 0% 98%;
  
  --muted: 210 6% 18%;           /* #2D2F33 */
  --muted-foreground: 0 0% 57%;
  
  --border: 210 6% 18%;
  --input: 210 6% 18%;
}
```

### Typography Mapping

```typescript
// tailwind.config.js - UPDATE fontSize

export default {
  theme: {
    extend: {
      fontSize: {
        // Calendr-inspired scale
        'xs': ['12px', { lineHeight: '16px' }],
        'sm': ['14px', { lineHeight: '20px' }],
        'base': ['16px', { lineHeight: '24px' }],
        'lg': ['18px', { lineHeight: '28px' }],
        'xl': ['20px', { lineHeight: '28px' }],
        '2xl': ['24px', { lineHeight: '32px' }],
        '3xl': ['30px', { lineHeight: '36px' }],
      },
    },
  },
};
```

### Spacing System

```typescript
// tailwind.config.js - Calendr uses 4px base (already standard in Tailwind)

export default {
  theme: {
    extend: {
      spacing: {
        // Already have 4px base, these are standard:
        // 1: '4px', 2: '8px', 3: '12px', 4: '16px'
        // 5: '20px', 6: '24px', 8: '32px', etc.
      },
    },
  },
};
```

### Border Radius

```typescript
// tailwind.config.js - UPDATE borderRadius

export default {
  theme: {
    extend: {
      borderRadius: {
        'sm': '4px',   // Calendr badges
        'md': '8px',   // Calendr cards, buttons
        'lg': '12px',  // Calendr modals
        'xl': '16px',  // Calendr large containers
      },
    },
  },
};
```

---

## 📦 Component Updates Needed

### 1. Calendar Grid Enhancement
**File**: `src/features/schedule/components/Calendar.tsx`

**Changes**:
```tsx
// Apply Calendr visual style
<div className="grid grid-cols-7 gap-3">
  {days.map(day => (
    <Card className="min-h-[120px] p-3 border border-border hover:border-primary/50 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <span className="text-sm font-semibold text-foreground">
          {day.number}
        </span>
        {day.hasAppointments && (
          <Badge variant="secondary" className="h-5 px-2 text-xs">
            {day.count}
          </Badge>
        )}
      </div>
      <div className="space-y-1">
        {day.appointments.map(apt => (
          <AppointmentPill appointment={apt} />
        ))}
      </div>
    </Card>
  ))}
</div>
```

### 2. Appointment Cards
**File**: `src/features/schedule/components/calendar/AppointmentPill.tsx` (NEW)

```tsx
export function AppointmentPill({ appointment }: { appointment: ScheduledHold }) {
  const statusColors = {
    scheduled: 'border-l-warning bg-warning/10',
    completed: 'border-l-success bg-success/10',
    skipped: 'border-l-destructive bg-destructive/10',
  };

  return (
    <div className={`
      px-2 py-1 rounded-md border-l-4 text-xs
      ${statusColors[appointment.status]}
      hover:bg-opacity-20 transition-colors cursor-pointer
    `}>
      <div className="font-medium truncate">
        {appointment.firefighter_name}
      </div>
      <div className="text-muted-foreground text-[10px]">
        {appointment.duration}
      </div>
    </div>
  );
}
```

### 3. Detail Modal Redesign
**File**: `src/features/schedule/components/calendar/DayModal.tsx`

**Update layout** to match Calendr Screen 21:
```tsx
<Dialog>
  <DialogContent className="max-w-2xl">
    <DialogHeader>
      <DialogTitle>Hold Details</DialogTitle>
    </DialogHeader>
    
    <div className="space-y-6">
      {/* Header with name and status */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-semibold">{hold.firefighter_name}</h3>
          <p className="text-sm text-muted-foreground">
            {format(hold.hold_date, 'EEEE, MMMM d, yyyy')}
          </p>
        </div>
        <Badge 
          variant={hold.status === 'completed' ? 'success' : 'warning'}
          className="px-3 py-1"
        >
          {hold.status}
        </Badge>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-2 gap-4">
        <InfoCard label="Duration" value={hold.duration} icon={<Clock />} />
        <InfoCard label="Station" value={hold.fire_station} icon={<Building />} />
        <InfoCard label="Shift" value={hold.shift} icon={<Users />} />
        <InfoCard label="Type" value={hold.is_voluntary ? 'Voluntary' : 'Rotation'} />
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-end pt-4 border-t">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button variant="destructive" onClick={onCancel}>
          Cancel Hold
        </Button>
      </div>
    </div>
  </DialogContent>
</Dialog>
```

### 4. Empty State
**File**: `src/features/schedule/components/calendar/EmptyCalendarState.tsx` (NEW)

```tsx
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyCalendarState({ onScheduleHold }: { onScheduleHold: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="rounded-full bg-muted p-8 mb-6">
        <CalendarIcon className="w-16 h-16 text-muted-foreground" />
      </div>
      <h3 className="text-2xl font-semibold mb-3">No holds scheduled</h3>
      <p className="text-muted-foreground text-center max-w-md mb-8">
        Get started by scheduling a hold for your shift members.
        Holds will appear on the calendar once created.
      </p>
      <Button size="lg" onClick={onScheduleHold}>
        <CalendarIcon className="w-4 h-4 mr-2" />
        Schedule Hold
      </Button>
    </div>
  );
}
```

---

## 🚀 Implementation Plan

### Phase 1: Update Design Tokens (30 min)
- [ ] Update colors in `src/index.css`
- [ ] Update border-radius in `tailwind.config.js`
- [ ] Test light/dark mode with new colors
- [ ] Verify contrast ratios (WCAG AA)

### Phase 2: Update Existing Components (2-3 hours)
- [ ] Enhance Calendar grid layout
- [ ] Update appointment card styling
- [ ] Redesign detail modal
- [ ] Add empty state component
- [ ] Update button styles
- [ ] Update badge variants

### Phase 3: New Components (2-3 hours)
- [ ] Create AppointmentPill component
- [ ] Create EmptyCalendarState component
- [ ] Create InfoCard component (for modals)
- [ ] Add loading states
- [ ] Add error states

### Phase 4: Polish & Testing (1-2 hours)
- [ ] Test all components in light/dark mode
- [ ] Verify responsive behavior
- [ ] Check accessibility (keyboard nav, screen readers)
- [ ] Test on mobile devices
- [ ] Verify with actual hold data

---

## 📊 Before/After Comparison

### Current FirefighterHub
- ✅ Functional calendar grid
- ⚠️ Basic styling
- ⚠️ Limited visual hierarchy
- ⚠️ Simple appointment display

### After Calendr Integration
- ✅ Modern card-based calendar
- ✅ Clear visual hierarchy
- ✅ Rich appointment cards
- ✅ Professional modal designs
- ✅ Empty states
- ✅ Consistent spacing/colors
- ✅ Better status indicators

---

## 🎨 Color Usage Guide

### When to Use Each Color

**Primary Blue (`#196FEB`)**:
- Primary buttons
- Links
- Active states
- Selected items
- Focus indicators

**Success Green (`#2ADBA9`)**:
- Completed holds
- Success messages
- Positive status indicators
- "Complete" action buttons

**Warning Yellow (`#F7E030`)**:
- Scheduled holds
- Pending states
- Important notices
- Caution messages

**Destructive Red (`#E24646`)**:
- Skipped/cancelled holds
- Delete buttons
- Error messages
- Destructive actions

**Neutral Grays**:
- Borders: `#2D2F33`
- Disabled states: `#909091`
- Secondary text: `#909091`
- Backgrounds: `#F9F9F9` / `#121315`

---

## ✅ Next Steps

1. **Review this design system** - Does it match what you see in the Calendr designs?
2. **Start with Phase 1** - Update color tokens
3. **Build one component** - Pick Calendar grid or Detail modal
4. **Iterate** - Refine based on visual comparison
5. **Apply pattern** - Roll out to remaining components

**Ready to start implementation?** I can help with any phase!
