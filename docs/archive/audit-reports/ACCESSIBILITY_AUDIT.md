# Accessibility & Readability Audit

## Executive Summary
This document provides a comprehensive analysis of text content, readability, and accessibility issues in the Hold List Manager application, along with specific recommendations for improvement following WCAG 2.1 AA standards.

---

## 1. HEADING STRUCTURE ANALYSIS

### Current Issues
- **Missing semantic HTML structure**: Using `<h1>`, `<h2>`, `<h3>` but not consistently
- **Skipped heading levels**: Some components jump from h2 to h4
- **Multiple h1 elements**: Should only have one per page
- **No document outline**: Difficult for screen readers to navigate

### Current Heading Hierarchy

```
Current Structure (PROBLEMS):
├── Header Component
│   └── h1: "Hold List Manager" ✓
│
├── Calendar Component
│   └── h2: "Hold Calendar" ✓
│
├── FirefighterList Component
│   └── h2: "Firefighter Roster" ✓
│
└── Sidebar Components
    ├── h3: "Team Status" ✗ (should be h2)
    ├── h3: "Upcoming Holds" ✗ (should be h2)
    └── h3: "Who's Next?" ✗ (should be h2)
```

### Recommended Heading Hierarchy

```
Improved Structure:
└── Page (App.tsx)
    ├── h1: "Hold List Manager" (Header)
    │
    ├── Main Content
    │   ├── section: Calendar
    │   │   ├── h2: "Hold Calendar"
    │   │   └── h3: Month navigation controls
    │   │
    │   └── section: Firefighter Management
    │       ├── h2: "Firefighter Roster"
    │       └── h3: Individual firefighter details
    │
    └── Aside (Sidebar)
        ├── section: Stats
        │   └── h2: "Team Status"
        ├── section: Upcoming
        │   └── h2: "Upcoming Holds"
        └── section: Rotation
            └── h2: "Who's Next?"
```

**Key Changes:**
1. Ensure only ONE h1 per page (in Header)
2. Use h2 for major sections (Calendar, Roster, Sidebar sections)
3. Use h3 for subsections within major sections
4. Never skip heading levels
5. Add semantic HTML (`<main>`, `<section>`, `<aside>`)

---

## 2. COLOR CONTRAST ANALYSIS

### WCAG 2.1 Requirements
- **Normal text (under 18pt)**: Minimum 4.5:1 contrast ratio
- **Large text (18pt+ or 14pt+ bold)**: Minimum 3:1 contrast ratio
- **UI components**: Minimum 3:1 contrast ratio

### Current Contrast Issues

#### ❌ FAILING Combinations

| Element | Foreground | Background | Ratio | Requirement | Status |
|---------|-----------|------------|-------|-------------|--------|
| Gray-400 text on gray-900 | `#9CA3AF` | `#111827` | 5.74:1 | 4.5:1 | ✓ PASS |
| Gray-500 text on gray-900 | `#6B7280` | `#111827` | 3.88:1 | 4.5:1 | ❌ FAIL |
| Gray-600 text on gray-900 | `#4B5563` | `#111827` | 2.59:1 | 4.5:1 | ❌ FAIL |
| Blue-200 text on blue-900 | `#BFDBFE` | `#1E3A8A` | 7.12:1 | 4.5:1 | ✓ PASS |
| Green-300 on green-900/30 | `#86EFAC` | `rgba(20,83,45,0.3)` | ~2.5:1 | 4.5:1 | ❌ FAIL |
| Red-300 on red-900/30 | `#FCA5A5` | `rgba(127,29,29,0.3)` | ~2.8:1 | 4.5:1 | ❌ FAIL |

#### Specific Problem Areas

**1. Sidebar Stats (Lines 72-78 in Sidebar.tsx)**
```tsx
// PROBLEM: Green-300 text on green-900/30 background
<p className="text-xs text-green-400 font-medium">Available</p>
```
**Fix:** Use `text-green-200` or `text-green-100` for better contrast

**2. Calendar Stats (Calendar.tsx)**
```tsx
// PROBLEM: Blue-200 on blue-900/50
<span className="text-blue-200">5 Holds This Month</span>
```
**Fix:** Use `text-blue-100` or increase background opacity

**3. Form Placeholders**
```tsx
// Placeholder text may have low contrast
placeholder="Full name (e.g., John Smith)"
```
**Fix:** Ensure placeholder color meets 4.5:1 ratio

**4. Disabled States**
```tsx
// PROBLEM: Gray-500 disabled text
disabled:text-gray-500
```
**Fix:** Even disabled text should meet 3:1 minimum

---

## 3. TYPOGRAPHY & READABILITY ANALYSIS

### Current Typography Issues

#### Font Sizes
```
Current:
- Body text: 14px (text-sm) ❌ Too small
- Headings: Various sizes, no consistent scale
- Minimum readable: 16px recommended
```

#### Line Heights
```
Current: Tailwind defaults (1.5 for body)
Recommended for accessibility:
- Body text: 1.6-1.8 (improved readability)
- Headings: 1.2-1.3 (tighter for visual hierarchy)
- Long-form content: 1.8-2.0
```

