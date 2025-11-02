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
export type { Tokens } from './tokens';
export type { Colors } from './colorSystem';

