# Micro-Interactions & Delight Patterns - Implementation Plan

## Project Overview
Create a comprehensive library of micro-interactions and delightful UI patterns for FirefighterHub that enhance UX without sacrificing performance or accessibility.

---

## 🎯 Goals & Success Criteria

### Primary Goals
1. **Enhance User Experience**: Add subtle, meaningful animations that provide feedback
2. **Maintain Performance**: All animations must run at 60fps with no jank
3. **Ensure Accessibility**: Respect `prefers-reduced-motion` and screen readers
4. **Build Confidence**: Provide clear feedback for all user actions
5. **Create Delight**: Add celebratory moments without being annoying

### Success Metrics
- ✅ All animations run at 60fps (measured via Performance API)
- ✅ Zero layout shifts during animations (CLS score)
- ✅ 100% compliance with `prefers-reduced-motion`
- ✅ All interactive elements have hover/focus/active states
- ✅ Loading states never show blank screens (skeleton screens)
- ✅ Empty states provide actionable guidance
- ✅ User testing shows positive emotional response

---

## 📋 Phase 1: Foundation & Infrastructure (2-3 hours)

### Task 1.1: Animation Utilities & Hooks
**Priority**: 🔴 CRITICAL  
**Estimated Time**: 1 hour

**Deliverables**:
- [ ] Create `src/hooks/useReducedMotion.ts` - Detect user motion preferences
- [ ] Create `src/hooks/useAnimation.ts` - Centralized animation hook
- [ ] Create `src/utils/animations.ts` - Animation utility functions
- [ ] Create `src/utils/performanceMonitor.ts` - FPS tracking utilities
- [ ] Define animation duration constants (150ms, 200ms, 300ms, 500ms)
- [ ] Create easing function library (ease-in, ease-out, spring, bounce)

**Files to Create**:
```
src/hooks/useReducedMotion.ts
src/hooks/useAnimation.ts
src/utils/animations.ts
src/utils/performanceMonitor.ts
src/styles/animations.css
```

**Acceptance Criteria**:
- ✅ `useReducedMotion()` returns boolean based on media query
- ✅ All animations use centralized timing constants
- ✅ Performance monitor logs FPS drops below 60
- ✅ CSS variables for animation durations

---

### Task 1.2: Design Tokens for Animations
**Priority**: 🔴 CRITICAL  
**Estimated Time**: 30 minutes

**Deliverables**:
- [ ] Add animation tokens to `src/styles/tokens.ts`
- [ ] Define motion scales (subtle, moderate, expressive)
- [ ] Create timing scale (instant, fast, normal, slow, very-slow)
- [ ] Define spring physics constants
- [ ] Add shadow elevation scales for depth

**Updates to**:
```typescript
// src/styles/tokens.ts
export const animations = {
  duration: {
    instant: '100ms',
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
    verySlow: '500ms',
  },
  easing: {
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
  scale: {
    subtle: '0.98',
    moderate: '0.95',
    expressive: '0.92',
  }
}
```

---

## 📋 Phase 2: Button & Interactive Elements (2-3 hours)

### Task 2.1: Button Press Animations
**Priority**: 🔴 CRITICAL  
**Estimated Time**: 1 hour

**Deliverables**:
- [ ] Create `src/components/ui/AnimatedButton.tsx`
- [ ] Implement press-down scale effect (scale: 0.95)
- [ ] Add ripple effect on click
- [ ] Implement loading state with spinner
- [ ] Add success checkmark animation
- [ ] Add error shake animation
- [ ] Respect `prefers-reduced-motion`

**Button States**:
```typescript
type ButtonState = 
  | 'idle' 
  | 'hover' 
  | 'active' 
  | 'loading' 
  | 'success' 
  | 'error' 
  | 'disabled';
```

**Acceptance Criteria**:
- ✅ Tactile feedback on all button presses
- ✅ Clear visual distinction between states
- ✅ Loading spinner doesn't cause layout shift
- ✅ Success animation completes in < 500ms
- ✅ No animation flicker during rapid clicks

---

### Task 2.2: Toggle Switch with Smooth Transitions
**Priority**: 🟡 HIGH  
**Estimated Time**: 45 minutes

