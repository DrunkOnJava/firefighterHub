/**
 * HoldList Component
 * 
 * Displays a list of scheduled holds for a selected day with:
 * - Hold cards showing firefighter name, station, status
 * - Action buttons (Edit, Delete, Mark Complete) - admin only
 * - Lock indicator for holds >1 week old
 * - Empty state when no holds exist
 * 
 * Uses design tokens for consistent styling.
 */

import { CheckCircle2, Trash2, Lock, Plus, Calendar, Clock } from 'lucide-react';
import { Firefighter } from '../../lib/supabase';
import { ScheduledHold } from '../../utils/calendarUtils';
import { isHoldLocked } from '../../utils/validation';
import { colors, tokens } from '../../styles';
import { EmptyState } from '../EmptyState';

interface HoldListProps {
  holds: ScheduledHold[];
  firefighters: Firefighter[];
  onRemove: (holdId: string) => void;
  onMarkCompleted: (hold: ScheduledHold) => void;
  onEdit: (holdId: string, station: string) => void;
  onAddNew: () => void;
  isAdminMode?: boolean;
  isDarkMode?: boolean;
}

export function HoldList({
  holds,
  onRemove,
  onMarkCompleted,
  onAddNew,
  isAdminMode = false,
  isDarkMode = true,
}: HoldListProps) {
  if (holds.length === 0) {
    return (
      <div>
        <EmptyState
          icon={Calendar as any}
          title="No holds scheduled"
          description="Click 'Add Hold' below to schedule someone"
          isDarkMode={isDarkMode}
        />
        
        {isAdminMode && (
          <button
            onClick={onAddNew}
            className={`
              w-full
              ${tokens.spacing.margin.lg}
              ${tokens.spacing.section.md}
              ${tokens.borders.radius.lg}
              ${colors.components.button.primary}
              font-semibold
              flex items-center justify-center gap-2
            `}
          >
            <Plus size={20} />
            Add Hold
          </button>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className={`space-y-3 ${tokens.spacing.margin.lg}`}>
        {holds.map((hold) => {
          const locked = isHoldLocked(hold);
          
          return (
            <div
              key={hold.id}
              className={`
                ${colors.components.hold.border}
                ${colors.components.hold[hold.status as 'scheduled' | 'completed']}
                ${tokens.borders.radius.lg}
                ${tokens.spacing.card.md}
                ${hold.status === 'scheduled' ? 'border-l-blue-500' : 'border-l-emerald-500'}
              `}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className={`${tokens.typography.heading.h4} ${isDarkMode ? colors.structural.text.primary : 'text-gray-900'}`}>
                    {hold.firefighter_name}
                  </p>
                  
                  {hold.fire_station && (
                    <p className={`${tokens.typography.body.secondary} ${isDarkMode ? colors.structural.text.secondary : 'text-gray-600'} mt-1 font-semibold`}>
                      Station #{hold.fire_station}
                    </p>
                  )}
                  
                  {hold.duration && (
                    <p className={`${tokens.typography.body.small} ${isDarkMode ? colors.structural.text.tertiary : 'text-gray-500'} mt-1 flex items-center gap-1`}>
                      <Clock size={14} />
                      {hold.duration === '12h' ? '12 Hour' : '24 Hour'} Hold
                      {hold.start_time && ` • Starts ${hold.start_time}`}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span
                      className={`
                        inline-block px-2 py-1
                        ${tokens.borders.radius.sm}
                        ${tokens.typography.body.small}
                        font-bold
                        ${
                          hold.status === "scheduled"
                            ? "bg-sky-900/70 text-sky-300"
                            : "bg-emerald-900/70 text-emerald-300"
                        }
                      `}
                    >
                      {hold.status === "scheduled" ? "SCHEDULED" : "COMPLETED"}
                    </span>
                    
                    {locked && (
                      <span className={`inline-flex items-center px-2 py-1 bg-amber-900/70 text-amber-200 ${tokens.typography.body.small} font-bold ${tokens.borders.radius.sm}`}>
                        <Lock size={12} />
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              {isAdminMode && (
                <div className={`flex gap-2 pt-3 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  {/* Complete Button: For 'scheduled' holds */}
                  {hold.status === "scheduled" && (
                    <button
                      onClick={() => onMarkCompleted(hold)}
                      className={`
                        flex-1
                        ${colors.components.button.success}
                        ${tokens.spacing.section.sm}
                        px-3
                        ${tokens.borders.radius.lg}
                        font-semibold
                        flex items-center justify-center gap-2
                      `}
                      title="Mark as completed and move to end of rotation"
                    >
                      <CheckCircle2 size={16} />
                      <span className={tokens.typography.body.small}>Complete</span>
                    </button>
                  )}

                  {/* Cancel Button: Disabled for locked holds */}
                  {!hold.id.startsWith("past-") && (
                    <button
                      disabled={locked}
                      onClick={() => !locked && onRemove(hold.id)}
                      className={`
                        flex-1
                        ${locked ? 'opacity-50 cursor-not-allowed' : colors.components.button.danger}
                        ${tokens.spacing.section.sm}
                        px-3
                        ${tokens.borders.radius.lg}
                        font-semibold
                        flex items-center justify-center gap-2
                      `}
                      title={
                        locked
                          ? "Hold is locked (>1 week old)"
                          : hold.status === "completed"
                          ? "Cancel completed hold and reset firefighter position"
                          : "Cancel scheduled hold"
                      }
                    >
                      {locked ? <Lock size={16} /> : (
                        <>
                          <Trash2 size={16} />
                          <span className={tokens.typography.body.small}>Cancel</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add button */}
      {isAdminMode && (
        <button
          onClick={onAddNew}
          className={`
            w-full
            ${tokens.spacing.margin.lg}
            ${tokens.spacing.section.md}
            ${tokens.borders.radius.lg}
            ${colors.components.button.primary}
            font-semibold
            flex items-center justify-center gap-2
          `}
        >
          <Plus size={20} />
          Add Another Hold
        </button>
      )}
    </div>
  );
}

