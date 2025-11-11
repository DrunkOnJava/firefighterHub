# Calendr Design Integration Plan

## Extracted Designs
**Location**: `docs/figma-designs/` (13 SVG files)  
**Source**: Calendr - Booking Service Appointment Dashboard2

---

## 📋 Design Screens Overview

### Core Calendar Views
1. **19. Calendar - Empty state.svg** - No appointments
2. **20. Calendar - Fill state.svg** - Populated calendar
3. **21. Calendar - View Detail.svg** - Detail modal

### Management
4. **22. Calendar - Request a cancel success.svg** - Success state

### Multi-Step Booking Flow
5. **23. Calendar - Create new services for client inactive.svg**
6. **24. Calendar - Create new services customer for client information filled.svg**
7. **25. Calendar - Create new services customer for client Select a services.svg**
8. **26. Calendar - Create new services customer for client Services selected.svg**
9. **27. Calendar - Create new services customer for client select a date.svg**
10. **28. Calendar - Create new services customer for client selected a date.svg**
11. **29. Calendar - Create new services customer for client select a time.svg**
12. **30. Calendar - Create new services customer for client filled.svg**
13. **31. Calendar - Add event succsees.svg**

---

## 🎯 Integration Strategy

### Phase 1: Analyze & Extract Patterns (Now)

**Open the SVG files in a browser or Figma:**
```bash
# View designs
open docs/figma-designs/*.svg

# Or open in browser
open -a "Google Chrome" "docs/figma-designs/20. Calendar - Fill state.svg"
```

**What to extract:**
1. **Color palette** - Note all colors used
2. **Typography** - Font sizes, weights, families
3. **Spacing** - Padding, margins, gaps
4. **Component structure** - Layout patterns
5. **Interactions** - Button states, hover effects

### Phase 2: Map to FirefighterHub Components

#### Calendar Grid Enhancement
**Current**: `src/features/schedule/components/Calendar.tsx`  
**Calendr Design**: Screen 20 (Fill state)

**Changes Needed:**
```tsx
// Add these features from Calendr design:
- Modern card-based appointment display
- Better empty state (Screen 19)
- Time indicators
- Status badges (scheduled/completed/cancelled)
- Hover states for days
```

**Implementation:**
```tsx
// src/features/schedule/components/calendar/ModernCalendarGrid.tsx
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ModernCalendarGrid() {
  return (
    <div className="grid grid-cols-7 gap-2">
      {days.map(day => (
        <Card key={day.date} className="min-h-[120px] p-2">
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium">{day.number}</span>
            {day.appointments.length > 0 && (
              <Badge variant="secondary" size="sm">
                {day.appointments.length}
              </Badge>
            )}
          </div>
          <div className="mt-2 space-y-1">
            {day.appointments.map(apt => (
              <AppointmentPill key={apt.id} appointment={apt} />
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
```

#### Appointment Detail Modal
**Current**: `src/features/schedule/components/calendar/DayModal.tsx`  
**Calendr Design**: Screen 21 (View Detail)

**Update the modal layout:**
```tsx
// src/features/schedule/components/calendar/AppointmentDetailModal.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function AppointmentDetailModal({ appointment, onClose }) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Appointment Details</DialogTitle>
        </DialogHeader>
        
        {/* Layout from Calendr Screen 21 */}
        <div className="space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold">{appointment.firefighter_name}</h3>
              <p className="text-sm text-muted-foreground">
                {format(appointment.hold_date, 'EEEE, MMMM d, yyyy')}
              </p>
            </div>
            <Badge variant={appointment.status === 'completed' ? 'success' : 'warning'}>
              {appointment.status}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InfoCard label="Duration" value={appointment.duration} />
            <InfoCard label="Station" value={appointment.fire_station} />
            <InfoCard label="Shift" value={appointment.shift} />
            <InfoCard label="Type" value={appointment.is_voluntary ? 'Voluntary' : 'Rotation'} />
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>Close</Button>
            <Button variant="destructive" onClick={() => onCancel(appointment.id)}>
              Cancel Appointment
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

#### Empty State Component
**Calendr Design**: Screen 19

```tsx
// src/features/schedule/components/calendar/EmptyCalendarState.tsx
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyCalendarState({ onAddAppointment }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="rounded-full bg-muted p-6 mb-4">
        <CalendarIcon className="w-12 h-12 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No holds scheduled</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">
        Get started by scheduling a hold for your shift members.
      </p>
      <Button onClick={onAddAppointment}>
        Schedule Hold
      </Button>
    </div>
  );
}
```

#### Multi-Step Booking Wizard (NEW)
**Calendr Design**: Screens 23-31

This is a new feature we need to create:

```tsx
// src/features/schedule/components/wizard/HoldBookingWizard.tsx
import { useState } from 'react';
import { Card } from "@/components/ui/card";

type Step = 'info' | 'service' | 'date' | 'time' | 'confirm';

