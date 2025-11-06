# MaterialM Rollback Procedures

**Created:** November 5, 2025
**Purpose:** Emergency rollback procedures for MaterialM deployment
**Rollback Time:** ~2-3 minutes

---

## When to Rollback

### Immediate Rollback Triggers (RED ALERTS)

**Execute rollback immediately if:**
- ❌ Critical bugs preventing core functionality
- ❌ Data loss or corruption
- ❌ Error rate spike >10%
- ❌ Performance regression >20%
- ❌ Security vulnerability discovered
- ❌ Accessibility violations causing user lockout
- ❌ Widespread user complaints (>10% of active users)

### Investigation Triggers (YELLOW ALERTS)

**Pause rollout and investigate if:**
- ⚠️ Error rate increase 5-10%
- ⚠️ Minor bugs affecting some users
- ⚠️ Performance slowdown 10-20%
- ⚠️ User confusion or complaints (5-10% of users)
- ⚠️ Non-critical accessibility issues

**Action:** Pause at current percentage, investigate, fix, then continue

---

## Rollback Methods

### Method 1: Remove Rollout Percentage (FASTEST)

**Rolls back to 0% MaterialM users:**

```bash
# Remove the rollout percentage
vercel env rm VITE_MATERIALM_ROLLOUT production

# Trigger new deployment
vercel --prod

# Wait 2-3 minutes for deploy
# All users will see legacy design
```

**Time:** ~3 minutes
**Impact:** All users back to legacy immediately

### Method 2: Reduce Rollout Percentage

**Reduce exposure but keep MaterialM for some users:**

```bash
# Example: Rollback from 50% to 10%
echo "10" | vercel env add VITE_MATERIALM_ROLLOUT production
vercel --prod
```

**Time:** ~3 minutes
**Impact:** Fewer users see MaterialM (deterministic, same users)

### Method 3: Disable MaterialM Entirely