**Deliverables**:
- [ ] Create `src/components/ui/AnimatedToggle.tsx`
- [ ] Implement smooth slide animation (200ms ease-out)
- [ ] Add background color transition
- [ ] Implement spring physics for thumb movement
- [ ] Add haptic-style bounce effect
- [ ] Include accessibility labels

**Acceptance Criteria**:
- ✅ Toggle animates smoothly without jank
- ✅ Keyboard navigation works (Space/Enter)
- ✅ ARIA labels announce state changes
- ✅ Respects reduced motion (instant toggle)

---

### Task 2.3: Enhanced Form Inputs
**Priority**: 🟡 HIGH  
**Estimated Time**: 1 hour

**Deliverables**:
- [ ] Create `src/components/ui/AnimatedInput.tsx`
- [ ] Implement floating label animation
- [ ] Add focus ring expansion effect
- [ ] Create error state shake animation
- [ ] Add success checkmark fade-in
- [ ] Implement character count animation
- [ ] Add auto-resize for textareas

**Acceptance Criteria**:
- ✅ Labels animate smoothly on focus
- ✅ Error messages slide in from bottom
- ✅ Validation feedback is instant (< 100ms)
- ✅ No layout shift during animations

---

## 📋 Phase 3: Loading & Skeleton States (2 hours)

### Task 3.1: Skeleton Screen Components
**Priority**: 🔴 CRITICAL  
**Estimated Time**: 1 hour

**Deliverables**:
- [ ] Create `src/components/ui/Skeleton.tsx` base component
- [ ] Create `src/components/ui/SkeletonCard.tsx`
- [ ] Create `src/components/ui/SkeletonTable.tsx`
- [ ] Create `src/components/ui/SkeletonList.tsx`
- [ ] Implement shimmer/pulse animation
- [ ] Match actual component dimensions

**Skeleton Types**:
- Firefighter card skeleton
- Calendar grid skeleton
- Activity log skeleton
- Profile modal skeleton

**Acceptance Criteria**:
- ✅ Skeletons match final component layout
- ✅ Shimmer animation is smooth (60fps)
- ✅ No content jump when replacing skeleton
- ✅ Respects reduced motion (static gray boxes)

---

### Task 3.2: Loading Indicators
**Priority**: 🟡 HIGH  
**Estimated Time**: 45 minutes

**Deliverables**:
- [ ] Create `src/components/ui/Spinner.tsx` with variants
- [ ] Create `src/components/ui/ProgressBar.tsx`
- [ ] Create `src/components/ui/PulseLoader.tsx`
- [ ] Implement determinate progress animation
- [ ] Add indeterminate loader (infinite spin)
- [ ] Create "dots" loader for inline use

**Variants**:
- Primary spinner (full screen overlay)
- Inline spinner (button loading)
- Progress bar (file uploads, multi-step forms)
- Pulse dots (inline text loading)

**Acceptance Criteria**:
- ✅ Spinners are perfectly centered
- ✅ No spinner flicker for fast loads (delay 300ms)
- ✅ Progress bar updates smoothly
- ✅ Accessibility: ARIA live region announces progress

---

## 📋 Phase 4: State Transitions & Page Transitions (2 hours)

### Task 4.1: View Transition Animations
**Priority**: 🟡 HIGH  
**Estimated Time**: 1 hour

**Deliverables**:
- [ ] Create `src/components/ui/PageTransition.tsx`
- [ ] Implement fade-in for new content
- [ ] Add slide transitions for mobile nav
- [ ] Create stagger animation for lists
- [ ] Implement crossfade for shift changes
- [ ] Add spring physics for modals

**Transition Types**:
- Modal enter/exit (scale + fade)
- Page change (fade)
- List item add (slide from left + fade)
- List item remove (slide right + fade)
- Mobile sheet (slide up from bottom)

**Acceptance Criteria**:
- ✅ Transitions feel natural (not robotic)
- ✅ No double-scrollbar during transitions
- ✅ Keyboard focus management preserved
- ✅ Transitions complete in < 300ms

---

### Task 4.2: Stagger Animations for Lists
**Priority**: 🟢 MEDIUM  
**Estimated Time**: 45 minutes

