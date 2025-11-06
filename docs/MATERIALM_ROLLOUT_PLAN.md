# MaterialM Gradual Rollout Plan

**Start Date:** November 5, 2025
**Initial Rollout:** 10% of users
**Target Completion:** 100% within 2 weeks
**Status:** 🚀 DAY 1 - 10% ROLLOUT ACTIVE

---

## Rollout Schedule

### Day 1: 10% Rollout ✅ ACTIVE NOW

**Date:** November 5, 2025
**Percentage:** 10% of users
**Environment Variable:** `VITE_MATERIALM_ROLLOUT=10`

**Status:**
- ✅ Environment variable set in production
- ✅ New deployment triggered
- ✅ MaterialM active for ~10% of users (deterministic hash)

**Monitoring:**
- Watch for error spikes in console
- Monitor user feedback (if collected)
- Check performance metrics

**Success Criteria:**
- No critical errors
- No user complaints
- Performance stable
- All workflows functional

### Day 3: 25% Rollout

**Date:** November 8, 2025 (3 days from now)
**Percentage:** 25% of users
**Command:**
```bash
echo "25" | vercel env add VITE_MATERIALM_ROLLOUT production
vercel --prod
```

**Prerequisites:**
- Day 1-2 monitoring shows no issues
- No critical bugs reported
- Performance metrics stable

### Day 5: 50% Rollout

**Date:** November 10, 2025 (5 days from now)
**Percentage:** 50% of users
**Command:**
```bash
echo "50" | vercel env add VITE_MATERIALM_ROLLOUT production
vercel --prod
```

**Prerequisites:**
- Day 3-4 monitoring shows no issues
- Positive or neutral user feedback
- No performance degradation

### Week 2 Day 1: 75% Rollout

**Date:** November 12, 2025 (1 week from now)
**Percentage:** 75% of users
**Command:**
```bash
echo "75" | vercel env add VITE_MATERIALM_ROLLOUT production
vercel --prod
```

**Prerequisites:**
- Week 1 monitoring shows success
- Majority positive feedback
- All issues resolved

### Week 2 Day 3: 100% Full Rollout

**Date:** November 14, 2025 (9 days from now)
**Percentage:** 100% of all users
**Command:**
```bash
echo "100" | vercel env add VITE_MATERIALM_ROLLOUT production
vercel --prod
```

**Prerequisites:**
- 75% rollout successful
- No blocking issues
- Stakeholder approval

---

## How Percentage Rollout Works

### Deterministic User Assignment

**Algorithm:**
```typescript
// In useRolloutFlag hook
const hash = userId.split('').reduce((acc, char) =>
  acc + char.charCodeAt(0), 0
);
return (hash % 100) < rolloutPercentage;
```

**Properties:**
- **Deterministic:** Same user always gets same experience
- **Consistent:** User doesn't flip between versions
- **Gradual:** Controlled increase in exposure
- **Fair:** Random distribution across user base

**Example:**
- User with hash 15: Sees MaterialM at 10%, 25%, 50%, 75%, 100%
- User with hash 85: Only sees MaterialM at 100%

### Admin Override

**Users can still force MaterialM on/off:**
```javascript
// Force ON (regardless of percentage)
localStorage.setItem('feature_MATERIALM', 'true')
location.reload()

// Force OFF (opt-out)
localStorage.setItem('feature_MATERIALM', 'false')
location.reload()
```

---

## Monitoring Checklist

### Daily Monitoring (During Rollout)

**1. Error Rates:**
```bash
# Check Vercel logs for errors
vercel logs firefighter-hub --follow

# Look for:
# - JavaScript errors
# - Failed API calls
# - Component render failures
```

**2. Console Errors:**
- Check production console for MaterialM errors
- Monitor browser error reporting (if available)

**3. User Feedback:**
- Monitor support channels
- Check for design-related complaints
- Track positive/negative sentiment

**4. Performance Metrics:**
- Page load times
- Time to interactive
- Lighthouse scores (if automated)

### What to Watch For

**Green Signals (Continue Rollout):**
- ✅ No error rate increase
- ✅ Positive or neutral feedback
- ✅ Performance stable or improved
- ✅ All workflows functional

**Yellow Signals (Pause & Investigate):**
- ⚠️ Minor error increase (<5%)
- ⚠️ Some user confusion
- ⚠️ Performance slightly slower
- ⚠️ Non-critical bugs

**Red Signals (ROLLBACK IMMEDIATELY):**
- ❌ Error rate spike (>10%)
- ❌ Critical bugs (data loss, broken workflows)
- ❌ Performance regression (>20% slower)
- ❌ Accessibility violations
- ❌ Widespread user complaints

---

## Rollback Procedures

### Instant Rollback (Emergency)

**If critical issues arise:**

```bash
# Option 1: Remove rollout percentage (back to 0%)
vercel env rm VITE_MATERIALM_ROLLOUT production
vercel --prod

# Option 2: Disable MaterialM entirely
echo "false" | vercel env add VITE_USE_MATERIALM production
vercel --prod
```

**Time to rollback:** ~2-3 minutes (Vercel deploy time)

### Partial Rollback

**If issues affect some users:**

```bash
# Reduce percentage (e.g., from 50% back to 10%)
echo "10" | vercel env add VITE_MATERIALM_ROLLOUT production
vercel --prod
```

### User Self-Rollback

**Users can opt-out themselves:**
```javascript
localStorage.setItem('feature_MATERIALM', 'false')
location.reload()
```

---

## User Communication

