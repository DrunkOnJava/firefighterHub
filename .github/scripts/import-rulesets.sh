#!/bin/bash

# Import Repository Rulesets via GitHub API
# Imports 3 rulesets: Main branch protection, Feature branch standards, Sensitive files protection

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

REPO_OWNER="DrunkOnJava"
REPO_NAME="firefighterHub"
REPO="$REPO_OWNER/$REPO_NAME"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Repository Rulesets Import${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check gh CLI
if ! command -v gh &> /dev/null; then
    echo -e "${RED}❌ Error: GitHub CLI (gh) not installed${NC}"
    exit 1
fi

# Check authentication
if ! gh auth status &> /dev/null; then
    echo -e "${RED}❌ Error: Not logged in to GitHub CLI${NC}"
    echo -e "${YELLOW}Run: gh auth login${NC}"
    exit 1
fi

echo -e "${GREEN}✅ GitHub CLI authenticated${NC}"
echo ""

# Function to import ruleset
import_ruleset() {
    local file=$1
    local name=$2

    echo -e "${YELLOW}Importing: ${name}${NC}"

    # Use GitHub CLI to create ruleset
    RESULT=$(gh api \
        --method POST \
        -H "Accept: application/vnd.github+json" \
        -H "X-GitHub-Api-Version: 2022-11-28" \
        "/repos/$REPO/rulesets" \
        --input "$file" 2>&1)

    if echo "$RESULT" | grep -q "id"; then
        RULESET_ID=$(echo "$RESULT" | jq -r '.id')
        echo -e "${GREEN}  ✅ Imported: ${name} (ID: ${RULESET_ID})${NC}"
        return 0
    elif echo "$RESULT" | grep -qi "already exists"; then
        echo -e "${YELLOW}  ⚠️  Ruleset already exists: ${name}${NC}"
        return 1
    else
        echo -e "${RED}  ❌ Failed to import: ${name}${NC}"
        echo -e "${RED}     Error: ${RESULT}${NC}"
        return 1
    fi
}

echo -e "${BLUE}📝 Importing rulesets...${NC}"
echo ""

# Import each ruleset
import_ruleset ".github/rulesets/main-branch-protection.json" "Main Branch Protection"
import_ruleset ".github/rulesets/feature-branch-standards.json" "Feature Branch Standards"
import_ruleset ".github/rulesets/sensitive-files-protection.json" "Sensitive Files Protection"

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Ruleset Import Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# List all rulesets
echo -e "${BLUE}📊 Active Rulesets:${NC}"
gh api "/repos/$REPO/rulesets" --jq '.[] | "  - \(.name) (\(.enforcement))"'

echo ""
echo -e "${BLUE}🔗 View rulesets at:${NC}"
echo -e "   https://github.com/$REPO/settings/rules"
echo ""
echo -e "${BLUE}🔍 View rule insights at:${NC}"
echo -e "   https://github.com/$REPO/settings/rules/insights"
echo ""
echo -e "${GREEN}🎉 Repository protection configured!${NC}"
