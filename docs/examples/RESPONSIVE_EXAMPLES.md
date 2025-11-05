# Responsive Design Examples

Practical code examples demonstrating the responsive design strategy in FirefighterHub.

## Table of Contents

1. [Basic Patterns](#basic-patterns)
2. [Component Examples](#component-examples)
3. [Real-World Scenarios](#real-world-scenarios)
4. [Anti-Patterns](#anti-patterns)

## Basic Patterns

### Pattern 1: Progressive Text Visibility

Show abbreviated content on mobile, full content on larger screens.

```tsx
import { tokens } from '@/styles';

// ✅ Good: Button with responsive label
export function ResponsiveButton() {
  return (
    <button className={`${tokens.spacing.card.md} ${tokens.borders.radius.lg}`}>
      <Plus className={tokens.icons.sm} />
      <span className="hidden sm:inline">Add New Member</span>
      <span className="sm:hidden">Add</span>
    </button>
  );
}

// ✅ Good: Icon-only on mobile, with label on tablet+
export function CompactButton() {
  return (
    <button className={`${tokens.spacing.card.md} ${tokens.borders.radius.lg}`}>
      <Calendar className={tokens.icons.sm} />
      <span className="hidden sm:inline">View Calendar</span>
    </button>
  );
}
```

### Pattern 2: Responsive Layout Direction

Stack on mobile, side-by-side on desktop.

```tsx
// ✅ Good: Vertical on mobile, horizontal on desktop
export function ResponsiveContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      {children}
    </div>
  );
}

// Usage example
export function PageHeader() {
  return (
    <ResponsiveContainer>
      <div>
        <h1 className={tokens.typography.heading.h1}>Dashboard</h1>
        <p className={tokens.typography.body.secondary}>Manage your shift rotation</p>
      </div>
      <div className="flex gap-3">
        <Button>Action 1</Button>
        <Button>Action 2</Button>
      </div>
    </ResponsiveContainer>
  );
}
```

### Pattern 3: Responsive Grid Columns

Progressive column expansion as screen size increases.

```tsx
// ✅ Good: 1 column → 2 columns → 3 columns
export function ResponsiveGrid({ items }: { items: Item[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map(item => (
        <GridItem key={item.id} {...item} />
      ))}
    </div>
  );
}

// ✅ Good: Form fields with responsive columns
export function ResponsiveForm() {
  return (
    <form className="space-y-6">
      {/* Main fields - 2 columns on tablet+ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="First Name" name="firstName" />
        <FormField label="Last Name" name="lastName" />
        <FormField label="Email" name="email" />
        <FormField label="Phone" name="phone" />
      </div>

      {/* Checkboxes - 2 columns mobile, 4 columns tablet+ */}
      <div>
        <label className={tokens.typography.body.primary}>Certifications</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
          <Checkbox label="Engine" />
          <Checkbox label="Truck" />
          <Checkbox label="Rescue" />
          <Checkbox label="Brush" />
        </div>
      </div>
    </form>
  );
}
```

### Pattern 4: Responsive Typography

Scale text size progressively for better readability.

```tsx
// ✅ Good: Using design tokens with responsive scaling
export function ResponsiveHeading({ children }: { children: React.ReactNode }) {
  return (
    <h1 className={tokens.typography.heading.h1}>
      {children}
    </h1>
  );
  // Renders: text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight
  // 24px → 30px → 36px
}

// ✅ Good: Subheading with responsive scaling
export function ResponsiveSubheading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className={tokens.typography.heading.h2}>
      {children}
    </h2>
  );
  // Renders: text-xl sm:text-2xl font-semibold leading-snug
  // 20px → 24px
}
```

### Pattern 5: Responsive Spacing

Adjust padding/margin based on available space.

```tsx
// ✅ Good: Card with responsive padding
export function ResponsiveCard({ children }: { children: React.ReactNode }) {
  return (
    <div className={`
      ${tokens.spacing.card.md} 
      lg:${tokens.spacing.card.lg}
      ${tokens.borders.radius.xl}
      ${colors.structural.bg.card}
    `}>
      {children}
    </div>
  );
  // Mobile: p-4 (16px)
  // Desktop: p-5 (20px)
}

// ✅ Good: Page container with responsive padding
export function PageContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
      {children}
    </div>
  );
}
```

## Component Examples

### Example 1: Responsive Calendar Header

```tsx
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { tokens } from '@/styles';

export function CalendarHeader({ 
  month, 
  year, 
  onPrevMonth, 
  onNextMonth 
}: CalendarHeaderProps) {
  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Title with responsive size */}
      <h2 className={tokens.typography.heading.h2}>
        {month} {year}
      </h2>

      {/* Navigation with responsive spacing */}
      <div className="flex items-center justify-center gap-2 sm:gap-6">
        <button
          onClick={onPrevMonth}
          className={`
            ${tokens.spacing.card.md}
            ${tokens.borders.radius.lg}
            ${tokens.touchTarget.min}
          `}
          aria-label="Previous month"
        >
          <ChevronLeft className={tokens.icons.md} />
        </button>

        <span className={tokens.typography.body.primary}>
          Navigate Months
        </span>

        <button
          onClick={onNextMonth}
          className={`
            ${tokens.spacing.card.md}
            ${tokens.borders.radius.lg}
            ${tokens.touchTarget.min}
          `}
          aria-label="Next month"
        >
          <ChevronRight className={tokens.icons.md} />
        </button>
      </div>
    </div>
  );
}
```

### Example 2: Responsive Navigation Header

```tsx
import { Menu, UserPlus, Clock, HelpCircle } from 'lucide-react';
import { tokens } from '@/styles';

export function AppHeader({
  onOpenMobileMenu,
  onQuickAdd,
  onActivityLog,
  onHelp,
}: AppHeaderProps) {
  return (
    <header className={`
      border-b backdrop-blur-sm sticky top-0
      ${tokens.zIndex.sticky}
      ${tokens.shadows.lg}
      px-4 sm:px-6 ${tokens.spacing.section.sm}
    `}>
      <div className="flex items-center justify-between gap-4">
        {/* Logo & Title */}
        <div className="flex items-center gap-4">
          <img src="/logo.png" alt="Logo" className="w-10 h-10" />
          <h1 className="text-xl font-bold">
            <span className="hidden sm:inline">FirefighterHub</span>
            <span className="sm:hidden">FFHub</span>
          </h1>
        </div>

        {/* Desktop Navigation - Hidden on mobile */}
        <div className="hidden lg:flex items-center gap-3">
          <button onClick={onQuickAdd} className={tokens.touchTarget.min}>
            <UserPlus className={tokens.icons.sm} />
            <span className="hidden md:inline">Add Member</span>
          </button>
          <button onClick={onActivityLog} className={tokens.touchTarget.min}>
            <Clock className={tokens.icons.sm} />
            <span>Activity Log</span>
          </button>
          <button onClick={onHelp} className={tokens.touchTarget.min}>
            <HelpCircle className={tokens.icons.sm} />
            <span>Help</span>
          </button>
        </div>

        {/* Mobile Menu Button - Hidden on desktop */}
        <div className="lg:hidden">
          <button 
            onClick={onOpenMobileMenu}
            className={tokens.touchTarget.min}
            aria-label="Open menu"
          >
            <Menu className={tokens.icons.md} />
          </button>
        </div>
      </div>
    </header>
  );
}
```

### Example 3: Responsive Modal

```tsx
import { X } from 'lucide-react';
import { tokens } from '@/styles';

export function ResponsiveModal({
  isOpen,
  onClose,
  title,
  children,
}: ResponsiveModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal - Responsive width and padding */}
      <div className={`
        relative w-full max-w-md sm:max-w-lg lg:max-w-2xl
        bg-slate-800 ${tokens.borders.radius['2xl']} ${tokens.shadows['2xl']}
      `}>
        {/* Header - Responsive padding */}
        <div className={`
          flex items-center justify-between
          ${tokens.spacing.modal.md} sm:${tokens.spacing.modal.lg}
          border-b border-slate-700
        `}>
          <h2 className={tokens.typography.heading.h3}>{title}</h2>
          <button
            onClick={onClose}
            className={tokens.touchTarget.min}
            aria-label="Close modal"
          >
            <X className={tokens.icons.md} />
          </button>
        </div>

        {/* Content - Responsive padding */}
        <div className={`${tokens.spacing.modal.md} sm:${tokens.spacing.modal.lg}`}>
          {children}
        </div>
      </div>
    </div>
  );
}
```

### Example 4: Responsive Card Grid

```tsx
import { Users, Calendar, BarChart3 } from 'lucide-react';
import { tokens } from '@/styles';

export function DashboardStats() {
  const stats = [
    { icon: Users, label: 'Active Members', value: '42' },
    { icon: Calendar, label: 'Scheduled Holds', value: '8' },
    { icon: BarChart3, label: 'Completion Rate', value: '94%' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
      {stats.map(({ icon: Icon, label, value }) => (
        <div
          key={label}
          className={`
            ${tokens.spacing.card.md} lg:${tokens.spacing.card.lg}
            ${tokens.borders.radius.xl}
            bg-slate-800
            ${tokens.shadows.sm}
          `}
        >
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <Icon className={`${tokens.icons.xl} text-blue-500`} />
            </div>
            <div>
              <p className={`${tokens.typography.body.secondary} text-slate-400`}>
                {label}
              </p>
              <p className="text-3xl font-bold text-slate-50">{value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
```

## Real-World Scenarios

### Scenario 1: Responsive Table/List View

Switch between table view on desktop and card view on mobile.

```tsx
import { tokens } from '@/styles';

export function ResponsiveFirefighterList({ firefighters }: Props) {
  return (
    <>
      {/* Desktop Table View - Hidden on mobile */}
      <div className="hidden lg:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Station</th>
              <th className="text-left p-3">Shift</th>
              <th className="text-left p-3">Last Hold</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {firefighters.map(ff => (
              <tr key={ff.id} className="border-b border-slate-800">
                <td className="p-3">{ff.name}</td>
                <td className="p-3">Station {ff.station}</td>
                <td className="p-3">
                  <ShiftBadge shift={ff.shift} />
                </td>
                <td className="p-3">{formatDate(ff.last_hold_date)}</td>
                <td className="p-3">
                  <button>Actions</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View - Hidden on desktop */}
      <div className="lg:hidden space-y-3">
        {firefighters.map(ff => (
          <div
            key={ff.id}
            className={`
              ${tokens.spacing.card.md}
              ${tokens.borders.radius.xl}
              bg-slate-800
            `}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className={tokens.typography.heading.h4}>{ff.name}</h3>
                <p className={tokens.typography.body.secondary}>
                  Station {ff.station}
                </p>
              </div>
              <ShiftBadge shift={ff.shift} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">
                Last Hold: {formatDate(ff.last_hold_date)}
              </span>
              <button className={tokens.touchTarget.min}>Actions</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
```

### Scenario 2: Responsive Sidebar Layout

Hide sidebar on mobile/tablet, show on desktop XL.

```tsx
import { useState } from 'react';
import { tokens } from '@/styles';

export function ResponsiveLayout({ children }: { children: React.ReactNode }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar - Hidden below xl: breakpoint */}
      <aside className="hidden xl:block w-64 border-r border-slate-800">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar - Overlay, controlled by state */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-40 xl:hidden">
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-slate-900">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">
        {/* Mobile menu button - Hidden on xl: */}
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="xl:hidden m-4"
        >
          Open Menu
        </button>

        {children}
      </main>
    </div>
  );
}
```

### Scenario 3: Responsive Calendar Day Names

Show full day names on tablet+, abbreviated on mobile.

```tsx
import { tokens } from '@/styles';

const WEEKDAYS = [
  { full: 'Sunday', abbr: 'Sun' },
  { full: 'Monday', abbr: 'Mon' },
  { full: 'Tuesday', abbr: 'Tue' },
  { full: 'Wednesday', abbr: 'Wed' },
  { full: 'Thursday', abbr: 'Thu' },
  { full: 'Friday', abbr: 'Fri' },
  { full: 'Saturday', abbr: 'Sat' },
];

export function CalendarWeekdayHeader() {
  return (
    <div className={`grid grid-cols-7 ${tokens.spacing.gap.sm} mb-3`}>
      {WEEKDAYS.map(({ full, abbr }) => (
        <div
          key={full}
          className={`
            text-center font-semibold
            ${tokens.typography.body.secondary}
            text-slate-400
          `}
        >
          {/* Full name on tablet+, abbreviated on mobile */}
          <span className="hidden sm:inline">{full}</span>
          <span className="sm:hidden">{abbr}</span>
        </div>
      ))}
    </div>
  );
}
```

## Anti-Patterns

### ❌ Anti-Pattern 1: Too Many Breakpoints

```tsx
// ❌ BAD: Overly complex, hard to maintain
<div className="p-2 sm:p-3 md:p-4 lg:p-5 xl:p-6 2xl:p-8">
  Content
</div>

// ✅ GOOD: Simple, maintainable
<div className="p-4 lg:p-6">
  Content
</div>
```

### ❌ Anti-Pattern 2: Inconsistent Breakpoints

```tsx
// ❌ BAD: ComponentA uses sm:, ComponentB uses md: for same pattern
// ComponentA.tsx
<span className="hidden sm:inline">Desktop Label</span>

// ComponentB.tsx
<span className="hidden md:inline">Desktop Label</span>  // Inconsistent!

// ✅ GOOD: Same breakpoint for same pattern
<span className="hidden sm:inline">Desktop Label</span>  // Both components
```

### ❌ Anti-Pattern 3: Desktop-First Approach

```tsx
// ❌ BAD: Desktop styles as default
<div className="flex-row md:flex-col">  // Backwards!
  Content
</div>

// ✅ GOOD: Mobile-first approach
<div className="flex-col md:flex-row">
  Content
</div>
```

### ❌ Anti-Pattern 4: Ignoring Touch Targets

```tsx
// ❌ BAD: Too small for mobile touch
<button className="px-2 py-1 text-xs">
  Tap Me
</button>

// ✅ GOOD: WCAG 2.1 AA compliant (44px minimum)
<button className={`px-4 py-3 ${tokens.touchTarget.min}`}>
  Tap Me
</button>
```

### ❌ Anti-Pattern 5: Arbitrary Breakpoint Values

```tsx
// ❌ BAD: Custom values not in design system
<div className="min-w-[900px] md:max-w-[1440px]">
  Content
</div>

// ✅ GOOD: Use design system breakpoints
<div className="max-w-screen-lg xl:max-w-screen-xl">
  Content
</div>
```

### ❌ Anti-Pattern 6: Over-Using Media Query Hooks

```tsx
// ❌ BAD: JS calculation when CSS is sufficient
const isMobile = useMediaQuery('(max-width: 640px)');
return (
  <>
    {isMobile ? <MobileComponent /> : <DesktopComponent />}
  </>
);

// ✅ GOOD: CSS hiding (better performance)
<>
  <MobileComponent className="lg:hidden" />
  <DesktopComponent className="hidden lg:block" />
</>
```

---

**Related Documentation:**
- [Responsive Design Strategy](../RESPONSIVE_DESIGN_STRATEGY.md) - Complete implementation guide
- [Design Tokens](../../src/styles/tokens.ts) - Token definitions
- [Accessibility Guide](../ACCESSIBILITY.md) - WCAG compliance

**Last Updated:** 2025-11-05
