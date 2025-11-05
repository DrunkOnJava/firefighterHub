#!/bin/bash
# Apply repository rulesets via GitHub API
# This script creates/updates GitHub rulesets from JSON configuration files

set -euo pipefail

OWNER="DrunkOnJava"
REPO="firefighterHub"

echo "🔍 Applying GitHub rulesets to ${OWNER}/${REPO}..."

# First, check if rulesets already exist and get their IDs
echo "📋 Checking existing rulesets..."
EXISTING_RULESETS=$(gh api "/repos/${OWNER}/${REPO}/rulesets" --jq '.[] | {id: .id, name: .name}' 2>/dev/null || echo "[]")

# Function to apply or update a ruleset
apply_ruleset() {
  local ruleset_file=$1
  local ruleset_name=$(jq -r '.name' "$ruleset_file")

  echo "🔧 Processing: $ruleset_name"

  # Check if ruleset with this name already exists
  local existing_id=$(echo "$EXISTING_RULESETS" | jq -r "select(.name == \"$ruleset_name\") | .id" 2>/dev/null || echo "")

  if [ -n "$existing_id" ] && [ "$existing_id" != "null" ]; then
    echo "  ↻ Updating existing ruleset (ID: $existing_id)"
    gh api --method PUT \
      "/repos/${OWNER}/${REPO}/rulesets/${existing_id}" \
      --input "$ruleset_file" \
      --silent
    echo "  ✅ Updated: $ruleset_name"
  else
    echo "  ➕ Creating new ruleset"
    gh api --method POST \
      "/repos/${OWNER}/${REPO}/rulesets" \
      --input "$ruleset_file" \
      --silent
    echo "  ✅ Created: $ruleset_name"
  fi
}

# Apply each ruleset
apply_ruleset ".github/rulesets/main-branch-protection.json"
apply_ruleset ".github/rulesets/feature-branch-standards.json"
apply_ruleset ".github/rulesets/all-branches-quality.json"

echo ""
echo "🎉 All rulesets applied successfully!"
echo ""
echo "📊 Current active rulesets:"
gh api "/repos/${OWNER}/${REPO}/rulesets" --jq '.[] | "  • \(.name) (ID: \(.id), enforcement: \(.enforcement))"'

echo ""
echo "✅ Ruleset enforcement is now ACTIVE"
echo "🔒 Direct pushes to main should be rejected"
echo "🧪 PRs will require: build, typecheck, lint, test checks to pass"
