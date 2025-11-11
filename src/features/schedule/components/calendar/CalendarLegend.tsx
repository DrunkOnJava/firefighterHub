/**
 * CalendarLegend Component
 * 
 * Displays the color legend for calendar day cells.
 * Shows what the different colors mean (scheduled, completed, today).
 */

export function CalendarLegend() {
  const legendItems = [
    {
      label: 'Scheduled',
      colorClass: 'bg-warning',
      description: 'Has scheduled holds'
    },
    {
      label: 'Completed',
      colorClass: 'bg-success',
      description: 'Has completed holds'
    },
    {
      label: 'Today',
      borderClass: 'ring-2 ring-primary',
      description: 'Current date'
    }
  ];

  return (
    <div 
      className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-6 text-sm"
      role="list"
      aria-label="Calendar legend"
    >
      {legendItems.map((item) => (
        <div 
          key={item.label}
          className="flex items-center gap-2"
          role="listitem"
        >
          <div 
            className={`
              w-4 h-4 rounded
              ${item.colorClass || ''}
              ${item.borderClass || ''}
              ${!item.colorClass && !item.borderClass ? 'bg-muted border border-border' : ''}
            `}
            aria-label={item.description}
          />
          <span className="text-muted-foreground">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
