# Micro-Interactions Integration Plan

## Strategy

We have TWO button components:
1. **`ui/Button.tsx`** - Existing simple button (95 lines)
2. **`ui/AnimatedButton.tsx`** - New animated button with states (200+ lines)

**Decision:** Enhance existing `Button.tsx` instead of replacing to maintain compatibility.

## Integration Batches

### Batch 1: Core UI Components (PRIORITY)
**Goal:** Replace all basic buttons with enhanced animations

1. **Enhance `ui/Button.tsx`**
   - Add ripple effect (already has `withRipple` prop)
   - Add press animation (already has `active:scale-95`)
   - Add loading state (already has spinner)
   - Add success/error states from AnimatedButton
   - Keep existing API 100% compatible

2. **Replace Old Buttons**
   - Header.tsx buttons → Button component
   - Modal action buttons → Button component  
   - Form submit buttons → Button component
   - Calendar action buttons → Button component

3. **Test Coverage**
   - Visual regression screenshots
   - Keyboard navigation
   - Screen reader announcements
   - Reduced motion compliance

### Batch 2: Form Inputs & Toggles
**Goal:** Enhance form interactions

1. **Integrate AnimatedInput**
   - AddFirefighterForm.tsx inputs
   - LoginModal.tsx inputs
   - QuickAddFirefighterModal.tsx inputs

2. **Integrate AnimatedToggle**
   - Dark mode toggle
   - BC mode toggle
   - Any future feature toggles

### Batch 3: Loading States
**Goal:** Better perceived performance

1. **Replace SkeletonLoader**
   - Use new Skeleton.tsx with shimmer
   - FirefighterList loading state
   - Calendar loading state
   - Modal loading state

2. **Add PulseLoader**
   - Next up bar loading
   - Activity log loading
   - Reports loading

### Batch 4: Page Transitions
**Goal:** Smooth view changes

1. **Modal Animations**
   - Use ModalTransition component
   - Fade + slide from bottom
   - Scale in for small dialogs

2. **Tab Transitions**
   - Mobile tab changes
   - Shift selector changes
   - View mode changes

### Batch 5: Celebrations & Delight
**Goal:** Positive feedback

1. **Success Confetti**
   - Hold completed
   - Firefighter added
   - Transfer successful

2. **Success Animations**
   - Toast notifications enhancement
   - Form submission feedback
   - Data sync indicators

### Batch 6: Hover & Focus Polish
**Goal:** Professional feel

1. **Hover Effects**
   - Card hover states
   - List item hover
   - Button hover polish

2. **Focus Management**
   - Focus rings enhancement
   - Focus trap in modals
   - Keyboard shortcuts visual feedback

## Testing Protocol (Per Batch)

1. **Build Test**
   ```bash
   pnpm build
   ```

2. **Type Check**
   ```bash
   pnpm typecheck
   ```

3. **Visual Test** (MCP Chrome)
   - Take screenshots at key states
   - Compare before/after
   - Check dark mode
   - Check mobile responsive

4. **Accessibility Test**
   - Keyboard navigation
   - Screen reader (VoiceOver)
   - Reduced motion
   - Focus indicators

5. **Performance Test**
   - FPS monitoring (usePerformanceMonitor)
   - Animation smoothness
   - Loading time impact

## Success Criteria

- ✅ All builds pass
- ✅ No TypeScript errors
- ✅ No visual regressions
- ✅ Keyboard nav works
- ✅ 60fps maintained
- ✅ Reduced motion respected
- ✅ Dark mode compatible
- ✅ Mobile responsive

## Rollback Plan

Each batch is isolated - can rollback individual components if issues found.

Git commit after each successful batch with descriptive message.
