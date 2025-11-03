#!/usr/bin/env python3
"""
Remove isDarkMode props from JSX components
Handles multi-line props correctly
"""

import re
import sys

def remove_isDarkMode_prop(content):
    """Remove isDarkMode prop from JSX, handling both single and multi-line cases"""
    
    # Pattern 1: Remove 'isDarkMode={value}' on its own line (with leading whitespace)
    content = re.sub(r'^\s*isDarkMode=\{[^}]+\}\s*\n', '', content, flags=re.MULTILINE)
    
    # Pattern 2: Remove 'isDarkMode={value}' inline (followed by space or closing tag)
    content = re.sub(r'\s+isDarkMode=\{[^}]+\}(?=\s|>|/)', '', content)
    
    # Pattern 3: Remove bare 'isDarkMode' prop
    content = re.sub(r'\s+isDarkMode(?=\s|>|/)', '', content)
    
    return content

def process_file(filepath):
    """Process a single file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        new_content = remove_isDarkMode_prop(content)
        
        if content != new_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"✓ {filepath}")
            return True
        else:
            print(f"- {filepath} (no changes)")
            return False
    except Exception as e:
        print(f"✗ {filepath}: {e}")
        return False

if __name__ == "__main__":
    files = [
        "src/components/__tests__/ShiftSelector.test.tsx",
        "src/components/calendar/CalendarHeader.tsx",
        "src/components/calendar/HoldList.tsx",
        "src/components/FirefighterItem.tsx",
        "src/components/FirefighterList.tsx",
        "src/components/Header.tsx",
        "src/components/MobileNav.tsx",
    ]
    
    print("🔧 Removing isDarkMode props from components...\n")
    
    changed = 0
    for filepath in files:
        if process_file(filepath):
            changed += 1
    
    print(f"\n✅ Updated {changed} file(s)")
