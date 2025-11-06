/**
 * BadgeM3 - MaterialM Badge/Chip Wrapper
 *
 * Wraps Flowbite Badge with MaterialM design system patterns.
 * Provides consistent badge styling for labels, statuses, and counts.
 *
 * @example
 * ```tsx
 * <BadgeM3 color="primary">New</BadgeM3>
 * <BadgeM3 color="success" icon={<CheckIcon />}>Completed</BadgeM3>
 * <BadgeM3 color="error" onDismiss={handleRemove}>Error</BadgeM3>
 * ```
 */

import { Badge } from 'flowbite-react';
import type { ComponentProps } from 'react';

/**
 * Badge variants
 */
export type BadgeM3Variant = 'filled' | 'outlined' | 'tonal';

/**
 * Badge colors (semantic)
 */
export type BadgeM3Color =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'error'
  | 'warning'
  | 'info'
  | 'neutral';

/**
 * Badge sizes
 */
export type BadgeM3Size = 'xs' | 'sm' | 'md';

export interface BadgeM3Props extends Omit<ComponentProps<typeof Badge>, 'color' | 'size' | 'icon'> {
  /**
   * Badge variant
   * @default 'filled'
   */
  variant?: BadgeM3Variant;

  /**
   * Semantic color
   * @default 'neutral'
   */
  color?: BadgeM3Color;

  /**
   * Badge size
   * @default 'sm'
   */
  size?: BadgeM3Size;

  /**
   * Icon to show before text
   */
  icon?: React.ReactNode;

  /**
   * Callback when badge is dismissed (shows X button)
   */
  onDismiss?: () => void;

  /**
   * Badge content
   */
  children: React.ReactNode;

  /**
   * Custom className
   */
  className?: string;
}

/**
 * Maps MaterialM colors to Flowbite colors
 */
function mapColorToFlowbite(color: BadgeM3Color): string {
  const colorMap: Record<BadgeM3Color, string> = {
    primary: 'blue',
    secondary: 'purple',
    success: 'success',
    error: 'failure',
    warning: 'warning',
    info: 'info',
    neutral: 'gray',
  };
  return colorMap[color] || 'gray';
}

/**
 * Material Design 3 Badge Component
 *
 * A small label component for displaying metadata, status, or counts.
 * Follows M3 badge patterns with proper spacing and styling.
 */
export function BadgeM3({
  variant = 'filled',
  color = 'neutral',
  size = 'sm',
  icon,
  onDismiss,
  children,
  className = '',
  ...props
}: BadgeM3Props) {
  const flowbiteColor = mapColorToFlowbite(color);

  // Size classes
  const sizeClasses: Record<BadgeM3Size, string> = {
    xs: 'text-xs px-2 py-0.5',
    sm: 'text-sm px-2.5 py-1',
    md: 'text-base px-3 py-1.5',
  };

  // Variant classes
  const variantClasses: Record<BadgeM3Variant, string> = {
    filled: '',
    outlined: 'bg-transparent border-2',
    tonal: 'bg-opacity-10',
  };

  const customClasses = [
    sizeClasses[size],
    variantClasses[variant],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Badge color={flowbiteColor} className={customClasses} {...props}>
      {icon && <span className="mr-1">{icon}</span>}
      {children}
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="ml-2 -mr-1 hover:bg-black/10 rounded-full p-0.5 transition-colors"
          aria-label="Dismiss"
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </Badge>
  );
}

/**
 * Status Badge Component
 *
 * Specialized badge for showing status with indicator dot.
 *
 * @example
 * ```tsx
 * <StatusBadgeM3 status="active">Active</StatusBadgeM3>
 * <StatusBadgeM3 status="inactive">Inactive</StatusBadgeM3>
 * ```
 */
export interface StatusBadgeM3Props {
  /**
   * Status type
   */
  status: 'active' | 'inactive' | 'pending' | 'error' | 'success';

  /**
   * Badge content
   */
  children: React.ReactNode;

  /**
   * Custom className
   */
  className?: string;
}

export function StatusBadgeM3({ status, children, className = '' }: StatusBadgeM3Props) {
  const statusConfig: Record<
    string,
    { color: BadgeM3Color; dotColor: string }
  > = {
    active: { color: 'success', dotColor: 'bg-materialm-success' },
    inactive: { color: 'neutral', dotColor: 'bg-materialm-text-secondary' },
    pending: { color: 'warning', dotColor: 'bg-materialm-warning' },
    error: { color: 'error', dotColor: 'bg-materialm-error' },
    success: { color: 'success', dotColor: 'bg-materialm-success' },
  };

  const config = statusConfig[status] || statusConfig.inactive;

  return (
    <BadgeM3
      color={config.color}
      icon={
        <span className={`w-2 h-2 rounded-full ${config.dotColor} inline-block`} />
      }
      className={className}
    >
      {children}
    </BadgeM3>
  );
}