**Deliverables**:
- [ ] Create `src/hooks/useStaggerAnimation.ts`
- [ ] Implement stagger for firefighter roster
- [ ] Add stagger for activity log entries
- [ ] Create stagger for calendar cells
- [ ] Add delay calculations (50ms per item)

**Acceptance Criteria**:
- ✅ Items animate in sequence (not all at once)
- ✅ Stagger delay scales with list length
- ✅ Maximum delay capped at 500ms
- ✅ Works with virtualized lists

---

## 📋 Phase 5: Feedback & Celebration (2-3 hours)

### Task 5.1: Success Celebrations
**Priority**: 🟡 HIGH  
**Estimated Time**: 1.5 hours

**Deliverables**:
- [ ] Create `src/components/ui/Confetti.tsx`
- [ ] Create `src/components/ui/SuccessAnimation.tsx`
- [ ] Implement confetti burst for hold completion
- [ ] Add checkmark animation with bounce
- [ ] Create "task complete" sound effect hook
- [ ] Add haptic feedback simulation (vibration API)

**Celebration Triggers**:
- Hold completed successfully
- Firefighter added to roster
- Shift transfer completed
- Multiple holds scheduled (bulk action)

**Acceptance Criteria**:
- ✅ Confetti doesn't cover important content
- ✅ Celebrations auto-dismiss after 2-3 seconds
- ✅ User can dismiss celebration early (Escape key)
- ✅ Confetti respects reduced motion (show checkmark only)
- ✅ Sound is optional and user-controllable

---

### Task 5.2: Drag & Drop Visual Feedback
**Priority**: 🟡 HIGH  
**Estimated Time**: 1 hour

**Deliverables**:
- [ ] Enhance existing drag-drop with better feedback
- [ ] Add ghost image opacity and scale
- [ ] Implement drop zone highlighting
- [ ] Add "snap back" animation on invalid drop
- [ ] Create drop shadow during drag
- [ ] Add subtle rotation during drag

**Updates to**:
- `src/components/FirefighterList.tsx`
- `src/components/FirefighterItem.tsx`

**Acceptance Criteria**:
- ✅ Dragged item has clear visual affordance
- ✅ Drop zones pulse/highlight on drag over
- ✅ Smooth animation on drop
- ✅ Snap-back feels natural on cancel

---

### Task 5.3: Toast Notification Enhancements
**Priority**: 🟢 MEDIUM  
**Estimated Time**: 30 minutes

**Deliverables**:
- [ ] Update `src/components/Toast.tsx` with animations
- [ ] Add slide-in from top-right animation
- [ ] Implement exit animation (slide + fade)
- [ ] Add progress bar for auto-dismiss
- [ ] Create stacking animation for multiple toasts
- [ ] Add icon animations (spin for loading, bounce for success)

**Acceptance Criteria**:
- ✅ Toasts don't overlap or collide
- ✅ Enter/exit animations are smooth
- ✅ Progress bar shows time remaining
- ✅ Screen readers announce toast content

---

## 📋 Phase 6: Empty States & Guidance (1.5 hours)

### Task 6.1: Illustrative Empty States
**Priority**: 🟡 HIGH  
**Estimated Time**: 1 hour

**Deliverables**:
- [ ] Create `src/components/ui/EmptyState.tsx` enhancement
- [ ] Add animated SVG illustrations
- [ ] Implement subtle floating animation for icons
- [ ] Create helpful CTAs with hover effects
- [ ] Add contextual guidance text

**Empty State Scenarios**:
- No firefighters on roster → "Add your first firefighter"
- No scheduled holds → "Schedule your first hold"
- No activity log → "Activity will appear here"
- No search results → "Try different keywords"
- Deactivated firefighters list empty → "No deactivated members"

**Acceptance Criteria**:
- ✅ Illustrations have subtle breathing animation
- ✅ CTA buttons have clear hover states
- ✅ Text is helpful, not condescending
- ✅ Icons are relevant to context

---

### Task 6.2: Progressive Disclosure Animations
**Priority**: 🟢 MEDIUM  
**Estimated Time**: 30 minutes

**Deliverables**:
- [ ] Create `src/components/ui/Collapsible.tsx`
- [ ] Implement smooth expand/collapse
- [ ] Add chevron rotation animation
- [ ] Create accordion component
- [ ] Add height transition with auto sizing

