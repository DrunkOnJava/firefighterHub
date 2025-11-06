/**
 * CalendarLegendM3 Component - MaterialM Version
 *
 * Displays the color legend for calendar day cells using MaterialM design system.
 * Shows what the different colors mean (scheduled, completed, today).
 *
 * Uses MaterialM OKLCH color palette with no dark mode conditionals.
 */

import { colors, tokens } from '../../styles';

export function CalendarLegendM3() {
  const legendItems = [
    {
      label: 'Scheduled',
      colorClass: colors.semantic.scheduled.solid,
      description: 'Has scheduled holds'
    },
    {
      label: 'Completed',
      colorClass: colors.semantic.success.solid,
      description: 'Has completed holds'
    },
    {
      label: 'Today',
      borderClass: 'ring-2 ring-red-500',
      description: 'Current date'
    }
  ];

  return (
    <div
      className={`
        flex flex-wrap items-center justify-center gap-4 sm:gap-6
        ${tokens.spacing.margin.lg}
        ${tokens.typography.body.small}
      `}
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
              w-4 h-4
              ${tokens.borders.radius.sm}
              ${item.colorClass || ''}
              ${item.borderClass || ''}
              ${!item.colorClass && !item.borderClass ? 'bg-materialm-darkgray border border-materialm-border-dark' : ''}
            `}
            aria-label={item.description}
          />
          <span className="text-materialm-text-secondary">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
