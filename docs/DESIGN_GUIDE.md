# FirefighterHub Design System Guide

## Color Palette

### Primary Colors
- **Fire Red**: #DC2626 (red-600) - Primary actions, alerts
- **Emergency Blue**: #2563EB (blue-600) - Information, secondary actions
- **Safety Green**: #059669 (emerald-600) - Success, confirmations
- **Warning Orange**: #EA580C (orange-600) - Warnings, cautions

### Shift Colors
- **Shift A**: #059669 (emerald-600) - Green
- **Shift B**: #2563EB (blue-600) - Blue  
- **Shift C**: #DC2626 (red-600) - Red

### Neutral Colors (Dark Mode)
- **Background**: #0f172a (slate-900)
- **Surface**: #1e293b (slate-800)
- **Border**: #334155 (slate-700)
- **Text Primary**: #f1f5f9 (slate-100)
- **Text Secondary**: #94a3b8 (slate-400)

### Neutral Colors (Light Mode)
- **Background**: #ffffff (white)
- **Surface**: #f8fafc (slate-50)
- **Border**: #e2e8f0 (slate-200)
- **Text Primary**: #0f172a (slate-900)
- **Text Secondary**: #64748b (slate-500)

## Typography

### Font Family
- **Primary**: Inter, system-ui, -apple-system, sans-serif
- **Monospace**: 'JetBrains Mono', monospace (for timestamps, codes)

### Font Sizes
- **xs**: 0.75rem (12px)
- **sm**: 0.875rem (14px)
- **base**: 1rem (16px)
- **lg**: 1.125rem (18px)
- **xl**: 1.25rem (20px)
- **2xl**: 1.5rem (24px)

### Font Weights
- **Normal**: 400
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700

## Spacing Scale

- **0.5**: 0.125rem (2px)
- **1**: 0.25rem (4px)
- **2**: 0.5rem (8px)
- **3**: 0.75rem (12px)
- **4**: 1rem (16px)
- **6**: 1.5rem (24px)
- **8**: 2rem (32px)
- **12**: 3rem (48px)

## Component Specifications

### Buttons

#### Primary Button
```css
padding: 0.5rem 1rem (py-2 px-4)
border-radius: 0.5rem (rounded-lg)
font-weight: 600 (semibold)
transition: 150ms
hover: scale(1.05)
active: scale(0.95)
```

#### Secondary Button
```css
padding: 0.5rem 1rem (py-2 px-4)
border-radius: 0.5rem (rounded-lg)
font-weight: 500 (medium)
border: 1px solid
transition: 150ms
hover: scale(1.05)
```

#### Icon Button
```css
padding: 0.5rem (p-2)
border-radius: 0.5rem (rounded-lg)
min-width: 2.5rem (40px)
min-height: 2.5rem (40px)
```

### Cards

```css
background: Surface color
border-radius: 0.75rem (rounded-xl)
padding: 1.5rem (p-6)
border: 1px solid Border color
shadow: subtle shadow
```

### Inputs

```css
padding: 0.75rem 1rem (py-3 px-4)
border-radius: 0.5rem (rounded-lg)
border: 2px solid
font-size: 0.875rem (text-sm)
transition: 150ms
focus: border-color + ring
```

### Badges

```css
padding: 0.25rem 0.75rem (py-1 px-3)
border-radius: 9999px (rounded-full)
font-size: 0.75rem (text-xs)
font-weight: 600 (semibold)
```

## Shadows

### Small
```css
box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05)
```

### Medium
```css
box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1)
```

### Large
```css
box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1)
```

### Colored (for primary elements)
```css
box-shadow: 0 10px 15px -3px color / 0.3
```

## Animation Durations

- **Fast**: 100ms - Micro-interactions
- **Normal**: 150ms - Standard transitions
- **Slow**: 300ms - Page transitions, modals

## Accessibility

### Minimum Touch Targets
- **Mobile**: 44px × 44px
- **Desktop**: 32px × 32px

### Color Contrast
- **Normal text**: 4.5:1 minimum
- **Large text**: 3:1 minimum
- **UI Components**: 3:1 minimum

### Focus Indicators
```css
outline: 2px solid primary-color
outline-offset: 2px
border-radius: inherit
```

## Icon Sizes

- **xs**: 12px
- **sm**: 16px
- **base**: 20px
- **lg**: 24px
- **xl**: 32px

## Border Radius

- **sm**: 0.25rem (4px)
- **md**: 0.5rem (8px)
- **lg**: 0.75rem (12px)
- **xl**: 1rem (16px)
- **full**: 9999px (circle/pill)

## Z-Index Scale

- **dropdown**: 1000
- **sticky**: 1020
- **modal-backdrop**: 1040
- **modal**: 1050
- **popover**: 1060
- **tooltip**: 1070

## Responsive Breakpoints

- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

## Component States

### Default
- Base colors
- No special styling

### Hover
- Slightly lighter/darker background
- Scale: 1.05 for buttons
- Cursor: pointer

### Active/Pressed
- Darker background
- Scale: 0.95 for buttons

### Focus
- Outline ring with primary color
- Increased contrast

### Disabled
- Opacity: 0.5
- Cursor: not-allowed
- No hover effects

## Emergency/Priority Indicators

### Critical (Red)
- Background: red-600
- Text: white
- Use for: Immediate action required

### High (Orange)
- Background: orange-600
- Text: white
- Use for: Important, needs attention

### Medium (Yellow)
- Background: yellow-500
- Text: slate-900
- Use for: Notable items

### Low (Blue)
- Background: blue-600
- Text: white
- Use for: Informational

### Success (Green)
- Background: emerald-600
- Text: white
- Use for: Completed, confirmed

## Best Practices

1. **Consistency**: Use the same spacing, colors, and typography across all components
2. **Hierarchy**: Establish clear visual hierarchy using size, weight, and color
3. **Contrast**: Ensure sufficient contrast for readability
4. **Feedback**: Provide immediate visual feedback for all interactions
5. **Accessibility**: Follow WCAG 2.1 AA standards minimum
6. **Performance**: Use CSS transforms for animations (not position/size)
7. **Mobile-First**: Design for mobile screens first, then scale up
8. **Touch Targets**: Ensure all interactive elements meet minimum size requirements
