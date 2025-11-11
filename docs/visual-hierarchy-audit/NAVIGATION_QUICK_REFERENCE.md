# Navigation System - Quick Reference

## Before & After Comparison

### Mobile Experience (< 640px)

**BEFORE:**
- ❌ Cramped controls
- ❌ No hamburger menu
- ❌ Stats hidden
- ❌ Touch targets too small
- ❌ Text overlapping

**AFTER:**
- ✅ Clean, spacious layout
- ✅ Hamburger menu for secondary actions
- ✅ Stats in mobile menu
- ✅ 44px touch targets
- ✅ Stacked navigation bar

### Desktop Experience (>= 1024px)

**BEFORE:**
- ✅ All features visible
- ⚠️ Unclear action hierarchy
- ⚠️ "Edit Mode" ambiguous

**AFTER:**
- ✅ All features visible
- ✅ Clear primary/secondary actions
- ✅ "Manage Team" / "View Only" clearer

## Component Usage

### ImprovedHeader
```tsx
import { ImprovedHeader } from './components/ImprovedHeader';

<ImprovedHeader
  onShowHelp={handleShowHelp}
  onShowActivityLog={handleShowLog}
  firefightersCount={available}
  offDutyCount={offDuty}
  isEditMode={editing}
  onToggleEditMode={toggleEdit}
  viewMode="calendar"
  onToggleViewMode={toggleView}
/>
```

### MobileNav
```tsx
import { MobileNav } from './components/MobileNav';

<MobileNav
  isOpen={open}
  onClose={close}
  onShowHelp={showHelp}
  onShowActivityLog={showLog}
  firefightersCount={5}
  offDutyCount={2}
/>
```

### Breadcrumb
```tsx
import { Breadcrumb } from './components/Breadcrumb';

<Breadcrumb items={[
  { label: 'Schedule', href: '/schedule' },
  { label: 'Edit', active: true }
]} />
```

## Responsive Breakpoints

| Breakpoint | Layout | Features |
|------------|--------|----------|
| **< 640px** | Mobile | Hamburger menu, stacked controls |
| **640px - 1024px** | Tablet | Icons only, collapsed stats |
| **>= 1024px** | Desktop | Full labels, all visible |

## Key Features

### 1. Mobile Navigation Menu
- Slides in from right
- Shows team status
- Contains secondary actions
- Focus trapped
- Escape key closes

### 2. Progressive Disclosure
- Primary actions always visible
- Secondary in menu on mobile
- Stats contextual

### 3. Improved Labels
- "Manage Team" instead of "Edit Mode"
- "View Only" instead of "View Mode"
- Action-oriented language

### 4. Touch Targets
- Minimum 44x44 pixels
- Adequate spacing
- No overlapping

### 5. Breadcrumb Navigation
- Shows current location
- Provides context
- Easy backtracking

## Testing Commands

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Type check
npm run typecheck
```

## Accessibility Features

### Keyboard Navigation
- Tab through controls
- Escape closes menu
- Enter/Space activates
- Focus indicators visible

### Screen Readers
- Proper ARIA labels
- Toggle states announced
- Live regions for updates
- Semantic HTML

### Visual
- High contrast
- Visible focus rings
- No color-only indicators
- Readable text sizes

## Common Tasks

### Add New Navigation Item
1. Add button to ImprovedHeader or MobileNav
2. Include proper icon
3. Add focus-ring class
4. Set ARIA attributes
5. Test keyboard navigation

### Adjust Breakpoints
```css
/* Mobile */
.sm:hidden  /* Hide on screens >= 640px */

/* Tablet */
.lg:hidden  /* Hide on screens >= 1024px */

/* Desktop */
.hidden lg:block  /* Show only on >= 1024px */
```

### Update Labels
Edit the button text in ImprovedHeader.tsx:
```tsx
<span className="hidden lg:inline">Your Label</span>
```

## Performance Tips

1. **Lazy load menu**: Menu only renders when open
2. **GPU acceleration**: Use transform for animations
3. **Debounce resizes**: Avoid excessive re-renders
4. **Optimize icons**: Use tree-shaking with lucide-react

## Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS 14+, Android 10+)

## Troubleshooting

### Menu won't open
- Check isOpen state
- Verify z-index (should be 50)
- Ensure no other overlays blocking

### Touch targets too small
- Add min-h-[44px] min-w-[44px]
- Check padding
- Test on real device

### Focus trap not working
- Ensure useFocusTrap called
- Check modal ref assigned
- Verify focusable elements exist

### Text truncating
- Add min-w-0 to flex containers
- Use truncate class
- Check parent container width

## Migration Checklist

- [ ] Backup current Header component
- [ ] Add ImprovedHeader to project
- [ ] Add MobileNav to project
- [ ] Add Breadcrumb to project
- [ ] Update CSS animations
- [ ] Test on mobile devices
- [ ] Test keyboard navigation
- [ ] Test with screen reader
- [ ] Monitor performance
- [ ] Gather user feedback
- [ ] Optimize based on data

## Metrics to Track

### Usability
- Time to find action
- Navigation success rate
- Mobile tap accuracy
- User satisfaction score

### Performance
- Time to interactive
- First contentful paint
- Largest contentful paint
- Cumulative layout shift

### Accessibility
- Keyboard nav success rate
- Screen reader errors
- Focus loss incidents
- WCAG compliance score

## Next Steps

1. **Immediate**: Replace Header with ImprovedHeader
2. **Short-term**: Add breadcrumbs where needed
3. **Medium-term**: Gather usage analytics
4. **Long-term**: Iterate based on feedback

## Resources

- Full evaluation: `NAVIGATION_UX_EVALUATION.md`
- Implementation guide: `NAVIGATION_IMPLEMENTATION_GUIDE.md`
- Codebase: `src/components/ImprovedHeader.tsx`
