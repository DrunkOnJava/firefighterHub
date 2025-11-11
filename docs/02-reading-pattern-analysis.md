# Phase 1.1: Reading Pattern Analysis
## Visual Hierarchy Audit - Z-Pattern and F-Pattern Mapping

**Date:** 2025-11-07  
**Phase:** 1 - Discovery & Analysis  
**Task:** 1.1 - Reading Pattern Analysis

---

## Overview

This document analyzes the natural reading patterns (Z-pattern and F-pattern) across FirefighterHub's primary views to evaluate whether important elements align with expected user eye-tracking paths.

---

## Z-Pattern Analysis (Desktop Dashboard)

### **What is Z-Pattern?**
Z-pattern describes the eye movement path users follow when scanning content:
1. **Top-left** (entry point) → Horizontal scan right
2. **Top-right** → Diagonal scan down-left
3. **Bottom-left** → Horizontal scan right
4. **Bottom-right** (conclusion point)

**Best for:** Dashboard layouts, landing pages, sparse content

---

### **Desktop Dashboard (1920px) - Current Layout**

```
┌─────────────────────────────────────────────────────────────┐
│ HEADER (64px height)                                         │
│ [1] Logo/Title ────────────────→ [2] Shift Selector + Actions│
│                                                              │
└─────────────────────────────────────────────────────────────┘
        ↓ diagonal scan                                        
┌────────────────────────────┬────────────────────────────────┐
│ CALENDAR (LEFT - 1fr)      │ ROSTER (RIGHT - 480px)         │
│                            │                                │
│ [3] Month navigation       │ [4] Next Up Bar (3 chips)      │
│     Calendar grid          │     ┌─────────────────────┐    │
│     (7×6 = 42 days)        │     │ Shift A: John Doe   │    │
│                            │     │ Shift B: Jane Smith │    │
│     Legend below           │     │ Shift C: Bob Jones  │    │
│                            │     └─────────────────────┘    │
│                            │                                │
│                            │ [5] Roster Table (20 rows)     │
│                            │     Name | Station | Certs    │
│                            │     ──────────────────────     │
│                            │     Available firefighters     │
└────────────────────────────┴────────────────────────────────┘
                                    ↑
                            Bottom-right conclusion
```

### **Z-Pattern Mapping - Desktop Dashboard**

#### **Point 1: Top-Left Entry (Logo/Title)**
**Current State:**
- **Element:** "FirefighterHub" title + logo
- **Size:** Logo 72px × 72px (desktop), Title text-2xl (24px)
- **Visual Weight:** High (large logo, bold text)
- **Purpose:** Brand recognition, orientation

**Analysis:**
- ✅ Strong entry point (logo is eye-catching)
- ✅ Title uses largest font size (h1)
- ⚠️ Logo may be oversized (competes with functional elements)
- ⚠️ Subtitle "Shift Management System" uses muted color (low visibility)

**Effectiveness Score:** 8/10
- Strong visual anchor
- Could reduce logo size by 10-15% without losing impact

---

#### **Point 2: Top-Right Horizontal Scan (Primary Actions)**
**Current State:**
- **Elements:** 
  - Shift Selector (A/B/C toggle)
  - Battalion Chief login/logout
  - Dark mode toggle
  - Help icon
  - Activity log icon
  - Quick Add Firefighter button

**Layout (left to right):**
```
Shift Selector | Help | Activity | Dark Mode | Login | Quick Add
   [Medium]    [Small] [Small]    [Small]   [Medium] [Large]
```

**Analysis:**
- ⚠️ **Cluttered:** 6 distinct actions in ~400px space
- ⚠️ **Hierarchy unclear:** Quick Add button (primary action) is rightmost - may be missed
- ⚠️ **Size:** Quick Add button not significantly larger than secondary actions
- ✅ Shift Selector positioned prominently (user needs this frequently)
- ❌ No visual grouping (actions, settings, and tools all mixed)

