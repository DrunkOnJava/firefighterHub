#!/bin/bash

# Script to remove isDarkMode props from component usages
# This removes isDarkMode from JSX prop spreads while preserving other props

echo "🔧 Removing isDarkMode props from component usages..."

# Files to process (based on typecheck errors)
files=(
  "src/components/__tests__/ShiftSelector.test.tsx"
  "src/components/calendar/CalendarHeader.tsx"
  "src/components/calendar/HoldList.tsx"
  "src/components/FirefighterItem.tsx"
  "src/components/FirefighterList.tsx"
  "src/components/Header.tsx"
  "src/components/MobileNav.tsx"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "Processing: $file"
    
    # Remove isDarkMode={isDarkMode} (with or without spaces)
    sed -i '' 's/ isDarkMode={isDarkMode}//g' "$file"
    
    # Remove isDarkMode={true} or isDarkMode={false}
    sed -i '' 's/ isDarkMode={true}//g' "$file"
    sed -i '' 's/ isDarkMode={false}//g' "$file"
    
    # Remove standalone isDarkMode prop
    sed -i '' 's/ isDarkMode//g' "$file"
    
    echo "✓ $file"
  else
    echo "⚠️  File not found: $file"
  fi
done

echo ""
echo "✅ isDarkMode props removed from ${#files[@]} files"
echo ""
echo "Running typecheck to verify..."
pnpm typecheck
