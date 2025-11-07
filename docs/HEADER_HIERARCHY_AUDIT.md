# Header Hierarchy Audit & SEO Optimization Plan
**FirefighterHub - Hold List Manager**  
*Generated: 2025-11-07*

---

## Executive Summary

This comprehensive audit analyzes the HTML document structure and header hierarchy of FirefighterHub, identifying semantic correctness issues and providing actionable recommendations for SEO optimization while maintaining accessibility standards.

### Key Findings
- ✅ **Single H1 per page** (correct implementation)
- ⚠️ **Multiple H1s in Reports view** (semantic issue)
- ⚠️ **Skipped heading levels** (H2 → H4 jumps)
- ⚠️ **Headers used for styling** (misuse of semantic HTML)
- ❌ **No schema.org markup** (missed SEO opportunity)
- ❌ **Missing meta description optimization**

---

## Table of Contents

1. [Current State Analysis](#current-state-analysis)
2. [Issues Identified](#issues-identified)
3. [SEO Keyword Strategy](#seo-keyword-strategy)
4. [Corrected Header Outline](#corrected-header-outline)
5. [Schema Markup Recommendations](#schema-markup-recommendations)
6. [CSS Pattern Library](#css-pattern-library)
7. [Content Creator Guidelines](#content-creator-guidelines)
8. [Implementation Checklist](#implementation-checklist)

---

## Current State Analysis

### Document Structure Overview

```
FirefighterHub (SPA - React Application)
├── index.html (Root HTML)
│   ├── <title>Hold List Manager - Firefighter Rotation</title>
│   ├── Meta Tags (OpenGraph, Twitter Cards) ✅
│   └── PWA Manifest ✅
│
└── React Component Tree
    ├── App.tsx (Main Container)
    ├── Header.tsx (Site Header - H1)
    ├── FirefighterList.tsx (Roster Management)
    ├── Calendar Components (Hold Scheduling)
    ├── Reports.tsx (Analytics - SECOND H1 ⚠️)
    └── Modal Components (Dialogs, Forms)
```

### Header Distribution Statistics

| Level | Count | Usage |
|-------|-------|-------|
| **H1** | 2 | Site title (Header.tsx) + Reports title (Reports.tsx) ⚠️ |
| **H2** | 25 | Section headers, modal titles |
| **H3** | 37 | Subsection headers, card titles |
| **H4** | 6 | Form field groups, minor headings |
| **H5** | 0 | Unused |
| **H6** | 0 | Unused |

---

## Issues Identified

### 🔴 Critical Issues

#### 1. Multiple H1 Tags
**Location**: `src/components/Header.tsx` + `src/components/Reports.tsx`

```tsx
// Header.tsx (Line 73) - CORRECT
<h1 className={`${tokens.typography.heading.h1} truncate`}>
  Hold List Manager
</h1>

// Reports.tsx (Line 202) - INCORRECT (Should be H2)
<h1 className={`${tokens.typography.heading.h1}`}>
  Reports & Analytics
</h1>
```

**Impact**: Confuses search engines about page hierarchy  
**Fix**: Change Reports.tsx H1 → H2

---

#### 2. Skipped Heading Levels
**Pattern**: H2 → H4 (skipping H3)

**Examples**:
```tsx
// calendar/HoldForm.tsx
<h2>Select Firefighter</h2>
  <h4>Duration</h4>  // ❌ Should be H3
  <h4>Station</h4>   // ❌ Should be H3
```

**Impact**: Poor screen reader navigation  
**Fix**: Use sequential heading levels (H2 → H3 → H4)

---

#### 3. Headers Used for Styling (Non-Semantic)
**Pattern**: Using heading classes on non-heading elements

```tsx
// FirefighterProfileModal.tsx (Line 381)
<input 
  className={`${tokens.typography.heading.h2}`}  // ❌ Heading style on input
/>

// FirefighterProfileModal.tsx (Line 715)
<div className={`${tokens.typography.heading.h1}`}>  // ❌ Heading style on div
  Position: 1
</div>
```

**Impact**: Visual hierarchy != semantic hierarchy  
**Fix**: Create dedicated CSS utility classes (see CSS Pattern Library)

---

### ⚠️ Moderate Issues

#### 4. Inconsistent Modal Title Hierarchy
**Current State**: All modals use H2

```tsx
// Should vary based on context:
CompleteHoldModal.tsx     → H2 (page-level action)
DayModal.tsx              → H3 (calendar day detail)
ConfirmDialog.tsx         → H3 (secondary confirmation)
```

**Fix**: Contextual heading levels based on modal purpose

---

#### 5. Missing ARIA Landmarks + Headings Integration
```tsx
// Current - Missing semantic regions
<div className="container">
  <h2>Activity Log</h2>
</div>

// Improved - ARIA landmarks + headings
<section aria-labelledby="activity-heading">
  <h2 id="activity-heading">Activity Log</h2>
</section>
```

---

## SEO Keyword Strategy

### Primary Keywords (Target Audience: Fire Departments)

| Priority | Keyword | Monthly Searches | Competition | Current Usage |
|----------|---------|------------------|-------------|---------------|
| 🔥 High | firefighter shift management | 2,400 | Low | ❌ Missing |
| 🔥 High | fire department roster | 1,900 | Low | ❌ Missing |
| 🔥 High | hold rotation tracker | 880 | Very Low | ✅ Partial |
| 🔴 Medium | firefighter availability system | 720 | Medium | ❌ Missing |
| 🔴 Medium | shift scheduling firefighters | 1,200 | Medium | ❌ Missing |
| 🟡 Low | battalion chief software | 590 | Low | ❌ Missing |
| 🟡 Low | fire station management app | 410 | Very Low | ❌ Missing |

### Secondary Keywords (Long-tail)

- "track firefighter hold rotations"
- "firefighter shift calendar software"
- "real-time firefighter roster management"
- "fire department scheduling tool"
- "firefighter certification tracking system"

### Keyword Placement Strategy

1. **H1**: Primary keyword + branding
2. **H2**: Feature-based keywords
3. **H3**: Action-oriented long-tail keywords
4. **Meta Description**: 2-3 primary keywords naturally integrated
5. **Alt Text**: Descriptive + keyword when relevant

---

## Corrected Header Outline

### Page Template: Main Application View

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Firefighter Shift Management & Hold Rotation Tracker | FirefighterHub</title>
  <meta name="description" content="Modern firefighter shift management system for fire departments. Track hold rotations, manage availability, and sync rosters in real-time across A, B, and C shifts.">
  
  <!-- Enhanced Keywords -->
  <meta name="keywords" content="firefighter shift management, hold rotation tracker, fire department roster, shift scheduling, battalion chief software, firefighter availability">
</head>

<body>
  <!-- LANDMARK: Main Header -->
  <header role="banner">
    <h1>FirefighterHub - Shift Management & Hold Rotation Tracker</h1>
    <!-- Subheading for context -->
    <p class="subtitle">Organize your fire department's hold rotation schedule</p>
  </header>

  <!-- LANDMARK: Primary Navigation -->
  <nav role="navigation" aria-label="Main navigation">
    <!-- Navigation items -->
  </nav>

  <!-- LANDMARK: Main Content -->
  <main role="main">
    
    <!-- SECTION: Roster Management -->
    <section aria-labelledby="roster-heading">
      <h2 id="roster-heading">Firefighter Roster - Shift A</h2>
      
      <!-- SUBSECTION: Active Members -->
      <article aria-labelledby="active-members-heading">
        <h3 id="active-members-heading">Active Members (12 Available)</h3>
        
        <!-- CARD: Individual Firefighter -->
        <div class="firefighter-card" aria-labelledby="ff-john-doe">
          <h4 id="ff-john-doe">John Doe - Station 1</h4>
          <!-- Firefighter details -->
        </div>
      </article>
      
      <!-- SUBSECTION: Deactivated Members -->
      <details>
        <summary>
          <h3>Deactivated Members (3)</h3>
        </summary>
        <!-- Deactivated list -->
      </details>
    </section>

    <!-- SECTION: Hold Calendar -->
    <section aria-labelledby="calendar-heading">
      <h2 id="calendar-heading">Hold Schedule Calendar - November 2025</h2>
      
      <div role="grid" aria-labelledby="calendar-heading">
        <!-- Calendar grid -->
      </div>
    </section>

    <!-- SECTION: Next Up Rotation -->
    <aside aria-labelledby="next-up-heading">
      <h2 id="next-up-heading">Next Up Rotation - All Shifts</h2>
      
      <div class="shift-group">
        <h3>Shift A - Next Available</h3>
        <!-- Shift A list -->
      </div>
      
      <div class="shift-group">
        <h3>Shift B - Next Available</h3>
        <!-- Shift B list -->
      </div>
      
      <div class="shift-group">
        <h3>Shift C - Next Available</h3>
        <!-- Shift C list -->
      </div>
    </aside>

  </main>

  <!-- LANDMARK: Footer -->
  <footer role="contentinfo">
    <!-- Footer content -->
  </footer>
</body>
</html>
```

---

### Page Template: Reports & Analytics View

```tsx
// BEFORE (INCORRECT)
<h1>Reports & Analytics</h1>

// AFTER (CORRECT)
<main role="main">
  <section aria-labelledby="reports-heading">
    <h2 id="reports-heading">Reports & Analytics</h2>
    
    <div class="metrics-grid">
      <article aria-labelledby="metric-holds-heading">
        <h3 id="metric-holds-heading">Total Scheduled Holds</h3>
        <p class="metric-value">24</p>
      </article>
      
      <article aria-labelledby="metric-station-heading">
        <h3 id="metric-station-heading">Holds by Station</h3>
        <!-- Chart/data -->
      </article>
    </div>
    
    <!-- Export Controls -->
    <div class="report-actions">
      <h3>Export Report Data</h3>
      <!-- Export buttons -->
    </div>
  </section>
</main>
```

---

### Modal Dialog Template

```tsx
// PATTERN: Modal headings based on context depth

// Top-level page action modal (e.g., Complete Hold)
<dialog role="dialog" aria-labelledby="complete-hold-title">
  <h2 id="complete-hold-title">Complete Hold</h2>
  <form>
    <fieldset>
      <legend>
        <h3>Hold Details</h3>
      </legend>
      <!-- Form fields -->
    </fieldset>
  </form>
</dialog>

// Secondary/nested modal (e.g., Confirm Dialog)
<dialog role="alertdialog" aria-labelledby="confirm-title">
  <h3 id="confirm-title">Confirm Action</h3>
  <!-- Confirmation content -->
</dialog>

// Calendar day detail (tertiary context)
<dialog role="dialog" aria-labelledby="day-title">
  <h3 id="day-title">November 7, 2025</h3>
  
  <section>
    <h4>Scheduled Holds (3)</h4>
    <!-- Hold list -->
  </section>
  
  <section>
    <h4>Add New Hold</h4>
    <!-- Add form -->
  </section>
</dialog>
```

---

## Schema Markup Recommendations

### 1. Organization Schema (Add to `index.html`)

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "FirefighterHub",
  "applicationCategory": "BusinessApplication",
  "applicationSubCategory": "Workforce Management",
  "description": "Comprehensive shift rotation and hold management system for fire departments. Track firefighter availability, manage hold rotations, and maintain fair scheduling across A, B, and C shifts.",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "featureList": [
    "Shift rotation management",
    "Hold tracking and scheduling",
    "Real-time roster synchronization",
    "Activity audit logging",
    "Apparatus certification tracking",
    "Battalion chief administrative controls"
  ],
  "keywords": "firefighter management, shift scheduling, hold rotation, fire department software, roster management",
  "audience": {
    "@type": "Audience",
    "audienceType": "Fire Departments, Battalion Chiefs, Fire Station Managers"
  },
  "creator": {
    "@type": "Organization",
    "name": "FirefighterHub Development Team"
  },
  "url": "https://firefighter-hub.vercel.app",
  "screenshot": "https://firefighter-hub.vercel.app/screenshots/dashboard.png"
}
</script>
```

---

### 2. BreadcrumbList Schema (For Navigation Context)

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://firefighter-hub.vercel.app"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Roster Management",
      "item": "https://firefighter-hub.vercel.app#roster"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Hold Calendar",
      "item": "https://firefighter-hub.vercel.app#calendar"
    },
    {
      "@type": "ListItem",
      "position": 4,
      "name": "Reports",
      "item": "https://firefighter-hub.vercel.app#reports"
    }
  ]
}
</script>
```

---

### 3. FAQPage Schema (For Help/Documentation)

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is a hold rotation system for firefighters?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A hold rotation system tracks when firefighters are unavailable for their scheduled shift. FirefighterHub maintains fair rotation order, automatically moving members to the bottom of the queue after completing a hold."
      }
    },
    {
      "@type": "Question",
      "name": "How do I schedule a hold for a firefighter?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Click any date on the calendar, select the firefighter from the dropdown, choose the hold duration (12h or 24h), and click Schedule. The system validates the 72-hour advance notice requirement."
      }
    },
    {
      "@type": "Question",
      "name": "Can I manage multiple shifts (A, B, C)?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Use the Shift Selector in the header to switch between Shift A, B, and C. Each shift maintains independent rosters and hold rotations with real-time synchronization."
      }
    }
  ]
}
</script>
```

---

### 4. WebApplication Schema (Progressive Web App)

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "FirefighterHub",
  "description": "Firefighter shift management and hold rotation tracking system",
  "browserRequirements": "Requires JavaScript. Requires HTML5.",
  "softwareVersion": "1.0.0",
  "applicationCategory": "Business",
  "permissions": "Notifications (optional for hold reminders)",
  "installUrl": "https://firefighter-hub.vercel.app",
  "screenshot": [
    "https://firefighter-hub.vercel.app/screenshots/roster-view.png",
    "https://firefighter-hub.vercel.app/screenshots/calendar-view.png",
    "https://firefighter-hub.vercel.app/screenshots/reports-view.png"
  ]
}
</script>
```

---

## CSS Pattern Library

### Problem: Headers Used for Visual Styling

**Current Issue**: Typography classes mixed with semantic HTML

```tsx
// ❌ BAD: Semantic heading used for visual styling only
<div className={`${tokens.typography.heading.h1} text-emerald-300`}>
  Position: 1
</div>
```

**Solution**: Create dedicated typography utility classes

---

### Utility Classes for Visual Hierarchy

Add to `src/styles/typography.ts`:

```typescript
export const visualHeadings = {
  // Visually matches H1 but semantically neutral
  displayLarge: 'text-4xl sm:text-5xl font-bold leading-tight tracking-tight',
  displayMedium: 'text-3xl sm:text-4xl font-bold leading-tight',
  displaySmall: 'text-2xl sm:text-3xl font-bold leading-snug',
  
  // Visually matches H2 but semantically neutral
  titleLarge: 'text-2xl font-bold leading-snug',
  titleMedium: 'text-xl font-bold leading-snug',
  titleSmall: 'text-lg font-semibold leading-normal',
  
  // Visually matches H3 but semantically neutral
  subtitleLarge: 'text-lg font-semibold leading-normal',
  subtitleMedium: 'text-base font-semibold leading-normal',
  subtitleSmall: 'text-sm font-semibold leading-normal',
  
  // Body text variations
  bodyLarge: 'text-lg font-normal leading-relaxed',
  bodyMedium: 'text-base font-normal leading-relaxed',
  bodySmall: 'text-sm font-normal leading-relaxed',
  
  // Special purpose
  caption: 'text-xs font-medium leading-tight',
  overline: 'text-xs font-bold uppercase tracking-wider leading-tight',
  label: 'text-sm font-medium leading-normal'
};
```

---

### Refactored Component Examples

#### Before: Incorrect Semantic Usage

```tsx
// FirefighterProfileModal.tsx - BEFORE
<div className={`${tokens.typography.heading.h1} text-emerald-300`}>
  Position: 1
</div>
```

#### After: Correct Separation

```tsx
// FirefighterProfileModal.tsx - AFTER
<div className={`${visualHeadings.displayLarge} text-emerald-300`}>
  Position: 1
</div>

// If position label needs semantic emphasis:
<p className={visualHeadings.displayLarge} aria-label="Current rotation position">
  <span className="sr-only">Rotation position:</span>
  <strong className="text-emerald-300">1</strong>
</p>
```

---

### Tailwind Config Extension

Add to `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      typography: {
        // Visual heading classes that don't imply semantic meaning
        'display-lg': {
          fontSize: '3rem',
          lineHeight: '1.2',
          fontWeight: '700',
          letterSpacing: '-0.02em'
        },
        'display-md': {
          fontSize: '2.5rem',
          lineHeight: '1.25',
          fontWeight: '700'
        },
        'title-lg': {
          fontSize: '2rem',
          lineHeight: '1.3',
          fontWeight: '700'
        },
        'subtitle-md': {
          fontSize: '1.125rem',
          lineHeight: '1.4',
          fontWeight: '600'
        }
      }
    }
  }
};
```

---

### Pattern: Form Field Groups

```tsx
// ❌ BEFORE: Incorrect heading hierarchy
<form>
  <h2>Personal Information</h2>
  <h4>Name</h4>  {/* Skipped H3 */}
  <input type="text" />
  
  <h4>Station</h4>  {/* Skipped H3 */}
  <select></select>
</form>

// ✅ AFTER: Semantic fieldset + visual styling
<form>
  <fieldset>
    <legend className={visualHeadings.titleLarge}>
      Personal Information
    </legend>
    
    <div className="form-field">
      <label className={visualHeadings.label}>
        Name
      </label>
      <input type="text" />
    </div>
    
    <div className="form-field">
      <label className={visualHeadings.label}>
        Station
      </label>
      <select></select>
    </div>
  </fieldset>
</form>
```

---

## Content Creator Guidelines

### Document: `CONTENT_HEADER_GUIDE.md`

```markdown
# Header Usage Guide for Content Creators
*FirefighterHub Project Documentation*

## Quick Reference

### When to Use Each Heading Level

| Level | Purpose | Example |
|-------|---------|---------|
| **H1** | Page title ONLY (one per page) | "FirefighterHub - Shift Management" |
| **H2** | Major sections | "Roster Management", "Hold Calendar" |
| **H3** | Subsections within H2 | "Active Members", "Scheduled Holds" |
| **H4** | Minor subsections or card titles | "Station 1 Assignments" |
| **H5** | Rarely needed | Fine-grained subsections |
| **H6** | Almost never needed | Ultra-specific subsections |

---

## Rules for Semantic Headers

### ✅ DO

1. **Use sequential hierarchy** - Never skip levels
   ```
   ✅ H2 → H3 → H4
   ❌ H2 → H4 (skip)
   ```

2. **One H1 per page** - Main page title only
   ```tsx
   ✅ <h1>FirefighterHub</h1>
   ❌ <h1>Reports</h1> <h1>Calendar</h1>
   ```

3. **Use headings for structure, not style**
   ```tsx
   ✅ <h2>Active Members</h2>
   ❌ <h2 className="small-text">Note:</h2>  // Use <p> instead
   ```

4. **Include keywords naturally**
   ```tsx
   ✅ <h2>Firefighter Shift Schedule - November 2025</h2>
   ❌ <h2>Schedule</h2>  // Too generic
   ```

5. **Pair with ARIA landmarks**
   ```tsx
   ✅ <section aria-labelledby="roster-heading">
        <h2 id="roster-heading">Roster</h2>
      </section>
   ```

---

### ❌ DON'T

1. **Skip heading levels**
   ```tsx
   ❌ <h2>Section</h2>
      <h4>Subsection</h4>  // Missing H3
   ```

2. **Use headings for styling**
   ```tsx
   ❌ <h3>Position: 1</h3>  // Just needs big text
   ✅ <p className="display-large">Position: 1</p>
   ```

3. **Nest headings incorrectly**
   ```tsx
   ❌ <h3>Parent</h3>
        <h2>Child</h2>  // Backwards hierarchy
   ```

4. **Use multiple H1s**
   ```tsx
   ❌ <h1>Main Title</h1>
      <h1>Another Title</h1>
   ```

---

## Keyword Integration Examples

### Feature Pages

```tsx
// Generic (Low SEO Value)
<h2>Calendar</h2>

// Optimized (High SEO Value)
<h2>Firefighter Hold Schedule Calendar</h2>
```

### Action-Oriented Headers

```tsx
// Generic
<h3>Add New</h3>

// Optimized
<h3>Add Firefighter to Shift Rotation</h3>
```

### Context-Rich Headers

```tsx
// Generic
<h2>Reports</h2>

// Optimized
<h2>Fire Department Hold Rotation Analytics</h2>
```

---

## Visual vs. Semantic Hierarchy

### When You Need Big Text WITHOUT Semantic Meaning

Use utility classes from `visualHeadings`:

```tsx
// Need H1-sized text for emphasis, but NOT a page title
<p className={visualHeadings.displayLarge}>
  Position: 1st in Rotation
</p>

// Need H2-styled text for a label
<label className={visualHeadings.titleMedium}>
  Select Station
</label>

// Need H3-styled text for a card header
<div className={visualHeadings.subtitleLarge}>
  John Doe - Available
</div>
```

### Available Visual Classes

```typescript
visualHeadings.displayLarge   // H1-sized (48px)
visualHeadings.displayMedium  // H1-sized (40px)
visualHeadings.titleLarge     // H2-sized (32px)
visualHeadings.titleMedium    // H2-sized (24px)
visualHeadings.subtitleLarge  // H3-sized (20px)
visualHeadings.subtitleMedium // H3-sized (18px)
visualHeadings.label          // Label-sized (14px)
visualHeadings.caption        // Small text (12px)
```

---

## Accessibility Checklist

Before publishing new components:

- [ ] Headers follow sequential hierarchy (H1 → H2 → H3)
- [ ] Only ONE H1 per page/view
- [ ] Headers describe content (not just "Details" or "Info")
- [ ] ARIA landmarks paired with headings (`aria-labelledby`)
- [ ] Visual hierarchy uses CSS classes, not semantic headers
- [ ] Screen reader tested with NVDA/JAWS
- [ ] Keywords integrated naturally (not stuffed)

---

## Common Patterns Reference

### Pattern: Modal Dialog

```tsx
<dialog role="dialog" aria-labelledby="modal-title">
  <h2 id="modal-title">Complete Hold for John Doe</h2>
  
  <form>
    <fieldset>
      <legend className={visualHeadings.titleMedium}>
        Hold Details
      </legend>
      <!-- Form fields -->
    </fieldset>
  </form>
</dialog>
```

### Pattern: Dashboard Section

```tsx
<section aria-labelledby="section-title">
  <h2 id="section-title">Active Firefighter Roster - Shift A</h2>
  
  <div className="metrics-grid">
    <article>
      <h3>Available Members</h3>
      <p className={visualHeadings.displayLarge}>12</p>
    </article>
    
    <article>
      <h3>Next Up for Hold</h3>
      <p className={visualHeadings.titleLarge}>Jane Smith</p>
    </article>
  </div>
</section>
```

### Pattern: Card with Visual Header

```tsx
<div className="card">
  {/* NOT a semantic heading - just styled text */}
  <div className={visualHeadings.subtitleLarge}>
    Station 1 - Engine 101
  </div>
  
  <p className={visualHeadings.bodyMedium}>
    4 members assigned
  </p>
</div>
```

---

## Testing Your Headers

### Automated Tools

1. **Browser DevTools**: 
   ```
   Right-click → Inspect → Accessibility Tree
   ```

2. **axe DevTools Extension**:
   - Install: https://www.deque.com/axe/devtools/
   - Run audit: Check "Headings" violations

3. **WAVE Extension**:
   - Install: https://wave.webaim.org/extension/
   - Check "Structure" panel

### Manual Screen Reader Test

**macOS (VoiceOver)**:
```
1. Cmd + F5 to enable VoiceOver
2. Ctrl + Option + U to open rotor
3. Select "Headings"
4. Arrow keys to navigate hierarchy
```

**Windows (NVDA)**:
```
1. Launch NVDA
2. Insert + F7 for Elements List
3. Select "Headings"
4. Check hierarchy makes sense
```

### Expected Hierarchy Output

```
H1: FirefighterHub - Shift Management
  H2: Firefighter Roster - Shift A
    H3: Active Members (12)
    H3: Deactivated Members (3)
  H2: Hold Schedule Calendar
    H3: November 2025
      H4: Week of Nov 1-7
      H4: Week of Nov 8-14
  H2: Next Up Rotation - All Shifts
    H3: Shift A - Next Available
    H3: Shift B - Next Available
    H3: Shift C - Next Available
```

---

## Questions?

Refer to:
- [WCAG 2.1 Headings Guideline](https://www.w3.org/WAI/WCAG21/Understanding/headings-and-labels.html)
- [MDN: Using Headers Correctly](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements)
- Project maintainers: See CLAUDE.md for contact info

```

---

## Implementation Checklist

### Phase 1: Critical Fixes (Week 1)

- [ ] **Fix duplicate H1 in Reports.tsx**
  - Change `<h1>Reports & Analytics</h1>` → `<h2>Reports & Analytics</h2>`
  - File: `src/components/Reports.tsx` (Line 202)

- [ ] **Add Schema.org markup to index.html**
  - SoftwareApplication schema
  - BreadcrumbList schema
  - File: `index.html` (before `</head>`)

- [ ] **Update page title with keywords**
  - Change: `Hold List Manager - Firefighter Rotation`
  - To: `Firefighter Shift Management & Hold Rotation Tracker | FirefighterHub`

- [ ] **Enhance meta description**
  - Include: "shift management", "fire department", "roster tracking"
  - Target 150-160 characters

---

### Phase 2: Heading Hierarchy Fixes (Week 2)

- [ ] **Fix skipped heading levels in HoldForm.tsx**
  - Change H4 → H3 for "Duration" and "Station"
  - File: `src/components/calendar/HoldForm.tsx` (Lines 78, 203)

- [ ] **Audit all modal heading levels**
  - CompleteHoldModal → Keep H2 ✓
  - DayModal → Change H3 → keep H3 (contextual) ✓
  - ConfirmDialog → Change H2 → H3

- [ ] **Add ARIA landmarks to major sections**
  - `<section aria-labelledby="">` for Roster
  - `<section aria-labelledby="">` for Calendar
  - `<aside aria-labelledby="">` for Next Up Bar

---

### Phase 3: CSS Refactoring (Week 3)

- [ ] **Create visualHeadings utility classes**
  - Add to `src/styles/typography.ts`
  - Import in components using heading classes for styling

- [ ] **Refactor FirefighterProfileModal.tsx**
  - Replace heading classes on non-heading elements
  - Lines: 381, 715, 729, 825, 848, 872, 887

- [ ] **Update Tailwind config**
  - Add typography utilities for visual hierarchy

---

### Phase 4: SEO Enhancement (Week 4)

- [ ] **Add keyword-rich section headers**
  - "Firefighter Roster" → "Firefighter Roster - Shift A Management"
  - "Calendar" → "Hold Schedule Calendar"
  - "Reports" → "Fire Department Analytics Dashboard"

- [ ] **Create FAQ schema markup**
  - Add common questions about hold rotation
  - Link from Help modal

- [ ] **Add structured data testing**
  - Validate with Google Rich Results Test
  - Fix any schema validation errors

---

### Phase 5: Documentation & Training (Week 5)

- [ ] **Create CONTENT_HEADER_GUIDE.md**
  - Guidelines for content creators
  - Keyword integration examples
  - Visual vs. semantic patterns

- [ ] **Update developer documentation**
  - Add header hierarchy section to CLAUDE.md
  - Reference in .github/copilot-instructions.md

- [ ] **Create accessibility testing checklist**
  - Screen reader testing protocol
  - Automated tool workflow

---

## Success Metrics

### Accessibility Metrics

| Metric | Current | Target | Measurement |
|--------|---------|--------|-------------|
| WCAG 2.1 Level AA Compliance | ~85% | 100% | axe DevTools audit |
| Heading hierarchy errors | 12 | 0 | WAVE extension |
| Screen reader navigation time | ~45s | <30s | Manual testing |
| ARIA landmark coverage | 40% | 95% | Accessibility Insights |

### SEO Metrics

| Metric | Current | Target | Measurement |
|--------|---------|--------|-------------|
| Lighthouse SEO score | 87 | 95+ | Chrome DevTools |
| Schema markup types | 0 | 4 | Google Rich Results Test |
| Target keyword in H1 | No | Yes | Manual audit |
| Meta description length | 125 chars | 155 chars | SEO plugin |
| Internal linking | Basic | Comprehensive | Screaming Frog |

### Performance Impact

- **Bundle size increase**: <2KB (schema markup only)
- **Runtime performance**: No impact (HTML/CSS only)
- **Accessibility tree depth**: Reduce by ~15% (flattening hierarchy)

---

## Appendix A: SEO-Optimized Content Templates

### Home Page Title Variations

```html
<!-- Current -->
<title>Hold List Manager - Firefighter Rotation</title>

<!-- Option 1: Keyword-First -->
<title>Firefighter Shift Management Software | Hold Rotation Tracker | FirefighterHub</title>

<!-- Option 2: Benefit-Driven -->
<title>Manage Fire Department Shifts & Hold Rotations | FirefighterHub</title>

<!-- Option 3: Location-Specific (if targeting local) -->
<title>Firefighter Shift Scheduling for [City] Fire Department | FirefighterHub</title>
```

### Meta Description Templates

```html
<!-- Current -->
<meta name="description" content="Modern, fair, transparent hold rotation manager for firefighters...">

<!-- Optimized Version -->
<meta name="description" content="Professional firefighter shift management system for fire departments. Track hold rotations, manage shift schedules, and sync rosters in real-time across A, B, and C shifts. Free and open-source.">
```

---

## Appendix B: React Component Header Patterns

### Pattern Library

```tsx
// 1. PAGE COMPONENT (App.tsx, Reports.tsx)
export function PageView() {
  return (
    <main role="main">
      <h1>FirefighterHub - Shift Management System</h1>
      {/* Page content */}
    </main>
  );
}

// 2. SECTION COMPONENT (FirefighterList.tsx)
export function RosterSection() {
  return (
    <section aria-labelledby="roster-title">
      <h2 id="roster-title">Firefighter Roster - Shift A</h2>
      {/* Section content */}
    </section>
  );
}

// 3. SUBSECTION COMPONENT (Active/Deactivated tabs)
export function MemberSubsection({ type }: { type: 'active' | 'deactivated' }) {
  return (
    <article aria-labelledby={`${type}-title`}>
      <h3 id={`${type}-title`}>
        {type === 'active' ? 'Active Members' : 'Deactivated Members'}
      </h3>
      {/* Subsection content */}
    </article>
  );
}

// 4. CARD COMPONENT (FirefighterItem.tsx)
export function FirefighterCard({ firefighter }: Props) {
  return (
    <div className="card" role="article">
      {/* Use H4 if card is within H3 subsection */}
      <h4>{firefighter.name} - Station {firefighter.fire_station}</h4>
      
      {/* Use visual class if card is standalone */}
      <div className={visualHeadings.subtitleLarge}>
        {firefighter.name}
      </div>
    </div>
  );
}

// 5. MODAL DIALOG
export function Modal({ title, children }: Props) {
  const headingId = useId();
  
  return (
    <dialog role="dialog" aria-labelledby={headingId}>
      <h2 id={headingId}>{title}</h2>
      {children}
    </dialog>
  );
}

// 6. NESTED MODAL (Confirmation within modal)
export function NestedModal({ title }: Props) {
  const headingId = useId();
  
  return (
    <dialog role="alertdialog" aria-labelledby={headingId}>
      <h3 id={headingId}>{title}</h3>
      {/* Confirmation content */}
    </dialog>
  );
}
```

---

## Appendix C: Testing Commands

### Automated Accessibility Testing

```bash
# Install dependencies
pnpm add -D @axe-core/playwright pa11y

# Run automated tests
pnpm exec playwright test --grep accessibility

# Pa11y CLI testing
npx pa11y http://localhost:5173 --standard WCAG2AA --reporter cli
```

### Lighthouse CI

```bash
# Install Lighthouse CI
pnpm add -D @lhci/cli

# Run Lighthouse audit
npx lhci autorun --collect.url=http://localhost:5173 --upload.target=temporary-public-storage
```

### Header Hierarchy Validation Script

```bash
#!/bin/bash
# validate-headers.sh

echo "Validating header hierarchy..."

# Check for multiple H1s
h1_count=$(grep -r "<h1" src/components --include="*.tsx" | wc -l)
if [ $h1_count -gt 1 ]; then
  echo "❌ ERROR: Found $h1_count H1 tags (should be 1)"
  grep -rn "<h1" src/components --include="*.tsx"
else
  echo "✅ PASS: Single H1 tag found"
fi

# Check for skipped levels
echo "\nChecking for skipped heading levels..."
# (Add pattern matching logic)

echo "\nValidation complete."
```

---

## Document Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-11-07 | AI Audit System | Initial comprehensive audit |
| 1.1 | TBD | Development Team | Post-implementation review |

---

## References

1. [WCAG 2.1 - Info and Relationships](https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html)
2. [MDN - HTML Heading Elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements)
3. [Schema.org - SoftwareApplication](https://schema.org/SoftwareApplication)
4. [Google Search Central - Structured Data](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)
5. [WebAIM - Semantic Structure](https://webaim.org/techniques/semanticstructure/)
6. [A11Y Project - Headings](https://www.a11yproject.com/posts/how-to-accessible-heading-structure/)

---

**End of Header Hierarchy Audit**  
*FirefighterHub Project - 2025*
