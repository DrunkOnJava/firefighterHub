interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  direction?: 'horizontal' | 'vertical';
}

/**
 * RadioGroup - WCAG 2.5.5 compliant radio button group with 44×44px touch targets
 * 
 * Features:
 * - Minimum 44×44px clickable area per option (WCAG 2.5.5 AA)
 * - Keyboard navigation (arrow keys)
 * - Hover state on entire label
 * - Focus ring for accessibility
 * - Flexible layout (horizontal/vertical)
 * 
 * @example
 * ```tsx
 * <RadioGroup
 *   name="duration"
 *   value={duration}
 *   onChange={setDuration}
 *   options={[
 *     { value: '12h', label: '12 Hours' },
 *     { value: '24h', label: '24 Hours' },
 *   ]}
 * />
 * ```
 */
export const RadioGroup = ({
  name,
  options,
  value,
  onChange,
  className = '',
  direction = 'vertical',
}: RadioGroupProps) => {
  const containerClasses = direction === 'horizontal'
    ? 'flex flex-wrap gap-4'
    : 'flex flex-col gap-2';

  return (
    <div className={`${containerClasses} ${className}`} role="radiogroup">
      {options.map((option) => {
        const inputId = `${name}-${option.value}`;
        const isChecked = value === option.value;
        const isDisabled = option.disabled || false;

        return (
          <label
            key={option.value}
            htmlFor={inputId}
            className={`
              inline-flex items-center
              min-h-[44px] min-w-[44px]
              py-2 px-1
              cursor-pointer group
              rounded-md
              hover:bg-slate-800/50
              dark:hover:bg-slate-700/30
              transition-colors
              ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <input
              id={inputId}
              type="radio"
              name={name}
              value={option.value}
              checked={isChecked}
              onChange={(e) => onChange(e.target.value)}
              disabled={isDisabled}
              className="
                w-4 h-4
                border-slate-300
                text-blue-600
                focus:ring-blue-500 focus:ring-2 focus:ring-offset-2
                dark:border-slate-600 dark:bg-slate-700
                dark:focus:ring-offset-slate-900
                cursor-pointer
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors
              "
            />
            <span className="ml-3 text-sm text-slate-300 group-hover:text-white transition-colors">
              {option.label}
            </span>
          </label>
        );
      })}
    </div>
  );
};
