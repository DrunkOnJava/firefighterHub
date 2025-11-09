/**
 * EmptyState Component
 * 
 * Enhanced empty state with animated illustrations and helpful CTAs.
 * 
 * Features:
 * - Animated SVG illustrations
 * - Floating icon animations
 * - Helpful messaging
 * - Primary and secondary actions
 * - Multiple variants (no-data, error, success, search)
 * - Respects prefers-reduced-motion
 * 
 * Usage:
 * ```tsx
 * <EmptyState
 *   variant="no-data"
 *   title="No firefighters yet"
 *   description="Get started by adding your first firefighter"
 *   primaryAction={{
 *     label: "Add Firefighter",
 *     onClick: handleAdd
 *   }}
 * />
 * ```
 */

import { ReactNode } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import {
  Users,
  Search,
  CheckCircle,
  AlertCircle,
  FileQuestion,
  Inbox,
} from 'lucide-react';
import '../../styles/animations.css';

type EmptyStateVariant = 
  | 'no-data' 
  | 'search' 
  | 'error' 
  | 'success' 
  | 'loading'
  | 'unauthorized'
  | 'not-found';

interface EmptyStateAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

interface EmptyStateProps {
  variant?: EmptyStateVariant;
  icon?: ReactNode;
  title: string;
  description?: string;
  primaryAction?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
  className?: string;
  isDarkMode?: boolean;
}

export function EmptyState({
  variant = 'no-data',
  icon: customIcon,
  title,
  description,
  primaryAction,
  secondaryAction,
  className = '',
  isDarkMode = true,
}: EmptyStateProps) {
  const prefersReducedMotion = useReducedMotion();

  // Get default icon based on variant
  const getDefaultIcon = () => {
    const iconProps = {
      className: `w-16 h-16 ${prefersReducedMotion ? '' : 'animate-float'}`,
      strokeWidth: 1.5,
    };

    switch (variant) {
      case 'no-data':
        return <Inbox {...iconProps} className={`${iconProps.className} text-slate-400`} />;
      case 'search':
        return <Search {...iconProps} className={`${iconProps.className} text-slate-400`} />;
      case 'error':
        return <AlertCircle {...iconProps} className={`${iconProps.className} text-red-500`} />;
      case 'success':
        return <CheckCircle {...iconProps} className={`${iconProps.className} text-green-500`} />;
      case 'loading':
        return <div className="w-16 h-16 spinner border-4 border-blue-500 border-t-transparent" />;
      case 'unauthorized':
        return <AlertCircle {...iconProps} className={`${iconProps.className} text-yellow-500`} />;
      case 'not-found':
        return <FileQuestion {...iconProps} className={`${iconProps.className} text-slate-400`} />;
      default:
        return <Users {...iconProps} className={`${iconProps.className} text-slate-400`} />;
    }
  };

  const icon = customIcon || getDefaultIcon();

  return (
    <div
      className={`
        flex flex-col items-center justify-center
        text-center
        py-12 px-4
        ${className}
      `}
    >
      {/* Icon */}
      <div
        className={`
          mb-4
          ${!prefersReducedMotion ? 'animate-fade-in' : ''}
        `}
        style={{ animationDelay: '0ms' }}
      >
        {icon}
      </div>

      {/* Title */}
      <h3
        className={`
          text-xl font-semibold mb-2
          ${isDarkMode ? 'text-white' : 'text-slate-900'}
          ${!prefersReducedMotion ? 'animate-fade-in' : ''}
        `}
        style={{ animationDelay: '100ms' }}
      >
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p
          className={`
            text-sm max-w-sm mb-6
            ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}
            ${!prefersReducedMotion ? 'animate-fade-in' : ''}
          `}
          style={{ animationDelay: '200ms' }}
        >
          {description}
        </p>
      )}

      {/* Actions */}
      {(primaryAction || secondaryAction) && (
        <div
          className={`
            flex flex-col sm:flex-row items-center gap-3
            ${!prefersReducedMotion ? 'animate-fade-in' : ''}
          `}
          style={{ animationDelay: '300ms' }}
        >
          {primaryAction && (
            <button
              onClick={primaryAction.onClick}
              className={`
                px-6 py-2.5 rounded-lg font-medium
                min-h-[44px]
                ${
                  primaryAction.variant === 'secondary'
                    ? isDarkMode
                      ? 'bg-slate-700 hover:bg-slate-600 text-white'
                      : 'bg-gray-200 hover:bg-gray-300 text-slate-900'
                    : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white'
                }
                ${!prefersReducedMotion ? 'transition-all duration-150 active:scale-95' : ''}
                focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2
              `}
            >
              {primaryAction.label}
            </button>
          )}

          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              className={`
                px-6 py-2.5 rounded-lg font-medium
                min-h-[44px]
                ${
                  isDarkMode
                    ? 'bg-transparent border-2 border-slate-600 hover:border-gray-500 text-slate-300'
                    : 'bg-transparent border-2 border-slate-300 hover:border-gray-400 text-slate-700'
                }
                ${!prefersReducedMotion ? 'transition-all duration-150 active:scale-95' : ''}
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              `}
            >
              {secondaryAction.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * EmptyStateCard Component
 * Empty state wrapped in a card container
 */
interface EmptyStateCardProps extends EmptyStateProps {
  cardClassName?: string;
}

export function EmptyStateCard({
  cardClassName = '',
  isDarkMode = true,
  ...props
}: EmptyStateCardProps) {
  return (
    <div
      className={`
        ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}
        border-2 rounded-xl p-8
        ${cardClassName}
      `}
    >
      <EmptyState {...props} isDarkMode={isDarkMode} />
    </div>
  );
}
