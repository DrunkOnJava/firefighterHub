/**
 * Visual Typography Utilities
 * 
 * These classes provide visual hierarchy WITHOUT semantic meaning.
 * Use when you need heading-styled text but the element is not a heading.
 * 
 * Example:
 *   <p className={visualHeadings.displayLarge}>Big Text</p>  // Looks like H1, but isn't
 *   <div className={visualHeadings.titleMedium}>Title</div>  // Looks like H2, but isn't
 */

export const visualHeadings = {
  // Display Sizes (H1 equivalent - largest)
  displayLarge: 'text-4xl sm:text-5xl font-bold leading-tight tracking-tight',
  displayMedium: 'text-3xl sm:text-4xl font-bold leading-tight tracking-tight',
  displaySmall: 'text-2xl sm:text-3xl font-bold leading-snug',
  
  // Title Sizes (H2 equivalent - large)
  titleLarge: 'text-2xl font-bold leading-snug',
  titleMedium: 'text-xl font-bold leading-snug',
  titleSmall: 'text-lg font-semibold leading-normal',
  
  // Subtitle Sizes (H3 equivalent - medium)
  subtitleLarge: 'text-lg font-semibold leading-normal',
  subtitleMedium: 'text-base font-semibold leading-normal',
  subtitleSmall: 'text-sm font-semibold leading-normal',
  
  // Body Text Variations
  bodyLarge: 'text-lg font-normal leading-relaxed',
  bodyMedium: 'text-base font-normal leading-relaxed',
  bodySmall: 'text-sm font-normal leading-relaxed',
  
  // Special Purpose
  caption: 'text-xs font-medium leading-tight',
  overline: 'text-xs font-bold uppercase tracking-wider leading-tight',
  label: 'text-sm font-medium leading-normal',
  
  // Metric/Number Display
  metricLarge: 'text-5xl sm:text-6xl font-bold tabular-nums',
  metricMedium: 'text-4xl font-bold tabular-nums',
  metricSmall: 'text-2xl font-semibold tabular-nums',
} as const;

/**
 * Usage Examples:
 * 
 * 1. Position indicator (needs big text, not a heading):
 *    <div className={visualHeadings.displayLarge}>Position: 1</div>
 * 
 * 2. Card title (styling only, not document structure):
 *    <div className={visualHeadings.titleMedium}>John Doe</div>
 * 
 * 3. Form label (styled like H3 but semantically a label):
 *    <label className={visualHeadings.subtitleMedium}>Station</label>
 * 
 * 4. Metric display:
 *    <p className={visualHeadings.metricLarge}>24</p>
 *    <span className={visualHeadings.caption}>Total Holds</span>
 */

// Type for autocomplete
export type VisualHeadingKey = keyof typeof visualHeadings;
