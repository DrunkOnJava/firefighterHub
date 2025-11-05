/**
 * ButtonM3 - MaterialM Button Wrapper
 *
 * Wraps Flowbite Button with MaterialM design system patterns.
 * Provides consistent button styling across the application.
 *
 * @example
 * ```tsx
 * <ButtonM3 variant="filled" color="primary">
 *   Save Changes
 * </ButtonM3>
 *
 * <ButtonM3 variant="outlined" color="error">
 *   Delete
 * </ButtonM3>
 *
 * <ButtonM3 variant="text" size="sm">
 *   Cancel
 * </ButtonM3>
 * ```
 */

import { Button } from 'flowbite-react';
import type { ComponentProps } from 'react';

/**
 * Material Design 3 Button Variants
 */
export type ButtonM3Variant = 'filled' | 'outlined' | 'text' | 'elevated' | 'tonal';

/**
 * Material Design 3 Semantic Colors
 */
export type ButtonM3Color = 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info' | 'neutral';

/**
 * Material Design 3 Button Sizes
 */
export type ButtonM3Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonM3Props extends Omit<ComponentProps<typeof Button>, 'color' | 'size'> {
  /**
   * Material Design 3 button variant
   * @default 'filled'
   */
  variant?: ButtonM3Variant;

  /**
   * Semantic color role
   * @default 'primary'
   */
  color?: ButtonM3Color;

  /**
   * Button size
   * @default 'md'
   */
  size?: ButtonM3Size;

  /**
   * Full width button
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Loading state (shows spinner)
   * @default false
   */
  loading?: boolean;

  /**
   * Icon to show before text
   */
  startIcon?: React.ReactNode;

  /**
   * Icon to show after text
   */
  endIcon?: React.ReactNode;
}

/**
 * Maps MaterialM colors to Flowbite colors
 */
function mapColorToFlowbite(color: ButtonM3Color): string {
  const colorMap: Record<ButtonM3Color, string> = {
    primary: 'blue',
    secondary: 'purple',
    success: 'success',
    error: 'failure',
    warning: 'warning',
    info: 'info',
    neutral: 'gray',
  };
  return colorMap[color] || 'blue';
}

/**
 * Material Design 3 Button Component
 *
 * A wrapper around Flowbite Button that implements Material Design 3 patterns.
 * Supports all M3 button variants: filled, outlined, text, elevated, and tonal.
 */
export function ButtonM3({
  variant = 'filled',
  color = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  startIcon,
  endIcon,
  disabled,
  children,
  className = '',
  ...props
}: ButtonM3Props) {
  const flowbiteColor = mapColorToFlowbite(color);
  const isOutline = variant === 'outlined';
  const isText = variant === 'text';

  // Build custom classes for MaterialM styling
  const customClasses = [
    className,
    fullWidth ? 'w-full' : '',
    // Elevated variant gets custom shadow
    variant === 'elevated' ? 'shadow-materialm-2 hover:shadow-materialm-3' : '',
    // Tonal variant gets light background
    variant === 'tonal' ? 'bg-opacity-10 hover:bg-opacity-20' : '',
    // Text variant gets no background
    isText ? 'bg-transparent hover:bg-gray-100 dark:hover:bg-slate-700' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Button
      color={flowbiteColor}
      size={size}
      outline={isOutline}
      disabled={disabled || loading}
      className={customClasses}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {startIcon && <span className="mr-2">{startIcon}</span>}
      {children}
      {endIcon && <span className="ml-2">{endIcon}</span>}
    </Button>
  );
}

/**
 * Material Design 3 Icon Button
 *
 * A square button optimized for displaying only an icon.
 *
 * @example
 * ```tsx
 * <IconButtonM3 color="primary">
 *   <TrashIcon className="h-5 w-5" />
 * </IconButtonM3>
 * ```
 */
export interface IconButtonM3Props extends Omit<ButtonM3Props, 'startIcon' | 'endIcon'> {
  /**
   * ARIA label for accessibility
   */
  'aria-label': string;
}

export function IconButtonM3({
  children,
  size = 'md' as ButtonM3Size,
  className = '',
  ...props
}: IconButtonM3Props) {
  // Size-specific padding for square appearance
  const sizeClasses: Record<ButtonM3Size, string> = {
    xs: 'p-1.5',
    sm: 'p-2',
    md: 'p-2.5',
    lg: 'p-3',
    xl: 'p-3.5',
  };

  const safeSize = (size || 'md') as ButtonM3Size;
  const sizeClass = sizeClasses[safeSize];

  return (
    <ButtonM3
      size={safeSize}
      className={`${sizeClass} aspect-square ${className}`}
      {...props}
    >
      {children}
    </ButtonM3>
  );
}

/**
 * Material Design 3 Button Group
 *
 * Groups related buttons together.
 *
 * @example
 * ```tsx
 * <ButtonGroupM3>
 *   <ButtonM3>Left</ButtonM3>
 *   <ButtonM3>Middle</ButtonM3>
 *   <ButtonM3>Right</ButtonM3>
 * </ButtonGroupM3>
 * ```
 */
export interface ButtonGroupM3Props {
  children: React.ReactNode;
  className?: string;
}

export function ButtonGroupM3({ children, className = '' }: ButtonGroupM3Props) {
  return (
    <div className={`inline-flex rounded-lg shadow-sm ${className}`} role="group">
      {children}
    </div>
  );
}
