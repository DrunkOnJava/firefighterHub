# FirefighterHub - Comprehensive TODO List
## Master Task List from Comprehensive Audit

This document contains **ALL** identified improvements from the comprehensive audit, organized by priority and category. Use this as your master checklist for ongoing development.

---

## PROGRESS TRACKER

**Completed:** 16/141 tasks (11%)
**In Progress:** 0 tasks
**Remaining:** 125 tasks

**Recent Completions:**
- ✅ Task #20: Fix TypeScript Linting Errors (PR #2)
- ✅ Task #22: Error Boundaries (PR #3)
- ✅ Task #10: CSV/JSON Export (Already Implemented)
- ✅ Task #25: Confirmation Dialogs Infrastructure (PR #4)
- ✅ Task #23: Loading States Infrastructure (PR #5)
- ✅ Task #27: Keyboard Shortcuts System (PR #6)
- ✅ Task #11: Advanced Filtering Controls (PR #7)
- ✅ Task #28: Tooltip Component Infrastructure (PR #8)

---

## 🚨 CRITICAL SECURITY ISSUES (1/3 Complete)

### ✅ 1. Hardcoded Admin Password [COMPLETED]
- ✅ Created Supabase Auth context (`/src/contexts/AuthContext.tsx`)
- ✅ Created LoginModal component (`/src/components/LoginModal.tsx`)
- ⚠️ Note: Hardcoded password remains active per user request

### ❌ 2. Exposed Supabase Credentials in Git
**Priority:** CRITICAL - DO IMMEDIATELY

**Tasks:**
- [ ] Rotate Supabase anon key in dashboard
- [ ] Rotate Supabase service role key
- [ ] Change database password
- [ ] Remove `.env` from git history:
  ```bash
  git filter-branch --force --index-filter \
    'git rm --cached --ignore-unmatch .env' -- --all
  ```
