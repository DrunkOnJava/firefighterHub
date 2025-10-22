# Keyboard Navigation Guide

## Global Shortcuts

### Skip Navigation
- **Tab** (from page load) → Focus skip link
- **Enter** (on skip link) → Jump to main content

### Modal Controls
- **Escape** → Close any open modal/dialog

## Focus Management

### Tab Navigation
- **Tab** → Move to next focusable element
- **Shift + Tab** → Move to previous focusable element
- **Enter/Space** → Activate buttons and links

### Modal Dialogs

When a modal opens:
1. Focus automatically moves to first interactive element
2. Tab cycles through elements within the modal only
3. Cannot tab outside the modal (focus trap)
4. Press Escape to close and return focus

#### Help Modal
- Opens with focus on close button or first element
- Navigate with Tab/Shift+Tab
- Close with Escape or Close button

#### Activity Log Modal
- Same behavior as Help Modal
- Scrollable content maintains focus

#### Calendar Date Selection
- Opens when clicking a calendar date
- Focus trapped within dialog
- Navigate firefighter list with Tab
- Select with Enter/Space
- Close with Escape or Cancel button

## Screen Reader Announcements

The application announces:
- **View changes**: "Switched to calendar view" / "Switched to list view"
- **Mode changes**: "Edit mode enabled" / "View mode enabled"
- **Actions**: Toast notifications for all important actions

## Accessibility Features

### Visual Focus Indicators
- All interactive elements show blue ring on focus
- Ring offset ensures visibility on all backgrounds
- High contrast for visibility

### Logical Tab Order
1. Skip link (when focused)
2. Header controls
3. Main content area
4. Sidebar (if present)
5. Modal dialogs (when open)

### Touch Targets
- All buttons minimum 44x44 pixels
- Adequate spacing between elements
- Works well with screen magnifiers

## Tips for Keyboard Users

1. **Use skip link**: Press Tab once on page load to skip navigation
2. **Close modals quickly**: Press Escape instead of tabbing to close button
3. **Navigate efficiently**: Tab order follows visual layout
4. **Check focus**: Blue ring always shows where you are

## Testing Your Experience

To test keyboard navigation:
1. Put your mouse away
2. Refresh the page
3. Use only Tab, Shift+Tab, Enter, Space, and Arrow keys
4. All functionality should be accessible

## Support

For accessibility issues or suggestions:
- All interactive elements should be keyboard accessible
- Focus should always be visible
- No unexpected focus changes should occur