**Use Cases**:
- Firefighter profile details
- Calendar filters panel
- Advanced search options
- Activity log filters

**Acceptance Criteria**:
- ✅ Content height calculates correctly
- ✅ No content clipping during transition
- ✅ Chevron rotates smoothly (180deg)
- ✅ Keyboard accessible (Enter/Space to toggle)

---

## 📋 Phase 7: Hover Effects & Focus States (1.5 hours)

### Task 7.1: Enhanced Hover States
**Priority**: 🟡 HIGH  
**Estimated Time**: 1 hour

**Deliverables**:
- [ ] Audit all interactive elements for hover states
- [ ] Add scale transform on hover (scale: 1.02)
- [ ] Implement shadow elevation changes
- [ ] Add underline animations for links
- [ ] Create color transitions for icons

**Elements to Enhance**:
- Firefighter cards
- Calendar day cells
- Navigation items
- Action buttons
- Links in text
- Icon buttons

**Acceptance Criteria**:
- ✅ All clickable elements have hover feedback
- ✅ Hover transitions are smooth (150ms)
- ✅ Touch devices don't show hover states
- ✅ Disabled elements have no hover effect

---

### Task 7.2: Focus Ring Enhancements
**Priority**: 🔴 CRITICAL (Accessibility)  
**Estimated Time**: 30 minutes

**Deliverables**:
- [ ] Create custom focus ring system
- [ ] Implement animated focus ring (fade in)
- [ ] Add offset outline for better visibility
- [ ] Create focus-within states for containers
- [ ] Ensure high contrast for dark mode

**Focus Styles**:
```css
.focus-ring {
  outline: 2px solid var(--focus-color);
  outline-offset: 2px;
  transition: outline-offset 150ms ease-out;
}
```

**Acceptance Criteria**:
- ✅ Focus rings are always visible
- ✅ Focus rings have 3:1 contrast minimum
- ✅ Focus-within highlights parent containers
- ✅ No focus rings on mouse click (only keyboard)

---

## 📋 Phase 8: Performance Optimization (2 hours)

### Task 8.1: Animation Performance Budgets
**Priority**: 🔴 CRITICAL  
**Estimated Time**: 1 hour

**Deliverables**:
- [ ] Implement FPS monitoring utility
- [ ] Create performance dashboard component
- [ ] Add CPU throttling tests (4x slowdown)
- [ ] Measure paint/composite metrics
- [ ] Create animation budget report

**Performance Budgets**:
- Target: 60fps (16.67ms per frame)
- Warning: < 55fps
- Critical: < 50fps
- Animation duration budget: 300ms max
- Concurrent animations: 3 max

**Acceptance Criteria**:
- ✅ All animations run at 60fps on low-end devices
- ✅ No layout thrashing detected
- ✅ GPU compositing used for transforms
- ✅ Will-change property used correctly

---

### Task 8.2: Reduced Motion Compliance
**Priority**: 🔴 CRITICAL (Accessibility)  
**Estimated Time**: 1 hour

**Deliverables**:
- [ ] Audit all animations for reduced-motion fallbacks
- [ ] Create `@media (prefers-reduced-motion)` utilities
- [ ] Implement instant state changes (no animations)
- [ ] Add user preference toggle in settings
- [ ] Document reduced-motion behavior

**Reduced Motion Rules**:
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Acceptance Criteria**:
- ✅ Zero animations when reduced-motion is on
- ✅ Functionality preserved without animations
- ✅ Crossfades remain (opacity only)
- ✅ User preference persists in localStorage

---

## 📋 Phase 9: Testing & Documentation (2 hours)

### Task 9.1: Animation Testing Suite
**Priority**: 🟡 HIGH  
**Estimated Time**: 1 hour

**Deliverables**:
- [ ] Create `src/components/ui/__tests__/animations.test.tsx`
- [ ] Test reduced-motion compliance
- [ ] Test animation timing
- [ ] Test focus management during transitions
- [ ] Create visual regression tests

**Test Cases**:
```typescript
describe('Animation System', () => {
  it('respects prefers-reduced-motion', () => {});
  it('maintains 60fps during transitions', () => {});
  it('completes animations within budget', () => {});
  it('handles rapid state changes gracefully', () => {});
  it('cleans up animations on unmount', () => {});
});
```

