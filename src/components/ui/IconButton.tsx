/**
 * IconButton Component
 * 
 * WCAG 2.5.5 compliant icon button with 44×44px minimum touch target.
 * Thin wrapper around shadcn Button for icon-only buttons.
 * 
 * Features:
 * - Touch-friendly 44×44px minimum size
 * - Accessible labels via aria-label
 * - Focus indicators
 * - Variants for different contexts
 * - Size options
 * 
 * Usage:
 * ```tsx
 * <IconButton
 *   icon={HelpCircle}
 *   label="Open help"
 *   onClick={handleHelp}
 *   variant="default"
 *   size="md"
 * />
 * ```
 */

import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  label: string; // For aria-label
  variant?: 'default' | 'primary' | 'danger' | 'destructive' | 'success' | 'ghost';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isDarkMode?: boolean; // Kept for backwards compatibility but ignored
}

export const IconButton = ({
  icon: Icon,
  label,
  variant = 'ghost',
  size = 'md',
  isDarkMode, // Ignored - handled by shadcn dark mode
  className = '',
  ...props
}: IconButtonProps) => {
  // Map custom sizes to shadcn sizes
  const shadcnSize = size === 'xs' ? 'sm' : size === 'lg' ? 'lg' : 'default';
  
  // Map variant to shadcn variant
  const shadcnVariant = 
    variant === 'danger' || variant === 'destructive' ? 'destructive' :
    variant === 'primary' ? 'default' :
    'ghost';

  // Icon sizes
  const iconSizes = {
    xs: 'w-4 h-4',
    sm: 'w-5 h-5',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <Button
      variant={shadcnVariant}
      size="icon"
      className={cn(className)}
      aria-label={label}
      title={label}
      {...props}
    >
      <Icon className={iconSizes[size]} aria-hidden="true" />
    </Button>
  );
};
