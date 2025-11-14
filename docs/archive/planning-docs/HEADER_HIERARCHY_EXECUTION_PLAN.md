# Header Hierarchy - Comprehensive Execution Plan
**Date**: 2025-11-07 20:29 UTC  
**Branch**: `feature/visual-hierarchy-implementation`  
**Estimated Time**: 2.5-3 hours  
**Current Status**: ~30-40% complete (8 files done, ~17+ remain)

---

## CORE PRINCIPLES - NEVER VIOLATE THESE

### 1. **MANDATORY VERIFICATION BEFORE CLAIMING COMPLETION**
```bash
# RULE: Never claim "done" without running this verification
grep -rn "className.*tokens\.typography\.heading" src/components/ | \
  grep -v "<h[1-6]" | wc -l

# Expected result when truly done: 0
# If > 0, you are NOT done. Period.
```

**Verification Checkpoints:**
- ✅ After every 2 batches (Batch 1-2, Batch 3-4, etc.)
- ✅ Before any "completion" documentation
- ✅ Before final commit
- ✅ Results must be saved to file (proof, not claims)

### 2. **STRICT DEFINITION OF DONE**
A task is "done" when ALL of these are true:
- [ ] All code changes implemented
- [ ] Old code removed/replaced (not commented out)
- [ ] Verification script passes (0 errors, 0 warnings)
- [ ] Atomic commit made with accurate message
- [ ] Changes tested (manual spot-check or automated)
- [ ] Documentation reflects VERIFIED reality (not aspirations)

### 3. **ATOMIC COMMITS AS YOU WORK**
- Commit after EACH batch (not at the end)
- 1 commit = 1 logical change (max 5-7 files per commit)
- Message format: `refactor(scope): what was changed - why`
- Include verification results in commit message when relevant

### 4. **CLEANUP OLD CODE IMMEDIATELY**
When replacing code:
```typescript
// ❌ WRONG - Don't leave old code commented
// const oldHeading = tokens.typography.heading.h3;
const newHeading = visualHeadings.titleLarge;

// ✅ CORRECT - Just replace it
const heading = visualHeadings.titleLarge;
```

