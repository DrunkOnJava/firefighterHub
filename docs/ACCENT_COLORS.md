# Accent Colors

## Orange Gradient Accent

A **red-to-orange gradient** (`from-red-500 to-orange-600`) has been documented as an accent color for future use throughout the application.

### Usage

This accent color is defined in the color system at `src/styles/colorSystem.ts`:

```typescript
accent: {
  gradient: "bg-gradient-to-r from-red-500 to-orange-600",
  hover: "hover:from-red-600 hover:to-orange-700",
  text: "text-orange-500",
  border: "border-orange-600",
  light: "bg-orange-500/20",
  shadow: "shadow-lg",
}
```

### Examples

#### Button with Accent Gradient
```tsx
<button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-lg font-medium hover:from-red-600 hover:to-orange-700 transition shadow-lg">
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

The red-to-orange gradient complements the existing color palette:
- **Red** aligns with the firefighter theme and existing primary colors
- **Orange** adds warmth and energy, creating visual interest
- **Gradient** provides depth and modern aesthetic
- **High contrast** ensures visibility in both light and dark modes

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

**Last Updated:** November 4, 2025
