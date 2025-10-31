/**
 * Empty State Components
 * User-friendly messages when no data is available
 * Improves UX by guiding users on next actions
 */

import { Users, Calendar, AlertCircle, Plus, Search } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  isDarkMode?: boolean;
}

// Base empty state component
export function EmptyState({
  title,
  description,
  icon,
  action,
  isDarkMode = true,
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-16 px-4 text-center ${
        isDarkMode ? 'text-gray-300' : 'text-gray-600'
      }`}
      role="status"
      aria-live="polite"
    >
      {icon && (
        <div
          className={`mb-6 p-4 rounded-full ${
            isDarkMode ? 'bg-gray-800/50' : 'bg-gray-100'
          }`}
        >
          {icon}
        </div>
      )}

      <h3
        className={`text-xl font-bold mb-2 ${
          isDarkMode ? 'text-gray-200' : 'text-gray-800'
        }`}
      >
        {title}
      </h3>

      <p
        className={`max-w-md mb-6 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}
      >
        {description}
      </p>

      {action && (
        <button
          onClick={action.onClick}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg ${
            isDarkMode
              ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          <Plus size={20} />
          {action.label}
        </button>
      )}
    </div>
  );
}

// Empty state for no firefighters
interface NoFirefightersEmptyStateProps {
  onAddFirefighter: () => void;
  isDarkMode?: boolean;
  isAdminMode?: boolean;
}

export function NoFirefightersEmptyState({
  onAddFirefighter,
  isDarkMode = true,
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
      icon={<Users size={48} className="text-gray-500" />}
      action={
        isAdminMode
          ? {
              label: 'Add First Firefighter',
              onClick: onAddFirefighter,
            }
          : undefined
      }
      isDarkMode={isDarkMode}
    />
  );
}

// Empty state for no scheduled holds
interface NoScheduledHoldsEmptyStateProps {
  onScheduleHold: () => void;
  isDarkMode?: boolean;
  isAdminMode?: boolean;
}

export function NoScheduledHoldsEmptyState({
  onScheduleHold,
  isDarkMode = true,
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
      icon={<Calendar size={48} className="text-gray-500" />}
      action={
        isAdminMode
          ? {
              label: 'Schedule First Hold',
              onClick: onScheduleHold,
            }
          : undefined
      }
      isDarkMode={isDarkMode}
    />
  );
}

// Empty state for search results
interface NoSearchResultsEmptyStateProps {
  searchTerm: string;
  onClearSearch: () => void;
  isDarkMode?: boolean;
}

export function NoSearchResultsEmptyState({
  searchTerm,
  onClearSearch,
  isDarkMode = true,
}: NoSearchResultsEmptyStateProps) {
  return (
    <EmptyState
      title="No Results Found"
      description={`No firefighters match "${searchTerm}". Try adjusting your search or clearing filters.`}
      icon={<Search size={48} className="text-gray-500" />}
      action={{
        label: 'Clear Search',
        onClick: onClearSearch,
      }}
      isDarkMode={isDarkMode}
    />
  );
}

// Empty state for connection error
interface ConnectionErrorEmptyStateProps {
  onRetry: () => void;
  isDarkMode?: boolean;
}

export function ConnectionErrorEmptyState({
  onRetry,
  isDarkMode = true,
}: ConnectionErrorEmptyStateProps) {
  return (
    <EmptyState
      title="Connection Error"
      description="Unable to load data. Please check your internet connection and try again."
      icon={<AlertCircle size={48} className="text-red-500" />}
      action={{
        label: 'Retry Connection',
        onClick: onRetry,
      }}
      isDarkMode={isDarkMode}
    />
  );
}

// Empty state for deactivated firefighters
interface NoDeactivatedFirefightersEmptyStateProps {
  isDarkMode?: boolean;
}

export function NoDeactivatedFirefightersEmptyState({
  isDarkMode = true,
}: NoDeactivatedFirefightersEmptyStateProps) {
  return (
    <EmptyState
      title="No Deactivated Members"
      description="All team members are currently active. Deactivated firefighters will appear here while preserving their history."
      icon={<Users size={48} className="text-gray-500" />}
      isDarkMode={isDarkMode}
    />
  );
}

// Empty state for activity log
interface NoActivityEmptyStateProps {
  isDarkMode?: boolean;
}

export function NoActivityEmptyState({
  isDarkMode = true,
}: NoActivityEmptyStateProps) {
  return (
    <EmptyState
      title="No Activity Yet"
      description="Team actions and changes will be logged here. This helps track roster modifications and hold assignments."
      icon={<AlertCircle size={48} className="text-gray-500" />}
      isDarkMode={isDarkMode}
    />
  );
}

// Empty state for reports
interface NoReportsDataEmptyStateProps {
  isDarkMode?: boolean;
}

export function NoReportsDataEmptyState({
  isDarkMode = true,
}: NoReportsDataEmptyStateProps) {
  return (
    <EmptyState
      title="No Data Available"
      description="Reports will be generated once you have scheduled holds and team member activity. Add firefighters and schedule holds to see analytics."
      icon={<Calendar size={48} className="text-gray-500" />}
      isDarkMode={isDarkMode}
    />
  );
}
