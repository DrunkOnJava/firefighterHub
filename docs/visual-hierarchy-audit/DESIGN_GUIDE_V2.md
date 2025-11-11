# FirefighterHub Design Guide v2 - shadcn/ui Standards

## Philosophy

**Use shadcn/ui defaults with minimal customization**

Core principles:
1. ✅ **Full viewport utilization** - No wasted space
2. ✅ **No text truncation** - All text visible, readable
3. ✅ **No word wrapping** - One line per row/person
4. ✅ **Proportional layouts** - Elements sized appropriately
5. ✅ **Visual hierarchy** - Clear importance levels
6. ✅ **Beautiful by default** - Trust shadcn/ui design decisions

---

## Layout Standards

### Viewport Usage
```css
/* Full height utilization */
height: 100vh
min-height: 100vh

/* No max-width constraints on main content */
Remove: max-w-7xl, max-w-6xl, etc.

/* Flexible containers */
Use: w-full, flex-1, h-full
```

### Text Display Rules

**Never truncate text:**
```css
❌ REMOVE: truncate, text-ellipsis, overflow-hidden
❌ REMOVE: line-clamp-1, line-clamp-2, etc.

✅ USE: whitespace-nowrap (when needed)
✅ USE: flex-shrink-0 (prevent shrinking)
✅ USE: min-w-0 (with overflow-visible)
```

**One line per row:**
```css
/* Lists, tables, rosters */
whitespace-nowrap
overflow-visible
flex items-center
```

### Proportional Sizing

**Hierarchy through size:**
```css
/* Page title */
text-2xl font-bold

/* Section headers */
text-xl font-semibold

/* Subsections */
text-lg font-medium

/* Body text */
text-base

/* Secondary/meta */
text-sm text-muted-foreground

/* Tiny labels */
text-xs text-muted-foreground
```

---

## shadcn/ui Component Usage

### Use Default Variants

**Button:**
```tsx
<Button>Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Secondary</Button>
<Button variant="ghost">Subtle</Button>
<Button variant="link">Link</Button>
<Button size="lg">Large</Button>
<Button size="sm">Small</Button>
<Button size="icon">Icon</Button>
```

**Badge:**
```tsx
<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Alert</Badge>
<Badge variant="outline">Outline</Badge>
```

**Card:**
```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
  <CardFooter>Footer</CardFooter>
</Card>
```

### Tables (No Truncation)

```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead className="whitespace-nowrap">Name</TableHead>
      <TableHead className="whitespace-nowrap">Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell className="whitespace-nowrap font-medium">
        Full Name Here
      </TableCell>
      <TableCell className="whitespace-nowrap">
        Status Text
      </TableCell>
    </TableRow>
  </TableBody>
</Table>
```

---

## Color System (shadcn defaults)

**Use CSS variables:**
```css
background: hsl(var(--background))
foreground: hsl(var(--foreground))
card: hsl(var(--card))
card-foreground: hsl(var(--card-foreground))
popover: hsl(var(--popover))
popover-foreground: hsl(var(--popover-foreground))
primary: hsl(var(--primary))
primary-foreground: hsl(var(--primary-foreground))
secondary: hsl(var(--secondary))
secondary-foreground: hsl(var(--secondary-foreground))
muted: hsl(var(--muted))
muted-foreground: hsl(var(--muted-foreground))
accent: hsl(var(--accent))
accent-foreground: hsl(var(--accent-foreground))
destructive: hsl(var(--destructive))
destructive-foreground: hsl(var(--destructive-foreground))
border: hsl(var(--border))
input: hsl(var(--input))
ring: hsl(var(--ring))
```

**Apply in components:**
```tsx
className="bg-background text-foreground"
className="bg-card text-card-foreground"
className="bg-primary text-primary-foreground"
className="text-muted-foreground"
className="border-border"
```

---

## Shift Colors (Only Customization)

**Keep these for firefighter shifts:**
```tsx
// Shift A - Green
className="bg-emerald-600 text-white"

// Shift B - Blue  
className="bg-blue-600 text-white"

// Shift C - Red
className="bg-red-600 text-white"
```

---

## Spacing (shadcn defaults)

**Use Tailwind scale as-is:**
```css
gap-1, gap-2, gap-3, gap-4, gap-6, gap-8
p-1, p-2, p-3, p-4, p-6, p-8
m-1, m-2, m-3, m-4, m-6, m-8
space-x-2, space-y-4
```

**Component spacing:**
```tsx
// Cards
<Card className="p-6">

// Lists
<ul className="space-y-2">

// Flex containers
<div className="flex gap-4">
```

---

## Typography (shadcn defaults)

**Font families:**
```css
font-sans (default)
font-mono (for codes/timestamps)
```

**Weights:**
```css
font-normal (400)
font-medium (500)
font-semibold (600)
font-bold (700)
```

**Hierarchy:**
```tsx
<h1 className="text-2xl font-bold">Page Title</h1>
<h2 className="text-xl font-semibold">Section</h2>
<h3 className="text-lg font-medium">Subsection</h3>
<p className="text-base">Body</p>
<span className="text-sm text-muted-foreground">Meta</span>
```

---

## Full Viewport Layout Pattern

