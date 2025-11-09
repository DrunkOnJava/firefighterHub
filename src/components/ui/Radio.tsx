/**
 * Radio Component
 * 
 * WCAG 2.5.5 compliant radio button with 44×44px minimum touch target.
 * Wraps native radio in larger label for better mobile usability.
 * Migrated to shadcn RadioGroup with semantic colors.
 * 
 * Features:
 * - Touch-friendly 44×44px minimum clickable area
 * - Visual 16×16px radio (standard size)
 * - Optional description text
 * - Hover feedback
 * - Focus indicators
 * - Disabled state support
 * 
 * Usage:
 * ```tsx
 * <Radio
 *   name="duration"
 *   value="12h"
 *   label="12 Hours"
 *   description="Half-day hold"
 *   checked={duration === '12h'}
 *   onChange={(value) => setDuration(value)}
 * />
 * ```
 */

import { RadioGroupItem } from './radio-group';
import { Label } from './label';
import { cn } from '@/lib/utils';

interface RadioProps {
  name: string;
  value: string;
  label: string;
  checked: boolean;
  onChange: (value: string) => void;
  disabled?: boolean;
  description?: string;
  /** @deprecated No longer needed - uses Tailwind dark: variants */
  isDarkMode?: boolean;
}

export const Radio = ({
  name,
  value,
  label,
  checked,
  onChange,
  disabled = false,
  description,
}: RadioProps) => {
  return (
    <label
      className={cn(
        'flex items-start gap-3',
        'min-h-[44px] py-2 px-2',
        'rounded-md cursor-pointer group transition-colors',
        'hover:bg-accent',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      <RadioGroupItem
        id={`${name}-${value}`}
        value={value}
        checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(value)}
        className="mt-0.5"
      />
      <div className="flex-1">
        <Label
          htmlFor={`${name}-${value}`}
          className={cn(
            'text-sm transition-colors cursor-pointer',
            'group-hover:text-foreground',
            disabled && 'cursor-not-allowed'
          )}
        >
          {label}
        </Label>
        {description && (
          <p
            id={`${name}-${value}-desc`}
            className="mt-1 text-xs text-muted-foreground"
          >
            {description}
          </p>
        )}
      </div>
    </label>
  );
};
