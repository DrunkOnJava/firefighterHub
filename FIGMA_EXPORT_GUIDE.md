# Figma to FirefighterHub Export Guide

## Design File
**Name**: Calendr - Booking Service Appointment Dashboard2  
**Dev Mode Link**: https://www.figma.com/design/8L0zhKw7kJUVftw0IjkS7K/Calendr---Booking-Service-Appointment-Dashboard2?node-id=47-2677&m=dev&t=XxowwzEjgpP0hJyN-1

---

## Method 1: Figma Dev Mode (Manual, Most Control)

### Step 1: Navigate in Figma
1. Open the Dev Mode link above
2. You should see the "Inspect" panel on the right
3. Click on any component to see its properties

### Step 2: Extract CSS from Dev Mode
For each component:
1. Select the element in Figma
2. Dev Mode panel shows:
   - **CSS** - Copy these styles
   - **Properties** - Width, height, padding, margins
   - **Colors** - Hex codes or RGB values
   - **Typography** - Font size, weight, line height

### Step 3: Convert to Tailwind
Figma Dev Mode gives you CSS, but we need Tailwind classes.

**CSS → Tailwind Conversion:**
```css
/* Figma gives you: */
width: 320px;
height: 48px;
padding: 12px 16px;
background: #3B82F6;
border-radius: 8px;

/* Convert to Tailwind: */
className="w-80 h-12 px-4 py-3 bg-blue-500 rounded-lg"
```

### Step 4: Map to shadcn/ui Components
Don't recreate everything from scratch! Use existing shadcn/ui:

| Figma Component | shadcn/ui Component | FirefighterHub Location |
|----------------|---------------------|-------------------------|
| Button | `Button` | `@/components/ui/button` |
| Input field | `Input` | `@/components/ui/input` |
| Card container | `Card` | `@/components/ui/card` |
| Calendar grid | `Calendar` | Already exists in `@/features/schedule/` |
| Modal/Dialog | `Dialog` | `@/components/ui/dialog` |
| Dropdown | `Select` | `@/components/ui/select` |
| Badge/Pill | `Badge` | `@/components/ui/badge` |

---

## Method 2: Using Figma Plugins (Automated)

### Option A: Locofy Lightning (Recommended)

**Install:**
1. In Figma: `Plugins` → `Find more plugins` → Search "Locofy Lightning"
2. Install the plugin

**Export Process:**
1. Select the frame/screen you want (e.g., "Dashboard View")
2. Right-click → `Plugins` → `Locofy Lightning`
3. In Locofy panel:
   - Click **"Tag Components"** (auto-detects buttons, inputs, etc.)
   - Review tags - adjust if needed
   - Click **"Export Code"**
4. Configure export:
   ```
   Framework: React
   Language: TypeScript
   Styling: Tailwind CSS
   State Management: None (we use React hooks)
   ```
5. Click **"Export"** → Downloads a .zip file

**What You Get:**
```
locofy-export/
├── components/
│   ├── DashboardView.tsx
│   ├── CalendarGrid.tsx
│   ├── AppointmentCard.tsx
│   └── ...
├── styles/
│   └── tailwind.config.js (you can merge with ours)
└── assets/
    └── (SVG icons, images)
```

### Option B: Quest AI Plugin

**Install:**
1. In Figma: `Plugins` → Search "Quest"
2. Install and authorize

**Export:**
1. Select frames
2. Open Quest plugin
3. Click **"Generate Code"**
4. Choose: React + TypeScript + Tailwind
5. Download components

---

## Method 3: Figma to Code (CLI Tool - For Bulk Export)

**Install:**
```bash
npm install -g @figma-export/cli
```

**Configure:**
```bash
# Create config file
cat > .figmaexportrc.json << EOF
{
  "fileId": "8L0zhKw7kJUVftw0IjkS7K",
  "token": "YOUR_FIGMA_TOKEN",
  "output": "./figma-exports"
}
EOF
```

**Get Figma Token:**
1. Figma → Settings → Personal Access Tokens
2. Generate new token
3. Copy to config above

**Run Export:**
```bash
figma-export use-config .figmaexportrc.json
```

---

## Integration with FirefighterHub

### After Exporting, Follow These Steps:

#### 1. Review Exported Components
```bash
# Examine the exported code
cd path/to/exported/components
ls -la
```

