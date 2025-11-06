/**
 * InputM3 - MaterialM Form Input Wrapper
 *
 * Wraps Flowbite form components with MaterialM design system patterns.
 * Provides consistent input styling and validation states.
 *
 * @example
 * ```tsx
 * <InputM3
 *   label="Email"
 *   type="email"
 *   placeholder="Enter your email"
 *   helperText="We'll never share your email"
 *   required
 * />
 *
 * <InputM3
 *   label="Password"
 *   type="password"
 *   error="Password must be at least 8 characters"
 * />
 * ```
 */

import { Label, TextInput, Textarea, Select, Checkbox } from 'flowbite-react';
import type { ComponentProps } from 'react';

/**
 * Input sizes
 */
export type InputM3Size = 'sm' | 'md' | 'lg';

/**
 * Base input props shared by all input types
 */
export interface BaseInputM3Props {
  /**
   * Input label
   */
  label?: string;

  /**
   * Helper text shown below the input
   */
  helperText?: string;

  /**
   * Error message (shows input in error state)
   */
  error?: string;

  /**
   * Whether the input is required
   */
  required?: boolean;

  /**
   * Input size
   * @default 'md'
   */
  size?: InputM3Size;

  /**
   * Custom className
   */
  className?: string;
}

/**
 * Text Input Component
 */
export interface InputM3Props
  extends Omit<BaseInputM3Props, 'size'>,
    Omit<ComponentProps<typeof TextInput>, 'sizing' | 'color' | 'size'> {
  /**
   * Input size
   * @default 'md'
   */
  size?: InputM3Size;
  /**
   * Icon to show before input
   */
  startIcon?: React.ReactNode;

  /**
   * Icon to show after input
   */
  endIcon?: React.ReactNode;
}