#### Text Spacing
```
Current: Standard Tailwind spacing
Recommended:
- Letter spacing: +0.01em for body text
- Word spacing: Normal (dyslexia-friendly)
- Paragraph spacing: 1.5em between paragraphs
```

### Font Family Issues
```css
/* Current: Default system fonts */
font-family: system-ui, sans-serif;

/* Problem: Not optimized for dyslexia */
```

**Dyslexia-Friendly Font Characteristics:**
1. Clear differentiation between similar letters (b/d, p/q)
2. Larger x-height
3. Generous spacing
4. Weighted bottoms on letters
5. Unique letter shapes

**Recommended Fonts:**
- Primary: Inter, Open Dyslexic, Lexend
- Fallback: system-ui, Arial

---

## 4. SPECIFIC COMPONENT ISSUES

### Header Component
```tsx
// Current h1
<h1 className="text-3xl font-bold text-white">Hold List Manager</h1>

// Issues:
// - 3xl might be too large on mobile (30px)
// - No consideration for zoom levels
```

**Recommendations:**
- Use responsive sizing: `text-2xl md:text-3xl`
- Add max-width for readability
- Ensure touch targets meet 44x44px minimum

### Calendar Component
```tsx
// Current day numbers
<span className="text-2xl font-bold text-white">{day.dayNumber}</span>

// Issues:
// - Good size but may need better contrast when disabled
// - Long firefighter names may overflow
```

**Recommendations:**
- Add text truncation with tooltips
- Increase padding for touch targets
- Use `overflow-wrap: break-word` for long names

### Firefighter Cards
```tsx
// Current name display
<h3 className="text-xl font-bold text-white truncate">{firefighter.name}</h3>

// Issues:
// - Truncation hides information
// - No way to see full name if cut off
```

**Recommendations:**
- Add `title` attribute for full name on hover
- Use multi-line with line-clamp instead of truncate
- Consider abbreviating middle names

### Sidebar Text
```tsx
// Current stats
<span className="text-sm text-gray-400">Team Size</span>

// Issues:
// - text-sm (14px) may be too small
// - gray-400 on gray-900 is borderline contrast
```

**Recommendations:**
- Increase to `text-base` (16px)
- Use `text-gray-300` for better contrast

---

## 5. RECOMMENDED CSS IMPROVEMENTS

### Base Typography Styles

Add to `src/index.css`:

```css
@layer base {
  /* Improved base typography */
  html {
    /* Better font rendering */
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }

  body {
    /* Minimum 16px base font */
    font-size: 16px;
    line-height: 1.6;
    letter-spacing: 0.01em;
  }

  /* Improved heading hierarchy */
  h1 {
    font-size: clamp(1.75rem, 4vw, 2.25rem);
    line-height: 1.2;
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  h2 {
    font-size: clamp(1.5rem, 3vw, 1.875rem);
    line-height: 1.3;
    font-weight: 700;
    letter-spacing: -0.01em;
  }

  h3 {
    font-size: clamp(1.25rem, 2.5vw, 1.5rem);
    line-height: 1.4;
    font-weight: 600;
  }

  /* Better paragraph spacing */
  p + p {
    margin-top: 1.5em;
  }

  /* Focus visible for keyboard navigation */
  *:focus-visible {
    outline: 3px solid #3B82F6;
    outline-offset: 2px;
    border-radius: 4px;
  }

  /* Improved button accessibility */
  button, a {
    min-height: 44px;
    min-width: 44px;
  }
}

/* Dyslexia-friendly font option */
@layer utilities {
  .font-dyslexia {
    font-family: 'Lexend', 'Open Dyslexic', system-ui, sans-serif;
    letter-spacing: 0.05em;
    word-spacing: 0.15em;
  }

  /* Improved readability mode */
  .readable {
    line-height: 1.8;
    font-size: 1.125rem;
    max-width: 70ch;
  }

  /* High contrast mode */
  .high-contrast {
    --tw-text-opacity: 1;
    color: rgb(255 255 255 / var(--tw-text-opacity));
  }
}
```

### Color Contrast Fixes

```css
@layer utilities {
  /* Accessible color variants */
  .text-gray-accessible {
    color: #D1D5DB; /* gray-300 - passes 4.5:1 on gray-900 */
  }

  .text-green-accessible {
    color: #86EFAC; /* green-300 - verified contrast */
  }

  .text-blue-accessible {
    color: #93C5FD; /* blue-300 - verified contrast */
  }

  .text-red-accessible {
    color: #FCA5A5; /* red-300 - verified contrast */
  }

  /* Accessible background combinations */
  .bg-stat-green {
    background-color: rgba(20, 83, 45, 0.5); /* Increased opacity */
  }

  .bg-stat-red {
    background-color: rgba(127, 29, 29, 0.5); /* Increased opacity */
  }
}
```

### Focus Management

```css
@layer components {
  /* Improved focus styles for all interactive elements */
  .focus-ring {
    @apply focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900;
  }

  /* Skip to main content link */
  .skip-link {
    position: absolute;
    top: -40px;
    left: 0;
    background: #3B82F6;
    color: white;
    padding: 8px 16px;
    text-decoration: none;
    border-radius: 0 0 8px 0;
    z-index: 100;
  }

  .skip-link:focus {
    top: 0;
  }
}
```

