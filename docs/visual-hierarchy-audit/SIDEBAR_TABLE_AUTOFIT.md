# Sidebar Table Auto-Fit System

**Created**: January 9, 2025  
**Purpose**: Handle dynamic table resizing in sidebar without scrollbars or truncation

---

## Overview

The table auto-fit system provides utilities and React hooks to automatically resize table content to fit within constrained containers (like sidebars) without requiring scrollbars or truncating content.

### Key Features

- ✅ **Binary search algorithm** for optimal font-size calculation
- ✅ **ResizeObserver integration** for dynamic responsiveness
- ✅ **React hooks** for declarative usage
- ✅ **Multiple strategies**: font-size adjustment, CSS scale, ellipsis
- ✅ **TypeScript support** with full type safety
- ✅ **Debounced resizing** to prevent performance issues

---

## Architecture

### Core Utilities (`src/utils/sidebarTableAutofit.ts`)

1. **`autoFitTableContent()`**
   - Uses binary search to find optimal font size
   - Targets `td` and `th` elements by default
   - Respects min/max font size constraints
   - Returns the final applied font size

2. **`setupAutoFitObserver()`**
   - Attaches ResizeObserver to container
   - Debounces resize events (150ms default)
   - Returns cleanup function for unmounting
   - Handles initial fit on setup

3. **`scaleTableToFit()`**
   - Alternative approach using `transform: scale()`
   - Better for maintaining visual fidelity
   - Can blur text at small scales
   - Useful for print or screenshot scenarios

4. **`applyTableCellEllipsis()`**
   - Applies text-overflow: ellipsis to cells
   - Prevents horizontal overflow
   - Good for preventing wrapping

5. **`setupSidebarTable()`**
   - Complete setup in one function
   - Creates container, applies fit, sets up observer
   - Returns container element and cleanup function

### React Hooks (`src/hooks/useSidebarTableAutofit.ts`)

1. **`useTableAutofit(options)`**
   - Primary hook for auto-fitting tables
   - Returns ref to attach to container
   - Handles cleanup automatically
   - Supports custom options

2. **`useTableAutofitManual(options)`**
   - For manual control over fitting
   - Returns ref and `fitTable()` function
   - Useful for triggering fit after data changes
   - No automatic ResizeObserver

---

## Usage Examples

### Basic Usage with React Hook

```tsx
import { useTableAutofit } from '@/hooks/useSidebarTableAutofit';

function MyTable({ data }) {
  const containerRef = useTableAutofit({
    minFontSize: 10,
    maxFontSize: 14,
    observeResize: true,
  });

  return (
    <div 
      ref={containerRef} 
      className="table-container flex-1 overflow-hidden p-4"
      style={{ maxHeight: '400px' }}
    >
      <table className="w-full">
        <thead>
          <tr>
            <th>Name</th>
            <th>Station</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.station}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### Manual Control

```tsx
import { useTableAutofitManual } from '@/hooks/useSidebarTableAutofit';

function MyTable({ data }) {
  const { containerRef, fitTable } = useTableAutofitManual();

  const handleDataChange = () => {
    // Manually trigger fit after data updates
    fitTable();
  };

  return (
    <div>
      <button onClick={handleDataChange}>Refresh Data</button>
      <div ref={containerRef} className="table-container overflow-hidden">
        <table>{/* ... */}</table>
      </div>
    </div>
  );
}
```

### Using Core Utilities Directly

```tsx
import { setupSidebarTable } from '@/utils/sidebarTableAutofit';

// In component or effect
const parentElement = document.querySelector('.sidebar-content');
const tableHTML = `
  <table>
    <thead><tr><th>Name</th></tr></thead>
    <tbody><tr><td>John Doe</td></tr></tbody>
  </table>
`;

const { container, cleanup } = setupSidebarTable(parentElement, tableHTML, {
  minFontSize: 10,
  maxFontSize: 14,
  padding: 16,
});

// Later, on unmount
cleanup();
```

---

## Configuration Options

### AutoFitOptions Interface

```typescript
interface AutoFitOptions {
  /** Minimum font size in pixels (default: 10) */
  minFontSize?: number;
  
  /** Maximum font size in pixels (default: 14) */
  maxFontSize?: number;
  
  /** CSS selector for elements to resize (default: 'td, th') */
  targetSelector?: string;
  
  /** CSS selector for container (default: '.table-container') */
  containerSelector?: string;
  
  /** Padding to account for in calculations (default: 16) */
  padding?: number;
}
```

### Hook Options

```typescript
interface UseTableAutofitOptions extends AutoFitOptions {
  /** Whether to use ResizeObserver (default: true) */
  observeResize?: boolean;
  
  /** Debounce delay for resize events in ms (default: 150) */
  debounceMs?: number;
}
```

---

## HTML Structure Requirements

### Recommended Structure

```html
<aside class="w-full flex flex-col">
  <!-- Sidebar Header -->
  <div class="border-b-2 p-4">
    <h2>Header</h2>
  </div>
  
  <!-- Flexible Content Area -->
  <div class="px-6 pb-6 flex-1 flex flex-col">
    <!-- Other content -->
    
    <!-- Table Container with Auto-Fit -->
    <div class="table-container flex-1 overflow-hidden">
      <table>
        <!-- Table content -->
      </table>
    </div>
  </div>
