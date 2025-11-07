interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
}

/**
 * Checkbox - WCAG 2.5.5 compliant checkbox with 44×44px minimum touch target
 * 
 * Features:
 * - Minimum 44×44px clickable area via large label (WCAG 2.5.5 AA)
 * - Hover state on entire label for better UX
 * - Focus ring for keyboard navigation
 * - Disabled state support
 * - Accessible labeling
 * 
 * @example
 * ```tsx
 * <Checkbox
 *   label="Engine certified"
 *   checked={isEngineCertified}
 *   onChange={setIsEngineCertified}
 * />
 * ```
 */
export const Checkbox = ({
  label,
  checked,
  onChange,
  disabled = false,
  className = '',
  id,
}: CheckboxProps) => {
  const inputId = id || `checkbox-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <label
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
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      <input
        id={inputId}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="
          w-4 h-4
          rounded border-gray-300
          text-blue-600 
          focus:ring-blue-500 focus:ring-2 focus:ring-offset-2
          dark:border-gray-600 dark:bg-slate-700
          dark:focus:ring-offset-slate-900
          cursor-pointer
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors
        "
      />
      <span className="ml-3 text-sm text-gray-300 group-hover:text-white transition-colors">
        {label}
      </span>
    </label>
  );
};
