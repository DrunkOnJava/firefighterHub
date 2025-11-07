#!/bin/bash
# Header Hierarchy Validation Script
# Usage: ./scripts/validate-headers.sh

set -e

echo "================================================"
echo "Header Hierarchy Validation - FirefighterHub"
echo "================================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# ================================================
# Check 1: Multiple H1 Tags
# ================================================
echo "1. Checking for multiple H1 tags..."
H1_COUNT=$(grep -r "<h1" src/components --include="*.tsx" --include="*.jsx" | wc -l | tr -d ' ')

if [ "$H1_COUNT" -eq 1 ]; then
  echo -e "${GREEN}✅ PASS: Found exactly 1 H1 tag${NC}"
elif [ "$H1_COUNT" -eq 0 ]; then
  echo -e "${RED}❌ FAIL: No H1 tag found${NC}"
  ERRORS=$((ERRORS + 1))
else
  echo -e "${RED}❌ FAIL: Found $H1_COUNT H1 tags (should be 1)${NC}"
  echo ""
  echo "Locations:"
  grep -rn "<h1" src/components --include="*.tsx" --include="*.jsx"
  echo ""
  ERRORS=$((ERRORS + 1))
fi
echo ""

# ================================================
# Check 2: Headers Used for Styling  
# ================================================
echo "2. Checking for headers used for styling..."

# More accurate detection: check if heading tokens are used on non-heading elements
STYLING_HEADERS=0
FOUND_FILES=""

while IFS=: read -r file line content; do
  # Get larger context (3 lines before to 1 line after)
  context=$(sed -n "$((line-3)),$((line+1))p" "$file" 2>/dev/null)
  
  # If context doesn't contain an actual heading tag, it's non-semantic
  if ! echo "$context" | grep -q "<h[1-6]"; then
    STYLING_HEADERS=$((STYLING_HEADERS + 1))
    if [ "$STYLING_HEADERS" -le 5 ]; then
      FOUND_FILES="${FOUND_FILES}  $file:$line\n"
    fi
  fi
done < <(grep -rn "tokens\.typography\.heading" src/components --include="*.tsx" 2>/dev/null)

if [ "$STYLING_HEADERS" -eq 0 ]; then
  echo -e "${GREEN}✅ PASS: All heading classes are on semantic heading elements${NC}"
else
  echo -e "${YELLOW}⚠️  WARNING: Found $STYLING_HEADERS potential instances of heading classes on non-heading elements${NC}"
  echo ""
  if [ -n "$FOUND_FILES" ]; then
    echo "Consider using visualHeadings instead (showing first 5):"
    echo -e "$FOUND_FILES"
  fi
  echo "Note: Some instances may be false positives if the heading tag is >3 lines above the className"
  WARNINGS=$((WARNINGS + 1))
fi
echo ""

# ================================================
# Check 3: Skipped Heading Levels
# ================================================
echo "3. Checking for skipped heading levels..."
echo "(Manual review recommended - automated detection is complex)"
echo ""
echo "Files with potential issues:"

# Find files with H2 and H4 but no H3
SKIP_FOUND=0
for file in $(find src/components -type f \( -name "*.tsx" -o -name "*.jsx" \)); do
  HAS_H2=$(grep -c "<h2" "$file" 2>/dev/null || echo "0")
  HAS_H3=$(grep -c "<h3" "$file" 2>/dev/null || echo "0")
  HAS_H4=$(grep -c "<h4" "$file" 2>/dev/null || echo "0")
  
  # Strip whitespace
  HAS_H2=$(echo "$HAS_H2" | tr -d ' ')
  HAS_H3=$(echo "$HAS_H3" | tr -d ' ')
  HAS_H4=$(echo "$HAS_H4" | tr -d ' ')
  
  if [ "$HAS_H2" -gt 0 ] 2>/dev/null && [ "$HAS_H4" -gt 0 ] 2>/dev/null && [ "$HAS_H3" -eq 0 ] 2>/dev/null; then
    echo -e "${YELLOW}⚠️  $file (H2→H4 skip detected)${NC}"
    SKIP_FOUND=$((SKIP_FOUND + 1))
  fi
done

if [ "$SKIP_FOUND" -gt 0 ]; then
  WARNINGS=$((WARNINGS + 1))
fi
echo ""

