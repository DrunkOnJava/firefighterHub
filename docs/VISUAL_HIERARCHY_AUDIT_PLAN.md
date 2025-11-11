# Comprehensive Visual Hierarchy Audit & Analysis Plan
## FirefighterHub Interface

**Date Created:** 2025-11-07  
**Status:** Planning Phase  
**Estimated Duration:** 3-4 weeks  
**Priority:** High

---

## Executive Summary

This document outlines a comprehensive visual hierarchy audit for the FirefighterHub shift management application. The audit will evaluate how effectively design elements guide user attention, facilitate task completion, and support the primary user goals of managing firefighter shifts, holds, and roster operations.

---

## Table of Contents

1. [Audit Objectives](#audit-objectives)
2. [Scope & Key Pages](#scope--key-pages)
3. [Task List by Phase](#task-list-by-phase)
4. [Deliverables](#deliverables)
5. [Success Metrics](#success-metrics)
6. [Timeline](#timeline)

---

## Audit Objectives

### Primary Goals
- **Improve scannability** - Users can quickly locate information
- **Clarify action hierarchy** - Primary actions are obvious, secondary actions accessible
- **Optimize reading patterns** - Content follows natural F/Z-pattern flows
- **Enhance accessibility** - WCAG AAA compliance for visual hierarchy
- **Maintain brand consistency** - MaterialM OKLCH color system alignment

### Secondary Goals
- Reduce cognitive load during shift transitions
- Improve emergency response time for hold completions
- Optimize mobile responsiveness (375px - 1920px)
- Support both light and dark mode effectively

---

## Scope & Key Pages

### Pages to Audit

#### 1. **Main Dashboard** (Home View)
- **Components:** Header, ShiftSelector, NextUpBar, FirefighterList, Calendar Grid
- **Primary Tasks:** View next firefighter in rotation, complete holds, add/remove personnel
- **User Type:** Shift supervisors, Battalion Chiefs

#### 2. **Calendar View**
- **Components:** BigCalendar, DayCell, DayModal, HoldForm, CalendarLegend
- **Primary Tasks:** Schedule holds, view monthly overview, identify patterns
- **User Type:** Planning officers, shift commanders

#### 3. **Firefighter Profile Modal**
- **Components:** FirefighterProfileModal, certification badges, hold history
- **Primary Tasks:** View detailed history, verify certifications, transfer shifts
- **User Type:** Administrative staff

#### 4. **Activity Log View**
- **Components:** ActivityLogModal, activity timeline, filter controls
- **Primary Tasks:** Audit trail review, compliance verification
- **User Type:** Battalion Chiefs, compliance officers

#### 5. **Mobile Views** (375px - 768px)
- **Components:** BottomNav, MobileNav, collapsed layouts
- **Primary Tasks:** Quick hold completion on-site
- **User Type:** Field supervisors

---

## Task List by Phase

### **PHASE 1: Discovery & Analysis** (Week 1)

#### Task 1.1: Reading Pattern Analysis
- [ ] **1.1.1** Map Z-pattern flow on desktop dashboard (1920px)
  - Identify top-left entry point (logo/shift selector)
  - Track horizontal scan path to primary actions
  - Map diagonal descent to content area
  - Verify bottom-right conclusion point
  
- [ ] **1.1.2** Map F-pattern flow on calendar view
  - Analyze horizontal month header scan
  - Track vertical left-edge day number scanning
  - Map secondary horizontal hold badge scanning
  
- [ ] **1.1.3** Analyze mobile reading patterns (375px)
  - Evaluate vertical scroll hierarchy
  - Assess thumb-zone accessibility
  - Map gesture interaction flows
  
- [ ] **1.1.4** Create heatmap predictions
  - Generate eye-tracking pattern overlays
  - Identify "dead zones" with low attention
  - Mark competition points (conflicting elements)

#### Task 1.2: Size Relationship Audit
- [ ] **1.2.1** Measure primary action button sizes
  - Complete Hold button: Current vs recommended
  - Quick Add Firefighter button: Current vs recommended
  - Schedule Hold button: Current vs recommended
  
- [ ] **1.2.2** Measure secondary action sizes
  - Help icon: Current vs recommended
  - Dark mode toggle: Current vs recommended
  - Activity log access: Current vs recommended
  
- [ ] **1.2.3** Calculate size ratios
  - Primary:Secondary ratio (target: 1.5:1 minimum)
  - Tertiary:Secondary ratio (target: 0.75:1)
  - Icon:Button ratio consistency check
  
- [ ] **1.2.4** Document sizing inconsistencies
  - List all elements <44px (mobile accessibility fail)
  - Identify oversized tertiary elements
  - Note platform-specific size issues (iOS vs Android)

#### Task 1.3: Color Hierarchy Analysis
- [ ] **1.3.1** Audit color contrast ratios (WCAG AAA)
  - Primary actions: Target 7:1 minimum
  - Secondary text: Target 4.5:1 minimum
  - Disabled states: Target 3:1 minimum
  
- [ ] **1.3.2** Map color usage by priority
  - High-priority elements: `--materialm-success`, `--materialm-error`, `--materialm-primary`
  - Medium-priority: `--text` (#e2e8f0)
  - Low-priority: `--muted` (#94a3b8)
  
- [ ] **1.3.3** Evaluate color saturation distribution
  - Check if high saturation reserved for CTA buttons
  - Verify muted tones for supporting elements
  - Analyze dark mode color hierarchy effectiveness
  
- [ ] **1.3.4** Test color-blind accessibility
  - Simulate Protanopia (red-blind)
  - Simulate Deuteranopia (green-blind)
  - Simulate Tritanopia (blue-blind)
  - Document required pattern/shape fallbacks

#### Task 1.4: Typography Hierarchy Audit
- [ ] **1.4.1** Measure font size scale
  - H1: Current 20px → Recommended ?
  - H2: Current 18px → Recommended ?
  - H3: Current 16px → Recommended ?
  - Body: Current 14px → Recommended ?
  - Caption: Current 11-12px → Recommended ?
  
- [ ] **1.4.2** Evaluate font weight distribution
  - Headings: 700 (bold) - Verify usage
  - Emphasis: 600 (semi-bold) - Verify usage
  - Body: 400-500 (normal/medium) - Verify usage
  
- [ ] **1.4.3** Analyze line-height relationships
  - Dense UI: 1.2 (current) - Evaluate readability
  - Body text: Recommend 1.5-1.6
  - Headings: Recommend 1.2-1.3
  
- [ ] **1.4.4** Test readability across viewport sizes
  - 375px mobile: Minimum 14px body, 16px inputs
  - 768px tablet: Scale appropriately
  - 1920px desktop: Maximum comfortable reading width

#### Task 1.5: Whitespace Distribution Analysis
- [ ] **1.5.1** Measure spacing between major sections
  - Header to content: Current 16px (`--gap`)
  - Calendar to sidebar: Current 16px
  - NextUpBar to roster: Current 12px
  
- [ ] **1.5.2** Evaluate content grouping effectiveness
  - Related elements: Should be 8-12px apart
  - Unrelated sections: Should be 24-32px apart
  - Check for visual "breathing room"
  
- [ ] **1.5.3** Analyze padding inside containers
  - Card padding: Current 12-14px
  - Modal padding: Current varies
  - Button padding: Current 10-16px
  
- [ ] **1.5.4** Map whitespace ratios
  - Content:Whitespace ratio (target: 60:40)
  - Identify cramped areas
  - Identify excessive whitespace

#### Task 1.6: Visual Weight Assessment
- [ ] **1.6.1** Evaluate border thickness hierarchy
  - Primary containers: Current 1px
  - Emphasis borders: Current 2px (today indicator)
  - Interaction states: Current varies
  
- [ ] **1.6.2** Analyze shadow usage
  - Header: `box-shadow: 0 0 0 1px rgba(0,0,0,.15) inset`
  - Cards: Current none
  - Modals: Current varies
  
- [ ] **1.6.3** Assess background treatment layers
  - App background: `#1e293b` (base layer)
  - Card background: `#1e293b` (same - issue?)
  - Alternate surface: `#0f1a2b`
  - Header: `#0f172a`
  
- [ ] **1.6.4** Calculate combined visual weight scores
  - Formula: (Size × 0.3) + (Color Saturation × 0.25) + (Border × 0.15) + (Shadow × 0.15) + (Position × 0.15)
  - Score each major UI element
  - Verify scores align with intended hierarchy

---

### **PHASE 2: Quantitative Measurement** (Week 2)

#### Task 2.1: Create Scoring Rubric
- [ ] **2.1.1** Define scannability metrics
  - **Eye path efficiency:** 0-100 score (Z/F-pattern alignment)
  - **Information density:** Elements per 100px² (target: 3-5)
  - **Visual anchors:** Count of clear waypoints (target: 5-7 per screen)
  
- [ ] **2.1.2** Define action clarity metrics
  - **Primary action discovery time:** <3 seconds target
  - **CTA visual prominence:** Contrast ratio + size ratio composite score
  - **Action disambiguation:** Uniqueness score (no similar-looking actions)
  
- [ ] **2.1.3** Define information prioritization metrics
  - **Content hierarchy levels:** Count (target: 3-4 max)
  - **Priority alignment:** % match between visual weight and user needs
  - **Cognitive load score:** Decisions required per task (target: <5)
  
- [ ] **2.1.4** Create composite hierarchy effectiveness score
  - Scannability: 35% weight
  - Action Clarity: 40% weight
  - Information Prioritization: 25% weight
  - **Target overall score:** 80/100 minimum

#### Task 2.2: Conduct Automated Accessibility Audits
- [ ] **2.2.1** Run axe DevTools audit
  - Document all violations
  - Prioritize by severity
  - Create remediation tickets
  
- [ ] **2.2.2** Run Lighthouse accessibility audit
  - Target: 95+ accessibility score
  - Document performance impact of hierarchy changes
  
- [ ] **2.2.3** Test keyboard navigation hierarchy
  - Tab order matches visual hierarchy
  - Focus indicators clear and consistent
  - Skip links for major sections
  
- [ ] **2.2.4** Validate ARIA hierarchy
  - Heading levels logical (no skipped levels)
  - Landmark roles present and correct
  - Live regions for dynamic content

#### Task 2.3: Generate Current State Measurements
- [ ] **2.3.1** Screenshot baseline states
  - Desktop: 1920px, 1440px, 1024px
  - Tablet: 768px
  - Mobile: 375px, 414px
  - Dark mode and light mode for each
  
- [ ] **2.3.2** Extract CSS values for all measured elements
  - Font sizes, weights, line-heights
  - Colors (hex + OKLCH values)
  - Spacing values (padding, margin, gap)
  - Border properties
  - Shadow properties
  
- [ ] **2.3.3** Create measurement spreadsheet
  - Columns: Element, Property, Current Value, Target Value, Priority, Notes
  - Include formula references for calculated values
  
- [ ] **2.3.4** Document current design tokens
  - Extract from `tailwind.config.js`
  - Extract from `index.css` custom properties
  - Extract from `theme.ts` object
  - Identify gaps and inconsistencies

---

### **PHASE 3: User Testing & Validation** (Week 3)

#### Task 3.1: Card Sorting Exercise
- [ ] **3.1.1** Prepare card set (20-30 cards)
  - Include all major UI elements
  - Add category labels
  - Create digital version (Optimal Workshop)
  
- [ ] **3.1.2** Recruit participants (n=15-20)
  - 60% firefighters/shift supervisors
  - 30% battalion chiefs
  - 10% administrative staff
  
- [ ] **3.1.3** Conduct open card sort
  - Let users create their own categories
  - Identify mental model mismatches
  
- [ ] **3.1.4** Analyze results
  - Agreement matrix (95% similarity target)
  - Popular vs unpopular categories
  - Unexpected groupings

#### Task 3.2: First-Click Testing
- [ ] **3.2.1** Define test scenarios (8-10 tasks)
  - "Complete a hold for the next firefighter"
  - "Schedule a hold for December 15th"
  - "View John Smith's hold history"
  - "Change from Shift A to Shift B"
  - "Add a new firefighter to the roster"
  
- [ ] **3.2.2** Recruit participants (n=20-30)
  - Same demographics as card sort
  
- [ ] **3.2.3** Conduct tests (Chalkmark or similar)
  - Record first click location
  - Record time to first click
  - Measure success rate
  
- [ ] **3.2.4** Analyze results
  - Success rate by task (target: 80%+)
  - Click heatmaps
  - Misclick patterns

#### Task 3.3: Attention Tracking Study
- [ ] **3.3.1** Select attention tracking method
  - **Option A:** Eye-tracking hardware (Tobii, EyeTech)
  - **Option B:** Predictive attention modeling (Feng-Vis, 3M VAS)
  - **Option C:** Mouse tracking as proxy (Hotjar, Mouseflow)
  
- [ ] **3.3.2** Set up test scenarios (5-7 tasks)
  - Free exploration (30 seconds)
  - Directed tasks (2 minutes each)
  
- [ ] **3.3.3** Conduct sessions (n=10-15)
  - Record gaze path
  - Record fixation duration
  - Record scanpath sequence
  
- [ ] **3.3.4** Analyze attention patterns
  - Generate heatmaps
  - Calculate time to first fixation (critical elements)
  - Map actual vs predicted attention flow

#### Task 3.4: A/B Testing (Proposed Changes)
- [ ] **3.4.1** Identify 3-5 high-impact changes
  - Example: Increase "Complete Hold" button size by 30%
  - Example: Change primary action color to higher saturation
  
- [ ] **3.4.2** Create test variations
  - Control (current design)
  - Variant A (hierarchy improvements)
  - Variant B (alternative approach)
  
- [ ] **3.4.3** Deploy to test environment
  - Use feature flags for controlled rollout
  - Track metrics: task completion time, error rate, satisfaction
  
- [ ] **3.4.4** Analyze results
  - Statistical significance (p < 0.05)
  - Effect size (Cohen's d)
  - User preference ratings

---

### **PHASE 4: Recommendations & Implementation** (Week 4)

#### Task 4.1: Generate Specific Recommendations

##### 4.1.1 Typography Recommendations
- [ ] **H1 Adjustments**
  - Current: 16-20px (varies by breakpoint)
  - Recommended: 24px desktop, 20px mobile
  - Implementation: Update `tokens.typography.heading.h1`
  
- [ ] **H2 Adjustments**
  - Current: 18px
  - Recommended: 20px desktop, 18px mobile
  
- [ ] **H3 Adjustments**
  - Current: 16px
  - Recommended: 18px desktop, 16px mobile
  
- [ ] **Body Text Adjustments**
  - Current: 14px (15px on mobile)
  - Recommended: 16px desktop, 15px mobile
  - Justification: Better readability, reduced eye strain
  
- [ ] **Line-Height Scale**
  - Headings: 1.2 → 1.25 (slightly more breathing room)
  - Body: 1.2 → 1.5 (critical for readability)
  - Dense UI (roster rows): 1.2 (keep current)

##### 4.1.2 Color Adjustments
- [ ] **Primary Actions**
  - Current: `--materialm-primary` (#5d87ff)
  - Recommended: Increase saturation by 10% for CTAs
  - Create new token: `--materialm-primary-emphasis`
  
- [ ] **Success States**
  - Current: `--materialm-success` (#13deb9)
  - Keep current (already high visibility)
  
- [ ] **Error/Warning**
  - Current: `--materialm-error` (#fa896b), `--materialm-warning` (#ffae1f)
  - Evaluate outline vs solid for holds indicator (accessibility)
  
- [ ] **Text Hierarchy**
  - Primary: `--text` (#e2e8f0) - Keep
  - Secondary: `--muted` (#94a3b8) - Increase to #a3b2c8 (better contrast)
  - Tertiary: Add new token `--text-tertiary` (#7a8a9f)

##### 4.1.3 Spacing Recommendations
- [ ] **Section Spacing**
  - Current: `--gap: 16px`
  - Recommended: 24px between major sections (desktop)
  - Keep 16px for mobile
  
- [ ] **Card Padding**
  - Current: 12-14px (inconsistent)
  - Standardize: 16px desktop, 12px mobile
  
- [ ] **Button Padding**
  - Current: Varies
  - Standardize: `padding: 12px 20px` (desktop), `12px 16px` (mobile)
  - Icon-only: 12px all sides

##### 4.1.4 Size Relationship Recommendations
- [ ] **Primary Button Sizing**
  - Current: min-height 44px (mobile), varies (desktop)
  - Recommended: min-height 48px (desktop), 44px (mobile)
  - Width: min-width 120px for text buttons
  
- [ ] **Secondary Button Sizing**
  - Recommended: 32px height (desktop), 40px (mobile)
  - Ensures 1.5:1 size ratio to primary
  
- [ ] **Icon Button Sizing**
  - Current: min 44px × 44px
  - Keep current (WCAG compliant)

##### 4.1.5 Visual Weight Adjustments
- [ ] **Border Thickness**
  - Standard: 1px (keep)
  - Emphasis: 2px → 3px (today indicator, selected state)
  - Dividers: 1px → 0.5px (lighter weight)
  
- [ ] **Shadow Hierarchy**
  - Level 0 (flush): none
  - Level 1 (cards): `box-shadow: 0 1px 3px rgba(0,0,0,0.12)`
  - Level 2 (hover): `box-shadow: 0 4px 6px rgba(0,0,0,0.16)`
  - Level 3 (modals): `box-shadow: 0 10px 25px rgba(0,0,0,0.25)`
  
- [ ] **Background Layer Separation**
  - Issue: Card background (`#1e293b`) = App background
  - Fix: Darken app to `#1a2332` OR lighten card to `#243447`

#### Task 4.2: Create Before/After Mockups
- [ ] **4.2.1** Main dashboard comparison
  - Annotate all changes with measurements
  - Show Z-pattern overlay
  - Highlight improved hierarchy
  
- [ ] **4.2.2** Calendar view comparison
  - Show improved day cell hierarchy
  - Demonstrate hold badge visibility
  - Illustrate F-pattern optimization
  
- [ ] **4.2.3** Mobile view comparison
  - Emphasize thumb-zone optimization
  - Show improved button sizing
  - Demonstrate vertical rhythm
  
- [ ] **4.2.4** Dark mode validation
  - Ensure all changes work in dark mode
  - Verify contrast ratios maintained
  - Test color hierarchy effectiveness

#### Task 4.3: CSS Implementation Plan
- [ ] **4.3.1** Create new design tokens file
  - File: `src/styles/design-tokens.css`
  - Organize by category: Typography, Color, Spacing, Shadow, Border
  
- [ ] **4.3.2** Define typography scale
  ```css
  :root {
    /* Typography Scale - Major Third (1.250) */
    --font-size-xs: 0.64rem;    /* 10.24px */
    --font-size-sm: 0.8rem;     /* 12.8px */
    --font-size-base: 1rem;     /* 16px */
    --font-size-md: 1.25rem;    /* 20px */
    --font-size-lg: 1.563rem;   /* 25px */
    --font-size-xl: 1.953rem;   /* 31.25px */
    
    /* Line Heights */
    --line-height-tight: 1.25;
    --line-height-normal: 1.5;
    --line-height-relaxed: 1.75;
    
    /* Font Weights */
    --font-weight-normal: 400;
    --font-weight-medium: 500;
    --font-weight-semibold: 600;
    --font-weight-bold: 700;
  }
  ```
  
- [ ] **4.3.3** Define spacing scale (8px grid)
  ```css
  :root {
    /* Spacing Scale */
    --space-1: 0.25rem;  /* 4px */
    --space-2: 0.5rem;   /* 8px */
    --space-3: 0.75rem;  /* 12px */
    --space-4: 1rem;     /* 16px */
    --space-5: 1.25rem;  /* 20px */
    --space-6: 1.5rem;   /* 24px */
    --space-8: 2rem;     /* 32px */
    --space-10: 2.5rem;  /* 40px */
    --space-12: 3rem;    /* 48px */
    --space-16: 4rem;    /* 64px */
  }
  ```
  
- [ ] **4.3.4** Define color hierarchy tokens
  ```css
  :root {
    /* Color Hierarchy */
    --color-action-primary: var(--materialm-primary);
    --color-action-primary-hover: #7a9dff;
    --color-action-secondary: var(--text);
    --color-action-danger: var(--materialm-error);
    
    /* Text Hierarchy */
    --color-text-primary: #e2e8f0;
    --color-text-secondary: #a3b2c8;  /* Improved from #94a3b8 */
    --color-text-tertiary: #7a8a9f;   /* New */
    --color-text-disabled: #64748b;
  }
  ```
  
- [ ] **4.3.5** Define shadow hierarchy
  ```css
  :root {
    /* Shadows */
    --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
    --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
    --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15);
  }
  ```
  
- [ ] **4.3.6** Update component styles to use tokens
  - Priority 1: Button.tsx (primary actions)
  - Priority 2: Header.tsx (global navigation)
  - Priority 3: FirefighterItem.tsx (repeated elements)
  - Priority 4: Calendar components

#### Task 4.4: Migration Strategy
- [ ] **4.4.1** Create migration checklist
  - [ ] Backup current styles
  - [ ] Create feature branch: `feature/visual-hierarchy-improvements`
  - [ ] Implement token system
  - [ ] Update one component at a time
  - [ ] Test each component in isolation
  - [ ] Update unit tests
  - [ ] Update visual regression tests
  
- [ ] **4.4.2** Component migration priority list
  1. Design tokens file (foundation)
  2. Button component (highest impact)
  3. Header component (always visible)
  4. FirefighterItem (repeated element)
  5. Calendar DayCell (repeated element)
  6. Modal components
  7. Form inputs
  8. Remaining components
  
- [ ] **4.4.3** Create codemods for bulk updates
  - Replace hardcoded colors with tokens
  - Replace magic numbers with spacing scale
  - Update font-size declarations
  
- [ ] **4.4.4** Validation gates
  - [ ] TypeScript compilation passes
  - [ ] All unit tests pass
  - [ ] Accessibility audit passes (axe)
  - [ ] Visual regression tests pass
  - [ ] Manual QA on all viewports
  - [ ] Dark mode verification

#### Task 4.5: Documentation
- [ ] **4.5.1** Create design system documentation
  - File: `docs/DESIGN_SYSTEM.md`
  - Sections: Typography, Color, Spacing, Components
  - Include usage examples
  - Include accessibility guidelines
  
- [ ] **4.5.2** Update component documentation
  - Add visual hierarchy notes to each component
  - Document token usage
  - Include before/after examples
  
- [ ] **4.5.3** Create hierarchy decision flowchart
  - "When should I use primary button vs secondary?"
  - "How do I choose the right heading level?"
  - "What spacing value should I use?"
  
- [ ] **4.5.4** Create audit report
  - Executive summary
  - Findings (current state)
  - Recommendations (with rationale)
  - Implementation plan
  - ROI estimation (time saved, errors reduced)

---

## Deliverables

### Required Deliverables

1. **Visual Hierarchy Audit Report** (PDF, 30-50 pages)
   - Executive summary
   - Methodology
   - Current state analysis
   - Scoring rubric results
   - User testing findings
   - Recommendations with mockups
   - Implementation roadmap

2. **Before/After Mockup Set** (Figma/Sketch)
   - Main dashboard (3 breakpoints)
   - Calendar view (3 breakpoints)
   - Mobile views (2 breakpoints)
   - Dark mode variants
   - Annotated with measurements

3. **Design Token System** (CSS + TypeScript)
   - `design-tokens.css` - CSS custom properties
   - `design-tokens.ts` - TypeScript definitions
   - Migration guide
   - Usage examples

4. **User Testing Results** (Spreadsheet + Report)
   - Card sorting analysis matrix
   - First-click heatmaps and success rates
   - Attention tracking visualizations
   - A/B test statistical analysis

5. **Implementation Guide** (Markdown)
   - Component migration checklist
   - Code examples
   - Testing requirements
   - Rollout strategy

### Optional Deliverables

6. **Visual Hierarchy Scoring Dashboard** (Interactive)
   - Real-time hierarchy effectiveness score
   - Component-level breakdown
   - Trend over time

7. **Accessibility Compliance Report**
   - WCAG 2.1 AAA checklist
   - Remediation priority matrix
   - Automated test results

8. **Eye-Tracking Video Highlights**
   - 2-3 minute compilation
   - Narrated findings
   - Comparison of current vs proposed

---

## Success Metrics

### Quantitative Metrics

| Metric | Baseline | Target | Measurement Method |
|--------|----------|--------|-------------------|
| **Primary Action Discovery Time** | TBD | <3 seconds | First-click testing |
| **Task Completion Success Rate** | TBD | >85% | User testing |
| **Accessibility Score (Lighthouse)** | TBD | >95 | Automated audit |
| **Visual Hierarchy Effectiveness Score** | TBD | >80/100 | Custom rubric |
| **First-Click Accuracy** | TBD | >80% | Click testing |
| **Information Density** | TBD | 3-5 elements/100px² | Measurement |
| **Color Contrast Ratio (Primary Text)** | TBD | >7:1 | Automated check |
| **Mobile Touch Target Compliance** | TBD | 100% | Manual audit |

### Qualitative Metrics

- **User Satisfaction:** Post-test survey (5-point scale)
- **Perceived Clarity:** "The interface hierarchy is clear" (agree/disagree)
- **Task Confidence:** "I am confident I completed the task correctly" (agree/disagree)
- **Visual Appeal:** "The interface looks professional" (agree/disagree)

### Business Metrics

- **Error Rate Reduction:** Hold completion errors before/after
- **Training Time Reduction:** New user onboarding duration
- **Support Ticket Reduction:** UI confusion-related tickets

---

## Timeline

### Week 1: Discovery & Analysis
- **Days 1-2:** Reading pattern analysis, size relationships
- **Days 3-4:** Color hierarchy, typography audit
- **Day 5:** Whitespace distribution, visual weight

### Week 2: Quantitative Measurement
- **Days 1-2:** Create scoring rubric, conduct automated audits
- **Days 3-4:** Generate current state measurements
- **Day 5:** Document design tokens

### Week 3: User Testing & Validation
- **Days 1-2:** Card sorting exercise (prep + conduct)
- **Days 2-3:** First-click testing (prep + conduct)
- **Days 4-5:** Attention tracking study, analyze all results

### Week 4: Recommendations & Implementation
- **Days 1-2:** Generate specific recommendations, create mockups
- **Days 3-4:** CSS implementation plan, create migration strategy
- **Day 5:** Documentation, final report compilation

---

## Risk Mitigation

### Identified Risks

1. **Risk:** User testing recruitment challenges
   - **Mitigation:** Pre-recruit participants, offer incentives
   
2. **Risk:** Design changes break existing functionality
   - **Mitigation:** Comprehensive visual regression testing, feature flags
   
3. **Risk:** Dark mode compatibility issues
   - **Mitigation:** Test both modes in parallel, dedicated dark mode pass
   
4. **Risk:** Mobile performance degradation
   - **Mitigation:** Lighthouse performance audits, bundle size monitoring
   
5. **Risk:** Scope creep beyond hierarchy
   - **Mitigation:** Strict adherence to task list, parking lot for out-of-scope items

---

## Appendices

### Appendix A: Tools & Resources

**Design Tools:**
- Figma (mockups, annotations)
- Sketch (alternative)
- Adobe XD (alternative)

**Testing Tools:**
- Optimal Workshop (card sorting)
- Chalkmark (first-click testing)
- Hotjar / Mouseflow (attention tracking)
- axe DevTools (accessibility)
- Lighthouse (performance + accessibility)

**Color Tools:**
- WebAIM Contrast Checker
- Stark (color-blind simulation)
- Colorable (contrast verification)

**Development Tools:**
- VS Code + extensions
- Chrome DevTools
- React DevTools
- Tailwind CSS IntelliSense

### Appendix B: Reference Materials

- WCAG 2.1 Guidelines: https://www.w3.org/WAI/WCAG21/quickref/
- Material Design: https://m3.material.io/
- Nielsen Norman Group (Visual Hierarchy): https://www.nngroup.com/articles/visual-hierarchy/
- Gestalt Principles: https://lawsofux.com/
- Butterick's Practical Typography: https://practicaltypography.com/

### Appendix C: Team Roles

- **Lead UX Designer:** Visual hierarchy analysis, mockup creation
- **UX Researcher:** User testing coordination, data analysis
- **Frontend Developer:** CSS implementation, token system
- **QA Engineer:** Regression testing, accessibility validation
- **Product Owner:** Stakeholder liaison, priority decisions

---

## Approval & Sign-Off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Product Owner | | | |
| Lead Designer | | | |
| Engineering Lead | | | |
| QA Lead | | | |

---

**Document Version:** 1.0  
**Last Updated:** 2025-11-07  
**Next Review Date:** Upon completion of Phase 1
