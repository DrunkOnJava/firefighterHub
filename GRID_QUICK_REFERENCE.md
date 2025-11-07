# Grid System Quick Reference Card

## 🎯 Import

```typescript
import { 
  gridUtilities,
  alignmentUtilities,
  baseline,
  modularScale,
  grid
} from '@/styles';
```

## 📏 Baseline Grid (8px)

```typescript
baseline.scale.xs   // 4px
baseline.scale.sm   // 8px
baseline.scale.md   // 16px
baseline.scale.lg   // 24px
baseline.scale.xl   // 32px
baseline.scale['2xl'] // 40px
baseline.scale['3xl'] // 48px
```

## 📐 Modular Scale (1.25 ratio)

```typescript
modularScale.scale[-2]  // 10px
modularScale.scale[-1]  // 13px
modularScale.scale[0]   // 16px (base)
modularScale.scale[1]   // 20px
modularScale.scale[2]   // 25px
modularScale.scale[3]   // 31px
modularScale.scale[4]   // 39px
modularScale.scale[5]   // 49px
```

## 📱 Breakpoints

```typescript
640px   // Mobile
768px   // Tablet
1024px  // Desktop
1280px  // Wide
1536px  // Ultra-wide
```

## 🎨 Common Utilities

### Calendar
```tsx
<div className={gridUtilities.calendar.container}>
  <div className={gridUtilities.calendar.weekdayHeader}>
    {/* Weekday headers */}
  </div>
  <div className={gridUtilities.calendar.dayGrid}>
    {days.map(day => (
      <div className={gridUtilities.calendar.dayCell}>
        {day.number}
      </div>
    ))}
  </div>
</div>
```

### Roster
```tsx
<div className={gridUtilities.roster.header}>
  <span>Name</span>
  <span>Station</span>
  <span>Certs</span>
</div>

<div className={gridUtilities.roster.row}>
  <span>{name}</span>
  <span>{station}</span>
  <div>{certs}</div>
</div>
```

### Alignment
```tsx
<div className={alignmentUtilities.flex.center}>
  Centered content
</div>

<div className={alignmentUtilities.flex.between}>
  Spaced between
</div>
```

## ⌨️ Grid Overlay (Dev Only)

| Shortcut | Action |
|----------|--------|
| `Ctrl+G` / `Cmd+G` | Toggle overlay on/off |
| `Ctrl+Shift+G` | Cycle through modes |
| `Ctrl+Shift+↑` | Increase opacity |
| `Ctrl+Shift+↓` | Decrease opacity |

### Overlay Modes
- **baseline** - Red horizontal lines (8px rhythm)
- **columns** - Blue calendar + green sidebar
- **calendar** - Orange calendar grid
- **all** - All overlays combined
- **none** - No overlay

## 🎛️ CSS Variables

```css
--grid-base-unit: 8px;
--grid-desktop-gap: 16px;
--grid-tablet-gap: 16px;
--grid-mobile-gap: 12px;
--calendar-gap-desktop: 8px;
--calendar-gap-tablet: 6px;
--calendar-gap-mobile: 4px;
--roster-gap: 8px;
--baseline-unit: 8px;
```

## 📦 Grid Configurations

### App Layout
```css
/* Desktop */
grid-template-columns: 1fr 480px;
grid-template-areas: "calendar sidebar";
gap: 16px;

/* Tablet/Mobile */
grid-template-columns: 1fr;
grid-template-areas: "calendar" "sidebar";
```

### Calendar Grid
```css
/* Desktop */
grid-template-columns: repeat(7, 1fr);
grid-auto-rows: 1fr;
gap: 8px;
aspect-ratio: 1 / 1.2;

/* Mobile */
gap: 4px;
aspect-ratio: 1 / 1;
min-height: 48px;
```

### Roster Grid
```css
grid-template-columns: 1.2fr 0.5fr 0.8fr;
grid-template-rows: repeat(20, 1fr);
gap: 8px;
```

## ✅ Best Practices

### DO ✅
```tsx
// Use baseline multiples
<div className="mb-4 p-6">  // 16px, 24px

// Use modular scale
const size = modularScale.scale[2];  // 25px

// Use grid utilities
<div className={gridUtilities.calendar.dayCell}>

// Use min-h-0 on grid children
<div className="grid min-h-0">
```

### DON'T ❌
```tsx
// Don't use arbitrary values
<div className="mb-[13px]">  // ❌

// Don't hardcode widths
grid-template-columns: 300px 200px;  // ❌

// Don't forget min-h-0
<div className="grid overflow-auto">  // ❌
```

## 🔧 Common Patterns

### Centered Content
```tsx
<div className={alignmentUtilities.flex.center}>
  Content
</div>
```

### Form Layout
```tsx
<div className={gridUtilities.form.container}>
  <label className={gridUtilities.form.labelColumn}>
    Name:
  </label>
  <input className={gridUtilities.form.inputColumn} />
</div>
```

### Responsive Columns
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* 1 → 2 → 3 columns */}
</div>
```

### Card Grid
```tsx
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
  {/* Responsive card grid */}
</div>
```

## 📚 Documentation Links

- **Complete Guide:** `docs/GRID_SYSTEM.md`
- **Implementation:** `GRID_SYSTEM_IMPLEMENTATION.md`
- **Testing:** `GRID_TESTING_GUIDE.md`
- **Summary:** `GRID_SYSTEM_COMPLETE.md`

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Calendar cells overflow | Add `min-h-0` to container |
| Unequal row heights | Use `grid-auto-rows: 1fr` |
| Grid overlay not showing | Use dev mode (`pnpm dev`) |
| Cells not square on mobile | Add `aspect-ratio: 1/1` |
| Roster columns misaligned | Use same columns on header & rows |

## 💡 Quick Tips

1. **Spacing:** Always use multiples of 8px
2. **Sizing:** Use modular scale values
3. **Grids:** Use `min-h-0` on children
4. **Mobile:** Enable scrolling (`overflow: visible`)
5. **Desktop:** Single-screen (`overflow: hidden`)
6. **Testing:** Use grid overlay (Ctrl+G)

---

**Version:** 1.0.0  
**Last Updated:** 2025-11-07
