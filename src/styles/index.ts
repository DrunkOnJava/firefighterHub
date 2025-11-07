/**
 * Design System Barrel Export
 * 
 * Import design tokens and colors from a single location:
 * 
 * ```tsx
 * import { tokens, colors } from '@/styles';
 * 
 * // Use tokens
 * <div className={tokens.spacing.card.md}>
 *   Content
 * </div>
 * 
 * // Use colors
 * <button className={colors.components.button.primary}>
 *   Click
 * </button>
 * ```
 */

export { tokens } from './tokens';
export { colors } from './colorSystem';
export { visualHeadings } from './visualHeadings';
export * from './gridSystem';
export { grid, gridUtilities, alignmentUtilities, spacingUtilities, responsiveUtilities } from './gridUtilities';

export type { Tokens } from './tokens';
export type { Colors } from './colorSystem';
export type { VisualHeadingKey } from './visualHeadings';
export type { GridSystem } from './gridSystem';

