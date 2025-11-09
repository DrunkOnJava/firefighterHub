/**
 * Example: Sidebar Table with Auto-Fit
 * 
 * Demonstrates how to use the table auto-fit utilities in a sidebar component.
 * This example shows a rotation schedule table that automatically resizes
 * to fit without scrollbars or truncation.
 */

import { useTableAutofit, useTableAutofitManual } from '../../hooks/useSidebarTableAutofit';
import { Firefighter } from '../../lib/supabase';

interface RotationScheduleTableProps {
  firefighters: Firefighter[];
  title?: string;
}

/**
 * Example table component using the auto-fit hook
 */
export function RotationScheduleTable({ 
  firefighters, 
  title = "Rotation Schedule" 
}: RotationScheduleTableProps) {
  // Use the auto-fit hook with custom options
  const containerRef = useTableAutofit({
    minFontSize: 10,
    maxFontSize: 14,
    observeResize: true,
    padding: 16,
  });

  return (
    <div className="border-2 rounded-xl shadow-md overflow-hidden bg-card border-border">
      {/* Header */}
      <div className="border-b-2 p-4 bg-muted border-border">
        <h3 className="text-lg font-bold text-foreground">{title}</h3>
      </div>

      {/* Table Container with Auto-Fit */}
      <div 
        ref={containerRef} 
        className="table-container flex-1 overflow-hidden p-4"
        style={{ maxHeight: '400px' }}
      >
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-border">
              <th className="text-left p-2 font-bold text-muted-foreground">#</th>
              <th className="text-left p-2 font-bold text-muted-foreground">Name</th>
              <th className="text-left p-2 font-bold text-muted-foreground">Shift</th>
              <th className="text-left p-2 font-bold text-muted-foreground">Station</th>
              <th className="text-left p-2 font-bold text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {firefighters.map((ff, index) => (
              <tr 
                key={ff.id}
                className="border-b border-border hover:bg-muted/50 transition-colors"
              >
                <td className="p-2 text-foreground">{index + 1}</td>
                <td className="p-2 text-foreground font-medium">{ff.name}</td>
                <td className="p-2 text-foreground">
                  <span className={`
                    px-2 py-1 rounded text-xs font-bold
                    ${ff.shift === 'A' ? 'bg-sky-600 text-white' : ''}
                    ${ff.shift === 'B' ? 'bg-emerald-600 text-white' : ''}
                    ${ff.shift === 'C' ? 'bg-red-600 text-white' : ''}
                  `}>
                    {ff.shift}
                  </span>
                </td>
                <td className="p-2 text-foreground">
                  {ff.fire_station ? `Station ${ff.fire_station}` : 'N/A'}
                </td>
                <td className="p-2">
                  <span className={`
                    px-2 py-1 rounded text-xs font-medium
                    ${ff.is_available 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }
                  `}>
                    {ff.is_available ? 'Available' : 'On Hold'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/**
 * Example of using manual control
 */
export function ManualFitExample({ firefighters }: RotationScheduleTableProps) {
  const { containerRef, fitTable } = useTableAutofitManual({
    minFontSize: 10,
    maxFontSize: 14,
  });

  return (
    <div className="space-y-4">
      <button
        onClick={fitTable}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
      >
        Manually Fit Table
      </button>

      <div 
        ref={containerRef} 
        className="table-container overflow-hidden border-2 rounded-lg border-border p-4"
        style={{ maxHeight: '300px' }}
      >
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left p-2">Name</th>
              <th className="text-left p-2">Shift</th>
            </tr>
          </thead>
          <tbody>
            {firefighters.map(ff => (
              <tr key={ff.id} className="border-b border-border">
                <td className="p-2">{ff.name}</td>
                <td className="p-2">{ff.shift}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
