/**
 * Empty State Components
 *
 * User-friendly messages when no data is available.
 * Automatically switches between MaterialM and legacy styling based on feature flag.
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
import { useFeatureFlag } from '../hooks/useFeatureFlag';
import { ButtonM3 } from './m3/ButtonM3';
import {
  EmptyStateLegacy,
  NoFirefightersEmptyStateLegacy,
  NoScheduledHoldsEmptyStateLegacy,
  NoSearchResultsEmptyStateLegacy,
  ConnectionErrorEmptyStateLegacy,
  NoDeactivatedFirefightersEmptyStateLegacy,
  NoActivityEmptyStateLegacy,
  NoReportsDataEmptyStateLegacy,
} from './EmptyStateLegacy';

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

      <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
        {title}
      </h3>

      <p className="max-w-md mb-6 text-gray-600 dark:text-gray-400">
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
 * Switches between MaterialM and legacy versions based on feature flag.
 */
export function EmptyState(props: EmptyStateProps) {
  const useMaterialM = useFeatureFlag('MATERIALM');

  if (!useMaterialM) {
    return <EmptyStateLegacy {...props} />;
  }

  return <EmptyStateM3 {...props} />;
}

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
  const useMaterialM = useFeatureFlag('MATERIALM');

  if (!useMaterialM) {
    return (
      <NoFirefightersEmptyStateLegacy
        onAddFirefighter={onAddFirefighter}
        isAdminMode={isAdminMode}
      />
    );
  }

  return (
    <EmptyState
      title="No Team Members Yet"
      description={
        isAdminMode
          ? "Get started by adding your first firefighter to the rotation. Click the button below to begin building your team."
          : "Your roster is empty. Contact an administrator to add team members to the rotation."
      }
      icon={<Users size={48} className="text-gray-400" />}
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
  const useMaterialM = useFeatureFlag('MATERIALM');

  if (!useMaterialM) {
    return (
      <NoScheduledHoldsEmptyStateLegacy
        onScheduleHold={onScheduleHold}
        isAdminMode={isAdminMode}
      />
    );
  }

  return (
    <EmptyState
      title="No Holds Scheduled"
      description={
        isAdminMode
          ? "Click on any date in the calendar to schedule a hold. The calendar will show scheduled and completed holds."
          : "No holds have been scheduled yet. Check back later or contact an administrator."
      }
      icon={<Calendar size={48} className="text-gray-400" />}
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
  const useMaterialM = useFeatureFlag('MATERIALM');

  if (!useMaterialM) {
    return (
      <NoSearchResultsEmptyStateLegacy
        searchTerm={searchTerm}
        onClearSearch={onClearSearch}
      />
    );
  }

  return (
    <EmptyState
      title="No Results Found"
      description={`No firefighters match "${searchTerm}". Try adjusting your search or clearing filters.`}
      icon={<Search size={48} className="text-gray-400" />}
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
  const useMaterialM = useFeatureFlag('MATERIALM');

  if (!useMaterialM) {
    return <ConnectionErrorEmptyStateLegacy onRetry={onRetry} />;
  }

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
  const useMaterialM = useFeatureFlag('MATERIALM');

  if (!useMaterialM) {
    return <NoDeactivatedFirefightersEmptyStateLegacy />;
  }

  return (
    <EmptyState
      title="No Deactivated Members"
      description="All team members are currently active. Deactivated firefighters will appear here while preserving their history."
      icon={<Users size={48} className="text-gray-400" />}
    />
  );
}

/**
 * Empty state for activity log
 */
export function NoActivityEmptyState() {
  const useMaterialM = useFeatureFlag('MATERIALM');

  if (!useMaterialM) {
    return <NoActivityEmptyStateLegacy />;
  }

  return (
    <EmptyState
      title="No Activity Yet"
      description="Team actions and changes will be logged here. This helps track roster modifications and hold assignments."
      icon={<AlertCircle size={48} className="text-gray-400" />}
    />
  );
}

/**
 * Empty state for reports
 */
export function NoReportsDataEmptyState() {
  const useMaterialM = useFeatureFlag('MATERIALM');

  if (!useMaterialM) {
    return <NoReportsDataEmptyStateLegacy />;
  }

  return (
    <EmptyState
      title="No Data Available"
      description="Reports will be generated once you have scheduled holds and team member activity. Add firefighters and schedule holds to see analytics."
      icon={<Calendar size={48} className="text-gray-400" />}
    />
  );
}