**Issues:**
1. Primary action (Quick Add) at far right - against natural reading flow
2. Icon buttons (Help, Activity, Dark Mode) same size as text buttons
3. No whitespace separation between action groups

**Effectiveness Score:** 5/10
- Users may not discover Quick Add button quickly
- Recommend moving primary action to top-left (after logo)

---

#### **Point 3: Diagonal Scan to Bottom-Left (Calendar)**
**Current State:**
- **Element:** Calendar grid
- **Entry Point:** Month/year header (e.g., "November 2025")
- **Visual Weight:** Medium (background cards with borders)

**User expectation:** Land on calendar controls or first meaningful content

**Analysis:**
- ✅ Month navigation is clear (arrows + centered month name)
- ⚠️ Calendar grid is visually dense (42 cells)
- ⚠️ Day numbers are small (12px font) - may be hard to scan quickly
- ⚠️ No immediate visual hierarchy within grid (all cells equal weight)
- ⚠️ Hold badges compete with day numbers for attention

**Effectiveness Score:** 6/10
- Calendar is discoverable but not scannable at a glance
- Recommend: Increase day number size, reduce cell border prominence

---

#### **Point 4: Bottom-Right Conclusion (Roster Table)**
**Current State:**
- **Element:** Firefighter roster (20 rows visible)
- **Expected User Action:** Scan roster for next firefighter in rotation
- **Visual Cue:** "Next Up Bar" above roster

**Analysis:**
- ✅ Next Up Bar provides immediate value (shows next 3 firefighters)
- ✅ Roster table is well-structured (Name | Station | Certifications)
- ⚠️ All 20 rows have equal visual weight (no highlighting)
- ⚠️ Bottom-right corner is empty space (wasted real estate)
- ❌ No clear "conclusion" or call-to-action at bottom-right

**Effectiveness Score:** 7/10
- Roster is functional but doesn't reinforce hierarchy
- Recommend: Highlight top 3 firefighters in rotation with subtle background

---

### **Z-Pattern Overall Effectiveness: 6.5/10**

**Strengths:**
- Strong top-left entry point (logo + title)
- Next Up Bar provides immediate value
- Sticky header maintains orientation

**Weaknesses:**
- Primary action (Quick Add) hidden at top-right (against flow)
- No clear conclusion point at bottom-right
- Middle section (diagonal) lacks visual anchor

**Recommendations:**
1. **Relocate primary action** to top-left (after logo) or top-right but visually distinct
2. **Add visual anchor** in middle-left (e.g., "Today's Holds" summary card)
3. **Add conclusion CTA** at bottom-right (e.g., "View All Activity" link)

---

## F-Pattern Analysis (Calendar View)

### **What is F-Pattern?**
F-pattern describes reading behavior for dense, text-heavy content:
1. **Horizontal scan** at top (month header)
2. **Vertical scan** down left edge (day numbers)
3. **Secondary horizontal scans** across holds/events

**Best for:** Lists, tables, calendars, text-heavy pages

---

### **Calendar View Layout (1920px)**

```
┌─────────────────────────────────────────────────────┐
│ [1] Month Header: ← November 2025 →                 │
└─────────────────────────────────────────────────────┘
┌──────┬──────┬──────┬──────┬──────┬──────┬──────┐
│ Sun  │ Mon  │ Tue  │ Wed  │ Thu  │ Fri  │ Sat  │ [2] Horizontal scan
├──────┼──────┼──────┼──────┼──────┼──────┼──────┤
│  1   │  2   │  3   │  4   │  5   │  6   │  7   │ [3] Vertical scan
│      │[Hold]│      │[Hold]│      │[Hold]│      │     down left edge
├──────┼──────┼──────┼──────┼──────┼──────┼──────┤     (day numbers)
│  8   │  9   │ 10   │ 11   │ 12   │ 13   │ 14   │
│      │[Hold]│      │[Hold]│[Hold]│      │      │ [4] Secondary scans
├──────┼──────┼──────┼──────┼──────┼──────┼──────┤     for holds
│ 15   │ 16   │ 17   │ 18   │ 19   │ 20   │ 21   │
│[Hold]│      │[Hold]│      │[Hold]│[Hold]│      │
├──────┼──────┼──────┼──────┼──────┼──────┼──────┤
│ 22   │ 23   │ 24   │ 25   │ 26   │ 27   │ 28   │
│      │[Hold]│      │[Hold]│      │[Hold]│      │
├──────┼──────┼──────┼──────┼──────┼──────┼──────┤
│ 29   │ 30   │  1   │  2   │  3   │  4   │  5   │
│      │[Hold]│      │      │      │      │      │
└──────┴──────┴──────┴──────┴──────┴──────┴──────┘
```