</aside>
```

### Key CSS Classes

- **Container**: `flex-1 overflow-hidden`
  - `flex-1`: Takes available space
  - `overflow-hidden`: Clips content, no scrollbars

- **Parent**: `flex flex-col`
  - Must be flex container
  - Column direction for vertical stacking

---

## Algorithm Details

### Binary Search for Font Size

The `autoFitTableContent()` function uses binary search to find the optimal font size:

1. **Initialize**: Set search range from `minFontSize` to `maxFontSize`
2. **Test midpoint**: Apply midpoint font size to all target elements
3. **Measure**: Check if content fits within container dimensions
4. **Adjust range**: 
   - If fits: Try larger size (low = mid + 1)
   - If doesn't fit: Try smaller size (high = mid - 1)
5. **Converge**: Repeat until optimal size found
6. **Apply**: Set final font size to all target elements

**Time Complexity**: O(log n) where n = font size range  
**Space Complexity**: O(1)

### Why Binary Search?

- **Efficiency**: Much faster than linear search
- **Precision**: Finds exact optimal size within 1px
- **Performance**: Only ~4-5 iterations for typical 10-14px range

---

## Performance Considerations

### Debouncing

ResizeObserver events are debounced by 150ms to prevent excessive recalculations:

```typescript
const observer = new ResizeObserver(() => {
  clearTimeout(timeoutId);
  timeoutId = window.setTimeout(() => {
    autoFitTableContent(tableContainer, options);
  }, 150);
});
```

### Optimization Tips

1. **Set explicit max-height**: Prevents excessive calculations
2. **Limit table rows**: More rows = slower calculations
3. **Use stable data**: Avoid re-rendering table content unnecessarily
4. **Memoize table content**: Use `React.memo()` for table components

---

## Alternative Strategies

### 1. CSS Transform Scale

**Pros**: Maintains visual fidelity, smoother scaling  
**Cons**: Can blur text, affects click targets

```typescript
scaleTableToFit(containerElement, { padding: 16 });
```

### 2. Text Ellipsis

**Pros**: No font-size changes, consistent appearance  
**Cons**: Truncates text, loses information

```typescript
applyTableCellEllipsis(tableElement, '200px');
```

### 3. Hybrid Approach

Combine strategies for best results:

```typescript
// 1. Apply font-size adjustment
autoFitTableContent(container);

// 2. If still doesn't fit, apply ellipsis
if (table.scrollHeight > container.clientHeight) {
  applyTableCellEllipsis(table);
}
```

---

## Troubleshooting

### Table Doesn't Resize

**Check**:
1. Container has `flex-1` or explicit height
2. Container has `overflow: hidden`
3. Parent is `display: flex`
4. Table is direct child of container with ref

### Font Size Too Small/Large

**Solution**: Adjust min/max font size options:

```typescript
useTableAutofit({
  minFontSize: 12, // Increase minimum
  maxFontSize: 16, // Increase maximum
});
```

### Performance Issues

**Solutions**:
1. Increase debounce delay: `debounceMs: 300`
2. Disable ResizeObserver: `observeResize: false`
3. Use manual control instead: `useTableAutofitManual()`

### Text Still Wrapping

**Solution**: Apply `white-space: nowrap` to cells:

```css
td, th {
  white-space: nowrap;
}
```

---

## Browser Compatibility

- ✅ **Chrome/Edge**: Full support (ResizeObserver native)
- ✅ **Firefox**: Full support (ResizeObserver native)
- ✅ **Safari**: Full support (ResizeObserver native since 13.1)
- ⚠️ **IE11**: Not supported (no ResizeObserver)

### Polyfill for Older Browsers

```bash
pnpm add resize-observer-polyfill
```

```typescript
import ResizeObserver from 'resize-observer-polyfill';
window.ResizeObserver = window.ResizeObserver || ResizeObserver;
```

---

## Testing

### Unit Tests

```typescript
import { autoFitTableContent } from '@/utils/sidebarTableAutofit';

describe('autoFitTableContent', () => {
  it('should reduce font size when content overflows', () => {
    const container = createTestContainer();
    const initialSize = autoFitTableContent(container, {
      minFontSize: 10,
      maxFontSize: 14,
    });
    
    expect(initialSize).toBeGreaterThanOrEqual(10);
    expect(initialSize).toBeLessThanOrEqual(14);
  });
});
```

### Integration Tests

Test with Playwright:

```typescript
test('table fits without scrollbars', async ({ page }) => {
  await page.goto('/sidebar-example');
  
  const container = page.locator('.table-container');
  const scrollHeight = await container.evaluate(el => el.scrollHeight);
  const clientHeight = await container.evaluate(el => el.clientHeight);
  
  expect(scrollHeight).toBeLessThanOrEqual(clientHeight);
});
```

---

## Future Enhancements

- [ ] Add animation/transition for font-size changes
- [ ] Support for column-specific sizing
- [ ] Virtual scrolling for very large tables
- [ ] Customizable scaling algorithms
- [ ] Performance metrics/logging
- [ ] CSS-only solution exploration

---

## Examples

See `src/components/examples/RotationScheduleTable.tsx` for complete working examples.

---

**Last Updated**: January 9, 2025  
**Maintainer**: FirefighterHub Development Team