### Announcement (Optional)

**If you want to inform users:**

**Subject:** New Design Coming Soon

**Message:**
> We're gradually rolling out a fresh, modern design for FirefighterHub.
> You may notice cleaner interfaces, better contrast, and improved usability.
>
> All features work exactly the same - just with a new coat of paint!
>
> If you experience any issues, please let us know.

### Feedback Collection

**Simple Approach:**
- Monitor support emails
- Check for design-related comments
- Track user sentiment

**Advanced Approach (Future):**
- In-app feedback widget
- Survey after 1 week
- Analytics tracking (MaterialM vs Legacy usage)

---

## Rollout Metrics

### Track These Metrics

**Usage:**
- % of users seeing MaterialM (should match rollout %)
- % of users with localStorage override
- Total active users

**Performance:**
- Average page load time
- Time to interactive
- Lighthouse scores
- Error rates

**User Behavior:**
- Workflows completed
- Time on site
- Feature usage patterns

**Feedback:**
- Support tickets mentioning design
- Positive mentions
- Negative mentions
- Feature requests

---

## Decision Points

### Day 2 Decision: Continue to 25%?

**Evaluate:**
- Any errors in Day 1?
- User feedback positive/neutral?
- Performance stable?

**If YES to all → Proceed to 25%**
**If NO → Pause, investigate, fix**

### Day 4 Decision: Continue to 50%?

**Evaluate:**
- Day 3-4 smooth?
- Majority positive feedback?
- No blocking issues?

**If YES → Proceed to 50%**
**If NO → Pause at 25%, investigate**

### Week 2 Decision: Full Rollout?

**Evaluate:**
- Week 1 success?
- All issues resolved?
- Stakeholder approval?

**If YES → 100% rollout**
**If NO → Keep at 75%, gather more data**

---

## Success Criteria

### Per Phase

**Each rollout phase must meet:**
- ✅ Error rate < baseline + 5%
- ✅ No critical bugs
- ✅ Performance within 10% of baseline
- ✅ User feedback >60% positive (if collected)
- ✅ All workflows functional

### Overall

**For 100% rollout:**
- ✅ All phases successful
- ✅ No outstanding critical bugs
- ✅ User feedback >80% positive
- ✅ Performance equal or better
- ✅ Accessibility maintained

---

## Rollout Timeline

```
Day 1  ████░░░░░░░░░░  10%  ← YOU ARE HERE
Day 3  ██████░░░░░░░░  25%
Day 5  ██████████░░░░  50%
Day 8  ███████████████ 75%
Day 10 ████████████████ 100%
```

**Current Status:** 10% rollout ACTIVE

**Next Checkpoint:** November 8 (Day 3) - Evaluate for 25%

---

## Emergency Contacts

### Rollback Decision Maker

**Who can authorize rollback:**
- You (deployment owner)
- Any admin with Vercel access

**When to rollback:**
- Critical bugs
- Data loss issues
- Performance regression >20%
- Widespread user complaints

**How to execute:**
```bash
vercel env rm VITE_MATERIALM_ROLLOUT production
vercel --prod
```

---

## Post-Rollout (After 100%)

### Week 13: Cleanup Tasks

**Once 100% rollout is stable for 3+ days:**

1. **Remove Feature Flags** (2 hours)
   - Remove useFeatureFlag checks
   - Keep only MaterialM versions
   - Delete conditional logic

2. **Archive Legacy Components** (1 hour)
   - Move *Legacy.tsx files to archive/
   - Update imports
   - Document for historical reference

3. **Clean Up** (2 hours)
   - Remove old color system
   - Update documentation
   - Remove VITE_MATERIALM_ROLLOUT env var
   - Update README with new screenshots

**Total:** 5-7 hours to finalize

---

## Appendix: Commands Reference

### Rollout Commands

```bash
# Set percentage
echo "10" | vercel env add VITE_MATERIALM_ROLLOUT production
echo "25" | vercel env add VITE_MATERIALM_ROLLOUT production
echo "50" | vercel env add VITE_MATERIALM_ROLLOUT production
echo "75" | vercel env add VITE_MATERIALM_ROLLOUT production
echo "100" | vercel env add VITE_MATERIALM_ROLLOUT production

# Deploy changes
vercel --prod

# Check deployment
vercel ls

# View logs
vercel logs firefighter-hub
```

### Rollback Commands

```bash
# Remove rollout percentage (back to 0%)
vercel env rm VITE_MATERIALM_ROLLOUT production
vercel --prod

# Disable MaterialM entirely
echo "false" | vercel env add VITE_USE_MATERIALM production
vercel --prod

# Check env vars
vercel env ls
```

### Monitoring Commands

```bash
# View recent deployments
vercel ls

# Inspect deployment
vercel inspect <deployment-url>

# View logs (real-time)
vercel logs firefighter-hub --follow

# View logs (last 100 lines)
vercel logs firefighter-hub
```

---

## Notes

**Important Reminders:**

1. **Each deployment takes 2-3 minutes** - be patient
2. **Users are assigned consistently** - same hash always
3. **Admin can override** - localStorage works regardless
4. **Rollback is fast** - ~3 minutes total
5. **Monitor daily** - check for issues before increasing
6. **Document issues** - track all problems found
7. **Communicate changes** - inform users if desired

**Good Luck with the Rollout!** 🚀

---

**Current Status:** Day 1 - 10% rollout deploying now
**Next Action:** Monitor for 48 hours, then evaluate for 25%
**Rollback:** Available immediately if needed
