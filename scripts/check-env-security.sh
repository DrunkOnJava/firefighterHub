#!/bin/bash
# Environment Security Check Script
# Verifies .env files are properly configured and not tracked by git

set -e

echo "🔐 Environment Security Check"
echo "=============================="
echo ""

# Check gitignore
echo "✓ Checking .gitignore configuration..."
if grep -q "^\.env" .gitignore 2>/dev/null; then
    echo "  ✅ .gitignore properly excludes .env files"
else
    echo "  ⚠️  WARNING: .gitignore may not exclude .env files properly"
fi

# Check for tracked .env files
echo ""
echo "✓ Checking for tracked .env files in git..."
TRACKED_ENV=$(git ls-files | grep "^\.env" | grep -v "\.env\.example" || true)
if [ -z "$TRACKED_ENV" ]; then
    echo "  ✅ No sensitive .env files are tracked by git"
else
    echo "  ⚠️  WARNING: The following .env files are tracked by git:"
    echo "$TRACKED_ENV" | sed 's/^/     /'
    echo "  Run: git rm --cached <file> to untrack them"
fi

# Check for .env files in workspace
echo ""
echo "✓ Checking for .env files in workspace..."
if [ -f .env ]; then
    echo "  📄 .env exists (should NOT be committed)"
fi
if [ -f .env.local ]; then
    echo "  📄 .env.local exists (should NOT be committed)"
fi
if [ -f .env.production ]; then
    echo "  📄 .env.production exists (should NOT be committed)"
fi
if [ -f .env.example ]; then
    echo "  📄 .env.example exists (✅ safe to commit)"
fi

# Check .env.example has placeholders
echo ""
echo "✓ Verifying .env.example has no real secrets..."
if [ -f .env.example ]; then
    if grep -q "your-.*-here\|REPLACE\|PLACEHOLDER\|example\|xxx" .env.example; then
        echo "  ✅ .env.example contains placeholders (safe)"
    else
        echo "  ⚠️  .env.example may contain real values - please verify"
    fi
fi

echo ""
echo "=============================="
echo "Security check complete!"
echo ""
echo "📚 Best practices:"
echo "  • Keep real secrets in .env.local (not committed)"
echo "  • Use .env.example for documentation (committed)"
echo "  • Use Vercel dashboard for production secrets"
echo "  • Never commit .env, .env.local, or .env.production"
