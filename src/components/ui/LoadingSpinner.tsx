/**
 * Unified Loading Spinner Component
 * 
 * Provides consistent loading states across the application with:
 * - Size variants (sm, md, lg, xl)
 * - Optional loading text
 * - Optional full-page overlay
 * - Design token integration
 * 
 * @example
 * // Inline button loading
 * <LoadingSpinner size="sm" />
 * 
 * @example
 * // Section loading with text
 * <LoadingSpinner size="md" text="Loading calendar..." />
 * 
 * @example
 * // Full-page loading overlay
 * <LoadingSpinner size="xl" text="Loading Hold List Manager..." fullPage />
 */

import { colors, tokens } from '../../styles';

export interface LoadingSpinnerProps {
  /** Size variant of the spinner */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Optional loading message to display */
  text?: string;
  /** Whether to render as a full-page overlay */
  fullPage?: boolean;
  /** Optional className for additional styling */
  className?: string;
}

const sizes = {
  sm: 'w-4 h-4 border-2',   // Inline - for buttons
  md: 'w-8 h-8 border-2',   // Section - for content areas
  lg: 'w-12 h-12 border-4', // Page - for main content
  xl: 'w-16 h-16 border-4', // Full-screen - for app loading
};

const textSizes = {
  sm: tokens.typography.body.small,      // 12px
  md: tokens.typography.body.secondary,  // 14px
  lg: tokens.typography.body.primary,    // 16px
  xl: 'text-xl font-semibold',           // 20px
};

export function LoadingSpinner({ 
  size = 'md', 
  text, 
  fullPage = false,
  className = '',
}: LoadingSpinnerProps) {
  const spinner = (
    <div className={`flex flex-col items-center ${tokens.spacing.gap.md} ${className}`}>
      <div 
        className={`
          ${sizes[size]}
          ${colors.semantic.scheduled.border}
          border-t-transparent
          rounded-full
          animate-spin
        `}
        role="status"
        aria-label={text || 'Loading'}
      />
      {text && (
        <p className={`${textSizes[size]} ${colors.structural.text.secondary}`}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div 
        className={`
          min-h-screen 
          ${colors.structural.bg.app} 
          ${tokens.layout.flex.center}
        `}
      >
        {spinner}
      </div>
    );
  }

  return spinner;
}
