/**
 * MaterialM Color Conversion Utilities
 *
 * Helper functions for converting current design tokens to MaterialM equivalents.
 * Useful during migration to ensure consistent color mapping.
 *
 * @example
 * ```tsx
 * // Convert Tailwind classes
 * const materialMClass = convertColorToM3('bg-slate-700');
 * // Returns: 'bg-materialm-dark'
 *
 * // Convert semantic colors
 * const buttonColor = convertSemanticToM3('error');
 * // Returns: 'error' (M3 color)
 * ```
 */

/**
 * Tailwind to MaterialM Class Mapping
 *
 * Maps current Tailwind color classes to MaterialM equivalents.
 */
const tailwindToM3Map: Record<string, string> = {
  // Background colors
  'bg-slate-700': 'bg-materialm-dark',
  'bg-slate-800': 'bg-materialm-dark',
  'bg-slate-900': 'bg-materialm-dark',
  'bg-slate-825': 'bg-materialm-dark',
  'bg-slate-850': 'bg-materialm-dark',
  'bg-slate-875': 'bg-materialm-dark',

  // Text colors
  'text-slate-100': 'text-gray-100', // Keep gray for text
  'text-slate-200': 'text-gray-200',
  'text-slate-300': 'text-gray-300',
  'text-slate-400': 'text-gray-400',

  // Primary colors
  'bg-blue-600': 'bg-materialm-primary',
  'bg-blue-700': 'bg-materialm-primary-emphasis',
  'text-blue-600': 'text-materialm-primary',
  'border-blue-600': 'border-materialm-primary',

  // Secondary colors
  'bg-purple-600': 'bg-materialm-secondary',
  'bg-purple-700': 'bg-materialm-secondary-emphasis',
  'text-purple-600': 'text-materialm-secondary',

  // Success colors
  'bg-emerald-600': 'bg-materialm-success',
  'bg-green-600': 'bg-materialm-success',
  'text-emerald-600': 'text-materialm-success',
  'text-green-600': 'text-materialm-success',

  // Error colors
  'bg-red-600': 'bg-materialm-error',
  'bg-red-500': 'bg-materialm-error',
  'text-red-600': 'text-materialm-error',
  'text-red-500': 'text-materialm-error',

  // Warning colors
  'bg-amber-600': 'bg-materialm-warning',
  'bg-yellow-600': 'bg-materialm-warning',
  'text-amber-600': 'text-materialm-warning',

  // Info colors
  'bg-cyan-600': 'bg-materialm-info',
  'text-cyan-600': 'text-materialm-info',

  // Border colors
  'border-slate-600': 'border-materialm-border-dark',
  'border-slate-700': 'border-materialm-border-dark',
  'border-gray-300': 'border-materialm-border',
};

/**
 * Semantic Color Mapping
 *
 * Maps current semantic color names to MaterialM color names.
 */
const semanticToM3Map: Record<string, string> = {
  primary: 'primary',
  secondary: 'secondary',
  success: 'success',
  error: 'error',
  warning: 'warning',
  info: 'info',
  neutral: 'neutral',
  // Legacy mappings
  danger: 'error',
  default: 'neutral',
};

/**
 * Convert Tailwind Class to MaterialM
 *
 * Converts a single Tailwind color class to its MaterialM equivalent.
 *
 * @param tailwindClass - Tailwind color class (e.g., 'bg-slate-700')
 * @returns MaterialM equivalent or original if no mapping exists
 */
export function convertColorToM3(tailwindClass: string): string {
  return tailwindToM3Map[tailwindClass] || tailwindClass;
}

/**
 * Convert Multiple Tailwind Classes
 *
 * Converts a space-separated string of Tailwind classes.
 *
 * @param classString - Space-separated Tailwind classes
 * @returns Converted class string
 *
 * @example
 * ```ts
 * convertClassesToM3('bg-slate-700 text-blue-600 border-red-500')
 * // Returns: 'bg-materialm-dark text-materialm-primary border-materialm-error'
 * ```
 */
export function convertClassesToM3(classString: string): string {
  return classString
    .split(' ')
    .map((cls) => convertColorToM3(cls))
    .join(' ');
}

/**
 * Convert Semantic Color Name
 *
 * Converts semantic color names from current system to MaterialM.
 *
 * @param semanticColor - Current semantic color name
 * @returns MaterialM semantic color name
 *
 * @example
 * ```ts
 * convertSemanticToM3('danger') // Returns: 'error'
 * convertSemanticToM3('primary') // Returns: 'primary'
 * ```
 */
export function convertSemanticToM3(semanticColor: string): string {
  return semanticToM3Map[semanticColor] || semanticColor;
}

/**
 * Check if Class Uses MaterialM
 *
 * Determines if a class string already uses MaterialM colors.
 *
 * @param classString - Class string to check
 * @returns True if using MaterialM colors
 */
export function isUsingM3(classString: string): boolean {
  return classString.includes('materialm-');
}

/**
 * Get MaterialM Shadow Class
 *
 * Returns the appropriate MaterialM shadow class for elevation level.
 *
 * @param elevation - Elevation level (0-5)
 * @returns MaterialM shadow class
 *
 * @example
 * ```ts
 * getM3Shadow(2) // Returns: 'shadow-materialm-2'
 * ```
 */
