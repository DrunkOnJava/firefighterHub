#!/bin/bash
# Systematic PR Processing Script
# Processes Copilot PRs in optimal order to minimize conflicts

set -euo pipefail

echo "🚀 Starting systematic PR processing..."
echo ""

# Merge order optimized for minimal conflicts
BATCH_1=(46 45 44)  # Foundations
BATCH_2=(43 47 50)  # Component improvements
BATCH_3=(48 49 51)  # Design system

# Function to update PR branch with latest main
update_pr() {
  local pr=$1
  echo "🔄 Updating PR #$pr with latest main..."
  gh api -X PUT repos/DrunkOnJava/firefighterHub/pulls/$pr/update-branch > /dev/null 2>&1 || echo "  ⚠️  Already up to date or conflict"
}

# Function to check if PR is mergeable
check_mergeable() {
  local pr=$1
  gh pr view $pr --json mergeable --jq '.mergeable'
}

# Function to check required CI status
check_ci() {
  local pr=$1
  local build=$(gh pr checks $pr 2>&1 | grep "^build" | grep "pass" | wc -l | tr -d ' ')
  local lint=$(gh pr checks $pr 2>&1 | grep "^lint" | grep "pass" | wc -l | tr -d ' ')
  local typecheck=$(gh pr checks $pr 2>&1 | grep "^typecheck" | grep "pass" | wc -l | tr -d ' ')

  if [ "$build" -ge 1 ] && [ "$lint" -ge 1 ] && [ "$typecheck" -ge 1 ]; then
    echo "pass"
  else
    echo "fail"
  fi
}

# Function to merge PR
merge_pr() {
  local pr=$1
  local title=$(gh pr view $pr --json title --jq '.title')

  echo "📦 Merging PR #$pr: $title"

  # Update branch first
  update_pr $pr
  sleep 5  # Wait for update to complete

  # Check if mergeable
  local mergeable=$(check_mergeable $pr)
  if [ "$mergeable" != "MERGEABLE" ]; then
    echo "  ❌ Cannot merge - status: $mergeable"
    echo "  ℹ️  May need manual conflict resolution"
    return 1
  fi

  # Check required CI
  local ci_status=$(check_ci $pr)
  if [ "$ci_status" != "pass" ]; then
    echo "  ❌ Required checks not passing"
    return 1
  fi

  # Merge
  if gh pr merge $pr --squash --delete-branch > /dev/null 2>&1; then
    echo "  ✅ Successfully merged and branch deleted"
    return 0
  else
    echo "  ❌ Merge failed"
    return 1
  fi
}

# Function to close related issue
close_issue() {
  local issue=$1
  local pr=$2
  echo "🗂️  Closing issue #$issue (resolved by PR #$pr)"
  gh issue close $issue --comment "✅ Resolved via PR #$pr" > /dev/null 2>&1
}

# Process Batch 1: Foundations
echo "═══════════════════════════════════════════════════════"
echo "📚 BATCH 1: Foundation PRs (Most Critical)"
echo "═══════════════════════════════════════════════════════"
echo ""

for pr in "${BATCH_1[@]}"; do
  if merge_pr $pr; then
    # Close related issue
    case $pr in
      46) close_issue 21 $pr ;;  # Color-blind indicators
      45) close_issue 20 $pr ;;  # Spacing
      44) close_issue 19 $pr ;;  # Typography
    esac
  fi
  echo ""
  sleep 3
done

# Process Batch 2: Component Improvements
echo "═══════════════════════════════════════════════════════"
echo "🎨 BATCH 2: Component Improvements"
echo "═══════════════════════════════════════════════════════"
echo ""

for pr in "${BATCH_2[@]}"; do
  if merge_pr $pr; then
    case $pr in
      43) close_issue 18 $pr ;;  # Calendar cells
      47) close_issue 24 $pr ;;  # Icon sizes
      50) close_issue 25 $pr ;;  # Loading states
    esac
  fi
  echo ""
  sleep 3
done

# Process Batch 3: Design System
echo "═══════════════════════════════════════════════════════"
echo "✨ BATCH 3: Design System Polish"
echo "═══════════════════════════════════════════════════════"
echo ""

for pr in "${BATCH_3[@]}"; do
  if merge_pr $pr; then
    case $pr in
      48) close_issue 26 $pr ;;  # Shadow system
      49) close_issue 22 $pr ;;  # Modal overlays
      51) close_issue 23 $pr ;;  # Border radius
    esac
  fi
  echo ""
  sleep 3
done

echo ""
echo "═══════════════════════════════════════════════════════"
echo "📊 Processing Complete!"
echo "═══════════════════════════════════════════════════════"
echo ""

# Summary
echo "📈 Summary:"
gh pr list --state merged --limit 9 --json number,title,mergedAt --jq '.[] | "  ✅ #\(.number) - \(.title) (merged \(.mergedAt[:10]))"'
echo ""

echo "📋 Remaining open PRs:"
gh pr list --json number,title --jq '.[] | "  🔄 #\(.number) - \(.title)"'
echo ""

echo "🎯 Next steps:"
echo "  1. Assign remaining Phase 1 issues to Copilot"
echo "  2. Fix Frontend Quality Checks workflow"
echo "  3. Generate VRT baselines"
echo ""

echo "✅ All done!"