#### 2. Map to Feature Structure
Move components to appropriate locations:

```bash
# Example mapping:
exported/DashboardView.tsx → src/features/dashboard/components/DashboardView.tsx
exported/CalendarGrid.tsx  → src/features/schedule/components/calendar/BookingCalendar.tsx
exported/AppointmentCard.tsx → src/features/schedule/components/AppointmentCard.tsx
```

#### 3. Replace Plugin Components with shadcn/ui
Exported plugins often use generic components. Replace with our design system:

**Before (Locofy export):**
```tsx
<div className="flex items-center justify-center w-32 h-10 bg-blue-500 rounded">
  Book Now
</div>
```

**After (FirefighterHub style):**
```tsx
import { Button } from "@/components/ui/button";

<Button variant="default" size="md">
  Book Now
</Button>
```

#### 4. Update Imports
```tsx
// Change generic imports
import { Calendar } from "../components/Calendar";

// To FirefighterHub structure
import { Calendar } from "@/features/schedule/components/Calendar";
```

#### 5. Add TypeScript Types
```tsx
import { Firefighter, ScheduledHold, Shift } from "@/lib/supabase";

interface AppointmentCardProps {
  appointment: ScheduledHold;
  firefighter: Firefighter;
  onEdit?: (id: string) => void;
  onCancel?: (id: string) => void;
}
```

#### 6. Connect to Supabase
Replace mock data with real queries:

```tsx
// Exported code might have:
const appointments = mockData;

// Change to:
const { data: appointments } = await supabase
  .from('scheduled_holds')
  .select('*')
  .eq('shift', currentShift);
```

---

## Quick Reference: Component Mapping

### Booking Dashboard Components → FirefighterHub Equivalents

| Figma Component | Create As | Location |
|----------------|-----------|----------|
| **Calendar View** | Enhance existing | `src/features/schedule/components/Calendar.tsx` |
| **Time Slot Picker** | New component | `src/features/schedule/components/TimeSlotPicker.tsx` |
| **Booking Card** | Adapt from HoldCard | `src/features/schedule/components/AppointmentCard.tsx` |
| **Status Badge** | Use shadcn Badge | `@/components/ui/badge` |
| **Filter Panel** | Adapt existing | `src/components/layout/FilterPanel.tsx` |
| **Header Nav** | Adapt existing | `src/components/layout/Header.tsx` |

---

## Color Mapping: Figma → FirefighterHub Tokens

When you export, replace hardcoded colors with semantic tokens:

```tsx
// Figma export might give:
className="bg-blue-500"

// Use our semantic tokens instead:
className="bg-primary"        // Interactive elements
className="bg-warning"        // Scheduled items (orange)
className="bg-success"        // Completed items (green)
className="bg-destructive"    // Errors/cancel actions
```

**Our Color System:**
- `primary` - Main brand color (blue)
- `warning` - Scheduled/pending (orange)
- `success` - Completed/confirmed (green)
- `destructive` - Errors/delete (red)
- `muted` - Secondary text
- `card` - Card backgrounds

---

## Testing After Import

1. **Build Check:**
```bash
pnpm typecheck
pnpm build
```

2. **Visual Verification:**
```bash
pnpm dev
# Open http://localhost:5173
# Test in light/dark mode
```

3. **Responsive Test:**
```bash
# Test at different viewports:
# - Mobile: 375px
# - Tablet: 768px
# - Desktop: 1920px
```

---

## Tips for Best Results

### ✅ DO:
- Use shadcn/ui components instead of custom divs
- Follow existing FirefighterHub patterns
- Use semantic color tokens
- Add proper TypeScript types
- Test dark mode compatibility
- Maintain accessibility (ARIA labels, keyboard nav)

### ❌ DON'T:
- Copy absolute positioning (use Flexbox/Grid)
- Use hardcoded colors (use tokens)
- Import external dependencies (use existing)
- Skip TypeScript types
- Forget mobile responsiveness
- Ignore existing patterns

---

## Need Help?

If you run into issues:
1. Share the exported component code
2. Describe what's not matching the design
3. I can help refactor to match FirefighterHub patterns

---

## Next Steps

1. Choose your export method (recommend Locofy)
2. Export the components
3. Share the exported code with me
4. I'll help integrate it properly into FirefighterHub

Ready to proceed? Let me know which export method you'd like to use!
