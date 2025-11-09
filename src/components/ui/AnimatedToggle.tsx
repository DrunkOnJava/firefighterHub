/**
 * AnimatedToggle Component
 * 
 * Smooth toggle switch with spring physics and haptic-style feedback.
 * 
 * Features:
 * - Smooth slide animation (200ms ease-out)
 * - Spring physics for thumb movement
 * - Background color transition
 * - Haptic-style bounce effect
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

import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useEffect, useRef, useState } from 'react';
import '../../styles/animations.css';

interface AnimatedToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'danger';
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
  const toggleRef = useRef<HTMLButtonElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Trigger haptic-style bounce on toggle
  useEffect(() => {
    if (toggleRef.current && !prefersReducedMotion && isAnimating) {
      const thumb = toggleRef.current.querySelector('.toggle-thumb') as HTMLElement;
      if (thumb) {
        thumb.animate(
          [
            { transform: checked ? 'translateX(100%) scale(1)' : 'translateX(0) scale(1)' },
            { transform: checked ? 'translateX(95%) scale(1.1)' : 'translateX(5%) scale(1.1)' },
            { transform: checked ? 'translateX(100%) scale(1)' : 'translateX(0) scale(1)' },
          ],
          {
            duration: 200,
            easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)', // Spring easing
          }
        );
      }
      setIsAnimating(false);
    }
  }, [checked, prefersReducedMotion, isAnimating]);

  const handleToggle = () => {
    if (disabled) return;
    setIsAnimating(true);
    onChange(!checked);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      setIsAnimating(true);
      onChange(!checked);
    }
  };

  // Size configurations
  const sizeConfig = {
    sm: {
      track: 'w-9 h-5',
      thumb: 'w-4 h-4',
      translate: 'translate-x-4',
      text: 'text-sm',
    },
    md: {
      track: 'w-11 h-6',
      thumb: 'w-5 h-5',
      translate: 'translate-x-5',
      text: 'text-base',
    },
    lg: {
      track: 'w-14 h-7',
      thumb: 'w-6 h-6',
      translate: 'translate-x-7',
      text: 'text-lg',
    },
  };

  const config = sizeConfig[size];

  // Variant colors
  const variantColors = {
    default: checked
      ? 'bg-blue-600 dark:bg-blue-500'
      : 'bg-gray-300 dark:bg-slate-600',
    success: checked
      ? 'bg-green-600 dark:bg-green-500'
      : 'bg-gray-300 dark:bg-slate-600',
    warning: checked
      ? 'bg-yellow-600 dark:bg-yellow-500'
      : 'bg-gray-300 dark:bg-slate-600',
    danger: checked
      ? 'bg-red-600 dark:bg-red-500'
      : 'bg-gray-300 dark:bg-slate-600',
  };

  const transitionClasses = prefersReducedMotion
    ? ''
    : 'transition-all duration-200 ease-out';

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <button
        ref={toggleRef}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={ariaLabel || label}
        disabled={disabled}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        className={`
          relative inline-flex items-center rounded-full
          ${config.track}
          ${variantColors[variant]}
          ${transitionClasses}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
          ${!disabled && 'hover:shadow-md'}
        `}
      >
        {/* Thumb */}
        <span
          className={`
            toggle-thumb
            inline-block
            ${config.thumb}
            transform rounded-full
            bg-white shadow-lg
            ${checked ? config.translate : 'translate-x-0.5'}
            ${transitionClasses}
            ${!prefersReducedMotion && 'will-change-transform'}
          `}
          aria-hidden="true"
        />
      </button>

      {/* Label */}
      {label && (
        <label
          className={`
            ${config.text}
            ${disabled ? 'text-slate-400 cursor-not-allowed' : 'text-slate-700 dark:text-slate-300 cursor-pointer'}
            select-none
          `}
          onClick={!disabled ? handleToggle : undefined}
        >
          {label}
        </label>
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
    <div className={`space-y-3 ${className}`}>
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
