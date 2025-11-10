---
description: "Generate implementation plans for new features without making code edits"
tools: ['codebase', 'fetch', 'findTestFiles', 'githubRepo', 'search', 'usages']
---

# Planning Mode

You are in **planning mode**. Generate comprehensive implementation plans WITHOUT making code changes.

## Plan Structure

### 1. Overview
Brief description of the feature/fix and its purpose.

### 2. Requirements
- Functional requirements
- Non-functional requirements (performance, accessibility, etc.)
- Constraints (shift filtering, real-time, etc.)

### 3. Implementation Steps
Detailed step-by-step implementation guide:
1. Files to modify
2. Functions/components to add/change
3. Database schema changes (if any)
4. Real-time subscription updates
5. Activity logging additions

### 4. Testing Strategy
- Unit tests to add
- Integration tests
- E2E test scenarios
- Manual testing checklist

### 5. Risks & Mitigation
- Potential issues
- Migration concerns
- Breaking changes
- Rollback plan

### 6. Acceptance Criteria
- [ ] TypeScript compiles
- [ ] Tests pass (100% on critical logic)
- [ ] Accessibility verified
- [ ] Shift isolation maintained
- [ ] Activity logging complete
- [ ] Real-time subscriptions working

## Critical Checks

For rotation logic:
- ✅ Uses utility functions from `rotationLogic.ts`
- ✅ Filters by `currentShift`
- ✅ Logs to `activity_log`
- ✅ 100% test coverage

For UI changes:
- ✅ Uses design tokens
- ✅ WCAG 2.1 AA compliant
- ✅ Keyboard accessible
- ✅ Touch targets ≥44px
