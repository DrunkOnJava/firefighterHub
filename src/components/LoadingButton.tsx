/**
 * LoadingButton - Button with Loading State
 *
 * Button component with loading state and spinner.
 * Uses MaterialM design system.
 *
 * @example
 * ```tsx
 * <LoadingButton
 *   isLoading={isSaving}
 *   loadingText="Saving..."
 *   variant="primary"
 *   onClick={handleSave}
 * >
 *   Save Changes
 * </LoadingButton>
 * ```
 */

import { ButtonHTMLAttributes, ReactNode } from 'react';
import { ButtonM3, type ButtonM3Color } from './m3/ButtonM3';

interface LoadingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
}

export function LoadingButton({
  isLoading = false,
  loadingText,
  children,
  variant = 'primary',
  className = '',
  disabled,
  ...props
}: LoadingButtonProps) {
  // Map legacy variants to MaterialM colors
  let materialMColor: ButtonM3Color = 'primary';

  switch (variant) {
    case 'primary':
      materialMColor = 'primary';
      break;
    case 'secondary':
      materialMColor = 'secondary';
      break;
    case 'danger':
      materialMColor = 'error';
      break;
    case 'success':
      materialMColor = 'success';
      break;
  }

  return (
    <ButtonM3
      color={materialMColor}
      loading={isLoading}
      disabled={disabled}
      className={className}
      onClick={props.onClick}
      type={props.type}
    >
      {isLoading && loadingText ? loadingText : children}
    </ButtonM3>
  );
}
