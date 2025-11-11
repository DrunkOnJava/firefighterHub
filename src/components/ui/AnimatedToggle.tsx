/**
 * AnimatedToggle Component
 * 
 * Smooth toggle switch with spring physics and haptic-style feedback.
 * Migrated to shadcn Switch component with semantic colors.
 * 
 * Features:
 * - Smooth slide animation (200ms ease-out)
 * - Spring physics for thumb movement
 * - Background color transition
 * - Keyboard accessible (Space/Enter)
 * - Respects prefers-reduced-motion
 * 
 * Usage:
 * ```tsx
 * <AnimatedToggle
 *   checked={isEnabled}
 *   onChange={setIsEnabled}
 *   label="Enable notifications"
 *   size="md"
 * />
 * ```
 */

import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useEffect, useRef, useState } from 'react';
import { Switch } from './switch';
import { Label } from './label';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const toggleVariants = cva(
  'transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'data-[state=checked]:bg-primary',
        success: 'data-[state=checked]:bg-green-600',
        warning: 'data-[state=checked]:bg-yellow-600',
        danger: 'data-[state=checked]:bg-destructive',
      },
      size: {
        sm: 'h-4 w-8',
        md: 'h-5 w-9',
        lg: 'h-6 w-11',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

interface AnimatedToggleProps extends VariantProps<typeof toggleVariants> {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
}

export function AnimatedToggle({
  checked,
  onChange,
  label,
  disabled = false,
  size = 'md',
  variant = 'default',
  className = '',
  ariaLabel,
}: AnimatedToggleProps) {
  const prefersReducedMotion = useReducedMotion();
  const switchRef = useRef<HTMLButtonElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (switchRef.current && !prefersReducedMotion && isAnimating) {
      const thumb = switchRef.current.querySelector('[data-state]') as HTMLElement;
      if (thumb) {
        thumb.animate(
          [
            { transform: checked ? 'translateX(100%) scale(1)' : 'translateX(0) scale(1)' },
            { transform: checked ? 'translateX(95%) scale(1.1)' : 'translateX(5%) scale(1.1)' },
            { transform: checked ? 'translateX(100%) scale(1)' : 'translateX(0) scale(1)' },
          ],
          {
            duration: 200,
            easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
          }
        );
      }
      setIsAnimating(false);
    }
  }, [checked, prefersReducedMotion, isAnimating]);

  const handleToggle = (newChecked: boolean) => {
    if (disabled) return;
    setIsAnimating(true);
    onChange(newChecked);
  };

  const textSizeConfig = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <div className={cn('inline-flex items-center gap-3', className)}>
      <Switch
        ref={switchRef}
        checked={checked}
        onCheckedChange={handleToggle}
        disabled={disabled}
        className={cn(
          toggleVariants({ variant, size }),
          disabled && 'cursor-not-allowed'
        )}
        aria-label={ariaLabel || label}
      />

      {label && (
        <Label
          className={cn(
            textSizeConfig[size || 'md'],
            disabled ? 'text-muted-foreground cursor-not-allowed' : 'cursor-pointer',
            'select-none'
          )}
          onClick={!disabled ? () => handleToggle(!checked) : undefined}
        >
          {label}
        </Label>
      )}
    </div>
  );
}

/**
 * AnimatedToggleGroup Component
 * Group of related toggles with labels
 */
interface ToggleOption {
  id: string;
  label: string;
  checked: boolean;
  disabled?: boolean;
}

interface AnimatedToggleGroupProps {
  options: ToggleOption[];
  onChange: (id: string, checked: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'danger';
  className?: string;
}

export function AnimatedToggleGroup({
  options,
  onChange,
  size = 'md',
  variant = 'default',
  className = '',
}: AnimatedToggleGroupProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {options.map((option) => (
        <AnimatedToggle
          key={option.id}
          checked={option.checked}
          onChange={(checked) => onChange(option.id, checked)}
          label={option.label}
          disabled={option.disabled}
          size={size}
          variant={variant}
        />
      ))}
    </div>
  );
}
