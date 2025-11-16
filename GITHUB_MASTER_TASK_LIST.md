# FirefighterHub - GitHub Master Task List

**Generated:** 2025-11-15
**Repository:** DrunkOnJava/firefighterHub
**Status:** Post PR #81 merge ✅

---

## 🎉 Recent Completions

- ✅ **PR #81 MERGED** - Calendr-style redesign with sidebar roster (commit: 0d57d82)
- ✅ **Created 5 follow-up issues** (#85-89) for PR #81 deferred work
- ✅ **Added comprehensive review response** to PR #81
- ✅ **All critical fixes applied** (light mode CSS, admin menu, error logging)

---

## 📋 PENDING ACTIONS BY CATEGORY

### 🔴 CRITICAL PRIORITY (Do First)

#### Issue #14 - Fix Shift B Button Contrast (WCAG Violation)
- **Status:** OPEN since Nov 4
- **Priority:** CRITICAL (accessibility compliance)
- **Effort:** 30 minutes
- **Problem:** Shift B button has 2.8:1 contrast ratio (fails WCAG AA 4.5:1 requirement)
- **Solution:** Change from `#7C2D12` to Tailwind `red-600` (#DC2626) → 5.4:1 ratio ✅
- **Files:** `src/components/ShiftBadge.tsx:6`, `src/components/ShiftSelector.tsx`
- **Action:**
  1. Update color to `bg-red-600 text-white border-red-700`
  2. Test contrast with WebAIM checker
  3. Verify visibility in bright environments
  4. Close issue

---

### 🟡 PULL REQUESTS TO REVIEW & MERGE (Medium Priority)

#### PR #80 - Clean up and organize project codebase
- **Status:** OPEN (not draft)
- **Author:** DrunkOnJava
- **Created:** Nov 13
- **Changes:** 244 files changed
- **Impact:**
  - Remove 10 unused dependencies (~600KB bundle reduction)
  - Delete 9 unused components
  - Archive 176+ docs files
  - Organize 46 scripts into categories
  - Remove 800+ lines dead code
- **Action:**
  1. Review changes for breaking changes
  2. Test build after merge
  3. Verify no critical files deleted
  4. Merge if safe

#### PR #82 - RosterSidebar unit tests (DRAFT)
- **Status:** DRAFT
- **Author:** Copilot
- **Created:** Nov 15
- **Changes:** 21 tests for sorting/filtering logic
- **Action:**
  1. Review test coverage
  2. Run tests locally
  3. Mark ready for review if tests pass
  4. Merge

#### PR #83 - RosterSidebar filtering tests (DRAFT)
- **Status:** DRAFT
- **Author:** Copilot
- **Created:** Nov 15
- **Changes:** 30 tests (92.85% statement coverage)
- **Overlap:** May duplicate PR #82
- **Action:**
  1. Compare with PR #82
  2. Keep better test suite
  3. Close duplicate
  4. Merge winner

#### PR #84 - Sidebar width constant (DRAFT)
- **Status:** DRAFT
- **Author:** Copilot
- **Created:** Nov 15
- **Changes:** Replace hardcoded `w-80` with centralized constant
- **Action:**
  1. Quick review (small change)
  2. Mark ready for review
  3. Merge (good refactor)

---

### 📝 OPEN ISSUES TO TRIAGE (13 Total)

#### From PR #81 Follow-Ups (NEW - Nov 15)

**Issue #85 - Global search modal**
- **Priority:** Enhancement
- **Effort:** 2-3 hours
- **Status:** Ready to implement
- **Action:** Assign to developer or pick up when ready

**Issue #86 - New Event modal**
- **Priority:** Enhancement
- **Effort:** 3-4 hours
- **Status:** Ready to implement
- **Action:** Assign to developer or pick up when ready

**Issue #87 - Settings panel**
- **Priority:** Enhancement (admin feature)
- **Effort:** 2-3 hours
- **Status:** Ready to implement
- **Action:** Assign to developer or pick up when ready

**Issue #88 - Type safety for database enums**
- **Priority:** Refactor (tech debt)
- **Effort:** 1-2 hours
- **Status:** Ready to implement
- **Action:** Good candidate for junior developer

**Issue #89 - Roster performance optimization**
- **Priority:** Performance (low priority)
- **Effort:** 1-2 hours
- **Status:** Nice to have
- **Action:** Defer until performance issues reported

#### Older Issues (Nov 4-7)

**Issue #75 - Set up Copilot instructions**
- **Created:** Nov 7
- **Effort:** 30 minutes
- **Action:**
  1. Review Copilot best practices
  2. Create `.github/copilot-instructions.md`
  3. Close issue

**Issue #36 - Standardize station number formatting**
- **Priority:** LOW
- **Effort:** 1 hour
- **Action:**
  1. Create `formatStation()` utility
  2. Update all usages
  3. Close issue

**Issue #31 - Document hover state patterns**
- **Priority:** LOW
- **Effort:** 1 hour
- **Action:** Add to design system docs

**Issue #29 - Implement tooltip system**
- **Priority:** LOW
- **Effort:** 3 hours
- **Action:** Add tooltips to truncated text

**Issue #27 - Document responsive design strategy**
- **Priority:** LOW
- **Effort:** 2 hours
- **Action:** Create responsive strategy doc

**Issue #25 - Create unified loading states**
- **Priority:** MEDIUM
- **Effort:** 3 hours
- **Action:** Build LoadingSpinner component

**Issue #22 - Standardize modal overlay transparency**
- **Priority:** MEDIUM
- **Effort:** 2 hours
- **Action:** Define overlay variants

---

### 🗑️ BRANCHES TO DELETE (Post-Merge Cleanup)

#### Merged Branches
- `claude/calendr-redesign-01LFykskmJWtVhjQg8jJEDRB` - ✅ Merged into main (PR #81)
- Action: `git push origin --delete claude/calendr-redesign-01LFykskmJWtVhjQg8jJEDRB`

#### Work Branches (Can Delete)
- `claude/close-pr-81-calendr-015bg5v9GsJKTNpTVVBVvXNn` - Used for PR #81 fixes
- Action: `git push origin --delete claude/close-pr-81-calendr-015bg5v9GsJKTNpTVVBVvXNn`

#### Copilot Sub-PR Branches (Likely Stale)
- `copilot/sub-pr-81`
- `copilot/sub-pr-81-again`
- `copilot/sub-pr-81-another-one`
- Action: Verify these are stale, then delete all 3

#### Other Branches
- `claude/cleanup-and-organize-01FLqtSXxjM8yvgdJ6WmDUdr` - Check if related to PR #80
- Action: If PR #80 uses different branch, delete this one

#### Local-Only Branches
- `pr-81` (local only)
- `cleanup/unfry-the-repo` (local only)
- `backup-before-merge-20251108-0044` (local backup)
- `feature/micro-interactions-full-integration` (local only)
- Action: Delete locally if no longer needed

**Cleanup Commands:**
```bash
# Delete merged remote branches
git push origin --delete claude/calendr-redesign-01LFykskmJWtVhjQg8jJEDRB
git push origin --delete claude/close-pr-81-calendr-015bg5v9GsJKTNpTVVBVvXNn
git push origin --delete copilot/sub-pr-81
git push origin --delete copilot/sub-pr-81-again
git push origin --delete copilot/sub-pr-81-another-one

# Delete local branches
git branch -D pr-81
git branch -D cleanup/unfry-the-repo
git branch -D backup-before-merge-20251108-0044
git branch -D feature/micro-interactions-full-integration
git branch -D claude/calendr-redesign-01LFykskmJWtVhjQg8jJEDRB
git branch -D claude/close-pr-81-calendr-015bg5v9GsJKTNpTVVBVvXNn
```

---

### 📄 UNCOMMITTED FILES ON MAIN

#### Documentation Files (Untracked)
- `PR_81_CLOSURE_PLAN.md` - Comprehensive closure plan for PR #81
- `PR_UPDATE.md` - PR #81 description template
- `docs/calendr-redesign-spec.md` - Calendr redesign specification

**Action:**
```bash
git add PR_81_CLOSURE_PLAN.md PR_UPDATE.md docs/calendr-redesign-spec.md
git commit -m "docs: add PR #81 closure plan and Calendr redesign documentation

- PR_81_CLOSURE_PLAN.md: 10-phase comprehensive closure strategy
- PR_UPDATE.md: PR description template for Calendr redesign
- docs/calendr-redesign-spec.md: Complete Calendr design specification

These documents track the PR #81 review process and design decisions."
git push origin main
```

#### Modified Submodule
- `Copilot-Cli-MCP-Tools` (untracked content)

**Action:**
- Investigate what's in this submodule
- Either commit changes or add to .gitignore
- If not needed, remove submodule entirely

---

### 🎯 DEPLOYMENT & DOCUMENTATION

#### Verify Production Deployment
- **URL:** https://firefighter-hub.vercel.app
- **Action:**
  1. Visit site and verify PR #81 changes deployed
  2. Test admin context menu in production
  3. Verify light mode event blocks visible
  4. Check for console errors
  5. Monitor Vercel logs for 24 hours

#### Update Project Documentation
- **Files to Update:**
  - `README.md` - Add screenshot of new Calendr UI
  - `docs/ARCHITECTURE.md` - Document RosterSidebar, RosterItem, EventBlock components
  - `CHANGELOG.md` - Add v1.2.0 release notes for Calendr redesign

**Action:**
```bash
# Update README with screenshot
# Update ARCHITECTURE with new components
# Create CHANGELOG entry for v1.2.0
git add README.md docs/ARCHITECTURE.md CHANGELOG.md
git commit -m "docs: update documentation for Calendr redesign (v1.2.0)"
git push origin main
```

---

## 📊 TASK SUMMARY BY ACTION TYPE

### Commits & Pushes (3 items)
1. Commit untracked documentation files (PR_81_CLOSURE_PLAN.md, etc.)
2. Handle Copilot-Cli-MCP-Tools submodule
3. Update README, ARCHITECTURE, CHANGELOG

### Pull Requests (4 items)
4. Review & merge PR #80 (cleanup)
5. Review & merge PR #82 or #83 (tests - keep better one)
6. Review & merge PR #84 (sidebar constant)
7. Close duplicate test PR

### Issues - Critical (1 item)
8. Fix Issue #14 - Shift B contrast (WCAG violation)

### Issues - Triage (12 items)
9-13. Triage PR #81 follow-ups (#85-89)
14. Triage Issue #75 (Copilot setup)
15-20. Triage Phase 3-5 issues (#22, #25, #27, #29, #31, #36)

### Branch Cleanup (9 items)
21-25. Delete merged/stale remote branches (5 branches)
26-29. Delete local-only branches (4 branches)

### Deployment & Monitoring (5 items)
30. Verify production deployment
31. Monitor for errors (24 hours)
32. Update README
33. Update ARCHITECTURE
34. Create CHANGELOG entry

---

## ⏱️ ESTIMATED TIME BY PRIORITY

### Immediate (Today - 2 hours)
- ✅ Fix Issue #14 (Shift B contrast) - 30 min
- ✅ Commit untracked docs - 5 min
- ✅ Review & merge PR #84 (sidebar constant) - 10 min
- ✅ Delete merged branches - 5 min
- ✅ Verify production deployment - 20 min
- ✅ Update documentation (README, CHANGELOG) - 45 min

### This Week (5-8 hours)
- Review & merge PR #80 (large cleanup) - 1 hour
- Review & merge PR #82 or #83 (tests) - 30 min
- Triage all 12 open issues - 2 hours
- Update ARCHITECTURE.md - 1 hour
- Monitor production - ongoing

### This Month (10-14 hours)
- Implement Issue #85 (search modal) - 2-3 hours
- Implement Issue #86 (new event modal) - 3-4 hours
- Implement Issue #87 (settings panel) - 2-3 hours
- Implement Issue #88 (type safety) - 1-2 hours
- Implement Issue #89 (performance) - 1-2 hours

### Low Priority Backlog (8-10 hours)
- Issues #22, #25, #27, #29, #31, #36 - 8-10 hours total
- Issue #75 (Copilot setup) - 30 min

---

## 🚀 RECOMMENDED EXECUTION ORDER

### Phase 1: Immediate Cleanup (30 minutes)
```bash
# 1. Commit documentation
git add PR_81_CLOSURE_PLAN.md PR_UPDATE.md docs/calendr-redesign-spec.md
git commit -m "docs: add PR #81 closure plan and Calendr redesign documentation"
git push origin main

# 2. Delete merged branches
git push origin --delete claude/calendr-redesign-01LFykskmJWtVhjQg8jJEDRB
git push origin --delete claude/close-pr-81-calendr-015bg5v9GsJKTNpTVVBVvXNn
git push origin --delete copilot/sub-pr-81
git push origin --delete copilot/sub-pr-81-again
git push origin --delete copilot/sub-pr-81-another-one

# 3. Delete local branches
git branch -D pr-81 cleanup/unfry-the-repo backup-before-merge-20251108-0044 feature/micro-interactions-full-integration
```

### Phase 2: Critical Fix (30 minutes)
```bash
# Fix Issue #14 - Shift B button contrast
# 1. Edit src/components/ShiftBadge.tsx
# 2. Edit src/components/ShiftSelector.tsx
# 3. Test contrast ratio
# 4. Commit and push
# 5. Close issue #14
```

### Phase 3: Review Open PRs (2 hours)
```bash
# PR #84 - Quick review and merge
# PR #82/83 - Consolidate test PRs, merge best one
# PR #80 - Thorough review (large changes), merge if safe
```

### Phase 4: Issue Triage (1 hour)
- Label all issues with priority/phase
- Assign issues to milestones
- Close any duplicates
- Add effort estimates

### Phase 5: Documentation Updates (1 hour)
- Update README with Calendr screenshot
- Update ARCHITECTURE.md with new components
- Create CHANGELOG v1.2.0 entry
- Commit and push

### Phase 6: Production Monitoring (Ongoing)
- Check Vercel deployment
- Monitor error logs for 24-48 hours
- Gather user feedback
- Watch for regressions

---

## 📊 STATISTICS

### Repository Health
- **Total Open Issues:** 13
- **Total Open PRs:** 4 (1 ready, 3 drafts)
- **Stale Branches:** 9 (5 remote, 4 local)
- **Uncommitted Files:** 4 (3 docs, 1 submodule)
- **Recent Merges:** 1 (PR #81 - Nov 15)

### Priority Breakdown
- **Critical:** 1 issue (#14 - WCAG violation)
- **High:** 0
- **Medium:** 3 issues (#22, #25, and review of PR #80)
- **Low:** 9 issues (mostly documentation and polish)

### Estimated Work Remaining
- **Immediate (today):** 2 hours
- **This week:** 5-8 hours
- **This month:** 10-14 hours (PR #81 follow-ups)
- **Backlog:** 8-10 hours (Phase 3-5 polish)

**Total:** ~25-34 hours of work pending

---

## ✅ QUICK WIN CHECKLIST (Do These First)

High-impact, low-effort tasks to knock out quickly:

- [ ] Commit untracked docs (5 min)
- [ ] Delete merged branches (5 min)
- [ ] Fix Issue #14 - Shift B contrast (30 min)
- [ ] Review & merge PR #84 - Sidebar constant (10 min)
- [ ] Verify production deployment (20 min)
- [ ] Close duplicate test PR (#82 or #83) (5 min)
- [ ] Update CHANGELOG with v1.2.0 (15 min)

**Total Quick Wins:** ~1.5 hours for major cleanup

---

## 🔗 USEFUL LINKS

- **Production:** https://firefighter-hub.vercel.app
- **Repository:** https://github.com/DrunkOnJava/firefighterHub
- **PR #81:** https://github.com/DrunkOnJava/firefighterHub/pull/81 (MERGED ✅)
- **Open PRs:** https://github.com/DrunkOnJava/firefighterHub/pulls
- **Open Issues:** https://github.com/DrunkOnJava/firefighterHub/issues
- **Issue #14 (CRITICAL):** https://github.com/DrunkOnJava/firefighterHub/issues/14

---

## 📌 NOTES

- PR #81 successfully merged with all critical fixes applied
- 5 follow-up issues created for deferred work
- Copilot has created 3 PRs (likely from automated analysis)
- Consider consolidating Copilot test PRs (#82, #83)
- Issue #14 is CRITICAL for accessibility compliance
- Many low-priority polish issues can be batched together

---

**Last Updated:** 2025-11-15 20:45 PST
**Next Review:** After completing Quick Wins checklist