/**
 * Count Badge Component
 *
 * Badge for displaying numeric counts or notifications.
 *
 * @example
 * ```tsx
 * <CountBadgeM3 count={5} />
 * <CountBadgeM3 count={99} max={99} />
 * <CountBadgeM3 count={150} max={99} /> // Shows "99+"
 * ```
 */
export interface CountBadgeM3Props {
  /**
   * Numeric count to display
   */
  count: number;

  /**
   * Maximum value to display (shows "max+" if exceeded)
   * @default 99
   */
  max?: number;

  /**
   * Badge color
   * @default 'error'
   */
  color?: BadgeM3Color;

  /**
   * Custom className
   */
  className?: string;
}

export function CountBadgeM3({
  count,
  max = 99,
  color = 'error',
  className = '',
}: CountBadgeM3Props) {
  const displayCount = count > max ? `${max}+` : count;

  return (
    <BadgeM3
      color={color}
      size="xs"
      className={`rounded-full min-w-[20px] h-5 flex items-center justify-center ${className}`}
    >
      {displayCount}
    </BadgeM3>
  );
}

/**
 * Shift Badge Component
 *
 * Specialized badge for firefighter shifts with shape indicators.
 *
 * @example
 * ```tsx
 * <ShiftBadgeM3 shift="A" />
 * <ShiftBadgeM3 shift="B" />
 * <ShiftBadgeM3 shift="C" />
 * ```
 */
export interface ShiftBadgeM3Props {
  /**
   * Shift letter (A, B, or C)
   */
  shift: 'A' | 'B' | 'C';

  /**
   * Badge size
   * @default 'sm'
   */
  size?: BadgeM3Size;

  /**
   * Custom className
   */
  className?: string;
}

export function ShiftBadgeM3({ shift, size = 'sm', className = '' }: ShiftBadgeM3Props) {
  const shiftConfig: Record<string, { color: BadgeM3Color; shape: string }> = {
    A: { color: 'success', shape: '●' },
    B: { color: 'error', shape: '■' },
    C: { color: 'info', shape: '◆' },
  };

  const config = shiftConfig[shift];

  return (
    <BadgeM3 color={config.color} size={size} className={className}>
      {config.shape} {shift}
    </BadgeM3>
  );
}

/**
 * Badge Group Component
 *
 * Groups multiple badges together with consistent spacing.
 *
 * @example
 * ```tsx
 * <BadgeGroupM3>
 *   <BadgeM3 color="primary">Tag 1</BadgeM3>
 *   <BadgeM3 color="secondary">Tag 2</BadgeM3>
 *   <BadgeM3 color="success">Tag 3</BadgeM3>
 * </BadgeGroupM3>
 * ```
 */
export interface BadgeGroupM3Props {
  /**
   * Badges to display
   */
  children: React.ReactNode;

  /**
   * Gap between badges
   * @default 2
   */
  gap?: 1 | 2 | 3 | 4;

  /**
   * Custom className
   */
  className?: string;
}

export function BadgeGroupM3({ children, gap = 2, className = '' }: BadgeGroupM3Props) {
  return <div className={`flex flex-wrap gap-${gap} ${className}`}>{children}</div>;
}

/**
 * Avatar Badge Component
 *
 * Badge that overlays on avatars or images.
 *
 * @example
 * ```tsx
 * <div className="relative">
 *   <img src="avatar.jpg" className="rounded-full" />
 *   <AvatarBadgeM3 status="active" position="bottom-right" />
 * </div>
 * ```
 */
export interface AvatarBadgeM3Props {
  /**
   * Badge status
   */
  status: 'active' | 'inactive' | 'busy' | 'away';

  /**
   * Badge position
   * @default 'bottom-right'
   */
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

  /**
   * Custom className
   */
  className?: string;
}

export function AvatarBadgeM3({
  status,
  position = 'bottom-right',
  className = '',
}: AvatarBadgeM3Props) {
  const statusColors: Record<string, string> = {
    active: 'bg-materialm-success',
    inactive: 'bg-materialm-text-secondary',
    busy: 'bg-materialm-error',
    away: 'bg-materialm-warning',
  };

  const positionClasses: Record<string, string> = {
    'top-right': 'top-0 right-0',
    'top-left': 'top-0 left-0',
    'bottom-right': 'bottom-0 right-0',
    'bottom-left': 'bottom-0 left-0',
  };

  return (
    <span
      className={`absolute w-3 h-3 ${statusColors[status]} border-2 border-materialm-surface dark:border-materialm-dark rounded-full ${positionClasses[position]} ${className}`}
      aria-label={`Status: ${status}`}
    />
  );
}