export function InputM3({
  label,
  helperText,
  error,
  required,
  size = 'md',
  startIcon,
  endIcon,
  className = '',
  id,
  ...props
}: InputM3Props) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  const hasError = !!error;

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <Label htmlFor={inputId}>
          {label}
          {required && <span className="text-materialm-error ml-1">*</span>}
        </Label>
      )}
      <div className="relative">
        {startIcon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            {startIcon}
          </div>
        )}
        <TextInput
          id={inputId}
          sizing={size}
          color={hasError ? 'failure' : undefined}
          className={startIcon ? 'pl-10' : endIcon ? 'pr-10' : ''}
          {...props}
        />
        {endIcon && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            {endIcon}
          </div>
        )}
      </div>
      {(helperText || error) && (
        <p
          className={`text-sm ${error ? 'text-materialm-error' : 'text-materialm-text-secondary'}`}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
}

/**
 * Textarea Component
 */
export interface TextareaM3Props
  extends BaseInputM3Props,
    Omit<ComponentProps<typeof Textarea>, 'color'> {
  /**
   * Number of visible text lines
   * @default 3
   */
  rows?: number;
}

export function TextareaM3({
  label,
  helperText,
  error,
  required,
  className = '',
  id,
  rows = 3,
  ...props
}: TextareaM3Props) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  const hasError = !!error;

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <Label htmlFor={inputId}>
          {label}
          {required && <span className="text-materialm-error ml-1">*</span>}
        </Label>
      )}
      <Textarea
        id={inputId}
        rows={rows}
        color={hasError ? 'failure' : undefined}
        {...props}
      />
      {(helperText || error) && (
        <p
          className={`text-sm ${error ? 'text-materialm-error' : 'text-materialm-text-secondary'}`}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
}

/**
 * Select Component
 */
export interface SelectM3Props
  extends Omit<BaseInputM3Props, 'size'>,
    Omit<ComponentProps<typeof Select>, 'sizing' | 'color' | 'size'> {
  /**
   * Input size
   * @default 'md'
   */
  size?: InputM3Size;
  /**
   * Select options
   */
  options: Array<{ value: string; label: string; disabled?: boolean }>;
}

export function SelectM3({
  label,
  helperText,
  error,
  required,
  size = 'md',
  className = '',
  id,
  options,
  ...props
}: SelectM3Props) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  const hasError = !!error;

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <Label htmlFor={inputId}>
          {label}
          {required && <span className="text-materialm-error ml-1">*</span>}
        </Label>
      )}
      <Select
        id={inputId}
        sizing={size}
        color={hasError ? 'failure' : undefined}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </Select>
      {(helperText || error) && (
        <p
          className={`text-sm ${error ? 'text-materialm-error' : 'text-materialm-text-secondary'}`}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
}

/**
 * Checkbox Component
 */
export interface CheckboxM3Props extends Omit<ComponentProps<typeof Checkbox>, 'color'> {
  /**
   * Checkbox label
   */
  label: string;

  /**
   * Helper text shown below the checkbox
   */
  helperText?: string;

  /**
   * Error message
   */
  error?: string;

  /**
   * Custom className
   */
  className?: string;
}

export function CheckboxM3({
  label,
  helperText,
  error,
  className = '',
  id,
  ...props
}: CheckboxM3Props) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  const hasError = !!error;

  return (
    <div className={`space-y-1 ${className}`}>
      <div className="flex items-center">
        <Checkbox
          id={inputId}
          color={hasError ? 'failure' : undefined}
          {...props}
        />
        <Label htmlFor={inputId} className="ml-2">
          {label}
        </Label>
      </div>
      {(helperText || error) && (
        <p
          className={`text-sm ml-6 ${error ? 'text-materialm-error' : 'text-materialm-text-secondary'}`}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
}

/**
 * Form Group Component
 *
 * Groups related form inputs together.
 *
 * @example
 * ```tsx
 * <FormGroupM3 title="Personal Information">
 *   <InputM3 label="First Name" />
 *   <InputM3 label="Last Name" />
 * </FormGroupM3>
 * ```
 */
export interface FormGroupM3Props {
  /**
   * Group title
   */
  title?: string;

  /**
   * Group description
   */
  description?: string;

  /**
   * Form inputs
   */
  children: React.ReactNode;

  /**
   * Custom className
   */
  className?: string;
}

export function FormGroupM3({
  title,
  description,
  children,
  className = '',
}: FormGroupM3Props) {
  return (
    <div className={`space-y-4 ${className}`}>
      {(title || description) && (
        <div className="space-y-1">
          {title && (
            <h3 className="text-lg font-semibold text-materialm-text">{title}</h3>
          )}
          {description && (
            <p className="text-sm text-materialm-text-secondary">{description}</p>
          )}
        </div>
      )}
      <div className="space-y-4">{children}</div>
    </div>
  );
}

/**
 * Inline Form Component
 *
 * Displays form inputs in a horizontal layout.
 *
 * @example
 * ```tsx
 * <InlineFormM3>
 *   <InputM3 label="Search" placeholder="Search..." />
 *   <ButtonM3>Search</ButtonM3>
 * </InlineFormM3>
 * ```
 */
export interface InlineFormM3Props {
  /**
   * Form inputs
   */
  children: React.ReactNode;

  /**
   * Gap between elements
   * @default 4
   */
  gap?: 2 | 4 | 6 | 8;

  /**
   * Custom className
   */
  className?: string;
}

export function InlineFormM3({ children, gap = 4, className = '' }: InlineFormM3Props) {
  return (
    <div className={`flex items-end gap-${gap} ${className}`}>{children}</div>
  );
}

/**
 * Field Array Component
 *
 * For dynamic lists of form inputs.
 *
 * @example
 * ```tsx
 * <FieldArrayM3
 *   items={items}
 *   onAdd={handleAdd}
 *   onRemove={handleRemove}
 *   renderItem={(item, index) => (
 *     <InputM3 label={`Item ${index + 1}`} value={item} />
 *   )}
 * />
 * ```
 */
export interface FieldArrayM3Props<T> {
  /**
   * Array items
   */
  items: T[];

  /**
   * Callback to add new item
   */
  onAdd: () => void;

  /**
   * Callback to remove item
   */
  onRemove: (index: number) => void;

  /**
   * Render function for each item
   */
  renderItem: (item: T, index: number) => React.ReactNode;

  /**
   * Add button text
   * @default 'Add Item'
   */
  addButtonText?: string;

  /**
   * Custom className
   */
  className?: string;
}

export function FieldArrayM3<T>({
  items,
  onAdd,
  onRemove,
  renderItem,
  addButtonText = 'Add Item',
  className = '',
}: FieldArrayM3Props<T>) {
  return (
    <div className={`space-y-4 ${className}`}>
      {items.map((item, index) => (
        <div key={index} className="flex gap-2 items-start">
          <div className="flex-1">{renderItem(item, index)}</div>
          <button
            onClick={() => onRemove(index)}
            className="px-3 py-1.5 text-sm border border-materialm-error text-materialm-error rounded-lg hover:bg-materialm-error-light dark:hover:bg-materialm-error/20"
            aria-label="Remove item"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        onClick={onAdd}
        className="px-3 py-1.5 text-sm border border-materialm-border-light dark:border-materialm-border-dark rounded-lg hover:bg-materialm-surface-hover dark:hover:bg-materialm-darkgray"
      >
        + {addButtonText}
      </button>
    </div>
  );
}
