#!/bin/bash
# VS Code Extension Cleanup Script
# Run this script to clean up problematic extensions

set -e

echo "🔍 Checking for problematic VS Code extensions..."

# Check for OpenAI extension that might conflict with Copilot
if code --list-extensions | grep -q "andrewbutson.vscode-openai"; then
    echo "⚠️  Found OpenAI extension (andrewbutson.vscode-openai)"
    read -p "   Uninstall? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "   Uninstalling..."
        code --uninstall-extension andrewbutson.vscode-openai
        echo "   ✅ Uninstalled"
    fi
fi

# Check for broken SonarLint analyzers
if [ -d ~/.vscode/extensions/sonarsource.sonarlint_ondemand-analyzers* ]; then
    echo "⚠️  Found broken SonarLint analyzer directories"
    read -p "   Remove? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "   Removing..."
        rm -rf ~/.vscode/extensions/sonarsource.sonarlint_ondemand-analyzers*
        echo "   ✅ Removed"
    fi
fi

# Check Settings Sync status
echo ""
echo "📊 Extension Report:"
echo "   Total extensions: $(code --list-extensions | wc -l)"
echo ""
echo "💡 To check for performance issues:"
echo "   1. Open Command Palette (⇧⌘P)"
echo "   2. Run 'Developer: Show Running Extensions'"
echo "   3. Look for high activation times"
echo ""
echo "✅ Cleanup check complete!"
