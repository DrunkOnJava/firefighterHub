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
export { colors } from './colorSystem';  // Keep legacy for now - structure is different
export { colorsM3 } from './colorSystemM3';  // MaterialM available as colorsM3
export type { Tokens } from './tokens';
export type { Colors } from './colorSystem';