**Complete disable (even admin overrides won't work):**

```bash
# Disable MaterialM globally
echo "false" | vercel env add VITE_USE_MATERIALM production
vercel --prod
```

**Time:** ~3 minutes
**Impact:** All users forced to legacy (localStorage overrides ignored)

### Method 4: User Self-Rollback

**Users can opt-out themselves:**

**Share this with affected users:**
```javascript
// In browser console at https://firefighter-hub.vercel.app
localStorage.setItem('feature_MATERIALM', 'false')
location.reload()
```

**Time:** Instant (per user)
**Impact:** Individual users can revert to legacy

---

## Rollback Procedure (Step-by-Step)

### Emergency Rollback Checklist

**Follow these steps in order:**

**1. Identify the Issue (1 minute)**
- [ ] Document the problem
- [ ] Determine severity (RED vs YELLOW)
- [ ] Check if rollback is necessary

**2. Choose Rollback Method (30 seconds)**
- RED alert → Method 1 (remove percentage)
- YELLOW alert → Method 2 (reduce percentage)
- Specific users affected → Method 4 (user self-rollback)

**3. Execute Rollback (2-3 minutes)**
```bash
# For complete rollback:
vercel env rm VITE_MATERIALM_ROLLOUT production
vercel --prod

# Wait for "Production: https://..." message
# Note the deployment URL
```

**4. Verify Rollback (2 minutes)**
```bash
# Check latest deployment
vercel ls | head -3

# Verify env var removed
vercel env ls | grep MATERIALM

# Test production
# Visit https://firefighter-hub.vercel.app
# Verify legacy design is showing
```

**5. Communicate (5 minutes)**
- [ ] Notify stakeholders
- [ ] Update users if needed
- [ ] Document rollback reason
- [ ] Plan fix strategy

**6. Post-Mortem (30 minutes)**
- [ ] Document what went wrong
- [ ] Identify root cause
- [ ] Create fix plan
- [ ] Update rollout plan

**Total Time:** ~10-15 minutes from decision to rollback complete

---

## Verification After Rollback

### Confirm Rollback Successful

**1. Check Environment Variables:**
```bash
vercel env ls | grep MATERIALM
# Should show: VITE_MATERIALM_ROLLOUT removed
# Or: VITE_USE_MATERIALM = false
```

**2. Check Production:**
```javascript
// Visit https://firefighter-hub.vercel.app
// In console:
localStorage.removeItem('feature_MATERIALM')
location.reload()

// Should see legacy design (dark slate calendar)
```

**3. Monitor Logs:**
```bash
vercel logs firefighter-hub
# Look for: No MaterialM-related errors
```

**4. Test Workflows:**
- [ ] Calendar displays (legacy)
- [ ] Can schedule holds
- [ ] Can add firefighters
- [ ] All buttons work
- [ ] No errors in console

---

## Post-Rollback Actions

### After Rolling Back

**Immediate (Day 1):**
1. Document the issue that caused rollback
2. Notify stakeholders
3. Create GitHub issue with details
4. Prioritize fix

**Short-Term (Day 2-3):**
1. Investigate root cause
2. Create fix
3. Test fix thoroughly
4. Update documentation

**Before Next Rollout:**
1. Verify fix deployed
2. Test extensively
3. Consider slower rollout (5% → 10% → 15%)
4. Monitor more closely

---

## Common Issues & Solutions

### Issue: Performance Regression

**Symptoms:**
- Page load times >20% slower
- Sluggish interactions
- Memory leaks

**Rollback:**
```bash
vercel env rm VITE_MATERIALM_ROLLOUT production
vercel --prod
```

**Fix Before Next Rollout:**
- Profile with React DevTools
- Check for unnecessary re-renders
- Optimize MaterialM components
- Consider code splitting

### Issue: Accessibility Violations

**Symptoms:**
- Users can't navigate with keyboard
- Screen readers broken
- Focus indicators missing

**Rollback:**
```bash
vercel env rm VITE_MATERIALM_ROLLOUT production
vercel --prod
```

**Fix Before Next Rollout:**
- Run axe-core audit
- Fix ARIA labels
- Fix focus management
- Test with screen reader

### Issue: Visual Bugs

**Symptoms:**
- Layout broken on mobile
- Dark mode issues
- Missing elements

**Rollback:**
```bash
# Partial rollback (reduce from 50% to 10%)
echo "10" | vercel env add VITE_MATERIALM_ROLLOUT production
vercel --prod
```

**Fix Before Next Rollout:**
- Test on all devices
- Fix responsive issues
- Test dark/light mode thoroughly

### Issue: Feature Flag Not Working

**Symptoms:**
- Some users stuck in MaterialM
- Can't toggle back to legacy

**Rollback:**
```bash
echo "false" | vercel env add VITE_USE_MATERIALM production
vercel --prod
```

**Fix Before Next Rollout:**
- Check useFeatureFlag hook
- Verify localStorage access
- Test flag toggle

---

## Monitoring During Rollout

### Daily Monitoring (15-30 minutes/day)

**1. Check Vercel Logs:**
```bash
vercel logs firefighter-hub | grep -i "error\|warning" | tail -50
```

**2. Check Console Errors:**
- Visit production
- Open DevTools console
- Look for MaterialM-related errors

**3. Test Critical Workflows:**
- Schedule a hold
- Add a firefighter
- Toggle dark mode
- Open modals

**4. Review Metrics:**
- Page load times (Vercel Analytics if available)
- Error rates
- User feedback

### Weekly Monitoring (1-2 hours/week)

**1. Aggregate Metrics:**
- Total users exposed to MaterialM
- Error rates trend
- Performance trend
- User feedback summary

**2. Decision Making:**
- Continue to next phase?
- Pause and investigate?
- Rollback completely?

---

## Communication Templates

### Rollback Announcement (If Needed)

**Subject:** Temporary Design Revert

**Message:**
> We temporarily reverted to the previous design while we address
> some issues. The new design will return soon once improvements are made.
>
> All your data is safe and all features continue to work normally.
>
> Thank you for your patience!

### Rollback Internal (For Team)

**Slack/Email:**
> MaterialM rolled back from X% to Y% (or 0%)
>
> Reason: [brief description]
>
> Issue documented in: [GitHub issue link]
>
> Fix ETA: [timeline]
>
> Next steps: [action items]

---

## Testing After Rollback

### Verify Legacy Works

**After rollback, test:**
- [ ] All calendar functions
- [ ] Scheduling holds
- [ ] Managing firefighters
- [ ] Dark/light mode
- [ ] Mobile responsive
- [ ] All modals and forms

**Should work identically to before MaterialM deployment.**

---

## Rollback History Log

**Track all rollbacks here:**

### Rollback #1 (If Occurs)

**Date:**
**From:** X% rollout
**To:** Y% rollout
**Reason:**
**Fix:**
**Re-rollout Date:**

---

## Emergency Contacts

### Who to Contact

**Deployment Issues:**
- Griffin (deployment owner)
- Vercel Support (if platform issues)

**Technical Issues:**
- Development team
- GitHub issues

**User Communication:**
- Support team
- Communications lead

---

## Appendix: Environment Variables

### Current Variables (Check Anytime)

```bash
vercel env ls
```

### MaterialM-Related Variables

**VITE_MATERIALM_ROLLOUT:**
- Purpose: Percentage of users seeing MaterialM
- Values: 0-100 (number)
- Default: Not set (0%)

**VITE_USE_MATERIALM:**
- Purpose: Force enable/disable globally
- Values: "true" or "false"
- Default: Not set (OFF)

### Variable Precedence

1. **localStorage** (highest - user override)
2. **VITE_USE_MATERIALM** (global override)
3. **VITE_MATERIALM_ROLLOUT** (percentage-based)
4. **Default** (OFF if none set)

---

**Keep this document handy during the entire rollout period!**

**Rollback is fast and safe - don't hesitate to use it if needed.**

---

*Updated: November 5, 2025*
*Status: 10% rollout active*
