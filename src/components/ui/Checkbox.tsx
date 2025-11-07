/**
 * Checkbox Component
 * 
 * WCAG 2.5.5 compliant checkbox with 44×44px minimum touch target.
 * Wraps native checkbox in larger label for better mobile usability.
 * 
 * Features:
 * - Touch-friendly 44×44px minimum clickable area
 * - Visual 16×16px checkbox (standard size)
 * - Optional description text
 * - Hover feedback
 * - Focus indicators
 * - Disabled state support
 * 
 * Usage:
 * ```tsx
 * <Checkbox
 *   label="Engine"
 *   description="Certified to operate engine apparatus"
 *   checked={certs.engine}
 *   onChange={(checked) => setCerts({ ...certs, engine: checked })}
 * />
 * ```
 */

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  description?: string;
  isDarkMode?: boolean;
}

export const Checkbox = ({
  label,
  checked,
  onChange,
  disabled = false,
  description,
  isDarkMode = true,
}: CheckboxProps) => {
  // Container classes - creates 44×44px touch target
  const containerClasses = `
    flex items-start gap-3
    min-h-[44px] py-2 px-2
    rounded-md
    cursor-pointer group
    transition-colors
    ${isDarkMode
      ? 'hover:bg-slate-800/50'
      : 'hover:bg-gray-50'
    }
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
  `;

  // Label text classes
  const labelTextClasses = `
    text-sm
    transition-colors
    ${isDarkMode
      ? 'text-gray-300 group-hover:text-white'
      : 'text-gray-700 group-hover:text-gray-900'
    }
  `;

  // Description text classes
  const descriptionClasses = `
    mt-1 text-xs
    ${isDarkMode
      ? 'text-gray-500'
      : 'text-gray-600'
    }
  `;

  // Checkbox input classes
  const checkboxClasses = `
    mt-0.5 w-4 h-4
    rounded border-gray-300
    focus:ring-blue-500 focus:ring-2
    cursor-pointer
    disabled:cursor-not-allowed
    ${isDarkMode
      ? 'text-blue-600 bg-gray-800 border-gray-600'
      : 'text-blue-600 bg-white'
    }
  `;

  return (
    <label className={containerClasses}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className={checkboxClasses}
        aria-describedby={description ? `${label}-desc` : undefined}
      />
      <div className="flex-1">
        <span className={labelTextClasses}>
          {label}
        </span>
        {description && (
          <p id={`${label}-desc`} className={descriptionClasses}>
            {description}
          </p>
        )}
      </div>
    </label>
  );
};