```tsx
export function App() {
  return (
    <div className="flex flex-col h-screen">
      {/* Header - Fixed height */}
      <header className="flex-shrink-0 border-b">
        <div className="h-16 px-6 flex items-center justify-between">
          {/* Header content */}
        </div>
      </header>

      {/* Main content - Fills remaining space */}
      <main className="flex-1 overflow-auto">
        <div className="h-full w-full p-6">
          {/* Content that uses full available space */}
        </div>
      </main>

      {/* Footer (optional) - Fixed height */}
      <footer className="flex-shrink-0 border-t">
        <div className="h-12 px-6 flex items-center">
          {/* Footer content */}
        </div>
      </footer>
    </div>
  );
}
```

---

## Roster/Table Pattern (No Truncation)

```tsx
<div className="h-full flex flex-col">
  {/* Header */}
  <div className="flex-shrink-0 mb-4">
    <h2 className="text-xl font-semibold">Firefighter Roster</h2>
  </div>

  {/* Scrollable table */}
  <div className="flex-1 overflow-auto">
    <Table>
      <TableHeader className="sticky top-0 bg-background">
        <TableRow>
          <TableHead className="whitespace-nowrap w-auto">Name</TableHead>
          <TableHead className="whitespace-nowrap w-auto">Shift</TableHead>
          <TableHead className="whitespace-nowrap w-auto">Last Hold</TableHead>
          <TableHead className="whitespace-nowrap w-auto">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {firefighters.map((ff) => (
          <TableRow key={ff.id}>
            <TableCell className="whitespace-nowrap font-medium">
              {ff.name}
            </TableCell>
            <TableCell className="whitespace-nowrap">
              <Badge>{ff.shift}</Badge>
            </TableCell>
            <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
              {ff.lastHold}
            </TableCell>
            <TableCell className="whitespace-nowrap">
              {ff.status}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
</div>
```

---

## Calendar Pattern (Full Space)

```tsx
<div className="h-full flex flex-col">
  {/* Month navigation */}
  <div className="flex-shrink-0 flex items-center justify-between mb-4">
    <Button variant="outline" size="icon">
      <ChevronLeft />
    </Button>
    <h2 className="text-xl font-semibold">November 2025</h2>
    <Button variant="outline" size="icon">
      <ChevronRight />
    </Button>
  </div>

  {/* Calendar grid - fills available space */}
  <div className="flex-1 grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
    {/* Day cells */}
    {days.map((day) => (
      <div key={day} className="bg-card p-2 min-h-0 flex flex-col">
        <div className="text-sm font-medium">{day}</div>
        <div className="flex-1 overflow-auto">
          {/* Events - no truncation */}
          {events.map((event) => (
            <div className="text-xs whitespace-nowrap">{event.name}</div>
          ))}
        </div>
      </div>
    ))}
  </div>
</div>
```

---

## Removed Custom Styles

**Delete these:**
- Custom color values (use CSS vars instead)
- Manual opacity calculations
- Fixed max-widths on content
- Text truncation utilities
- Custom shadows (use shadcn defaults)
- Custom border radius beyond Tailwind defaults
- Custom z-index scales (use shadcn's)

**Keep only:**
- Shift colors (emerald/blue/red)
- Full viewport patterns
- No-truncation rules
- Proportional sizing

---

## Installation Commands

```bash
# Add all essential components
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add badge
npx shadcn@latest add table
npx shadcn@latest add tooltip
npx shadcn@latest add select
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add calendar
npx shadcn@latest add popover
npx shadcn@latest add separator
npx shadcn@latest add tabs
npx shadcn@latest add alert
npx shadcn@latest add toast
```

---

## Migration Checklist

- [ ] Remove all max-width constraints on main layouts
- [ ] Replace custom colors with shadcn CSS variables
- [ ] Remove all text truncation (truncate, line-clamp)
- [ ] Add whitespace-nowrap to table cells
- [ ] Use h-screen/h-full for full viewport
- [ ] Replace custom buttons with shadcn Button
- [ ] Replace custom badges with shadcn Badge
- [ ] Use Card component for containers
- [ ] Apply text-muted-foreground for secondary text
- [ ] Use border-border for all borders
- [ ] Implement sticky headers where needed
- [ ] Test all text is fully visible
- [ ] Ensure proper visual hierarchy
- [ ] Verify proportional spacing

---

## Visual Hierarchy Rules

**Size progression:**
```
Page Title:    text-2xl font-bold
Section:       text-xl font-semibold  
Subsection:    text-lg font-medium
Body:          text-base
Secondary:     text-sm text-muted-foreground
Labels:        text-xs text-muted-foreground
```

**Color hierarchy:**
```
Primary:       text-foreground
Secondary:     text-muted-foreground
Destructive:   text-destructive
Success:       text-emerald-600
Warning:       text-orange-600
```

**Spacing hierarchy:**
```
Between sections:    mb-8 or gap-8
Between elements:    mb-4 or gap-4
Between items:       mb-2 or gap-2
Within elements:     gap-1 or space-x-1
```

---

## Key Differences from V1

| Aspect | V1 (Custom) | V2 (shadcn defaults) |
|--------|-------------|----------------------|
| Colors | Custom slate values | CSS variables |
| Spacing | Custom scale | Tailwind defaults |
| Components | Hand-built | shadcn/ui |
| Text | Truncation allowed | Never truncate |
| Viewport | Max-width limits | Full space usage |
| Shadows | Custom values | shadcn defaults |
| Focus | Custom rings | shadcn defaults |

**Result:** Cleaner, more maintainable, fully accessible, beautiful by default.
