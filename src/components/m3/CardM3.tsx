/**
 * CardM3 - MaterialM Card Wrapper
 *
 * Wraps Flowbite Card with MaterialM design system patterns.
 * Provides elevation, padding, and styling consistent with Material Design 3.
 *
 * @example
 * ```tsx
 * <CardM3>
 *   <CardM3.Header>
 *     <h3>Card Title</h3>
 *   </CardM3.Header>
 *   <CardM3.Body>
 *     <p>Card content goes here...</p>
 *   </CardM3.Body>
 *   <CardM3.Footer>
 *     <ButtonM3>Action</ButtonM3>
 *   </CardM3.Footer>
 * </CardM3>
 * ```
 */

import { Card } from 'flowbite-react';
import type { ComponentProps } from 'react';

/**
 * Material Design 3 Elevation Levels
 */
export type CardM3Elevation = 0 | 1 | 2 | 3 | 4 | 5;

/**
 * Card variants
 */
export type CardM3Variant = 'elevated' | 'filled' | 'outlined';

export interface CardM3Props
  extends Omit<
    ComponentProps<typeof Card>,
    'className' | 'onClick' | 'imgAlt' | 'imgSrc' | 'renderImage'
  > {
  /**
   * Material Design 3 elevation level
   * @default 1
   */
  elevation?: CardM3Elevation;

  /**
   * Card variant
   * @default 'elevated'
   */
  variant?: CardM3Variant;

  /**
   * Whether the card is interactive (clickable)
   * @default false
   */
  interactive?: boolean;

  /**
   * Click handler for interactive cards
   */
  onClick?: () => void;

  /**
   * Custom className
   */
  className?: string;

  /**
   * Children elements
   */
  children: React.ReactNode;
}

/**
 * Maps elevation level to MaterialM shadow class
 */
function getElevationClass(elevation: CardM3Elevation): string {
  if (elevation === 0) return '';
  return `shadow-materialm-${elevation}`;
}

/**
 * Material Design 3 Card Component
 *
 * A container component that groups related content and actions.
 * Supports elevation, variants, and interactive states.
 */
export function CardM3({
  elevation = 1,
  variant = 'elevated',
  interactive = false,
  onClick,
  className = '',
  children,
  ...props
}: CardM3Props) {
  const elevationClass = variant === 'elevated' ? getElevationClass(elevation) : '';
  const outlineClass = variant === 'outlined' ? 'border border-materialm-border-dark' : '';
  const filledClass = variant === 'filled' ? 'bg-materialm-dark' : '';
  const interactiveClass = interactive
    ? 'cursor-pointer hover:shadow-materialm-3 transition-shadow duration-200'
    : '';

  const customClasses = [
    elevationClass,
    outlineClass,
    filledClass,
    interactiveClass,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <Card className={customClasses} {...props}>
      {children}
    </Card>
  );

  // Wrap in div with onClick if interactive
  if (interactive && onClick) {
    return <div onClick={onClick}>{content}</div>;
  }

  return content;
}

/**
 * Card Header Component
 *
 * Top section of the card, typically contains title and actions.
 */
export interface CardM3HeaderProps {
  children: React.ReactNode;
  className?: string;
}

function CardM3Header({ children, className = '' }: CardM3HeaderProps) {
  return (
    <div className={`pb-4 border-b border-slate-600 dark:border-slate-700 ${className}`}>
      {children}
    </div>
  );
}

/**
 * Card Body Component
 *
 * Main content area of the card.
 */
export interface CardM3BodyProps {
  children: React.ReactNode;
  className?: string;
}

function CardM3Body({ children, className = '' }: CardM3BodyProps) {
  return <div className={`py-4 ${className}`}>{children}</div>;
}

/**
 * Card Footer Component
 *
 * Bottom section of the card, typically contains actions.
 */
export interface CardM3FooterProps {
  children: React.ReactNode;
  className?: string;
  /**
   * Align footer content
   * @default 'right'
   */
  align?: 'left' | 'center' | 'right' | 'space-between';
}

function CardM3Footer({ children, className = '', align = 'right' }: CardM3FooterProps) {
  const alignClasses: Record<string, string> = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    'space-between': 'justify-between',
  };

  return (
    <div
      className={`pt-4 border-t border-slate-600 dark:border-slate-700 flex gap-2 ${alignClasses[align]} ${className}`}
    >
      {children}
    </div>
  );
}

// Attach sub-components to main component
CardM3.Header = CardM3Header;
CardM3.Body = CardM3Body;
CardM3.Footer = CardM3Footer;

/**
 * Compact Card Variant
 *
 * A card with reduced padding for dense layouts.
 *
 * @example
 * ```tsx
 * <CompactCardM3>
 *   <p>Compact content</p>
 * </CompactCardM3>
 * ```
 */
export function CompactCardM3({ className = '', ...props }: CardM3Props) {
  return <CardM3 className={`p-3 ${className}`} {...props} />;
}

/**
 * Metric Card Component
 *
 * Specialized card for displaying metrics and statistics.
 *
 * @example
 * ```tsx
 * <MetricCardM3
 *   title="Active Firefighters"
 *   value="24"
 *   subtitle="Currently available"
 *   trend={{ value: 5, direction: 'up' }}
 * />
 * ```
 */
export interface MetricCardM3Props {
  /**
   * Metric title
   */
  title: string;

  /**
   * Primary value to display
   */
  value: string | number;

  /**
   * Optional subtitle or description
   */
  subtitle?: string;

  /**
   * Optional trend indicator
   */
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
  };

  /**
   * Optional icon
   */
  icon?: React.ReactNode;

  /**
   * Click handler
   */
  onClick?: () => void;

  /**
   * Custom className
   */
  className?: string;
}

export function MetricCardM3({
  title,
  value,
  subtitle,
  trend,
  icon,
  onClick,
  className = '',
}: MetricCardM3Props) {
  const trendColor = trend
    ? trend.direction === 'up'
      ? 'text-materialm-success'
      : trend.direction === 'down'
        ? 'text-materialm-error'
        : 'text-gray-500'
    : '';

  return (
    <CardM3
      elevation={1}
      interactive={!!onClick}
      onClick={onClick}
      className={className}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
          )}
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${trendColor}`}>
              {trend.direction === 'up' && '↑'}
              {trend.direction === 'down' && '↓'}
              {trend.direction === 'neutral' && '→'}
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
    </CardM3>
  );
}