---

### **F-Pattern Mapping - Calendar View**

#### **Scan 1: Top Horizontal - Month Header**
**Current State:**
- **Element:** "← November 2025 →"
- **Font Size:** 16px (text-lg)
- **Visual Weight:** Medium (bold font)
- **Color:** Primary text color (high contrast)

**Analysis:**
- ✅ Centered alignment draws attention
- ✅ Arrow buttons provide clear affordance
- ⚠️ Month name could be larger (h2 instead of text-lg)
- ⚠️ Current month not visually distinct from other months

**Effectiveness Score:** 7/10
- Clear and functional
- Could benefit from increased size/weight

---

#### **Scan 2: Day-of-Week Headers**
**Current State:**
- **Elements:** Sun, Mon, Tue, Wed, Thu, Fri, Sat
- **Font Size:** 12px (text-xs)
- **Color:** Muted (gray-400)
- **Font Weight:** 600 (semibold)

**Analysis:**
- ✅ Abbreviated to 3 letters (good for mobile)
- ⚠️ Very small font (12px) - may be hard to read
- ⚠️ Muted color reduces scannability
- ❌ Not visually distinct from day numbers below

**Effectiveness Score:** 5/10
- Functional but low visibility
- Recommend: Increase to 14px, use uppercase WEEKDAY for distinction

---

#### **Scan 3: Vertical Left Edge - Day Numbers**
**Current State:**
- **Element:** Day numbers (1, 2, 3... 30)
- **Font Size:** 12px
- **Font Weight:** 700 (bold)
- **Position:** Top-left of each cell
- **Color:** High contrast (cbd5e1) for current month, muted for other months

**Analysis:**
- ✅ Positioned at top-left (aligns with F-pattern)
- ⚠️ Font size too small (12px) - hard to scan quickly
- ⚠️ Other month days use muted color but same size (confusing)
- ✅ Bold weight helps distinguish from hold text

**User Task:** "What day is it today?"
- Current day has outline indicator (2px solid red)
- ✅ Today indicator is highly visible
- ⚠️ Relies solely on color (accessibility issue for color-blind users)

**Effectiveness Score:** 6/10
- Day numbers scannable but too small
- Recommend: Increase to 14-16px, add shape indicator for today (not just outline)

---

#### **Scan 4: Secondary Horizontal - Hold Badges**
**Current State:**
- **Element:** Hold badges (blue = scheduled, teal = completed)
- **Size:** Compact pill shape
- **Content:** Firefighter name
- **Position:** Below day number in each cell

**Layout Example (day cell):**
```
┌─────────────────┐
│ 15 (day number) │ ← Primary scan
│                 │
│ [John Doe]      │ ← Secondary scan
│ [Jane Smith]    │    (hold badges)
│ [+ 2 more]      │
└─────────────────┘
```