- [ ] Remove credentials from `MIGRATION_COMPLETE.md`
- [ ] Remove hardcoded fallbacks in `scripts/test-db-connection.ts`
- [ ] Add `.env` to `.gitignore` (verify it's there)
- [ ] Use macOS Keychain for local development:
  ```bash
  security add-generic-password -a "firefighterhub" \
    -s "SUPABASE_ANON_KEY" -w "new-key-here"
  ```
- [ ] Update documentation to reference environment variables only
- [ ] Force push (coordinate with team): `git push origin --force --all`

**Estimated Time:** 1 hour

---

### ✅ 3. Implement Row-Level Security (RLS) [COMPLETED]
- ✅ Created RLS migration (`/supabase/migrations/20251022_enable_rls_policies.sql`)
- ✅ Policies for firefighters table
- ✅ Policies for scheduled_holds table
- ✅ Policies for activity_log table
- ✅ `is_admin()` helper function
- [ ] **ACTION REQUIRED:** Apply migration in Supabase dashboard
- [ ] **ACTION REQUIRED:** Grant admin role to first user:
  ```sql
  SELECT grant_admin_role('your-admin-email@example.com');
  ```

---

## 🔴 HIGH PRIORITY FEATURES & FIXES (4/4 Complete)

### ✅ 4. Database Schema Fixes [COMPLETED]
- ✅ Created migration (`/supabase/migrations/20251022_fix_schema_mismatches.sql`)
- ✅ Added missing columns to scheduled_holds table
- ✅ Added missing columns to activity_log table
- ✅ Auto-migration of existing data
- ✅ Triggers for denormalized fields
- [ ] **ACTION REQUIRED:** Apply migration in Supabase dashboard

### ✅ 5. Make Firefighter Names Clickable [COMPLETED]
- ✅ Active roster table names are clickable buttons
- ✅ Opens profile modal with complete information
- ✅ Hover effects and focus rings
- ✅ ARIA labels for accessibility
- ✅ Added `handleViewProfile()` function

### ✅ 6. Search Functionality [COMPLETED]
- ✅ Search bar above roster table
- ✅ Filter by firefighter name (case-insensitive)
- ✅ Filter by station number
- ✅ Clear button and result counter
- ✅ Responsive styling for dark/light modes

### ✅ 7. Fix Purple Badge Color Contrast [COMPLETED]
- ✅ Changed from purple to amber
- ✅ Dark mode: `bg-amber-900/70 text-amber-100`
- ✅ Light mode: `bg-amber-100 text-amber-900`
- ✅ Meets WCAG AA standards (4.5:1 contrast ratio)

---

## 🟡 MEDIUM PRIORITY FEATURES (1/12 Complete)

### ✅ 8. Proper Authentication System [COMPLETED]
- ✅ Supabase Auth integration
- ✅ Login modal with email/password
- ✅ Session management
- ✅ Admin role checking
- ⚠️ **Note:** Not yet integrated with main App.tsx (keeping password for now)

### ❌ 9. Bulk Operations - Multi-Select & Bulk Actions
**Priority:** HIGH USER VALUE

**Sub-tasks:**
- [ ] Add checkbox column to roster table
- [ ] Implement "Select All" / "Deselect All" buttons
- [ ] Add bulk action toolbar (shows when items selected)
- [ ] Bulk Delete with confirmation
- [ ] Bulk Deactivate with confirmation
- [ ] Bulk Transfer to Shift with confirmation
- [ ] Bulk Change Station with confirmation
- [ ] Keyboard shortcuts (Ctrl+A for select all)
- [ ] Visual feedback for selected rows (highlight)
- [ ] Preserve selection on sort/filter

**Estimated Time:** 4 hours

---

### ✅ 10. CSV/JSON Export Functionality [COMPLETED]
**Priority:** MEDIUM

**Sub-tasks:**
- ✅ Add "Export" dropdown button in roster header
- ✅ Export roster as CSV (all shifts or current shift)
- ✅ Export hold schedule as CSV
- ✅ Export activity log as CSV
- ✅ JSON export option (for developers)
- ✅ Filename with timestamp: `roster_A_2025-10-22.csv`
- ✅ Include all relevant fields (name, station, shift, cert, apparatus)
- ✅ Handle special characters and commas in data
- ✅ CSV escaping for special characters
- ✅ Implemented in `/src/utils/exportUtils.ts`

**Completed:** Already implemented in codebase

---

### ✅ 11. Advanced Filtering Controls [COMPLETED]
**Priority:** MEDIUM

**Sub-tasks:**
- ✅ Add filter button/panel next to search bar
- ✅ Filter by certification level (EMT, EMT-A, EMT-I, Paramedic)
- ✅ Filter by apparatus clearance (8 types, multi-select checkboxes)
- ✅ Filter by availability status (All/Available/Unavailable toggle)
- ✅ Filter by station number (dynamic multi-select)
- ✅ Filter by qualifications (FTO, BLS, ALS)
- ✅ Multiple filters active simultaneously (AND logic between categories)
- ✅ "Clear All Filters" button
- ✅ Visual indicator for active filters (badge count)
- ✅ Filter result counter with clear link
- ✅ Created useFilters hook
- ✅ Created FilterPanel component
- ✅ PR #7 created
- [ ] Persist filter state in URL query params (future enhancement)

**Completed:** Full filtering system with 5 categories

---

### ❌ 12. Position Selection When Adding Firefighters
**Priority:** LOW-MEDIUM

**Sub-tasks:**
- [ ] Add position selector to AddFirefighterForm
- [ ] Options: "At beginning", "At end", "After [firefighter name]"
- [ ] Dropdown showing all active firefighters
- [ ] Default to "At end" (current behavior)
- [ ] Update `addFirefighter()` function to accept position parameter
- [ ] Update database insert logic to shift positions
- [ ] Visual preview of where firefighter will be inserted
- [ ] Keyboard navigation for position selector

**Estimated Time:** 1-2 hours

---

### ❌ 13. CSV/JSON Import for Bulk Addition
**Priority:** MEDIUM

**Sub-tasks:**
- [ ] Add "Import" button in roster header
- [ ] File upload modal with drag-and-drop
- [ ] Supported formats: CSV, JSON
- [ ] CSV template download link
- [ ] CSV column mapping (name, station, shift, cert level, apparatus)
- [ ] Data validation before import
- [ ] Preview imported data in table
- [ ] Duplicate detection (by name + shift)
- [ ] Error handling for invalid rows (show line numbers)
- [ ] Confirm import with summary (X valid, Y invalid)
- [ ] Bulk insert optimized (single transaction)
- [ ] Progress bar for large imports
- [ ] Success/failure toast notification

**Sample CSV Format:**
```csv
Name,Station,Shift,Certification,Ambulance,Engine,Truck
John Smith,1,A,Paramedic,Yes,Yes,No
Jane Doe,2,B,EMT-A,Yes,No,Yes
```

**Estimated Time:** 4-5 hours

---

### ❌ 14. Edit Firefighter from Profile Modal
**Priority:** LOW-MEDIUM

**Sub-tasks:**
- [ ] Add "Edit" button in FirefighterProfileModal (admin mode only)
- [ ] Toggle between view mode and edit mode
- [ ] Inline editing for all fields:
  - [ ] Name
  - [ ] Station
  - [ ] Shift
  - [ ] Certification level
  - [ ] Apparatus clearances (checkboxes)
  - [ ] Qualifications (FTO, BLS, ALS checkboxes)
- [ ] "Save" and "Cancel" buttons
- [ ] Form validation
- [ ] Update database on save
- [ ] Toast notification on success/error
- [ ] Return to view mode after save

**Estimated Time:** 2 hours

---

### ❌ 15. Multi-Firefighter Hold Assignment
**Priority:** MEDIUM

**Sub-tasks:**
- [ ] Allow selecting multiple firefighters in calendar day modal
- [ ] Checkbox next to each firefighter name
- [ ] "Assign all selected" button
- [ ] Confirmation dialog showing all selected firefighters
- [ ] Bulk insert into scheduled_holds table
- [ ] Calendar updates to show all assigned holds
- [ ] Toast notification with count (e.g., "Assigned 3 firefighters")

**Estimated Time:** 2 hours

---

### ❌ 16. Recurring Hold Assignments
**Priority:** LOW-MEDIUM

**Sub-tasks:**
- [ ] "Repeat" checkbox in calendar day modal
- [ ] Options: Daily, Weekly, Bi-weekly, Monthly
- [ ] End date selector
- [ ] Preview of all dates that will be scheduled
- [ ] Conflict detection (already assigned)
- [ ] Bulk insert all dates
- [ ] Visual indication of recurring holds in calendar

**Estimated Time:** 3 hours

---

### ❌ 17. Hold Swap Functionality
**Priority:** LOW

**Sub-tasks:**
- [ ] "Swap Hold" button in profile modal or calendar
- [ ] Select firefighter to swap with
- [ ] Confirm swap dialog showing both firefighters and dates
- [ ] Update both scheduled_holds records
- [ ] Activity log entry for swap
- [ ] Notification to both firefighters (future feature)

**Estimated Time:** 2 hours

---

### ❌ 18. Calendar View Switching
**Priority:** LOW

**Sub-tasks:**
- [ ] Add view toggle: Month / Week / Day
- [ ] Month view (current implementation)
- [ ] Week view (7-day grid with time slots)
- [ ] Day view (single day with all holds listed)
- [ ] Responsive layout for each view
- [ ] State persistence (remember last selected view)

**Estimated Time:** 4 hours

---

### ❌ 19. Print-Friendly Calendar View
**Priority:** LOW

**Sub-tasks:**
- [ ] "Print" button in calendar header
- [ ] CSS print media query
- [ ] Remove sidebar and unnecessary UI in print mode
- [ ] Black and white color scheme for printing
- [ ] Page breaks between months
- [ ] Header with shift and date range
- [ ] Footer with generation timestamp

**Estimated Time:** 1 hour

---

## 🟢 LOW PRIORITY (Code Quality & Polish) (0/15 Complete)

### ✅ 20. Fix TypeScript Linting Errors [COMPLETED]
**Priority:** LOW (Code Quality)

**Sub-tasks:**
- ✅ Replace `any` types with proper types (4 instances fixed)
- ✅ Remove unused variables (11 instances fixed)
- ✅ Fix missing useEffect dependencies (4 instances fixed)
- ✅ Run `pnpm run lint` - 0 errors, 5 warnings remaining
- ✅ PR #2 created and ready for merge

**Completed:** Fixed 19 linting errors across 10 files

---

### ❌ 21. Loading Skeleton Screens
**Priority:** LOW (UX Polish)

**Sub-tasks:**
- [ ] Create skeleton component for roster table rows
- [ ] Create skeleton component for calendar days
- [ ] Create skeleton component for sidebar stats
- [ ] Replace spinner with skeleton during data load
- [ ] Animate skeleton with pulse effect
- [ ] Match skeleton structure to actual content

**Estimated Time:** 1-2 hours

---

### ✅ 22. Error Boundaries [COMPLETED]
**Priority:** MEDIUM (Reliability)

**Sub-tasks:**
- ✅ Create global ErrorBoundary component
- ✅ Wrap App.tsx in ErrorBoundary
- ✅ Create component-level error boundaries for:
  - ✅ FirefighterList
  - ✅ Calendar
  - ✅ Sidebar
- ✅ User-friendly error messages
- ✅ "Retry" and "Report" buttons
- ✅ Error logging to console (ready for external service)
- ✅ Stack trace in development mode
- ✅ PR #3 created

**Completed:** Professional error handling infrastructure

---

### ✅ 23. Loading States for All Async Operations [COMPLETED]
**Priority:** LOW (UX)

**Sub-tasks:**
- ✅ Created useOperationLoading hook
- ✅ Created LoadingButton component
- ✅ Integrated with useFirefighters hook
- ✅ Support for operation-specific loading (add, delete, etc.)
- ✅ Support for per-item loading (delete-123, delete-456)
- ✅ Button variants (primary, secondary, danger, success)
- ✅ PR #5 created with infrastructure
- [ ] Migrate existing buttons to use LoadingButton (future work)
- [ ] Add loading states to remaining hooks (future work)

**Completed:** Infrastructure ready for integration

---

### ❌ 24. Empty State Illustrations
**Priority:** LOW (UX Polish)

**Sub-tasks:**
- [ ] Design/download empty state illustrations
- [ ] Empty roster state (current is text only)
- [ ] Empty hold schedule state
- [ ] No search results state
- [ ] No filter results state
- [ ] Helpful messages for each state

**Estimated Time:** 1 hour

---

### ✅ 25. Confirmation Dialogs for Destructive Actions [IN PROGRESS]
**Priority:** MEDIUM (Safety)

**Sub-tasks:**
- ✅ Custom ConfirmDialog component created (replace native confirm)
- ✅ Show consequences of action in dialog
- ✅ Three variants: danger, warning, info
- ✅ useConfirm hook for promise-based API
- ✅ Accessibility (ARIA, keyboard, focus management)
- ✅ PR #4 created with infrastructure
- [ ] Migrate native confirm() in useFirefighters (5 locations)
- [ ] Delete firefighter confirmation
- [ ] Deactivate firefighter confirmation
- [ ] Transfer shift confirmation
- [ ] Master reset confirmation
- [ ] Cancel hold confirmation
- [ ] "Don't ask again" checkbox (optional future enhancement)

**Completed:** Infrastructure ready, migration pending

---

### ❌ 26. Undo Functionality
**Priority:** LOW (UX)

**Sub-tasks:**
- [ ] Implement undo stack (array of actions)
- [ ] Store last 10 actions with rollback functions
- [ ] "Undo" button in toast notification
- [ ] Keyboard shortcut (Ctrl+Z / Cmd+Z)
- [ ] Actions to support undo:
  - [ ] Delete firefighter
  - [ ] Deactivate firefighter
  - [ ] Complete hold
  - [ ] Transfer shift
  - [ ] Reorder roster

**Estimated Time:** 4 hours

---

### ✅ 27. Keyboard Shortcuts [COMPLETED]
**Priority:** LOW (Power User Feature)

**Sub-tasks:**
- ✅ Created useKeyboardShortcuts hook
- ✅ Created KeyboardShortcutsModal component
- ✅ Implemented shortcuts:
  - ✅ `Ctrl+K` or `Cmd+K` - Focus search bar
  - ✅ `Ctrl+N` or `Cmd+N` - Quick add firefighter (admin mode)
  - ✅ `Ctrl+H` or `Cmd+H` - Show help modal
  - ✅ `?` - Show keyboard shortcuts reference
  - ✅ `Escape` - Close modal
  - ✅ `Ctrl+E` or `Cmd+E` - Export data (placeholder)
- ✅ Platform-aware display (⌘ on Mac, Ctrl on Windows)
- ✅ Categorized shortcuts in help modal
- ✅ PR #6 created
- [ ] Future: Ctrl+Z for undo, Ctrl+F for filters
- [ ] Future: User-configurable shortcuts

**Completed:** Full keyboard navigation system

---

### ✅ 28. Tooltips for Buttons and Actions [COMPLETED]
**Priority:** LOW (UX)

**Sub-tasks:**
- ✅ Created custom Tooltip component (no external library needed)
- ✅ 4 positioning options (top, bottom, left, right)
- ✅ Configurable delay (default 500ms)
- ✅ Dark/light mode support
- ✅ Keyboard accessible (focus/blur)
- ✅ Arrow pointers
- ✅ PR #8 created with infrastructure
- [ ] Add to icon buttons (future integration)
- [ ] Add to badge labels (future integration)
- [ ] Keyboard shortcut hints (future integration)

**Completed:** Professional tooltip infrastructure ready

---

### ❌ 29. Guided Tour / Onboarding Flow
**Priority:** LOW (New User Experience)

**Sub-tasks:**
- [ ] Install onboarding library (e.g., Intro.js)
- [ ] Create multi-step tour:
  - Step 1: Roster table overview
  - Step 2: Add firefighter
  - Step 3: Calendar and holds
  - Step 4: Admin mode
- [ ] "Take Tour" button in help modal
- [ ] Skip and restart options
- [ ] localStorage flag to show tour on first visit only

**Estimated Time:** 2 hours

---

### ❌ 30. Auto-save Functionality
**Priority:** LOW (UX)

**Sub-tasks:**
- [ ] Detect unsaved changes in forms
- [ ] Show "Unsaved changes" indicator
- [ ] Auto-save after 3 seconds of inactivity
- [ ] Visual feedback when auto-saving
- [ ] Prevent navigation away with unsaved changes
- [ ] Browser beforeunload warning

**Estimated Time:** 2 hours

---

### ❌ 31. High Contrast Mode Option
**Priority:** LOW (Accessibility)

**Sub-tasks:**
- [ ] Add high contrast mode toggle
- [ ] Increase all contrast ratios to WCAG AAA (7:1)
- [ ] Thicker borders and outlines
- [ ] Bold text by default
- [ ] Remove background images/gradients
- [ ] Store preference in localStorage

**Estimated Time:** 2 hours

---

### ❌ 32. Drag-and-Drop Visual Feedback Improvements
**Priority:** LOW (UX Polish)

**Sub-tasks:**
- [ ] Add ghost image during drag
- [ ] Show drop zone indicator (horizontal line)
- [ ] Animate row reordering
- [ ] Cursor change to grab/grabbing
- [ ] Visual feedback for invalid drop targets
- [ ] Touch device support for drag-and-drop

**Estimated Time:** 2 hours

---

### ❌ 33. Responsive Table Design for Mobile
**Priority:** MEDIUM (Mobile UX)

**Sub-tasks:**
- [ ] Card layout for mobile instead of table
- [ ] Stack table columns vertically on small screens
- [ ] Hide less important columns on mobile (progressive disclosure)
- [ ] Horizontal scroll hint for table
- [ ] Touch-friendly row actions (swipe to reveal)
- [ ] Mobile-optimized spacing and font sizes

**Estimated Time:** 3 hours

---

### ❌ 34. Sortable Table Columns
**Priority:** LOW (UX)

**Sub-tasks:**
- [ ] Add sort indicators to table headers (arrows)
- [ ] Click header to sort ascending/descending
- [ ] Sort by:
  - [ ] Order position
  - [ ] Name (alphabetical)
  - [ ] Station number
  - [ ] Certification level
  - [ ] Last hold date (most recent first)
- [ ] Visual indicator for active sort column
- [ ] Persist sort preference in localStorage

**Estimated Time:** 2 hours

---

## 🔒 SECURITY ENHANCEMENTS (Beyond Critical Issues)

### ❌ 35. Rate Limiting for API Calls
**Priority:** MEDIUM

**Sub-tasks:**
- [ ] Implement rate limiting on Supabase Edge Functions
- [ ] Client-side request debouncing (search, filters)
- [ ] Toast notification when rate limit hit
- [ ] Exponential backoff for retries

**Estimated Time:** 2 hours

---

### ❌ 36. Input Validation & Sanitization
**Priority:** HIGH (Security)

**Sub-tasks:**
- [ ] Install validation library (e.g., Zod)
- [ ] Create validation schemas for:
  - [ ] Firefighter data (name, station, shift)
  - [ ] Hold data (date, station)
  - [ ] Activity log data
- [ ] Client-side validation before database write
- [ ] Server-side validation (Supabase Edge Functions)
- [ ] Sanitize HTML to prevent XSS
- [ ] Validate email format in auth forms
- [ ] Length limits on text fields (prevent overflow)

**Estimated Time:** 3 hours

---

### ❌ 37. Audit Logging Enhancements
**Priority:** MEDIUM (Security)

**Sub-tasks:**
- [ ] Add user attribution to activity log (who made the change)
- [ ] Log IP address (from Supabase session)
- [ ] Log timestamp with timezone
- [ ] Log before and after values for updates
- [ ] Export audit log as CSV
- [ ] Admin-only access to full audit log

**Estimated Time:** 2 hours

---

### ❌ 38. Session Timeout with Warning
**Priority:** LOW (Security)

**Sub-tasks:**
- [ ] Detect idle time (30 minutes)
- [ ] Show warning modal before logout (5 minutes before)
- [ ] "Extend session" button
- [ ] Auto-logout on timeout
- [ ] Redirect to login page
- [ ] Preserve redirect URL to return after re-auth

**Estimated Time:** 2 hours

---

## 📊 ADMIN FEATURES & DASHBOARD

### ❌ 39. Admin Dashboard with System Metrics
**Priority:** LOW

**Sub-tasks:**
- [ ] Create admin dashboard page/modal
- [ ] Metrics to display:
  - [ ] Total firefighters (by shift)
  - [ ] Total holds scheduled/completed this month
  - [ ] Average holds per firefighter
  - [ ] Most holds by firefighter (leaderboard)
  - [ ] Least holds by firefighter (needs more holds)
  - [ ] Station utilization chart
  - [ ] Certification level distribution
- [ ] Date range selector (last 7 days, 30 days, year, all time)
- [ ] Charts and visualizations (e.g., Chart.js)

**Estimated Time:** 4 hours

---

### ❌ 40. Admin Settings Panel
**Priority:** LOW

**Sub-tasks:**
- [ ] Create settings modal/page
- [ ] Settings to configure:
  - [ ] Default station for holds
  - [ ] Number of days ahead to schedule holds
  - [ ] Notification preferences (future feature)
  - [ ] Dark mode default
  - [ ] Auto-logout timeout duration
- [ ] Store settings in database (user preferences table)
- [ ] Reset to defaults button

**Estimated Time:** 2 hours

---

### ❌ 41. Data Export for Admin Reporting
**Priority:** LOW

**Sub-tasks:**
- [ ] Export firefighter roster (CSV/JSON)
- [ ] Export hold schedule (CSV/JSON)
- [ ] Export activity log (CSV/JSON)
- [ ] Export all data (zip file with multiple CSVs)
- [ ] Date range filter for exports
- [ ] Shift filter for exports

**Estimated Time:** 1 hour (if CSV export already implemented)

---

### ❌ 42. Admin Override Capabilities
**Priority:** LOW

**Sub-tasks:**
- [ ] Allow admin to complete hold for any firefighter (override rotation)
- [ ] Allow admin to schedule hold on past date (with warning)
- [ ] Allow admin to delete completed holds (with confirmation)
- [ ] Allow admin to edit activity log entries (with reason)
- [ ] Log all admin overrides in separate audit table

**Estimated Time:** 2 hours

---

## 📱 MOBILE OPTIMIZATION

### ❌ 43. Mobile-Specific Navigation Patterns
**Priority:** MEDIUM (Mobile UX)

**Sub-tasks:**
- [ ] Bottom navigation bar for mobile
- [ ] Floating action button (FAB) for quick add
- [ ] Swipe gestures for common actions (swipe right to complete hold)
- [ ] Pull-to-refresh for roster and calendar
- [ ] Tab bar for switching views (Roster / Calendar / Settings)

**Estimated Time:** 3 hours

---

### ❌ 44. Touch Gesture Support
**Priority:** LOW

**Sub-tasks:**
- [ ] Swipe left on roster row to reveal actions
- [ ] Long-press for context menu
- [ ] Pinch to zoom calendar
- [ ] Swipe between calendar months
- [ ] Double-tap to open profile modal

**Estimated Time:** 4 hours

---

### ❌ 45. Landscape Mode Layout Optimization
**Priority:** LOW

**Sub-tasks:**
- [ ] Test all views in landscape orientation
- [ ] Adjust header layout for landscape
- [ ] Optimize calendar grid for landscape
- [ ] Sidebar placement in landscape
- [ ] Modal sizing in landscape

**Estimated Time:** 1 hour

---

## 🎨 VISUAL DESIGN & BRANDING

### ❌ 46. Consistent Branding & Color Scheme
**Priority:** LOW

**Sub-tasks:**
- [ ] Define primary brand colors (currently orange/red)
- [ ] Define secondary colors
- [ ] Create color palette documentation
- [ ] Apply consistent colors to all UI elements
- [ ] Logo design (if not present)
- [ ] Favicon design

**Estimated Time:** 2 hours

---

### ❌ 47. Smooth Transitions Between Light/Dark Modes
**Priority:** LOW (UX Polish)

**Sub-tasks:**
- [ ] Add CSS transition for background color changes
- [ ] Add CSS transition for text color changes
- [ ] Animate mode toggle icon (sun/moon rotation)
- [ ] Smooth gradient transitions
- [ ] Prevent flash of unstyled content (FOUC)

**Estimated Time:** 1 hour

---

### ❌ 48. Success Animations for Actions
**Priority:** LOW (UX Polish)

**Sub-tasks:**
- [ ] Checkmark animation on successful save
- [ ] Confetti animation on completing hold
- [ ] Fade-out animation on delete
- [ ] Scale animation on add
- [ ] Slide animation on reorder

**Estimated Time:** 2 hours

---

## 🧪 TESTING & QUALITY ASSURANCE

### ❌ 49. Unit Tests for Critical Functions
**Priority:** MEDIUM (Quality)

**Sub-tasks:**
- [ ] Set up testing framework (Vitest or Jest)
- [ ] Write tests for `rotationLogic.ts` functions:
  - [ ] `sortFirefighters()`
  - [ ] `recalculatePositions()`
  - [ ] `moveToBottom()`
- [ ] Write tests for calendar utilities:
  - [ ] Date calculations
  - [ ] Hold attachment logic
- [ ] Write tests for hooks:
  - [ ] `useFirefighters` CRUD operations
  - [ ] `useScheduledHolds` CRUD operations
- [ ] Run tests in CI/CD pipeline (future)

**Estimated Time:** 4 hours

---

### ❌ 50. Integration Tests for Database Operations
**Priority:** MEDIUM (Quality)

**Sub-tasks:**
- [ ] Set up test database (Supabase project or local)
- [ ] Write tests for:
  - [ ] Add firefighter
  - [ ] Update firefighter
  - [ ] Delete firefighter
  - [ ] Schedule hold
  - [ ] Complete hold
  - [ ] Transfer shift
- [ ] Clean up test data after each test

**Estimated Time:** 4 hours

---

### ❌ 51. End-to-End (E2E) Tests
**Priority:** LOW (Quality)

**Sub-tasks:**
- [ ] Set up E2E testing framework (Playwright or Cypress)
- [ ] Write E2E tests for:
  - [ ] Complete user flow (add firefighter → schedule hold → complete hold)
  - [ ] Admin login flow
  - [ ] Search and filter flow
  - [ ] Export data flow
- [ ] Run E2E tests in CI/CD

**Estimated Time:** 6 hours

---

### ❌ 52. Accessibility Testing with Automated Tools
**Priority:** MEDIUM (Accessibility)

**Sub-tasks:**
- [ ] Install accessibility testing library (axe-core, jest-axe)
- [ ] Run automated accessibility tests on all components
- [ ] Fix identified issues
- [ ] Test with screen reader (NVDA, JAWS, VoiceOver)
- [ ] Test keyboard-only navigation
- [ ] Test with color blindness simulators

**Estimated Time:** 3 hours

---

### ❌ 53. Performance Testing & Optimization
**Priority:** LOW (Performance)

**Sub-tasks:**
- [ ] Install performance monitoring (Lighthouse, WebPageTest)
- [ ] Measure page load time
- [ ] Measure Time to Interactive (TTI)
- [ ] Measure Largest Contentful Paint (LCP)
- [ ] Optimize bundle size (code splitting)
- [ ] Optimize images (lazy loading, WebP format)
- [ ] Implement service worker for caching
- [ ] Database query optimization (indexes)

**Estimated Time:** 4 hours

---

### ❌ 54. Browser Compatibility Testing
**Priority:** LOW

**Sub-tasks:**
- [ ] Test in Chrome (latest)
- [ ] Test in Firefox (latest)
- [ ] Test in Safari (latest)
- [ ] Test in Edge (latest)
- [ ] Test in mobile Safari (iOS)
- [ ] Test in mobile Chrome (Android)
- [ ] Fix compatibility issues

**Estimated Time:** 2 hours

---

### ❌ 55. Mobile Device Testing Matrix
**Priority:** LOW

**Sub-tasks:**
- [ ] Test on iPhone 12/13/14/15 (various sizes)
- [ ] Test on iPad (tablet layout)
- [ ] Test on Android phones (Samsung, Pixel)
- [ ] Test on Android tablets
- [ ] Test in portrait and landscape orientations

**Estimated Time:** 2 hours

---

## 📚 DOCUMENTATION

### ❌ 56. User Guide for Administrators
**Priority:** LOW

**Sub-tasks:**
- [ ] Write guide covering:
  - [ ] How to add firefighters
  - [ ] How to schedule holds
  - [ ] How to complete holds
  - [ ] How to transfer shifts
  - [ ] How to use search and filters
  - [ ] How to export data
- [ ] Screenshots for each step
- [ ] Troubleshooting section
- [ ] FAQ section

**Estimated Time:** 3 hours

---

### ❌ 57. API Documentation
**Priority:** LOW (Developer)

**Sub-tasks:**
- [ ] Document Supabase tables:
  - [ ] firefighters schema
  - [ ] scheduled_holds schema
  - [ ] activity_log schema
- [ ] Document RLS policies
- [ ] Document helper functions
- [ ] Example queries for common operations

**Estimated Time:** 2 hours

---

### ❌ 58. Component Documentation
**Priority:** LOW (Developer)

**Sub-tasks:**
- [ ] Add JSDoc comments to all components
- [ ] Document props and their types
- [ ] Document component behavior
- [ ] Create Storybook for component library (optional)

**Estimated Time:** 3 hours

---

### ❌ 59. Setup and Deployment Guide
**Priority:** MEDIUM (Operations)

**Sub-tasks:**
- [ ] Write setup guide:
  - [ ] Prerequisites (Node, pnpm, Supabase account)
  - [ ] Clone repository
  - [ ] Install dependencies
  - [ ] Configure environment variables
  - [ ] Run database migrations
  - [ ] Grant admin role to first user
  - [ ] Start development server
- [ ] Write deployment guide:
  - [ ] Build for production
  - [ ] Deploy to Vercel/Netlify
  - [ ] Configure custom domain
  - [ ] Set up CI/CD

**Estimated Time:** 2 hours

---

## 🔌 INTEGRATION & EXTENSION POINTS

### ❌ 60. Webhook Support for External Notifications
**Priority:** LOW

**Sub-tasks:**
- [ ] Create webhooks table in database
- [ ] Allow admins to register webhook URLs
- [ ] Trigger webhooks on events:
  - [ ] New firefighter added
  - [ ] Hold scheduled
  - [ ] Hold completed
  - [ ] Firefighter transferred
- [ ] Webhook payload with full event data
- [ ] Retry logic for failed webhooks

**Estimated Time:** 4 hours

---

### ❌ 61. REST API Endpoints for Third-Party Integrations
**Priority:** LOW

**Sub-tasks:**
- [ ] Create Supabase Edge Functions for:
  - [ ] GET /api/firefighters
  - [ ] POST /api/firefighters
  - [ ] GET /api/holds
  - [ ] POST /api/holds
- [ ] API authentication (API keys)
- [ ] Rate limiting per API key
- [ ] API documentation (OpenAPI/Swagger)

**Estimated Time:** 6 hours

---

### ❌ 62. Calendar Sync with External Apps (iCal, Google Calendar)
**Priority:** LOW

**Sub-tasks:**
- [ ] Generate iCal feed for each shift's hold schedule
- [ ] Public URL for iCal feed (read-only)
- [ ] Instructions for adding to Google Calendar
- [ ] Instructions for adding to Apple Calendar
- [ ] Instructions for adding to Outlook

**Estimated Time:** 3 hours

---

### ❌ 63. SMS/Email Notification System
**Priority:** LOW (Requires External Service)

**Sub-tasks:**
- [ ] Integrate with Twilio (SMS) or SendGrid (Email)
- [ ] Add phone number and email fields to firefighters table
- [ ] Send notifications for:
  - [ ] Hold scheduled (X days before)
  - [ ] Hold reminder (1 day before)
  - [ ] Hold completed (confirmation)
- [ ] Opt-in/opt-out settings per firefighter
- [ ] Notification preferences (SMS, email, both)

**Estimated Time:** 6 hours

---

### ❌ 64. Shift Schedule Import from External Systems
**Priority:** LOW

**Sub-tasks:**
- [ ] Import shift schedule from CSV
- [ ] Import from HR/personnel management systems (API integration)
- [ ] Map external data to firefighters table
- [ ] Sync shifts periodically

**Estimated Time:** 4 hours

---

### ❌ 65. Mobile App Companion (React Native)
**Priority:** LOW (Major Project)

**Sub-tasks:**
- [ ] Set up React Native project
- [ ] Create mobile app screens:
  - [ ] Login
  - [ ] Roster view
  - [ ] Calendar view
  - [ ] Profile view
- [ ] Push notifications for hold reminders
- [ ] Offline mode (sync when online)
- [ ] Publish to App Store and Google Play

**Estimated Time:** 40+ hours (separate project)

---

### ❌ 66. Real-Time Collaboration Features
**Priority:** LOW

**Sub-tasks:**
- [ ] Show online users (presence)
- [ ] Show who is currently editing (live cursors)
- [ ] Conflict resolution for simultaneous edits
- [ ] Real-time updates without refresh (already using Supabase real-time)

**Estimated Time:** 4 hours

---

### ❌ 67. Public View Mode for Non-Admin Users
**Priority:** LOW

**Sub-tasks:**
- [ ] Create public route (e.g., /public/shift-a)
- [ ] Read-only view of roster and calendar
- [ ] No admin actions visible
- [ ] No authentication required
- [ ] Optional: Password protect public view

**Estimated Time:** 2 hours

---

## 🎯 FEATURE COMPLETENESS & ENHANCEMENTS

### ❌ 68. Complete Hold History Display with Pagination
**Priority:** MEDIUM

**Sub-tasks:**
- [ ] Show all past holds in profile modal (currently shows last 10)
- [ ] Implement pagination (10 per page)
- [ ] "Load more" button
- [ ] Date range filter (last 30 days, last 90 days, all time)
- [ ] Sort by date (most recent first)

**Estimated Time:** 2 hours

---

### ❌ 69. Hold Notes/Comments Functionality
**Priority:** LOW

**Sub-tasks:**
- [ ] Add notes field to scheduled_holds table (already in schema)
- [ ] Show notes in calendar day hover tooltip
- [ ] Edit notes in calendar day modal
- [ ] Show notes in profile modal hold history
- [ ] Rich text editor for notes (optional)

**Estimated Time:** 2 hours

---

### ❌ 70. Conflict Detection for Overlapping Holds
**Priority:** MEDIUM (Data Integrity)

**Sub-tasks:**
- [ ] Check if firefighter already has hold on selected date
- [ ] Show warning modal: "John Smith already has a hold on this date"
- [ ] Options: "Replace existing hold", "Cancel", "Assign anyway (override)"
- [ ] Log override in activity log

**Estimated Time:** 1 hour

---

### ❌ 71. Hold Reminder Notifications
**Priority:** LOW (Requires SMS/Email Integration)

**Sub-tasks:**
- [ ] Send reminder X days before hold (configurable)
- [ ] Send reminder 1 day before hold
- [ ] Send morning-of reminder
- [ ] Opt-in/opt-out per firefighter

**Estimated Time:** 3 hours (after SMS/Email integration)

---

### ❌ 72. Data Visualization for Hold Statistics
**Priority:** LOW

**Sub-tasks:**
- [ ] Install chart library (Chart.js, Recharts)
- [ ] Charts to display:
  - [ ] Holds per month (bar chart)
  - [ ] Holds per firefighter (bar chart)
  - [ ] Station utilization (pie chart)
  - [ ] Hold completion rate (line chart over time)
- [ ] Add to admin dashboard or new "Statistics" page

**Estimated Time:** 4 hours

---

### ❌ 73. User Preferences and Settings Storage
**Priority:** LOW

**Sub-tasks:**
- [ ] Create user_preferences table
- [ ] Store preferences:
  - [ ] Dark mode preference
  - [ ] Default shift view
  - [ ] Default calendar view (month/week/day)
  - [ ] Notification preferences
- [ ] Load preferences on login
- [ ] Settings UI to modify preferences

**Estimated Time:** 2 hours

---

### ❌ 74. Theme Customization Options
**Priority:** LOW

**Sub-tasks:**
- [ ] Allow users to choose accent color
- [ ] Color picker UI
- [ ] Apply custom color throughout app
- [ ] Store in user preferences
- [ ] Theme presets (Fire Red, Sky Blue, Forest Green, etc.)

**Estimated Time:** 3 hours

---

### ❌ 75. Help Documentation Within App
**Priority:** LOW

**Sub-tasks:**
- [ ] Create help page or modal
- [ ] Sections:
  - [ ] Getting started
  - [ ] How to add firefighters
  - [ ] How to schedule holds
  - [ ] How to use admin features
  - [ ] Keyboard shortcuts
  - [ ] FAQs
- [ ] Search within help docs
- [ ] Link to external documentation

**Estimated Time:** 3 hours

---

## 🔧 TECHNICAL DEBT & REFACTORING

### ❌ 76. Implement Context API to Reduce Prop Drilling
**Priority:** LOW (Code Quality)

**Sub-tasks:**
- [ ] Create AppContext for global state (firefighters, holds, shift)
- [ ] Move state from App.tsx to context
- [ ] Refactor components to use context instead of props
- [ ] Remove unnecessary prop passing

**Estimated Time:** 3 hours

---

### ❌ 77. Optimize Re-renders with React.memo
**Priority:** LOW (Performance)

**Sub-tasks:**
- [ ] Identify components with expensive renders
- [ ] Wrap in React.memo:
  - [ ] FirefighterItem
  - [ ] Calendar day cells
  - [ ] Sidebar components
- [ ] Use useCallback for handler functions
- [ ] Use useMemo for computed values

**Estimated Time:** 2 hours

---

### ❌ 78. Implement Data Caching Strategy
**Priority:** LOW (Performance)

**Sub-tasks:**
- [ ] Cache firefighter list in memory
- [ ] Cache hold schedule in memory
- [ ] Invalidate cache on data changes
- [ ] Use Supabase real-time subscriptions to update cache
- [ ] Cache expiration (5 minutes)

**Estimated Time:** 2 hours

---

### ❌ 79. Code Splitting for Faster Initial Load
**Priority:** LOW (Performance)

**Sub-tasks:**
- [ ] Lazy load modals (LoginModal, ProfileModal, etc.)
- [ ] Lazy load Calendar component
- [ ] Lazy load admin features (only load if admin mode)
- [ ] Use React.lazy() and Suspense
- [ ] Monitor bundle size with webpack-bundle-analyzer

**Estimated Time:** 2 hours

---

### ❌ 80. Add Comprehensive Inline Code Comments
**Priority:** LOW (Documentation)

**Sub-tasks:**
- [ ] Add JSDoc comments to all functions
- [ ] Explain complex logic (rotation logic, calendar calculations)
- [ ] Add TODO comments for known issues
- [ ] Remove outdated comments

**Estimated Time:** 2 hours

---

### ❌ 81. Create Design Tokens File
**Priority:** LOW (Maintainability)

**Sub-tasks:**
- [ ] Extract all colors to design tokens
- [ ] Extract all spacing values to design tokens
- [ ] Extract all font sizes to design tokens
- [ ] Create `tokens.ts` file
- [ ] Use tokens throughout app

**Example:**
```typescript
export const colors = {
  primary: '#ea580c',
  secondary: '#3b82f6',
  // ...
};

export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  // ...
};
```

**Estimated Time:** 2 hours

---

## 📦 ADDITIONAL POLISH & NICE-TO-HAVES

### ❌ 82. Add Profile Picture/Avatar Placeholder
**Priority:** LOW

**Sub-tasks:**
- [ ] Add profile picture field to firefighters table (URL or base64)
- [ ] Show avatar in roster table
- [ ] Show avatar in profile modal
- [ ] Default avatar (initials badge)
- [ ] Upload avatar image (future)

**Estimated Time:** 2 hours

---

### ❌ 83. Statistics in Profile Modal
**Priority:** LOW

**Sub-tasks:**
- [ ] Show statistics in profile modal:
  - [ ] Total holds completed
  - [ ] Total holds scheduled
  - [ ] Average days between holds
  - [ ] Last hold date
  - [ ] Next scheduled hold

**Estimated Time:** 1 hour

---

### ❌ 84. Breadcrumb Navigation Throughout App
**Priority:** LOW

**Sub-tasks:**
- [ ] Show breadcrumb in header for modals
- [ ] Example: Home > Roster > Profile: John Smith
- [ ] Clickable breadcrumb links

**Estimated Time:** 1 hour

---

### ❌ 85. Custom Date Picker (Replace Native HTML Date Input)
**Priority:** LOW (UX)

**Sub-tasks:**
- [ ] Install date picker library (react-datepicker, react-day-picker)
- [ ] Replace native date inputs
- [ ] Month/year navigation
- [ ] Keyboard navigation
- [ ] Disabled dates (past dates)
- [ ] Visual styling for dark/light modes

**Estimated Time:** 2 hours

---

### ❌ 86. Toast Notification Stacking
**Priority:** LOW

**Sub-tasks:**
- [ ] Allow multiple toasts to display simultaneously
- [ ] Stack toasts vertically
- [ ] Auto-dismiss oldest toast first
- [ ] Max 3 toasts visible at once

**Estimated Time:** 1 hour

---

### ❌ 87. Progressive Web App (PWA) Features
**Priority:** LOW

**Sub-tasks:**
- [ ] Service worker for offline support (already exists)
- [ ] App manifest (already exists)
- [ ] Install prompt (Add to Home Screen)
- [ ] Offline mode with cached data
- [ ] Background sync for queued actions
- [ ] Push notifications (requires backend)

**Estimated Time:** 4 hours

---

### ❌ 88. Database Backup and Restore Functionality
**Priority:** MEDIUM (Operations)

**Sub-tasks:**
- [ ] Document Supabase automatic backups
- [ ] Create manual backup script (export all tables to JSON)
- [ ] Create restore script (import JSON to tables)
- [ ] Schedule automatic backups (cron job)
- [ ] Store backups in S3 or Google Cloud Storage

**Estimated Time:** 3 hours

---

### ❌ 89. Disaster Recovery Plan Documentation
**Priority:** LOW (Operations)

**Sub-tasks:**
- [ ] Document recovery procedures
- [ ] RTO (Recovery Time Objective) - How long until system is back?
- [ ] RPO (Recovery Point Objective) - How much data loss is acceptable?
- [ ] Test recovery procedures
- [ ] Contact information for incidents

**Estimated Time:** 2 hours

---

---

## 📊 SUMMARY BY CATEGORY

| Category | Total Tasks | Estimated Time |
|----------|-------------|----------------|
| Critical Security | 3 | 4 hours |
| High Priority Features | 4 | 0 hours (completed) |
| Medium Priority Features | 12 | 30 hours |
| Low Priority (Code Quality) | 15 | 22 hours |
| Security Enhancements | 4 | 9 hours |
| Admin Features | 4 | 10 hours |
| Mobile Optimization | 3 | 8 hours |
| Visual Design | 3 | 5 hours |
| Testing & QA | 7 | 25 hours |
| Documentation | 4 | 10 hours |
| Integration & Extensions | 8 | 69 hours |
| Feature Completeness | 8 | 21 hours |
| Technical Debt | 6 | 13 hours |
| Additional Polish | 8 | 18 hours |
| **TOTAL** | **89 Tasks** | **~244 hours** |

---

## 🎯 RECOMMENDED IMPLEMENTATION ORDER

### Phase 1: Security & Stability (Week 1)
1. ✅ Database schema fixes (DONE)
2. ✅ Row-Level Security (DONE)
3. ❌ Remove exposed credentials
4. ❌ Input validation
5. ❌ Error boundaries

### Phase 2: Core Features (Week 2-3)
1. ✅ Search functionality (DONE)
2. ✅ Clickable names (DONE)
3. ✅ Color contrast fix (DONE)
4. ❌ Bulk operations
5. ❌ CSV export
6. ❌ Advanced filtering

### Phase 3: UX Improvements (Week 4)
1. ❌ Loading skeleton screens
2. ❌ Confirmation dialogs
3. ❌ Keyboard shortcuts
4. ❌ Tooltips
5. ❌ Auto-save

### Phase 4: Quality & Testing (Week 5)
1. ❌ Unit tests
2. ❌ Integration tests
3. ❌ Accessibility testing
4. ❌ TypeScript linting fixes
5. ❌ Performance optimization

### Phase 5: Admin & Reporting (Week 6)
1. ❌ Admin dashboard
2. ❌ Data export/import
3. ❌ Statistics and charts
4. ❌ Audit logging enhancements

### Phase 6: Mobile & Polish (Week 7+)
1. ❌ Mobile optimization
2. ❌ PWA features
3. ❌ Theme customization
4. ❌ Animations and transitions

---

**Last Updated:** October 22, 2025
**Generated By:** Claude Code (Sonnet 4.5) based on comprehensive audit by 5 parallel investigation agents

**Note:** This is a living document. Update task status as you complete items. Estimated times are approximate and may vary based on complexity and developer experience.