**Acceptance Criteria**:
- ✅ 100% test coverage for animation hooks
- ✅ Visual regression tests pass
- ✅ Performance tests run in CI
- ✅ Accessibility tests include motion

---

### Task 9.2: Documentation & Style Guide
**Priority**: 🟡 HIGH  
**Estimated Time**: 1 hour

**Deliverables**:
- [ ] Create `ANIMATION_STYLE_GUIDE.md`
- [ ] Create Storybook stories for all components
- [ ] Document animation timing decisions
- [ ] Create "Do's and Don'ts" section
- [ ] Add code examples for common patterns

**Documentation Sections**:
1. Animation Principles
2. Timing & Easing Reference
3. Component API Documentation
4. Performance Guidelines
5. Accessibility Considerations
6. Common Patterns & Recipes

**Acceptance Criteria**:
- ✅ Every animated component has Storybook story
- ✅ Code examples are copy-pasteable
- ✅ Performance budgets are documented
- ✅ Reduced-motion guidelines are clear

---

## 🎨 Design System Integration

### Animation Principles

#### 1. **Purposeful**
Every animation should have a clear purpose:
- Provide feedback (button press)
- Guide attention (new item added)
- Show relationships (parent-child expansion)
- Communicate brand personality (celebratory moments)

#### 2. **Performant**
- Use `transform` and `opacity` only (GPU-accelerated)
- Avoid animating `width`, `height`, `top`, `left`
- Keep animations under 300ms
- Limit concurrent animations to 3 max

#### 3. **Accessible**
- Respect `prefers-reduced-motion`
- Maintain keyboard focus visibility
- Announce state changes to screen readers
- Don't rely on animation alone for information

#### 4. **Subtle**
- Default to subtle movements (2-5px)
- Use moderate easing (not too bouncy)
- Avoid distracting attention from content
- Save expressive animations for celebrations

---

## 📊 Performance Metrics

### Target Metrics
| Metric | Target | Warning | Critical |
|--------|--------|---------|----------|
| Frame Rate | 60fps | 55fps | 50fps |
| Animation Duration | < 300ms | < 500ms | > 500ms |
| Paint Time | < 10ms | < 15ms | > 16ms |
| Composite Time | < 5ms | < 8ms | > 10ms |
| Layout Shifts (CLS) | 0 | 0.05 | 0.1 |

### Monitoring
```typescript
// Performance monitoring utility
const monitorAnimation = (name: string, callback: () => void) => {
  const start = performance.now();
  
  callback();
  
  const duration = performance.now() - start;
  
  if (duration > ANIMATION_BUDGET) {
    console.warn(`Animation "${name}" exceeded budget: ${duration}ms`);
  }
};
```

---

## 🛠️ Implementation Order

### Week 1: Foundation & Core Interactions
1. ✅ Animation utilities and hooks (Day 1)
2. ✅ Button press animations (Day 1-2)
3. ✅ Form input enhancements (Day 2)
4. ✅ Toggle switches (Day 2)
5. ✅ Skeleton screens (Day 3)

### Week 2: States & Transitions
6. ✅ Loading indicators (Day 1)
7. ✅ Page transitions (Day 1-2)
8. ✅ Stagger animations (Day 2)
9. ✅ Empty states (Day 3)
10. ✅ Progressive disclosure (Day 3)

### Week 3: Delight & Polish
11. ✅ Success celebrations (Day 1)
12. ✅ Drag-drop feedback (Day 1-2)
13. ✅ Toast enhancements (Day 2)
14. ✅ Hover effects audit (Day 2-3)
15. ✅ Focus ring system (Day 3)

### Week 4: Performance & Testing
16. ✅ Performance optimization (Day 1-2)
17. ✅ Reduced motion compliance (Day 2)
18. ✅ Testing suite (Day 3)
19. ✅ Documentation (Day 3-4)
20. ✅ Final polish & QA (Day 4-5)

---

## 📁 File Structure