**Analysis:**
- ✅ Color coding (blue/teal) provides instant status
- ✅ Compact design fits multiple holds per day
- ⚠️ Hold text size too small when multiple holds present
- ⚠️ "+X more" indicator competes visually with actual holds
- ❌ No visual priority - all holds equal weight (user can't tell which is most important)

**Effectiveness Score:** 6/10
- Functional but lacks hierarchy
- Recommend: Highlight first hold (next in rotation), dim "+X more"

---

### **F-Pattern Overall Effectiveness: 6/10**

**Strengths:**
- Day numbers positioned correctly (top-left)
- Today indicator is obvious
- Hold color coding provides instant status

**Weaknesses:**
- Font sizes too small across the board (12px day numbers, 12px headers)
- No hierarchy within hold badges (all equal weight)
- Muted colors reduce scannability

**Recommendations:**
1. **Increase day number size** to 16px (desktop), 14px (mobile)
2. **Increase day-of-week headers** to 14px, use uppercase
3. **Add visual weight** to first hold in each day (bold name or darker background)
4. **Reduce "+X more" prominence** (lighter color, smaller text)

---

## Mobile Reading Patterns (375px - 768px)

### **Mobile Layout Characteristics**

Mobile devices favor **vertical scroll patterns** over Z/F patterns:
- **Thumb zone:** Bottom 1/3 of screen is most accessible
- **Priority content:** Top of screen (users scroll down)
- **Fixed elements:** Bottom navigation bars

---

### **Mobile Dashboard Layout (375px)**

```
┌─────────────────────┐
│ HEADER (48px)       │ [1] First view (logo + shift)
│ Logo | Shift | Menu │
├─────────────────────┤
│                     │
│ NEXT UP BAR         │ [2] Immediate value
│ ┌─────────────────┐ │
│ │ Shift A: John   │ │
│ └─────────────────┘ │
│                     │
├─────────────────────┤
│ CALENDAR PREVIEW    │ [3] Scroll to view
│ (Compact month)     │
│                     │
│ [Today's Holds]     │
│ • John Doe          │
│ • Jane Smith        │
│                     │
├─────────────────────┤
│ ROSTER (Condensed)  │ [4] Further scroll
│ ↓ Vertical scroll   │
│                     │
└─────────────────────┘
      ↑
   [Bottom Nav]       [5] Thumb zone (primary actions)
   Home | Cal | Log
```

---

### **Mobile Pattern Analysis**

#### **Scan Area 1: Header (Top 1/3)**
**Current State:**
- Logo: 48px × 48px (smaller than desktop)
- Shift Selector: Prominent
- Hamburger Menu: Top-right

**Analysis:**
- ✅ Shift selector easily accessible
- ⚠️ Primary actions hidden in hamburger menu
- ❌ Quick Add Firefighter requires 2 taps (menu → action)

**Effectiveness Score:** 5/10
- Essential navigation present
- Primary action buried

---

#### **Scan Area 2: Immediate Value (Middle 1/3)**
**Current State:**
- Next Up Bar shows immediately
- Today's holds visible without scroll
- Calendar preview partially visible

**Analysis:**
- ✅ Most important info (next firefighter) is visible immediately
- ✅ No scrolling required for primary task
- ✅ Users can complete holds from this screen

**Effectiveness Score:** 9/10
- Excellent prioritization of content

---

#### **Scan Area 3: Thumb Zone (Bottom 1/3)**
**Current State:**
- Bottom Navigation: Home | Calendar | Activity Log
- Fixed position (always accessible)
- Large touch targets (56px height)

**Analysis:**
- ✅ Primary navigation in most accessible area
- ✅ Touch targets meet WCAG 2.1 (>44px)
- ✅ Icons + labels (no ambiguity)

**Effectiveness Score:** 10/10
- Perfect mobile UX pattern

---

## Heatmap Predictions

### **Desktop Dashboard - Predicted Attention Map**

```
HIGH ATTENTION (Red zones)
┌─────────────────────────────────────────┐
│ 🔴🔴🔴 Logo/Title    🔴🔴🔴 Shift Selector │
│                                         │
└─────────────────────────────────────────┘
│                     │ 🔴🔴🔴 Next Up Bar  │
│  🟡 Calendar       │                    │
│   Month Header     │ 🟡 First 5 roster  │
│                    │    rows            │
│  🟢 Day cells      │                    │
│                    │ 🟢 Lower roster    │
└────────────────────┴────────────────────┘

Legend:
🔴 HIGH attention (5-10 seconds fixation)
🟡 MEDIUM attention (2-5 seconds)
🟢 LOW attention (<2 seconds)
⚫ DEAD ZONE (rarely viewed)
```

**Predicted Dead Zones:**
- Bottom-left of calendar (weeks 5-6 if current week is top)
- Bottom roster rows (15-20) unless scrolling
- Far-right edge of roster (certification badges)

---

### **Calendar View - Predicted Attention Map**

```
🔴🔴🔴 Month header
🟡🟡🟡 Day-of-week headers
🔴 🟡 🟡 🟡 🟡 🟡 🟢  ← First row (high attention)
🟡 🟡 🟡 🟡 🟡 🟢 🟢  ← Second row
🟡 🟡 🟢 🟢 🟢 🟢 🟢  ← Third row
🟢 🟢 🟢 🟢 🟢 ⚫ ⚫  ← Fourth row
🟢 🟢 ⚫ ⚫ ⚫ ⚫ ⚫  ← Fifth row (dead zone)
🟢 ⚫ ⚫ ⚫ ⚫ ⚫ ⚫  ← Sixth row (dead zone)
```

**Analysis:**
- Top-left gets most attention (aligns with F-pattern)
- Right column (Sunday) gets less attention
- Bottom 2 rows rarely viewed unless specifically needed

**Implication:**
- Important holds should be in weeks 1-3
- Bottom-right is wasted real estate (could add summary stats)

---

## Competition Points (Conflicting Elements)

### **Header: Action Overload**
**Competing elements:**
1. Shift Selector (medium priority)
2. Help icon (low priority)
3. Activity log icon (medium priority)
4. Dark mode toggle (low priority)
5. Login button (low priority)
6. Quick Add button (HIGH priority)

**Issue:** 6 elements fight for attention
**Resolution:** Group by priority, add whitespace separation

---

### **Roster: Certification Badges**
**Competing elements:**
1. Firefighter name (high priority)
2. Station number (medium priority)
3. FTO badge (low priority)
4. BLS/ALS badges (low priority)
5. Apparatus badges (low priority)

**Issue:** Too many badges (up to 5 per row)
**Resolution:** Show max 2 badges, "+X more" on hover

---

## Recommendations Summary

### **High Priority (Impact: High, Effort: Low)**
1. ✅ Increase day numbers to 16px (calendar)
2. ✅ Move Quick Add button to prominent location
3. ✅ Add min-height to buttons (WCAG compliance)
4. ✅ Increase section-to-section spacing (24-32px)

### **Medium Priority (Impact: Medium, Effort: Medium)**
5. ⚠️ Highlight top 3 firefighters in roster
6. ⚠️ Add visual anchor in middle-left of dashboard
7. ⚠️ Reduce certification badge clutter
8. ⚠️ Increase day-of-week header size

### **Low Priority (Impact: Medium, Effort: High)**
9. 🔵 Redesign header to group actions
10. 🔵 Add bottom-right conclusion CTA
11. 🔵 Add week number column to calendar

---

## Eye-Tracking Pattern Verification

### **Recommended User Testing**
- **Tool:** Hotjar or Mouseflow (mouse tracking as proxy)
- **Tasks:**
  1. "Complete a hold for the next firefighter" (measure time to first click)
  2. "Find the shift selector" (measure discovery time)
  3. "Add a new firefighter" (measure Quick Add discovery)
  4. "View holds for November 15th" (measure calendar scan time)

### **Success Metrics**
- Time to first click: <3 seconds (primary actions)
- Discovery rate: >80% (users find element without prompting)
- Scan efficiency: <5 seconds to locate date in calendar

---

**Document Status:** ✅ Complete  
**Next Document:** `02-size-relationship-audit.md`  
**Estimated Time:** 3-4 hours for detailed measurements