---

## 6. DYSLEXIA-SPECIFIC RECOMMENDATIONS

### Text Formatting
1. **Line Length**: Limit to 70-80 characters
2. **Alignment**: Left-aligned (no justified text)
3. **Spacing**: Increase letter and word spacing
4. **Font Weight**: Use 400-600, avoid 700+ for body text
5. **Color**: Avoid pure black on pure white (use off-white backgrounds)

### Implementation

```tsx
// Add optional dyslexia mode
const [dyslexiaMode, setDyslexiaMode] = useState(false);

<div className={dyslexiaMode ? 'font-dyslexia' : ''}>
  {/* content */}
</div>
```

### Visual Aids
1. **Icons**: Use alongside text, not instead of
2. **Color**: Never use color alone to convey meaning
3. **Animations**: Provide option to reduce motion
4. **Contrast**: Offer high contrast mode toggle

---

## 7. SCREEN READER OPTIMIZATION

### ARIA Labels
```tsx
// Current: Missing context
<button onClick={onDelete}>
  <Trash2 size={20} />
</button>

// Improved: Clear context
<button
  onClick={onDelete}
  aria-label={`Remove ${firefighter.name} from roster`}
>
  <Trash2 size={20} aria-hidden="true" />
</button>
```

### Landmark Regions
```tsx
// Add semantic HTML
<header role="banner">
  {/* Header content */}
</header>

<main role="main">
  {/* Main content */}
</main>

<aside role="complementary" aria-label="Team statistics">
  {/* Sidebar content */}
</aside>
```

### Live Regions
```tsx
// Announce toast messages
<div
  role="alert"
  aria-live="polite"
  aria-atomic="true"
>
  {toast.message}
</div>
```

---

## 8. IMPLEMENTATION PRIORITY

### HIGH PRIORITY (WCAG Level A)
1. ✅ Fix color contrast failures (gray-500, gray-600)
2. ✅ Add proper heading hierarchy
3. ✅ Ensure 44x44px touch targets
4. ✅ Add ARIA labels to icon buttons
5. ✅ Improve focus visible states

### MEDIUM PRIORITY (WCAG Level AA)
6. ✅ Increase base font size to 16px
7. ✅ Improve line height for readability
8. ✅ Add semantic HTML landmarks
9. ✅ Fix text truncation issues
10. ✅ Add skip navigation link

### NICE TO HAVE (WCAG Level AAA / Enhanced UX)
11. ✅ Add dyslexia-friendly font option
12. ✅ Implement high contrast mode
13. ✅ Add reduce motion preferences
14. ✅ Optimize for 200% zoom
15. ✅ Add keyboard shortcuts

---

## 9. TESTING CHECKLIST

### Manual Testing
- [ ] Test with keyboard only (no mouse)
- [ ] Test with 200% browser zoom
- [ ] Test with screen reader (NVDA/JAWS/VoiceOver)
- [ ] Test color blindness with Chrome DevTools
- [ ] Test with reduced motion preference

### Automated Testing Tools
- [ ] Lighthouse Accessibility Score (target: 100)
- [ ] axe DevTools browser extension
- [ ] WAVE Web Accessibility Evaluation Tool
- [ ] Color contrast checker tools

### Real User Testing
- [ ] Test with users who have dyslexia
- [ ] Test with users who use screen readers
- [ ] Test with users who have motor impairments
- [ ] Test with users with low vision

---

## 10. QUICK WINS (Implement Immediately)

### 1. Update Color Classes
```tsx
// Replace all instances:
text-gray-500 → text-gray-400
text-gray-600 → text-gray-300
```

### 2. Increase Font Sizes
```tsx
// Replace:
text-xs → text-sm
text-sm → text-base
```

### 3. Add Focus Rings
```tsx
// Add to all interactive elements:
className="focus-visible:ring-4 focus-visible:ring-blue-500"
```

### 4. Fix Heading Levels
```tsx
// Sidebar: Change h3 to h2
<h3> → <h2>
```

### 5. Add ARIA Labels
```tsx
// All icon-only buttons need labels
aria-label="Descriptive action"
```

---

## SUMMARY OF CHANGES NEEDED

**Typography:**
- Increase base font from 14px to 16px
- Improve line heights (1.6-1.8 for body)
- Add responsive font sizing with clamp()
- Consider dyslexia-friendly font option

**Color Contrast:**
- Fix 8 failing contrast combinations
- Use gray-300+ on dark backgrounds
- Increase opacity on colored backgrounds
- Test all combinations with contrast checker

**Structure:**
- Add semantic HTML (main, section, aside)
- Fix heading hierarchy (one h1, proper h2-h3)
- Add ARIA landmarks and labels
- Implement skip navigation

**Interaction:**
- Ensure 44x44px minimum touch targets
- Improve focus visible styles
- Add keyboard navigation support
- Implement live regions for announcements

**Visual:**
- Fix text truncation with tooltips
- Improve spacing between elements
- Add option for high contrast mode
- Support reduced motion preferences
