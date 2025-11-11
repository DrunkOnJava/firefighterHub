# Content Creator Guidelines: Header Usage
**FirefighterHub - Semantic HTML Best Practices**

## Quick Reference Card

### When to Use Each Heading Level

| Level | Purpose | Example | Max per Section |
|-------|---------|---------|-----------------|
| **H1** | Page title ONLY | "FirefighterHub - Shift Management" | 1 per page |
| **H2** | Major sections | "Roster Management", "Hold Calendar" | 3-5 per page |
| **H3** | Subsections | "Active Members", "Scheduled Holds" | 2-4 per H2 |
| **H4** | Minor subsections | "Station 1 Assignments" | 1-3 per H3 |
| **H5** | Rarely needed | Fine-grained details | Avoid if possible |
| **H6** | Almost never needed | Ultra-specific content | Avoid |

---

## The Golden Rules

### ✅ DO

1. **Use sequential hierarchy** - Never skip levels
2. **One H1 per page** - Main title only
3. **Include keywords naturally** - Improve SEO
4. **Pair with ARIA** - Better accessibility
5. **Describe content** - Not just "Details"

### ❌ DON'T

1. **Skip levels** (H2 → H4)
2. **Use for styling** (Use CSS classes instead)
3. **Multiple H1s** per page
4. **Generic text** ("Section", "Info")
5. **Backwards hierarchy** (H3 → H2)

---

## Common Patterns

### Modal Dialog
```tsx
<dialog aria-labelledby="modal-title">
  <h2 id="modal-title">Complete Hold for John Doe</h2>
</dialog>
```

### Section with Subsections
```tsx
<section aria-labelledby="section-title">
  <h2 id="section-title">Active Firefighters</h2>
  
  <article>
    <h3>Station 1 (6 members)</h3>
  </article>
</section>
```

### Visual Text (Not Semantic)
```tsx
{/* Need big text WITHOUT semantic meaning */}
<p className={visualHeadings.displayLarge}>
  Position: 1
</p>
```

---

## SEO Keyword Integration

### Generic vs. Optimized

```tsx
// ❌ Generic (Low SEO)
<h2>Calendar</h2>

// ✅ Optimized (High SEO)
<h2>Firefighter Hold Schedule Calendar</h2>
```

### Target Keywords

- firefighter shift management
- hold rotation tracker
- fire department roster
- shift scheduling
- battalion chief software

---

## Testing Checklist

Before publishing:

- [ ] Headers follow sequential hierarchy
- [ ] Only ONE H1 per page
- [ ] Keywords integrated naturally
- [ ] ARIA landmarks present
- [ ] Screen reader tested
- [ ] No styling-only headers

---

## Visual vs. Semantic Classes

Use `visualHeadings` utilities when you need styled text WITHOUT semantic meaning:

```typescript
visualHeadings.displayLarge   // H1-sized (48px)
visualHeadings.titleLarge     // H2-sized (32px)  
visualHeadings.subtitleLarge  // H3-sized (20px)
visualHeadings.label          // Label (14px)
```

---

## Need Help?

- **Documentation**: See `docs/HEADER_HIERARCHY_AUDIT.md`
- **Code Examples**: `docs/header-patterns.tsx`
- **Questions**: Ask in project Slack channel

---

**Last Updated**: 2025-11-07  
**Version**: 1.0