export function HoldBookingWizard({ onComplete, onCancel }) {
  const [step, setStep] = useState<Step>('info');
  const [formData, setFormData] = useState({});

  return (
    <Card className="max-w-3xl mx-auto p-6">
      {/* Progress indicator */}
      <WizardProgress currentStep={step} />

      {/* Step content */}
      {step === 'info' && <StepInfo onNext={(data) => {
        setFormData({...formData, ...data});
        setStep('service');
      }} />}

      {step === 'service' && <StepServiceSelection onNext={(data) => {
        setFormData({...formData, ...data});
        setStep('date');
      }} />}

      {step === 'date' && <StepDateSelection onNext={(data) => {
        setFormData({...formData, ...data});
        setStep('time');
      }} />}

      {step === 'time' && <StepTimeSelection onNext={(data) => {
        setFormData({...formData, ...data});
        setStep('confirm');
      }} />}

      {step === 'confirm' && <StepConfirmation 
        data={formData}
        onConfirm={async () => {
          await onComplete(formData);
          // Show success (Screen 31)
        }}
      />}
    </Card>
  );
}
```

---

## 🎨 Design Tokens to Extract

### Colors (from Calendr SVGs)
Open the SVG files and identify:
- Primary color (likely blue)
- Success color (green)
- Warning color (orange/yellow)
- Danger color (red)
- Background colors
- Text colors
- Border colors

**Map to FirefighterHub tokens:**
```typescript
// Already have these defined in src/index.css
--primary: (map Calendr primary here)
--warning: (map Calendr warning here)
--success: (map Calendr success here)
--destructive: (map Calendr danger here)
```

### Typography
- Heading sizes (h1-h6)
- Body text sizes
- Font weights
- Line heights

### Spacing Scale
- Between cards
- Within cards (padding)
- Between elements (gap)

### Border Radius
- Card corners
- Button corners
- Badge corners

---

## 🔨 Implementation Checklist

### Step 1: Visual Analysis (15 min)
- [ ] Open all 13 SVG files in browser
- [ ] Screenshot key components
- [ ] Note color values (inspect SVG with DevTools)
- [ ] Identify font sizes and spacing

### Step 2: Extract Design Tokens (30 min)
- [ ] Create color palette
- [ ] Document typography scale
- [ ] Measure spacing values
- [ ] Note border radius values

### Step 3: Component Planning (45 min)
- [ ] List components to update
- [ ] List components to create new
- [ ] Map Calendr → FirefighterHub components
- [ ] Identify reusable patterns

### Step 4: Implementation Priority

**High Priority** (Core calendar improvements):
1. ✅ Enhanced calendar grid (Screen 20)
2. ✅ Appointment detail modal (Screen 21)
3. ✅ Empty state (Screen 19)
4. ✅ Status badges redesign

**Medium Priority** (UX improvements):
5. ⏳ Cancellation flow (Screen 22)
6. ⏳ Better appointment cards
7. ⏳ Loading states

**Low Priority** (New features):
8. ⏳ Multi-step booking wizard (Screens 23-31)
9. ⏳ Service type selection
10. ⏳ Time slot picker

---

## 📦 File Structure

```
src/features/schedule/components/
├── calendar/
│   ├── ModernCalendarGrid.tsx          // Enhanced grid from Screen 20
│   ├── EmptyCalendarState.tsx          // From Screen 19
│   ├── AppointmentDetailModal.tsx      // From Screen 21
│   ├── AppointmentPill.tsx             // Small appointment card
│   └── CancellationFlow.tsx            // From Screen 22
├── wizard/                              // NEW - Multi-step booking
│   ├── HoldBookingWizard.tsx           // Main wizard
│   ├── WizardProgress.tsx              // Step indicator
│   ├── steps/
│   │   ├── StepInfo.tsx                // Screen 24
│   │   ├── StepServiceSelection.tsx    // Screens 25-26
│   │   ├── StepDateSelection.tsx       // Screens 27-28
│   │   ├── StepTimeSelection.tsx       // Screen 29
│   │   └── StepConfirmation.tsx        // Screen 30
│   └── SuccessMessage.tsx              // Screen 31
```

---

## 🚀 Next Steps

### Option A: Manual Inspection
```bash
# Open SVG files to analyze
open docs/figma-designs/*.svg

# Use browser DevTools to inspect:
# - Colors (fill, stroke attributes)
# - Dimensions (width, height, viewBox)
# - Layout structure (SVG groups)
```

### Option B: Use Figma Plugin
Since you have the .fig file, you can:
1. Open it in Figma
2. Use Locofy/Quest plugin
3. Export React components
4. Share the code with me for integration

### Option C: Share Screenshots
If you can share screenshots of the key screens, I can:
1. Recreate components using your existing design system
2. Match the visual design
3. Ensure consistency with FirefighterHub patterns

---

## 💡 Recommendation

**Best approach for quick integration:**

1. **Open 3 key screens** in browser:
   - Screen 19 (Empty state)
   - Screen 20 (Fill state)
   - Screen 21 (Detail modal)

2. **Use browser DevTools** to inspect SVG:
   - Right-click → Inspect
   - Find `<rect>`, `<text>`, `<path>` elements
   - Copy color values, sizes, positions

3. **Share screenshots or descriptions** with me:
   - I'll recreate using shadcn/ui
   - Match your existing color tokens
   - Ensure TypeScript types
   - Test dark mode

4. **Iterate**:
   - Review implementation
   - Adjust as needed
   - Add to FirefighterHub

Ready to start? Which screen should we tackle first?
