/**
 * UI Components Library - Index
 * 
 * Central export point for all animated UI components.
 * Import from here for consistency and tree-shaking optimization.
 * 
 * Usage:
 * ```tsx
 * import { AnimatedButton, Spinner, ProgressBar } from './components/ui';
 * ```
 */

// Button Components
export { AnimatedButton, AsyncButton } from './AnimatedButton';
export type { ButtonState, ButtonVariant, ButtonSize } from './AnimatedButton';

// Toggle Components
export { AnimatedToggle, AnimatedToggleGroup } from './AnimatedToggle';

// Input Components
export { AnimatedInput, AnimatedInputGroup } from './AnimatedInput';

// Loading Components
export { Spinner, SpinnerOverlay } from './Spinner';
export { ProgressBar, CircularProgress } from './ProgressBar';
export { PulseLoader, BarLoader, ClockLoader } from './PulseLoader';

// Skeleton Components
export {
  Skeleton,
  SkeletonCard,
  SkeletonTable,
  SkeletonList,
  SkeletonCalendar,
} from './Skeleton';

// Visual Hierarchy Audit - WCAG 2.5.5 Compliant Components
export { IconButton } from './IconButton';
export { Checkbox } from './Checkbox';
export { Radio } from './Radio';
export { FloatingActionButton } from './FloatingActionButton';
