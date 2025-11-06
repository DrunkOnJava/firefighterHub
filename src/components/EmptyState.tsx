/**
 * Empty State Components
 *
 * User-friendly messages when no data is available.
 * Uses MaterialM design system.
 * Improves UX by guiding users on next actions.
 *
 * @example
 * ```tsx
 * <EmptyState
 *   title="No Data"
 *   description="Add your first item to get started"
 *   icon={<Icon />}
 *   action={{ label: 'Add Item', onClick: handleAdd }}
 * />
 * ```
 */

import { Users, Calendar, AlertCircle, Plus, Search } from 'lucide-react';
import { ButtonM3 } from './m3/ButtonM3';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * MaterialM Empty State Component
 */
function EmptyStateM3({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
      role="status"
      aria-live="polite"
    >
      {icon && (
        <div className="mb-6 p-4 rounded-full bg-materialm-dark opacity-50">
          {icon}
        </div>
      )}

      <h3 className="text-2xl font-bold mb-2 text-materialm-text-primary dark:text-white">
        {title}
      </h3>

      <p className="max-w-md mb-6 text-materialm-text-secondary dark:text-materialm-text-secondary">
        {description}
      </p>

      {action && (
        <ButtonM3
          color="primary"
          startIcon={<Plus size={20} />}
          onClick={action.onClick}
        >
          {action.label}
        </ButtonM3>
      )}
    </div>
  );
}

/**
 * Base Empty State Component
 *
 * Uses MaterialM design system.
 */
export const EmptyState = EmptyStateM3;

// ============================================================================
// Specialized Empty State Components
// ============================================================================

/**
 * Empty state for no firefighters
 */
interface NoFirefightersEmptyStateProps {
  onAddFirefighter: () => void;
  isAdminMode?: boolean;
}

export function NoFirefightersEmptyState({
  onAddFirefighter,
  isAdminMode = false,
}: NoFirefightersEmptyStateProps) {
  return (
    <EmptyState
      title="No Team Members Yet"
      description={
        isAdminMode
          ? "Get started by adding your first firefighter to the rotation. Click the button below to begin building your team."
          : "Your roster is empty. Contact an administrator to add team members to the rotation."
      }
      icon={<Users size={48} className="text-materialm-text-tertiary" />}
      action={
        isAdminMode
          ? {
              label: 'Add First Firefighter',
              onClick: onAddFirefighter,
            }
          : undefined
      }
    />
  );
}

/**
 * Empty state for no scheduled holds
 */
interface NoScheduledHoldsEmptyStateProps {
  onScheduleHold: () => void;
  isAdminMode?: boolean;
}

export function NoScheduledHoldsEmptyState({
  onScheduleHold,
  isAdminMode = false,
}: NoScheduledHoldsEmptyStateProps) {
  return (
    <EmptyState
      title="No Holds Scheduled"
      description={
        isAdminMode
          ? "Click on any date in the calendar to schedule a hold. The calendar will show scheduled and completed holds."
          : "No holds have been scheduled yet. Check back later or contact an administrator."
      }
      icon={<Calendar size={48} className="text-materialm-text-tertiary" />}
      action={
        isAdminMode
          ? {
              label: 'Schedule First Hold',
              onClick: onScheduleHold,
            }
          : undefined
      }
    />
  );
}

/**
 * Empty state for search results
 */
interface NoSearchResultsEmptyStateProps {
  searchTerm: string;
  onClearSearch: () => void;
}

export function NoSearchResultsEmptyState({
  searchTerm,
  onClearSearch,
}: NoSearchResultsEmptyStateProps) {
  return (
    <EmptyState
      title="No Results Found"
      description={`No firefighters match "${searchTerm}". Try adjusting your search or clearing filters.`}
      icon={<Search size={48} className="text-materialm-text-tertiary" />}
      action={{
        label: 'Clear Search',
        onClick: onClearSearch,
      }}
    />
  );
}

/**
 * Empty state for connection error
 */
interface ConnectionErrorEmptyStateProps {
  onRetry: () => void;
}

export function ConnectionErrorEmptyState({
  onRetry,
}: ConnectionErrorEmptyStateProps) {
  return (
    <EmptyState
      title="Connection Error"
      description="Unable to load data. Please check your internet connection and try again."
      icon={<AlertCircle size={48} className="text-materialm-error" />}
      action={{
        label: 'Retry Connection',
        onClick: onRetry,
      }}
    />
  );
}

/**
 * Empty state for deactivated firefighters
 */
export function NoDeactivatedFirefightersEmptyState() {
  return (
    <EmptyState
      title="No Deactivated Members"
      description="All team members are currently active. Deactivated firefighters will appear here while preserving their history."
      icon={<Users size={48} className="text-materialm-text-tertiary" />}
    />
  );
}

/**
 * Empty state for activity log
 */
export function NoActivityEmptyState() {
  return (
    <EmptyState
      title="No Activity Yet"
      description="Team actions and changes will be logged here. This helps track roster modifications and hold assignments."
      icon={<AlertCircle size={48} className="text-materialm-text-tertiary" />}
    />
  );
}

/**
 * Empty state for reports
 */
export function NoReportsDataEmptyState() {
  return (
    <EmptyState
      title="No Data Available"
      description="Reports will be generated once you have scheduled holds and team member activity. Add firefighters and schedule holds to see analytics."
      icon={<Calendar size={48} className="text-materialm-text-tertiary" />}
    />
  );
}