```
src/
├── components/
│   └── ui/
│       ├── AnimatedButton.tsx
│       ├── AnimatedToggle.tsx
│       ├── AnimatedInput.tsx
│       ├── Skeleton.tsx
│       ├── SkeletonCard.tsx
│       ├── SkeletonTable.tsx
│       ├── SkeletonList.tsx
│       ├── Spinner.tsx
│       ├── ProgressBar.tsx
│       ├── PulseLoader.tsx
│       ├── PageTransition.tsx
│       ├── Confetti.tsx
│       ├── SuccessAnimation.tsx
│       ├── Collapsible.tsx
│       └── __tests__/
│           └── animations.test.tsx
├── hooks/
│   ├── useReducedMotion.ts
│   ├── useAnimation.ts
│   ├── useStaggerAnimation.ts
│   └── useFocusRing.ts
├── utils/
│   ├── animations.ts
│   └── performanceMonitor.ts
├── styles/
│   ├── animations.css
│   └── focus-rings.css
└── docs/
    └── ANIMATION_STYLE_GUIDE.md
```

---

## ✅ Definition of Done

### Per Component
- [ ] Component implemented with animations
- [ ] Reduced motion fallback implemented
- [ ] Unit tests written and passing
- [ ] Storybook story created
- [ ] Performance tested (60fps)
- [ ] Accessibility tested (keyboard + screen reader)
- [ ] Code reviewed
- [ ] Documentation updated

### Per Phase
- [ ] All tasks completed
- [ ] Integration tests passing
- [ ] Performance budgets met
- [ ] Visual regression tests passing
- [ ] Accessibility audit clean
- [ ] User testing conducted
- [ ] Documentation complete

### Overall Project
- [ ] All components implemented
- [ ] Full test coverage (>80%)
- [ ] Performance metrics met
- [ ] WCAG 2.1 AA compliant
- [ ] Style guide complete
- [ ] Stakeholder approval
- [ ] Production deployment successful

---

## 🚀 Getting Started

### Step 1: Set Up Development Environment
```bash
# Install dependencies (if any new ones needed)
pnpm install

# Run development server
pnpm dev

# Open Storybook (for component development)
pnpm storybook
```

### Step 2: Create Feature Branch
```bash
git checkout -b feature/micro-interactions
```

### Step 3: Start with Foundation (Phase 1)
Begin with Task 1.1: Animation Utilities & Hooks

---

## 📝 Notes & Considerations

### Browser Support
- Modern evergreen browsers (Chrome, Firefox, Safari, Edge)
- CSS transitions and transforms
- `prefers-reduced-motion` media query
- `will-change` property
- `requestAnimationFrame` API

### Performance Considerations
- Avoid animating expensive properties (width, height, top, left)
- Use `transform: translateX/Y/Z` instead of `left/top`
- Use `transform: scale()` instead of width/height
- Batch DOM reads and writes
- Use `will-change` sparingly (only during animation)
- Debounce/throttle scroll-triggered animations

### Accessibility Requirements
- All animations must have reduced-motion fallback
- Focus must remain visible during transitions
- State changes must be announced to screen readers
- Keyboard navigation must work during animations
- Color is not the only indicator of state

### Edge Cases to Handle
- Rapid state changes (debounce animations)
- Unmounting during animation (cleanup)
- Nested animations (coordinate timing)
- Mobile performance (less GPU power)
- Slow network (skeleton states)
- Touch vs mouse (different feedback)

---

## 🎓 References & Resources

### Animation Libraries (for inspiration, not dependencies)
- Framer Motion (React animation library)
- React Spring (physics-based animations)
- GSAP (GreenSock Animation Platform)
- Anime.js (lightweight animation library)

### Best Practices
- [Material Design Motion](https://material.io/design/motion)
- [Apple Human Interface Guidelines - Motion](https://developer.apple.com/design/human-interface-guidelines/motion)
- [Accessible Animations](https://www.a11yproject.com/posts/2019-01-23-animation-accessibility/)
- [Web Animation Performance Guide](https://web.dev/animations-guide/)

### Tools
- Chrome DevTools Performance Panel
- Lighthouse CI (performance monitoring)
- WebPageTest (real device testing)
- Storybook (component development)

---

**TOTAL ESTIMATED TIME**: 18-22 hours  
**RECOMMENDED SPRINT**: 3-4 weeks part-time or 1-2 weeks full-time  
**COMPLEXITY**: Medium-High  
**RISK LEVEL**: Low (additive, non-breaking changes)
