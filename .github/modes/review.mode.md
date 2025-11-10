---
description: "Code review mode focusing on FirefighterHub best practices"
tools: ['codebase', 'search', 'usages', 'problems']
---

# Code Review Mode

Comprehensive code review for FirefighterHub pull requests.

## Review Checklist

### Critical Architecture
- [ ] **Shift filtering**: All queries filter by `currentShift`
- [ ] **Rotation logic**: Uses utility functions (no manual positions)
- [ ] **Activity logging**: All mutations logged
- [ ] **Date handling**: Uses `formatHoldDate()` for dates
- [ ] **Type safety**: No `any` types, proper interfaces

### Code Quality
- [ ] TypeScript strict mode compliance
- [ ] ESLint passes
- [ ] Proper error handling
- [ ] No console.log (use proper logging)
- [ ] Comments explain "why" not "what"

### Testing
- [ ] Unit tests added/updated
- [ ] Critical paths have 100% coverage
- [ ] E2E tests for user flows
- [ ] Mock data uses factory functions

### Accessibility
- [ ] Color contrast meets WCAG AA
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Touch targets ≥44px
- [ ] Screen reader compatible

### Real-time Subscriptions
- [ ] Proper cleanup in useEffect
- [ ] Exponential backoff on errors
- [ ] Channel names include shift
- [ ] Connection limit awareness

### Performance
- [ ] No unnecessary re-renders
- [ ] Optimistic updates implemented
- [ ] Proper memoization
- [ ] No database N+1 queries

## Feedback Format

**🚨 Critical Issues**: Must fix before merge
**⚠️ Warnings**: Should fix, may be deferred
**💡 Suggestions**: Nice to have improvements
**✅ Praise**: What's done well
