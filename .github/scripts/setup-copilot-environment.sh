#!/bin/bash

# GitHub Copilot Environment Setup Script
# Configures the 'copilot' environment with required variables for UI/UX implementation agent

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Repository info
REPO_OWNER="DrunkOnJava"
REPO_NAME="firefighterHub"
REPO="$REPO_OWNER/$REPO_NAME"
ENV_NAME="copilot"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  GitHub Copilot Environment Setup${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo -e "${RED}❌ Error: GitHub CLI (gh) is not installed${NC}"
    echo -e "${YELLOW}Install it from: https://cli.github.com${NC}"
    exit 1
fi

# Check if logged in
if ! gh auth status &> /dev/null; then
    echo -e "${RED}❌ Error: Not logged in to GitHub CLI${NC}"
    echo -e "${YELLOW}Run: gh auth login${NC}"
    exit 1
fi

echo -e "${GREEN}✅ GitHub CLI authenticated${NC}"
echo ""

# Function to add environment variable
add_env_var() {
    local name=$1
    local value=$2
    local description=$3

    echo -e "${YELLOW}Adding variable: ${name}${NC}"

    # Use GitHub API to add environment variable
    gh api \
        --method POST \
        -H "Accept: application/vnd.github+json" \
        -H "X-GitHub-Api-Version: 2022-11-28" \
        "/repos/$REPO/environments/$ENV_NAME/variables" \
        -f "name=$name" \
        -f "value=$value" \
        2>/dev/null && echo -e "${GREEN}  ✅ Added: $name = $value${NC}" || echo -e "${YELLOW}  ⚠️  Variable may already exist${NC}"
}

echo -e "${BLUE}📝 Step 1: Checking copilot environment...${NC}"

# Check if environment exists, create if it doesn't
if gh api "/repos/$REPO/environments/$ENV_NAME" &> /dev/null; then
    echo -e "${GREEN}✅ Environment 'copilot' exists${NC}"
else
    echo -e "${YELLOW}⚠️  Environment 'copilot' does not exist${NC}"
    echo -e "${BLUE}Creating environment...${NC}"

    # Create environment
    gh api \
        --method PUT \
        -H "Accept: application/vnd.github+json" \
        -H "X-GitHub-Api-Version: 2022-11-28" \
        "/repos/$REPO/environments/$ENV_NAME" \
        -f "wait_timer=0" \
        -f "prevent_self_review=false" \
        && echo -e "${GREEN}✅ Environment 'copilot' created${NC}" \
        || { echo -e "${RED}❌ Failed to create environment${NC}"; exit 1; }
fi

echo ""
echo -e "${BLUE}📝 Step 2: Adding required environment variables...${NC}"
echo ""

# Add required variables
add_env_var "NODE_ENV" "development" "Ensures dev mode for testing"
add_env_var "VITE_DEV_MODE" "true" "Enable Vite dev optimizations"
add_env_var "FORCE_COLOR" "1" "Enable colored output in CI logs"
add_env_var "CI" "true" "Indicate CI environment"

echo ""
echo -e "${BLUE}📝 Step 3: Adding testing & validation variables...${NC}"
echo ""

add_env_var "PLAYWRIGHT_BROWSERS_PATH" "~/.cache/ms-playwright" "Cache Playwright browsers"
add_env_var "VITEST_REPORTER" "verbose" "Detailed test output"
add_env_var "ACCESSIBILITY_TEST_MODE" "strict" "Enable strict a11y testing"
add_env_var "WCAG_LEVEL" "AA" "Target WCAG compliance level"

echo ""
echo -e "${BLUE}📝 Step 4: Adding build & performance variables...${NC}"
echo ""

add_env_var "VITE_BUILD_ANALYZE" "true" "Enable bundle analysis"
add_env_var "VITE_SOURCEMAP" "true" "Generate sourcemaps for debugging"
add_env_var "TAILWIND_MODE" "jit" "Use JIT compilation"
add_env_var "NODE_OPTIONS" "--max-old-space-size=4096" "Increase Node.js memory"

echo ""
echo -e "${BLUE}📝 Step 5: Adding design tool integration variables...${NC}"
echo ""

add_env_var "DESIGN_SYSTEM_VERSION" "1.0.0" "Track design system version"
add_env_var "COLOR_CONTRAST_CHECK" "enabled" "Auto-check WCAG contrast"
add_env_var "RESPONSIVE_BREAKPOINTS" "375,768,1024,1920" "Test breakpoints"
add_env_var "TOUCH_TARGET_MIN" "44" "Minimum touch target size (px)"

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  ✅ Environment Setup Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

echo -e "${BLUE}📊 Summary:${NC}"
echo -e "  Environment: ${GREEN}copilot${NC}"
echo -e "  Variables Added: ${GREEN}16${NC}"
echo -e "  Secrets Added: ${YELLOW}0 (manual step)${NC}"
echo ""

echo -e "${YELLOW}📝 Next Steps:${NC}"
echo ""
echo -e "1. ${BLUE}Add Optional Secrets${NC} (if using these services):"
echo -e "   Go to: https://github.com/$REPO/settings/environments/$ENV_NAME"
echo -e "   Click 'Add environment secret' for:"
echo -e "   - FIGMA_API_TOKEN (if using Figma)"
echo -e "   - VERCEL_TOKEN (if deploying preview builds)"
echo -e "   - CHROMATIC_PROJECT_TOKEN (if using visual testing)"
echo ""
echo -e "2. ${BLUE}Configure Firewall${NC}:"
echo -e "   Go to: https://github.com/$REPO/settings/copilot/coding-agent"
echo -e "   - Keep 'Recommended allowlist' ${GREEN}ENABLED${NC}"
echo -e "   - Add custom domains if needed"
echo ""
echo -e "3. ${BLUE}Test the Environment${NC}:"
echo -e "   gh workflow run 'Copilot Setup Steps' --ref main"
echo -e "   gh run watch"
echo ""
echo -e "4. ${BLUE}Use the Custom Agent${NC}:"
echo -e "   - Assign Issue #14 to @copilot"
echo -e "   - Select 'ui-ux-implementation-specialist' agent"
echo -e "   - Watch it work!"
echo ""
echo -e "${GREEN}🚀 Ready to accelerate UI/UX implementation!${NC}"
