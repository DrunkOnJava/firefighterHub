/**
 * Sidebar Table Auto-Fit Utilities
 * 
 * Handles dynamic resizing of table content within sidebar to prevent
 * scrollbars and truncation. Uses font-size adjustment and flexible
 * container layout to ensure tables fit within available space.
 */

interface AutoFitOptions {
  minFontSize?: number;
  maxFontSize?: number;
  targetSelector?: string;
  containerSelector?: string;
  padding?: number;
}

const DEFAULT_OPTIONS: Required<AutoFitOptions> = {
  minFontSize: 10,
  maxFontSize: 14,
  targetSelector: 'td, th',
  containerSelector: '.table-container',
  padding: 16,
};

/**
 * Adjusts font size of table content to fit within container without overflow
 * 
 * @param tableContainer - The container element wrapping the table
 * @param options - Configuration options for auto-fitting
 * @returns The final font size applied
 */
export function autoFitTableContent(
  tableContainer: HTMLElement,
  options: AutoFitOptions = {}
): number {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  const table = tableContainer.querySelector('table');
  if (!table) {
    console.warn('No table found in container');
    return opts.maxFontSize;
  }

  // Get all target elements (td and th by default)
  const targets = table.querySelectorAll<HTMLElement>(opts.targetSelector);
  if (targets.length === 0) {
    console.warn('No target elements found in table');
    return opts.maxFontSize;
  }

  // Start with max font size
  let currentFontSize = opts.maxFontSize;
  
  // Apply initial font size
  targets.forEach(el => {
    el.style.fontSize = `${currentFontSize}px`;
  });

  // Get container dimensions
  const containerHeight = tableContainer.clientHeight;
  const containerWidth = tableContainer.clientWidth;

  // Binary search for optimal font size
  let low = opts.minFontSize;
  let high = opts.maxFontSize;
  let bestFitSize = opts.maxFontSize;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    
    // Apply test font size
    targets.forEach(el => {
      el.style.fontSize = `${mid}px`;
    });

    // Force reflow
    void table.offsetHeight;

    // Check if content fits
    const tableHeight = table.scrollHeight;
    const tableWidth = table.scrollWidth;
    
    const fitsHeight = tableHeight <= (containerHeight - opts.padding);
    const fitsWidth = tableWidth <= (containerWidth - opts.padding);

    if (fitsHeight && fitsWidth) {
      // Content fits, try larger size
      bestFitSize = mid;
      low = mid + 1;
    } else {
      // Content doesn't fit, try smaller size
      high = mid - 1;
    }
  }

  // Apply best fit size
  currentFontSize = bestFitSize;
  targets.forEach(el => {
    el.style.fontSize = `${currentFontSize}px`;
  });

  return currentFontSize;
}

/**
 * Creates a table container with proper flex layout for auto-fitting
 * 
 * @param parentElement - The parent element to insert the container into
 * @param tableHTML - HTML string for the table content
 * @returns The created container element
 */
export function createTableContainer(
  parentElement: HTMLElement,
  tableHTML: string
): HTMLElement {
  const container = document.createElement('div');
  container.className = 'table-container flex-1 overflow-hidden';
  container.innerHTML = tableHTML;
  
  parentElement.appendChild(container);
  
  return container;
}

/**
 * Sets up auto-fit behavior with ResizeObserver for dynamic adjustments
 * 
 * @param tableContainer - The container element wrapping the table
 * @param options - Configuration options for auto-fitting
 * @returns Cleanup function to disconnect observer
 */
export function setupAutoFitObserver(
  tableContainer: HTMLElement,
  options: AutoFitOptions = {}
): () => void {
  let timeoutId: number;
  
  const observer = new ResizeObserver(() => {
    // Debounce resize events
    clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      autoFitTableContent(tableContainer, options);
    }, 150);
  });

  observer.observe(tableContainer);

  // Initial fit
  autoFitTableContent(tableContainer, options);

  // Return cleanup function
  return () => {
    clearTimeout(timeoutId);
    observer.disconnect();
  };
}

/**
 * Alternative approach using CSS transform: scale()
 * Better for maintaining visual fidelity but can blur text
 * 
 * @param tableContainer - The container element wrapping the table
 * @param options - Configuration options
 */
export function scaleTableToFit(
  tableContainer: HTMLElement,
  options: { padding?: number } = {}
): void {
  const padding = options.padding ?? DEFAULT_OPTIONS.padding;
  const table = tableContainer.querySelector<HTMLElement>('table');
  
  if (!table) {
    console.warn('No table found in container');
    return;
  }

  // Reset any existing transform
  table.style.transform = 'none';
  table.style.transformOrigin = 'top left';

  // Force reflow
  void table.offsetHeight;

  // Get dimensions
  const containerWidth = tableContainer.clientWidth - padding;
  const containerHeight = tableContainer.clientHeight - padding;
  const tableWidth = table.scrollWidth;
  const tableHeight = table.scrollHeight;

  // Calculate scale factors
  const scaleX = containerWidth / tableWidth;
  const scaleY = containerHeight / tableHeight;
  
  // Use the smaller scale to ensure both dimensions fit
  const scale = Math.min(scaleX, scaleY, 1); // Don't scale up

  if (scale < 1) {
    table.style.transform = `scale(${scale})`;
    table.style.transformOrigin = 'top left';
  }
}

/**
 * Utility to apply ellipsis to table cells for overflow text
 * Good for preventing horizontal overflow
 * 
 * @param table - The table element
 * @param maxWidth - Maximum width for cells (optional)
 */
export function applyTableCellEllipsis(
  table: HTMLElement,
  maxWidth?: string
): void {
  const cells = table.querySelectorAll<HTMLElement>('td, th');
  
  cells.forEach(cell => {
    cell.style.whiteSpace = 'nowrap';
    cell.style.overflow = 'hidden';
    cell.style.textOverflow = 'ellipsis';
    
    if (maxWidth) {
      cell.style.maxWidth = maxWidth;
    }
  });
}

/**
 * Complete setup for a table that needs to auto-fit in sidebar
 * Combines container creation, initial fit, and observer setup
 * 
 * @param parentElement - Parent element for the table
 * @param tableHTML - HTML for the table
 * @param options - Auto-fit options
 * @returns Object with container element and cleanup function
 */
export function setupSidebarTable(
  parentElement: HTMLElement,
  tableHTML: string,
  options: AutoFitOptions = {}
): { container: HTMLElement; cleanup: () => void } {
  // Ensure parent is a flex container
  if (!parentElement.classList.contains('flex')) {
    parentElement.classList.add('flex', 'flex-col');
  }

  // Create container
  const container = createTableContainer(parentElement, tableHTML);
  
  // Setup auto-fit with observer
  const cleanup = setupAutoFitObserver(container, options);

  return { container, cleanup };
}
