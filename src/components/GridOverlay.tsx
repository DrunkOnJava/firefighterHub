/**
 * Grid Overlay Component (Development Tool)
 * 
 * Visual debugging tool that overlays the baseline grid and column grid
 * on the interface. Helps developers align elements to the grid system.
 * 
 * Usage:
 * - Press Ctrl+G (Cmd+G on Mac) to toggle grid overlay
 * - Press Ctrl+Shift+G to toggle between grid types
 * 
 * Only rendered in development mode.
 */

import { useEffect, useState } from 'react';
import { baseline, columnGrid, calendarGrid } from '../styles/gridSystem';

type GridType = 'baseline' | 'columns' | 'calendar' | 'all' | 'none';

export function GridOverlay() {
  const [gridType, setGridType] = useState<GridType>('none');
  const [opacity, setOpacity] = useState(0.2);

  // Only show in development
  if (import.meta.env.PROD) {
    return null;
  }

  useEffect(() => {
    function handleKeyPress(e: KeyboardEvent) {
      // Ctrl+G (Cmd+G on Mac): Toggle grid on/off
      if ((e.ctrlKey || e.metaKey) && e.key === 'g' && !e.shiftKey) {
        e.preventDefault();
        setGridType(prev => prev === 'none' ? 'all' : 'none');
      }

      // Ctrl+Shift+G: Cycle through grid types
      if ((e.ctrlKey || e.metaKey) && e.key === 'G' && e.shiftKey) {
        e.preventDefault();
        setGridType(prev => {
          const types: GridType[] = ['none', 'baseline', 'columns', 'calendar', 'all'];
          const currentIndex = types.indexOf(prev);
          return types[(currentIndex + 1) % types.length];
        });
      }

      // Ctrl+Shift+Up/Down: Adjust opacity
      if ((e.ctrlKey || e.metaKey) && e.shiftKey) {
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          setOpacity(prev => Math.min(1, prev + 0.1));
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          setOpacity(prev => Math.max(0, prev - 0.1));
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  if (gridType === 'none') {
    return null;
  }

  const showBaseline = gridType === 'baseline' || gridType === 'all';
  const showColumns = gridType === 'columns' || gridType === 'all';
  const showCalendar = gridType === 'calendar' || gridType === 'all';

  return (
    <>
      {/* Baseline Grid Overlay */}
      {showBaseline && (
        <div
          className="fixed inset-0 pointer-events-none z-[9999]"
          style={{
            backgroundImage: `repeating-linear-gradient(
              to bottom,
              rgba(255, 0, 0, ${opacity}) 0,
              rgba(255, 0, 0, ${opacity}) 1px,
              transparent 1px,
              transparent ${baseline.unit}px
            )`,
          }}
        />
      )}

      {/* Column Grid Overlay */}
      {showColumns && (
        <div
          className="fixed inset-0 pointer-events-none z-[9999] px-4"
          style={{
            display: 'grid',
            gridTemplateColumns: columnGrid.desktop.columns,
            gap: `${columnGrid.desktop.gap}px`,
            paddingTop: '80px', // Account for header
          }}
        >
          {/* Calendar column */}
          <div style={{ 
            background: `rgba(0, 100, 255, ${opacity})`,
            border: '1px dashed rgba(0, 100, 255, 0.5)',
          }} />
          
          {/* Sidebar column */}
          <div style={{ 
            background: `rgba(0, 200, 100, ${opacity})`,
            border: '1px dashed rgba(0, 200, 100, 0.5)',
          }} />
        </div>
      )}

      {/* Calendar Grid Overlay */}
      {showCalendar && (
        <div
          className="fixed left-4 right-[500px] pointer-events-none z-[9999]"
          style={{
            top: '200px',
            bottom: '100px',
            display: 'grid',
            gridTemplateColumns: calendarGrid.desktop.columns,
            gridAutoRows: '1fr',
            gap: `${calendarGrid.desktop.gap}px`,
          }}
        >
          {Array.from({ length: 42 }).map((_, i) => (
            <div
              key={i}
              style={{
                background: `rgba(255, 100, 0, ${opacity})`,
                border: '1px dashed rgba(255, 100, 0, 0.5)',
              }}
            />
          ))}
        </div>
      )}

      {/* Legend */}
      <div className="fixed bottom-4 right-4 z-[10000] bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs text-slate-200 font-mono shadow-2xl">
        <div className="font-semibold mb-2 text-blue-400">Grid Overlay ({gridType})</div>
        <div className="space-y-1 text-[11px]">
          <div><kbd className="px-1.5 py-0.5 bg-slate-800 rounded">Ctrl+G</kbd> Toggle</div>
          <div><kbd className="px-1.5 py-0.5 bg-slate-800 rounded">Ctrl+Shift+G</kbd> Cycle</div>
          <div><kbd className="px-1.5 py-0.5 bg-slate-800 rounded">Ctrl+Shift+↑/↓</kbd> Opacity</div>
          <div className="pt-1 mt-2 border-t border-slate-700">
            Opacity: {Math.round(opacity * 100)}%
          </div>
        </div>
        {gridType === 'all' && (
          <div className="mt-2 pt-2 border-t border-slate-700 space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500/50 border border-red-500"></div>
              <span>Baseline (8px)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500/50 border border-blue-500"></div>
              <span>Calendar Column</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500/50 border border-green-500"></div>
              <span>Sidebar Column</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500/50 border border-orange-500"></div>
              <span>Calendar Grid</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