# ================================================
# Check 4: ARIA Landmark Coverage
# ================================================
echo "4. Checking ARIA landmark coverage..."
SECTIONS_WITH_ARIA=$(grep -r "aria-labelledby\|aria-label" src/components --include="*.tsx" | wc -l | tr -d ' ')
TOTAL_SECTIONS=$(grep -r "<section\|<aside\|<article" src/components --include="*.tsx" | wc -l | tr -d ' ')

if [ "$TOTAL_SECTIONS" -eq 0 ]; then
  echo -e "${YELLOW}⚠️  WARNING: No semantic sections found${NC}"
  WARNINGS=$((WARNINGS + 1))
else
  COVERAGE_PERCENT=$((SECTIONS_WITH_ARIA * 100 / TOTAL_SECTIONS))
  
  if [ "$COVERAGE_PERCENT" -ge 80 ]; then
    echo -e "${GREEN}✅ PASS: ${COVERAGE_PERCENT}% of sections have ARIA labels${NC}"
  else
    echo -e "${YELLOW}⚠️  WARNING: Only ${COVERAGE_PERCENT}% of sections have ARIA labels (target: 80%+)${NC}"
    WARNINGS=$((WARNINGS + 1))
  fi
fi
echo ""

# ================================================
# Check 5: Schema.org Markup
# ================================================
echo "5. Checking for schema.org structured data..."
if grep -q "application/ld+json" index.html; then
  echo -e "${GREEN}✅ PASS: Schema.org markup found in index.html${NC}"
else
  echo -e "${YELLOW}⚠️  WARNING: No schema.org markup found in index.html${NC}"
  echo "   Consider adding SoftwareApplication schema for SEO"
  WARNINGS=$((WARNINGS + 1))
fi
echo ""

# ================================================
# Check 6: Meta Description
# ================================================
echo "6. Checking meta description..."
META_DESC=$(grep -A 2 'name="description"' index.html | grep content | sed -n 's/.*content="\([^"]*\)".*/\1/p')
META_LENGTH=${#META_DESC}

if [ "$META_LENGTH" -ge 150 ] && [ "$META_LENGTH" -le 160 ]; then
  echo -e "${GREEN}✅ PASS: Meta description length optimal ($META_LENGTH chars)${NC}"
elif [ "$META_LENGTH" -lt 150 ]; then
  echo -e "${YELLOW}⚠️  WARNING: Meta description too short ($META_LENGTH chars, target: 150-160)${NC}"
  WARNINGS=$((WARNINGS + 1))
else
  echo -e "${YELLOW}⚠️  WARNING: Meta description too long ($META_LENGTH chars, target: 150-160)${NC}"
  WARNINGS=$((WARNINGS + 1))
fi
echo ""

# ================================================
# Check 7: Page Title SEO
# ================================================
echo "7. Checking page title..."
PAGE_TITLE=$(grep "<title>" index.html | sed 's/.*<title>//;s/<\/title>.*//')

# Check for target keywords
if echo "$PAGE_TITLE" | grep -qi "firefighter"; then
  echo -e "${GREEN}✅ PASS: Title contains 'firefighter' keyword${NC}"
else
  echo -e "${YELLOW}⚠️  WARNING: Title missing 'firefighter' keyword${NC}"
  WARNINGS=$((WARNINGS + 1))
fi

if echo "$PAGE_TITLE" | grep -qi "shift"; then
  echo -e "${GREEN}✅ PASS: Title contains 'shift' keyword${NC}"
else
  echo -e "${YELLOW}⚠️  WARNING: Title missing 'shift' keyword${NC}"
  WARNINGS=$((WARNINGS + 1))
fi
echo ""

# ================================================
# Summary
# ================================================
echo "================================================"
echo "Validation Summary"
echo "================================================"
echo -e "Errors:   ${RED}$ERRORS${NC}"
echo -e "Warnings: ${YELLOW}$WARNINGS${NC}"
echo ""

if [ "$ERRORS" -eq 0 ] && [ "$WARNINGS" -eq 0 ]; then
  echo -e "${GREEN}🎉 All checks passed!${NC}"
  exit 0
elif [ "$ERRORS" -eq 0 ]; then
  echo -e "${YELLOW}⚠️  Validation passed with warnings${NC}"
  echo "Review warnings above to improve SEO and accessibility"
  exit 0
else
  echo -e "${RED}❌ Validation failed with errors${NC}"
  echo "Fix errors above before committing"
  exit 1
fi
