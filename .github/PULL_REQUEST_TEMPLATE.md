## Description

<!-- Provide a clear and concise description of what this PR does and why it's needed -->

## Type of Change

<!-- Mark the relevant option with an 'x' -->

- [ ] 🐛 Bug fix (non-breaking change that fixes an issue)
- [ ] ✨ New feature (non-breaking change that adds functionality)
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] 📝 Documentation update
- [ ] 🎨 UI/UX improvement
- [ ] ♻️ Code refactoring (no functional changes)
- [ ] ⚡ Performance improvement
- [ ] 🔒 Security fix
- [ ] 🗄️ Database migration

## Changes Made

<!-- List the specific changes made in this PR -->

- 
- 
- 

## Related Issues

<!-- Link related issues using keywords: Closes #123, Fixes #456, Relates to #789 -->

Closes #
Relates to #

## Critical Architecture Review

<!-- ⚠️ For changes affecting critical systems, confirm compliance -->

### Shift-Based Data Isolation
- [ ] All Supabase queries filter by `currentShift` (if applicable)
- [ ] No cross-shift data contamination possible
- [ ] Not applicable

### Rotation Logic
- [ ] Uses utility functions (never manual position assignment)
- [ ] Tests cover position recalculation scenarios
- [ ] Not applicable

### Date Handling
- [ ] Uses `formatHoldDate()` or similar utilities for ISO strings
- [ ] No direct Date object manipulation of database dates
- [ ] Not applicable

### Activity Logging
- [ ] All mutations log to `activity_log` table
- [ ] Logged actions have descriptive details
- [ ] Not applicable

### Real-Time Subscriptions
- [ ] Subscriptions properly cleaned up in useEffect return
- [ ] Connection limit impact considered (<200 concurrent)
- [ ] Not applicable

## Testing

<!-- Describe how you tested your changes -->

### Automated Tests
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] E2E tests added/updated (if UI changes)
- [ ] All existing tests pass (`pnpm test:run`)

### Manual Testing
- [ ] Tested on desktop (1920×1080)
- [ ] Tested on tablet (768px)
- [ ] Tested on mobile (375px)
- [ ] Tested in light mode
- [ ] Tested in dark mode
- [ ] Tested with keyboard navigation
- [ ] Tested with screen reader (if UI changes)

### Test Coverage
<!-- Include coverage results for changed files if applicable -->
```
# Run: pnpm test:coverage
Coverage: ___%
```

## Screenshots/Videos

<!-- For UI changes, include before/after screenshots or screen recordings -->

### Before
<!-- Screenshot or description of current behavior -->

### After
<!-- Screenshot or description of new behavior -->

## Code Quality Checklist

### TypeScript
- [ ] No `any` types used
- [ ] Proper interfaces defined for component props
- [ ] Uses types from `src/lib/supabase.ts`
- [ ] TypeScript compilation passes (`pnpm typecheck`)

### Styling
- [ ] Uses Tailwind design tokens (no arbitrary values)
- [ ] Responsive classes for mobile/tablet/desktop
- [ ] Dark mode variants included (`dark:` prefix)
- [ ] Follows spacing scale (gap-2, gap-4, gap-6, etc.)

### Accessibility
- [ ] Semantic HTML used (`<button>` not `<div onClick>`)
- [ ] ARIA labels on icon-only buttons
- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] Focus indicators visible
- [ ] Touch targets ≥44px (WCAG compliance)
- [ ] Screen reader announcements added (if needed)

### Code Standards
- [ ] ESLint passes with no warnings (`pnpm lint`)
- [ ] Follows existing code patterns
- [ ] No console.log/debugger statements
- [ ] Comments explain "why" not "what"

## Database Changes

<!-- If this PR includes database changes -->

- [ ] Migration file created in `supabase/migrations/`
- [ ] Migration is idempotent (can run multiple times safely)
- [ ] Rollback plan documented
- [ ] RLS policies updated (if needed)
- [ ] Indexes added for new queries
- [ ] Types regenerated (`pnpm types:generate`)
- [ ] No breaking changes to existing data
- [ ] Not applicable - no database changes

## Dependencies

<!-- If this PR adds or updates dependencies -->

- [ ] New dependencies justified and minimal
- [ ] Dependencies have TypeScript support
- [ ] No security vulnerabilities (`pnpm audit`)
- [ ] Bundle size impact acceptable
- [ ] Not applicable - no dependency changes

## Documentation

- [ ] Code comments added/updated
- [ ] README.md updated (if needed)
- [ ] CONTRIBUTING.md updated (if workflow changes)
- [ ] JSDoc added for complex functions
- [ ] Not applicable - no documentation needed

## Performance

<!-- For performance-sensitive changes -->

- [ ] No performance regressions introduced
- [ ] Optimizations documented
- [ ] Large lists use virtualization/pagination
- [ ] Images optimized and lazy-loaded
- [ ] Not applicable - no performance concerns

## Security

<!-- For security-sensitive changes -->

- [ ] No secrets hardcoded
- [ ] User input validated and sanitized
- [ ] SQL injection prevented (using Supabase client properly)
- [ ] XSS vulnerabilities addressed
- [ ] Authentication/authorization properly enforced
- [ ] Not applicable - no security concerns

## Breaking Changes

<!-- If this is a breaking change, describe the impact and migration path -->

### Impact
<!-- What will break? -->

### Migration Guide
<!-- How should users update their code? -->

## Deployment Notes

<!-- Special instructions for deployment -->

- [ ] Database migration required
- [ ] Environment variables need updating
- [ ] Feature flag needed
- [ ] Data backfill script needed
- [ ] Not applicable - standard deployment

## Reviewer Notes

<!-- Any specific areas you'd like reviewers to focus on? -->

## Post-Merge Tasks

<!-- Tasks to complete after this PR is merged -->

- [ ] Close related issues
- [ ] Update project board
- [ ] Notify team in Slack/Discord
- [ ] Update changelog
- [ ] Create follow-up issues (if needed)
- [ ] None needed

---

## Pre-Submit Checklist

<!-- Verify all items before submitting -->

- [ ] Branch is up to date with `main`
- [ ] `pnpm typecheck` passes
- [ ] `pnpm lint` passes
- [ ] `pnpm test:run` passes
- [ ] `pnpm build` succeeds
- [ ] Self-reviewed my own code
- [ ] Added/updated tests for changes
- [ ] Documentation updated
- [ ] Conventional commit format in title
- [ ] PR description is clear and complete

## Merge Strategy

<!-- Recommended merge strategy for this PR -->

- [ ] **Squash merge** (default - single commit with all changes)
- [ ] **Merge commit** (preserve individual commits - well-organized history)
- [ ] **Rebase** (linear history - clean, atomic commits)

---

<!-- 
🔍 Review Tips:
- Check the "Files changed" tab for detailed code review
- Test locally by checking out this branch
- Verify all automated checks pass
- Focus on architectural compliance for critical systems
- Ensure accessibility standards are met for UI changes
-->
