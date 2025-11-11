# Accent Colors

## Teal-Cyan Gradient Accent

A **teal-to-cyan gradient** (`from-teal-500 to-cyan-600`) serves as the primary accent color for event pills and important UI elements throughout the application.

### Usage

This accent color is defined in the color system at `src/styles/colorSystem.ts`:

```typescript
accent: {
  gradient: "bg-gradient-to-r from-teal-500 to-cyan-600",
  hover: "hover:from-teal-600 hover:to-cyan-700",
  text: "text-teal-500",
  border: "border-teal-600",
  light: "bg-teal-500/20",
  shadow: "shadow-lg shadow-teal-900/30",
}
```

### Examples

#### Button with Accent Gradient
```tsx
<button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-lg font-medium hover:from-teal-600 hover:to-cyan-700 transition shadow-lg shadow-teal-900/30">
  <PlusIcon className="w-5 h-5" />
  Create Vacancy
</button>
```

#### Using the Color System
```tsx
import { colors } from '@/styles';

<button className={`${colors.semantic.accent.gradient} ${colors.semantic.accent.hover} ${colors.semantic.accent.shadow}`}>
  Action Button
</button>
```

### Where to Use

- **Primary action buttons** (e.g., "Create Vacancy", "Add Firefighter")
- **Call-to-action elements** that need to stand out
- **Navigation active states** for sidebar items
- **Important notifications** or alerts
- **Badge highlights** for key metrics

### Design Rationale

The teal-to-cyan gradient provides a professional, modern look that complements the existing color palette:
- **Teal** is distinct from shift colors (green, red, blue) preventing confusion
- **Cyan** adds freshness and visual interest without being overwhelming
- **Gradient** provides depth and contemporary aesthetic
- **High contrast** with dark slate backgrounds ensures visibility
- **Professional appearance** suitable for emergency services applications

### Complementary Colors

Works well with:
- Slate backgrounds (`bg-slate-800`, `bg-slate-700`)
- White text (`text-white`)
- Neutral borders (`border-slate-700`, `border-slate-200`)

### Accessibility

- Maintains WCAG AA contrast ratios with white text
- Shadow provides depth for better visual hierarchy
- Hover state clearly indicates interactivity

---

**Last Updated:** November 5, 2025
**Change:** Updated from red-orange to teal-cyan gradient for more professional appearance and better distinction from shift colors
