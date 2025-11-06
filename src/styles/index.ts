/**
 * Design System Barrel Export
 *
 * NOW EXPORTS MaterialM color system by default!
 *
 * Import design tokens and MaterialM colors:
 *
 * ```tsx
 * import { tokens, colors } from '@/styles';
 *
 * // MaterialM colors are now the default
 * // Legacy color system available via ./colorSystem if needed
 * ```
 */

export { tokens } from './tokens';
export { colorsM3 as colors } from './colorSystemM3';  // MaterialM colors!
export { colors as colorsLegacy } from './colorSystem'; // Legacy fallback
export type { Tokens } from './tokens';

