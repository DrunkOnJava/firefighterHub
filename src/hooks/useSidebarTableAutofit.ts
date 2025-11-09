/**
 * React Hook for Sidebar Table Auto-Fit
 * 
 * Provides a declarative way to handle auto-fitting tables within sidebar
 * or other constrained containers. Automatically handles cleanup and
 * re-fitting on dependency changes.
 */

import { useEffect, useRef } from 'react';
import { autoFitTableContent, setupAutoFitObserver } from '../utils/sidebarTableAutofit';

interface UseTableAutofitOptions {
  /** Minimum font size in pixels */
  minFontSize?: number;
  /** Maximum font size in pixels */
  maxFontSize?: number;
  /** CSS selector for elements to resize */
  targetSelector?: string;
  /** Padding to account for in calculations */
  padding?: number;
  /** Whether to use ResizeObserver for dynamic resizing */
  observeResize?: boolean;
  /** Debounce delay for resize events in ms */
  debounceMs?: number;
}

/**
 * Hook to auto-fit table content within a container
 * 
 * @example
 * ```tsx
 * function MyTableComponent() {
 *   const containerRef = useTableAutofit({
 *     minFontSize: 10,
 *     maxFontSize: 14,
 *     observeResize: true
 *   });
 * 
 *   return (
 *     <div ref={containerRef} className="table-container flex-1 overflow-hidden">
 *       <table>
 *         <thead>
 *           <tr><th>Name</th><th>Station</th></tr>
 *         </thead>
 *         <tbody>
 *           <tr><td>John Doe</td><td>Station 1</td></tr>
 *         </tbody>
 *       </table>
 *     </div>
 *   );
 * }
 * ```
 */
export function useTableAutofit(options: UseTableAutofitOptions = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  const {
    observeResize = true,
    minFontSize = 10,
    maxFontSize = 14,
    targetSelector = 'td, th',
    padding = 16,
  } = options;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (observeResize) {
      // Setup observer for dynamic resizing
      cleanupRef.current = setupAutoFitObserver(container, {
        minFontSize,
        maxFontSize,
        targetSelector,
        padding,
      });
    } else {
      // One-time fit
      autoFitTableContent(container, {
        minFontSize,
        maxFontSize,
        targetSelector,
        padding,
      });
    }

    // Cleanup function
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
  }, [observeResize, minFontSize, maxFontSize, targetSelector, padding]);

  return containerRef;
}

/**
 * Hook for manual control over table fitting
 * Returns a ref and a manual fit function
 * 
 * @example
 * ```tsx
 * function MyTableComponent() {
 *   const { containerRef, fitTable } = useTableAutofitManual();
 * 
 *   const handleDataChange = () => {
 *     // Manually trigger fit after data changes
 *     fitTable();
 *   };
 * 
 *   return (
 *     <div ref={containerRef} className="table-container">
 *       <table>...</table>
 *     </div>
 *   );
 * }
 * ```
 */
export function useTableAutofitManual(options: UseTableAutofitOptions = {}) {
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    minFontSize = 10,
    maxFontSize = 14,
    targetSelector = 'td, th',
    padding = 16,
  } = options;

  const fitTable = () => {
    if (!containerRef.current) return;
    
    autoFitTableContent(containerRef.current, {
      minFontSize,
      maxFontSize,
      targetSelector,
      padding,
    });
  };

  return { containerRef, fitTable };
}