**Rules:**
- Remove old imports when no longer needed
- Remove old code completely (don't comment out)
- Clean up unused variables
- Update related comments if they reference old code

---

## PHASE 0: BASELINE AUDIT (15 minutes)

### Task 0.1: Get Exact Count of Remaining Work
```bash
# Create comprehensive audit
grep -rn "className.*tokens\.typography\.heading" src/components/ > /tmp/all_heading_usage.txt

# Filter to ONLY non-semantic (not on h1-h6 tags)
grep -rn "className.*tokens\.typography\.heading" src/components/ | \
  grep -v "<h[1-6]" > /tmp/non_semantic_headings.txt

# Count them
echo "Total heading usage: $(wc -l < /tmp/all_heading_usage.txt)"
echo "Semantic (on h1-h6): $(grep "<h[1-6]" /tmp/all_heading_usage.txt | wc -l)"
echo "NON-SEMANTIC (must fix): $(wc -l < /tmp/non_semantic_headings.txt)"
```

**Save results to**: `docs/BASELINE_AUDIT.txt`

**Commit**: `docs: add baseline audit for header hierarchy work`
- 1 file: `docs/BASELINE_AUDIT.txt`
- Message includes exact counts
- No code changes yet

**Checkpoint**: 
- [ ] Audit file created
- [ ] Exact count known
- [ ] Committed and pushed

---

## PHASE 1: MODAL COMPONENTS BATCH 1 (30 minutes)

### Task 1.1: Refactor Auth/Utility Modals
**Files:**
1. `src/components/BattalionChiefLogin.tsx` (line 81)
2. `src/components/CalendarSubscribeModal.tsx` (line 99)
3. `src/components/KeyboardShortcutsModal.tsx` (line 66)

**Process for EACH file:**
1. Open file, locate exact line with non-semantic heading
2. Determine correct visualHeading replacement:
   - h1 → `visualHeadings.displayLarge` or `displayMedium`
   - h2 → `visualHeadings.titleLarge` or `subtitleLarge`
   - h3 → `visualHeadings.titleMedium` or `subtitleMedium`
   - h4 → `visualHeadings.titleSmall` or `subtitleSmall`
3. Replace the className
4. Add import if not present: `import { visualHeadings } from '../utils/theme';`
5. Remove old import if no longer used (check entire file)
6. Save file
7. **Verify change**: `git diff <filename>` (ensure clean replacement)

**Manual Test:**
- Start dev server: `pnpm dev`
- Open each modal in browser
- Verify visual appearance unchanged
- Check dark mode toggle works

**Commit**: `refactor(ui): replace non-semantic headings in auth/utility modals`

**Message template**:
```
refactor(ui): replace non-semantic headings in auth/utility modals

Replaced tokens.typography.heading.* with visualHeadings for non-semantic usage:
- BattalionChiefLogin.tsx: h3 → visualHeadings.titleMedium (line 81)
- CalendarSubscribeModal.tsx: h3 → visualHeadings.titleMedium (line 99)  
- KeyboardShortcutsModal.tsx: h3 → visualHeadings.titleMedium (line 66)

Semantic headings (on <h1>-<h6> tags) remain using tokens.typography.heading
as they should for proper document structure and SEO.

Verified: Visual appearance unchanged in light/dark modes.
Impact: Improved semantic HTML structure
```

**Checkpoint**:
- [ ] 3 files refactored
- [ ] Old code removed
- [ ] Imports cleaned up
- [ ] Manual test passed
- [ ] Committed with descriptive message
- [ ] Pushed

---

## PHASE 2: HELP MODAL (30 minutes)

### Task 2.1: Refactor HelpModal (7 instances!)
**File:** `src/components/HelpModal.tsx`

**Lines to fix** (from audit):
- Line 81: h2 class
- Line 111: h3 class
- Line 172: h3 class
- Line 228: h3 class
- Line 281: h3 class
- Line 330: h4 class
- Line 369: h4 class
- Line 443: h4 class (error styling - preserve semantic error color)

**Special attention**:
- Line 443 has error styling: `${colors.semantic.error.text}`
- Must preserve error color in replacement
- Example: `${visualHeadings.titleSmall} ${colors.semantic.error.text}`

**Process:**
1. Open HelpModal.tsx
2. Fix all 7-8 instances one by one
3. Verify each replacement with context (is it really non-semantic?)
4. Add visualHeadings import
5. Remove old heading imports if unused
6. Save

**Manual Test:**
- Open Help modal
- Check all sections render correctly
- Verify error styling still shows red text
- Test dark mode

**Commit**: `refactor(ui): replace non-semantic headings in HelpModal`

**Message template**:
```
refactor(ui): replace non-semantic headings in HelpModal

Replaced 7 instances of tokens.typography.heading.* with visualHeadings
for non-semantic usage (div/span elements with heading visual styling):

- Line 81: h2 → visualHeadings.titleLarge (section header)
- Line 111: h3 → visualHeadings.titleMedium (subsection)
- Line 172: h3 → visualHeadings.titleMedium (subsection)
- Line 228: h3 → visualHeadings.titleMedium (subsection)
- Line 281: h3 → visualHeadings.titleMedium (subsection)
- Line 330: h4 → visualHeadings.titleSmall (label)
- Line 369: h4 → visualHeadings.titleSmall (label)
- Line 443: h4 → visualHeadings.titleSmall + error color (preserved)

Verified: All sections render correctly, error styling preserved.
Impact: Improved semantic structure in help documentation
```

**Checkpoint**:
- [ ] 7-8 instances fixed in HelpModal
- [ ] Error styling preserved
- [ ] Old code removed
- [ ] Manual test passed
- [ ] Committed
- [ ] Pushed

---

## VERIFICATION CHECKPOINT 1 (15 minutes)

### Task V1: Verify Batches 1-2
**Run verification script:**
```bash
cd /Users/griffin/Projects/firefighterHub

# Count remaining non-semantic usage
grep -rn "className.*tokens\.typography\.heading" src/components/ | \
  grep -v "<h[1-6]" > /tmp/verification_checkpoint1.txt

# Display count
echo "=== CHECKPOINT 1 VERIFICATION ===" 
echo "Baseline: ~17 instances"
echo "After Batch 1-2: $(wc -l < /tmp/verification_checkpoint1.txt) instances"
echo "Expected: ~7-10 remaining"
echo ""
echo "Remaining files:"
cat /tmp/verification_checkpoint1.txt
```

**Save results**: `docs/VERIFICATION_CHECKPOINT_1.txt`

**Expected Progress**:
- Started: ~17 instances
- Fixed: ~10 instances (3 from Batch 1, 7 from Batch 2)
- Remaining: ~7 instances

**If count doesn't match expectations**:
- STOP and investigate
- Don't proceed to next batch
- Review what was missed

**Commit**: `test: verification checkpoint 1 - batches 1-2 complete`

**Message**:
```
test: verification checkpoint 1 - batches 1-2 complete

Verification Results:
- Baseline: 17 non-semantic heading instances
- After Batches 1-2: X instances remaining
- Fixed: Y instances
- Progress: Z%

Remaining files:
<paste list from verification_checkpoint1.txt>

Next: Continue with Batch 3 (partial completions)
```

**Checkpoint**:
- [ ] Verification run
- [ ] Results saved to file
- [ ] Count matches expectations (±1-2)
- [ ] Committed
- [ ] If count wrong, STOP and debug

---

## PHASE 3: PARTIAL COMPLETIONS (30 minutes)

### Task 3.1: Finish FirefighterProfileModal
**File:** `src/components/FirefighterProfileModal.tsx`
**Issue**: Already partially refactored, but line 247 still has non-semantic h1

**Process:**
1. Find line 247
2. Confirm it's non-semantic (not on <h1> tag)
3. Replace: `tokens.typography.heading.h1` → `visualHeadings.displayLarge`
4. Check if other refactored parts in same file are correct
5. Ensure visualHeadings import exists

**Commit**: `refactor(ui): complete FirefighterProfileModal heading replacement`

### Task 3.2: Finish FirefightersModal
**File:** `src/components/FirefightersModal.tsx`
**Issues**: Lines 195, 531 still have non-semantic h1/h2

**Process:**
1. Fix line 195: h1 → `visualHeadings.displayLarge`
2. Fix line 531: h2 → `visualHeadings.titleLarge`
3. Verify other parts already refactored
4. Clean up imports

**Commit**: `refactor(ui): complete FirefightersModal heading replacement`

**Combined Message Template**:
```
refactor(ui): complete partial heading replacements in profile modals

Finished replacing remaining non-semantic heading instances in modals
that were partially refactored in previous work:

FirefighterProfileModal.tsx:
- Line 247: h1 → visualHeadings.displayLarge (firefighter name display)

FirefightersModal.tsx:
- Line 195: h1 → visualHeadings.displayLarge (modal title)
- Line 531: h2 → visualHeadings.titleLarge (section header)

These files were partially refactored earlier but had missed instances.
Now fully compliant with semantic heading guidelines.

Verified: Visual appearance unchanged, all modal interactions work.
```

**Checkpoint**:
- [ ] FirefighterProfileModal complete
- [ ] FirefightersModal complete
- [ ] Old code removed
- [ ] Committed
- [ ] Pushed

---

## PHASE 4: UTILITY COMPONENTS (30 minutes)

### Task 4.1: Refactor Remaining Utility Components
**Files** (from audit):
1. `src/components/EmptyState.tsx` (line 42)
2. `src/components/FilterPanel.tsx` (line 70)
3. Any others discovered in verification

**Process for EACH file:**
1. Locate non-semantic heading usage
2. Replace with appropriate visualHeading
3. Add import if needed
4. Remove old import if unused
5. Test component renders correctly

**Manual Test:**
- Trigger EmptyState (clear all firefighters filter)
- Open FilterPanel
- Verify styling intact

**Commit**: `refactor(ui): replace non-semantic headings in utility components`

**Message Template**:
```
refactor(ui): replace non-semantic headings in utility components

Replaced tokens.typography.heading.* with visualHeadings in:
- EmptyState.tsx: h3 → visualHeadings.titleMedium (empty state message)
- FilterPanel.tsx: h3 → visualHeadings.titleMedium (filter section title)

These components use heading-style typography for visual hierarchy
but are not semantic document headings (h1-h6 tags).

Verified: Components render correctly with unchanged visual appearance.
```

**Checkpoint**:
- [ ] All utility components refactored
- [ ] Manual tests passed
- [ ] Committed
- [ ] Pushed

---

## VERIFICATION CHECKPOINT 2 (15 minutes)

### Task V2: Verify Batches 3-4
**Run verification script:**
```bash
cd /Users/griffin/Projects/firefighterHub

# Count remaining non-semantic usage
grep -rn "className.*tokens\.typography\.heading" src/components/ | \
  grep -v "<h[1-6]" > /tmp/verification_checkpoint2.txt

# Display count
echo "=== CHECKPOINT 2 VERIFICATION ===" 
echo "After Checkpoint 1: ~7-10 instances"
echo "After Batch 3-4: $(wc -l < /tmp/verification_checkpoint2.txt) instances"
echo "Expected: 0-2 remaining (edge cases only)"
echo ""
echo "Remaining files (if any):"
cat /tmp/verification_checkpoint2.txt
```

**Save results**: `docs/VERIFICATION_CHECKPOINT_2.txt`

**Expected Progress**:
- After Checkpoint 1: ~7-10 instances
- Fixed in Batches 3-4: ~5-7 instances
- Remaining: 0-2 instances (edge cases or newly discovered)

**If ANY instances remain**:
- Identify which files
- Determine if truly non-semantic
- Add to Batch 5 (mop-up)

**Commit**: `test: verification checkpoint 2 - batches 3-4 complete`

**Checkpoint**:
- [ ] Verification run
- [ ] Results saved
- [ ] Count is 0-2 (nearly complete)
- [ ] Committed
- [ ] If > 2 remain, STOP and debug

---

## PHASE 5: MOP-UP & EDGE CASES (15-30 minutes)

### Task 5.1: Handle Any Remaining Instances
**Process:**
1. Review `/tmp/verification_checkpoint2.txt`
2. For each remaining instance:
   - Verify it's truly non-semantic
   - If semantic (on h1-h6), update audit (false positive)
   - If non-semantic, refactor it
3. Commit each file individually if edge case
4. Or batch if multiple similar cases

**Commit**: `refactor(ui): handle edge cases in heading replacements`

### Task 5.2: Clean Up Imports Across All Touched Files
**Process:**
```bash
# Find files that import both tokens.typography.heading AND visualHeadings
grep -l "tokens.typography.heading" src/components/**/*.tsx | \
  xargs grep -l "visualHeadings" > /tmp/dual_imports.txt

# For each file, check if tokens.typography.heading is still needed
# If ONLY used on <h1>-<h6> tags, it's correct
# If not used at all, remove the import
```

**Manual review**: Each file in `/tmp/dual_imports.txt`

**If cleaning needed**: `refactor: clean up unused heading imports`

**Checkpoint**:
- [ ] All edge cases handled
- [ ] Imports cleaned
- [ ] Committed

---

## FINAL VERIFICATION (15 minutes)

### Task FV: The Moment of Truth
**Run complete verification:**
```bash
cd /Users/griffin/Projects/firefighterHub

echo "=== FINAL VERIFICATION ===" 
echo "Date: $(date)"
echo ""

# THE CRITICAL TEST
NON_SEMANTIC_COUNT=$(grep -rn "className.*tokens\.typography\.heading" src/components/ | grep -v "<h[1-6]" | wc -l)

echo "Non-semantic heading instances remaining: $NON_SEMANTIC_COUNT"
echo ""

if [ "$NON_SEMANTIC_COUNT" -eq 0 ]; then
  echo "✅ SUCCESS: All non-semantic heading usage replaced!"
  echo ""
  
  # Show semantic usage (should still exist on h1-h6 tags)
  SEMANTIC_COUNT=$(grep -rn "className.*tokens\.typography\.heading" src/components/ | grep "<h[1-6]" | wc -l)
  echo "Semantic heading usage (CORRECT, on h1-h6 tags): $SEMANTIC_COUNT"
  
  # Show visualHeadings usage
  VISUAL_COUNT=$(grep -r "visualHeadings\." src/components/ | wc -l)
  echo "visualHeadings usage (NEW): $VISUAL_COUNT"
  
  echo ""
  echo "✅ VERIFIED: Header hierarchy refactoring COMPLETE"
else
  echo "❌ FAILURE: $NON_SEMANTIC_COUNT instances still remain!"
  echo ""
  echo "Remaining instances:"
  grep -rn "className.*tokens\.typography\.heading" src/components/ | grep -v "<h[1-6]"
  echo ""
  echo "❌ NOT DONE - Fix remaining instances before claiming completion"
fi
```

**Save results**: `docs/FINAL_VERIFICATION.txt`

**Expected Results**:
```
Non-semantic heading instances remaining: 0
Semantic heading usage (CORRECT, on h1-h6 tags): ~30-40
visualHeadings usage (NEW): ~30-40
✅ VERIFIED: Header hierarchy refactoring COMPLETE
```

**If verification fails (count > 0)**:
- DO NOT PROCEED
- DO NOT claim completion
- Identify missed instances
- Fix them
- Re-run verification
- Repeat until count = 0

**Commit**: `test: final verification - all non-semantic headings replaced`

**Message**:
```
test: final verification - all non-semantic headings replaced

VERIFICATION RESULTS (verified with grep):
✅ Non-semantic heading instances: 0 (was ~17)
✅ Semantic heading usage (on h1-h6): X instances
✅ visualHeadings usage: Y instances

Verification command:
grep -rn "className.*tokens\.typography\.heading" src/components/ | grep -v "<h[1-6]" | wc -l

Result: 0 (PASS)

All non-semantic heading usage has been replaced with visualHeadings.
Semantic headings (on <h1>-<h6> tags) correctly use tokens.typography.heading.

This refactoring improves semantic HTML structure while maintaining
visual hierarchy through the visualHeadings utility system.
```

**Checkpoint**:
- [ ] Verification shows 0 non-semantic instances
- [ ] Results saved to file
- [ ] Committed
- [ ] **ONLY NOW** can claim completion

---

## PHASE 6: DOCUMENTATION (15 minutes)

### Task D1: Create Completion Report (HONEST)
**File**: `docs/HEADER_HIERARCHY_COMPLETION_REPORT.md`

**Must include:**
1. Original task description
2. What was done (specific files, line numbers)
3. **VERIFIED** results (paste from FINAL_VERIFICATION.txt)
4. Before/after metrics
5. Testing performed
6. Git commits made (with SHAs)
7. How to verify the work
8. Known limitations (if any)

**Template structure**:
```markdown
# Header Hierarchy Refactoring - Completion Report
**Date**: [actual date]
**Status**: ✅ COMPLETE (verified)

## Task Description
[paste original task]

## What Was Done
### Files Refactored (X files)
1. File.tsx - Y instances replaced (commit SHA)
   - Line Z: h1 → visualHeadings.displayLarge
   ...

### Total Instances Replaced
- Non-semantic heading usage: 17 → 0 (verified)
- New visualHeadings usage: 0 → ~X

## Verification Results (PROOF)
[paste ENTIRE output from FINAL_VERIFICATION.txt]

## Testing Performed
- [ ] Manual testing in browser
- [ ] Dark mode verification
- [ ] All modals open correctly
- [ ] No visual regressions
- [ ] Grep verification passed

## Git Commits
1. [SHA] - docs: baseline audit
2. [SHA] - refactor: batch 1
...

## How to Verify This Work
```bash
# Should return 0
grep -rn "className.*tokens\.typography\.heading" src/components/ | \
  grep -v "<h[1-6]" | wc -l
```

## Known Limitations
None. Work is complete and verified.
```

**Commit**: `docs: add header hierarchy completion report (verified)`

**Checkpoint**:
- [ ] Report created with VERIFIED results
- [ ] No false claims
- [ ] Verification proof included
- [ ] Committed

---

## FINAL CHECKLIST - DEFINITION OF DONE

Before claiming "COMPLETE", ALL must be ✅:

### Code Quality
- [ ] All non-semantic heading usage replaced (verified with grep = 0)
- [ ] Old code removed (no commented-out code)
- [ ] Imports cleaned up (no unused imports)
- [ ] visualHeadings import added where needed
- [ ] No linting errors introduced
- [ ] No TypeScript errors

### Testing
- [ ] Manual testing in browser (all components)
- [ ] Dark mode toggle tested
- [ ] All modals open/close correctly
- [ ] No visual regressions observed
- [ ] Verification script passes (0 non-semantic instances)

### Git History
- [ ] Atomic commits made (1 per batch)
- [ ] Commit messages are descriptive and accurate
- [ ] All commits pushed to remote
- [ ] No single commit > 10 files (except initial audit)
- [ ] Verification checkpoints committed

### Documentation
- [ ] Baseline audit created
- [ ] Verification checkpoints saved
- [ ] Final verification saved
- [ ] Completion report created
- [ ] **ALL CLAIMS VERIFIED** (no lies)

### Verification Proof
- [ ] FINAL_VERIFICATION.txt shows 0 non-semantic instances
- [ ] File committed to repo (permanent proof)
- [ ] Can be re-run by anyone to verify

---

## EMERGENCY PROCEDURES

### If Verification Fails
1. **STOP** - Do not proceed
2. **IDENTIFY** - Which instances were missed?
3. **FIX** - Refactor the missed instances
4. **RE-VERIFY** - Run verification again
5. **REPEAT** - Until verification passes

### If Unsure About Semantic vs Non-Semantic
```bash
# Check the context around the line
sed -n 'LINE_NUM-2,LINE_NUM+2p' src/components/File.tsx

# Look for:
# ✅ SEMANTIC: <h1 className={tokens.typography.heading.h1}>
# ❌ NON-SEMANTIC: <div className={tokens.typography.heading.h1}>
# ❌ NON-SEMANTIC: <span className={tokens.typography.heading.h1}>
# ❌ NON-SEMANTIC: <p className={tokens.typography.heading.h1}>
```

**Rule**: If it's not on an `<h1>` through `<h6>` tag, it's non-semantic.

### If Found New Instances During Work
1. Add to running list
2. Include in next batch
3. Update baseline count
4. Document in checkpoint verification

---

## TIME TRACKING

| Phase | Estimated | Actual | Notes |
|-------|-----------|--------|-------|
| Phase 0: Baseline Audit | 15 min | ___ | |
| Phase 1: Modal Batch 1 | 30 min | ___ | |
| Phase 2: HelpModal | 30 min | ___ | |
| Checkpoint 1 | 15 min | ___ | |
| Phase 3: Partial Completions | 30 min | ___ | |
| Phase 4: Utility Components | 30 min | ___ | |
| Checkpoint 2 | 15 min | ___ | |
| Phase 5: Mop-up | 15-30 min | ___ | |
| Final Verification | 15 min | ___ | |
| Phase 6: Documentation | 15 min | ___ | |
| **TOTAL** | **2.5-3 hours** | ___ | |

---

## SUCCESS CRITERIA

This work is COMPLETE when:
1. ✅ Grep verification returns 0 non-semantic instances
2. ✅ All manual tests pass (no visual regressions)
3. ✅ All atomic commits made and pushed
4. ✅ All verification checkpoints committed
5. ✅ Final verification proof committed
6. ✅ Completion report created with VERIFIED claims
7. ✅ This checklist is 100% ✅

**Until ALL success criteria are met, work is NOT COMPLETE.**

---

## COMMITMENT

I will:
- ✅ Follow this plan exactly
- ✅ Verify at each checkpoint
- ✅ Never claim completion without proof
- ✅ Make atomic commits as I work
- ✅ Clean up old code immediately
- ✅ Be honest about progress
- ✅ Ask for help if stuck

I will NOT:
- ❌ Skip verification steps
- ❌ Claim completion without proof
- ❌ Leave commented-out code
- ❌ Make giant commits
- ❌ Fabricate verification results
- ❌ Rush through batches

---

**Plan Status**: ✅ READY TO EXECUTE  
**Next Action**: Begin Phase 0 (Baseline Audit)  
**Estimated Completion**: 2.5-3 hours from start