export function getM3Shadow(elevation: 0 | 1 | 2 | 3 | 4 | 5): string {
  if (elevation === 0) return '';
  return `shadow-materialm-${elevation}`;
}

/**
 * Get MaterialM Border Radius
 *
 * Returns the appropriate MaterialM border radius class.
 *
 * @param size - Size variant (sm, md, lg)
 * @returns MaterialM border radius class
 */
export function getM3BorderRadius(size: 'sm' | 'md' | 'lg'): string {
  return `rounded-materialm-${size}`;
}

/**
 * Convert Hex Color to OKLCH
 *
 * Approximates hex color conversion to OKLCH format.
 * NOTE: This is a simplified approximation. For precise color conversion,
 * use a dedicated color space conversion library.
 *
 * @param hex - Hex color (e.g., '#FF5733')
 * @returns OKLCH CSS value (approximate)
 */
export function hexToOKLCH(hex: string): string {
  // Remove # if present
  const cleanHex = hex.replace('#', '');

  // Convert hex to RGB
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

  // Simplified OKLCH approximation
  // For production, use a proper color space conversion library
  const lightness = (r * 0.299 + g * 0.587 + b * 0.114) * 100;
  const chroma = Math.max(r, g, b) - Math.min(r, g, b);
  const hue = Math.atan2(g - b, r - g) * (180 / Math.PI);

  return `oklch(${lightness.toFixed(2)}% ${chroma.toFixed(3)} ${hue.toFixed(2)})`;
}

/**
 * Migration Helper: Find Classes to Convert
 *
 * Analyzes a class string and returns classes that should be converted.
 *
 * @param classString - Class string to analyze
 * @returns Array of classes that need conversion
 *
 * @example
 * ```ts
 * findClassesToConvert('bg-slate-700 text-white p-4')
 * // Returns: ['bg-slate-700']
 * ```
 */
export function findClassesToConvert(classString: string): string[] {
  return classString.split(' ').filter((cls) => cls in tailwindToM3Map);
}

/**
 * Get Conversion Suggestions
 *
 * Provides conversion suggestions for a given class string.
 *
 * @param classString - Class string to analyze
 * @returns Array of conversion suggestions
 *
 * @example
 * ```ts
 * getConversionSuggestions('bg-slate-700 text-blue-600')
 * // Returns: [
 * //   { original: 'bg-slate-700', suggestion: 'bg-materialm-dark' },
 * //   { original: 'text-blue-600', suggestion: 'text-materialm-primary' }
 * // ]
 * ```
 */
export function getConversionSuggestions(classString: string): Array<{
  original: string;
  suggestion: string;
}> {
  return findClassesToConvert(classString).map((cls) => ({
    original: cls,
    suggestion: convertColorToM3(cls),
  }));
}

/**
 * Batch Convert Component Classes
 *
 * Converts all color classes in a component's className prop.
 * Preserves non-color classes unchanged.
 *
 * @param className - Original className string
 * @returns Converted className string with MaterialM colors
 *
 * @example
 * ```tsx
 * const originalClass = "bg-slate-700 text-blue-600 p-4 rounded-lg";
 * const materialMClass = batchConvertClasses(originalClass);
 * // Returns: "bg-materialm-dark text-materialm-primary p-4 rounded-lg"
 * ```
 */
export function batchConvertClasses(className: string): string {
  return className
    .split(' ')
    .map((cls) => {
      // If class has a MaterialM mapping, convert it
      if (cls in tailwindToM3Map) {
        return tailwindToM3Map[cls];
      }
      // Otherwise, keep it as-is
      return cls;
    })
    .join(' ');
}

/**
 * Color Palette Reference
 *
 * Exports MaterialM color palette for easy reference in code.
 */
export const m3ColorPalette = {
  backgrounds: {
    dark: 'materialm-dark',
    darkgray: 'materialm-darkgray',
  },
  primary: {
    base: 'materialm-primary',
    emphasis: 'materialm-primary-emphasis',
    light: 'materialm-primary-light',
  },
  secondary: {
    base: 'materialm-secondary',
    emphasis: 'materialm-secondary-emphasis',
    light: 'materialm-secondary-light',
  },
  semantic: {
    info: 'materialm-info',
    success: 'materialm-success',
    warning: 'materialm-warning',
    error: 'materialm-error',
  },
  borders: {
    base: 'materialm-border',
    dark: 'materialm-border-dark',
  },
  text: {
    link: 'materialm-link',
    linkDark: 'materialm-link-dark',
  },
} as const;

/**
 * Quick Class Builder
 *
 * Utility for building MaterialM class strings programmatically.
 *
 * @param classes - Object mapping class types to MaterialM values
 * @returns Combined class string
 *
 * @example
 * ```ts
 * buildM3Classes({
 *   bg: 'materialm-dark',
 *   text: 'gray-100',
 *   padding: 'p-4',
 *   rounded: 'rounded-lg'
 * })
 * // Returns: 'bg-materialm-dark text-gray-100 p-4 rounded-lg'
 * ```
 */
export function buildM3Classes(classes: Record<string, string | undefined>): string {
  return Object.entries(classes)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => {
      // If key is a utility prefix, combine with value
      if (['bg', 'text', 'border'].includes(key)) {
        return `${key}-${value}`;
      }
      // Otherwise, just return the value
      return value;
    })
    .filter(Boolean)
    .join(' ');
}
