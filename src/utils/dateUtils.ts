/**
 * Date utility functions for consistent date handling across the application
 *
 * IMPORTANT: All dates are stored in the database as YYYY-MM-DD strings (no time component)
 * When JavaScript parses "2024-01-15", it treats it as UTC midnight
 * Converting UTC midnight to local time can shift to the previous day
 *
 * Solution: Always display dates in UTC timezone to match how they're stored
 */

/**
 * Format a hold date string for consistent display
 * @param dateString Date string from database (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss format)
 * @returns Formatted date string (e.g., "Jan 15, 2024")
 */
export function formatHoldDate(dateString: string | null | undefined): string {
  if (!dateString) return 'N/A';

  try {
    // Ensure we're parsing as UTC by adding 'Z' if no time component
    const utcDateString = dateString.includes('T')
      ? dateString
      : dateString + 'T00:00:00Z';

    const date = new Date(utcDateString);

    // Format in UTC timezone to avoid day-shift issues
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC"  // ✅ Always use UTC to match database storage
    });
  } catch (error) {
    console.error('Error formatting date:', dateString, error);
    return dateString;
  }
}

/**
 * Format a hold date for display with full month name
 * @param dateString Date string from database
 * @returns Formatted date string (e.g., "January 15, 2024")
 */
export function formatHoldDateLong(dateString: string | null | undefined): string {
  if (!dateString) return 'N/A';

  try {
    const utcDateString = dateString.includes('T')
      ? dateString
      : dateString + 'T00:00:00Z';

    const date = new Date(utcDateString);

    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC"
    });
  } catch (error) {
    console.error('Error formatting date:', dateString, error);
    return dateString;
  }
}

/**
 * Format a hold date for display without year (for recent dates)
 * @param dateString Date string from database
 * @returns Formatted date string (e.g., "Jan 15")
 */
export function formatHoldDateShort(dateString: string | null | undefined): string {
  if (!dateString) return 'N/A';

  try {
    const utcDateString = dateString.includes('T')
      ? dateString
      : dateString + 'T00:00:00Z';

    const date = new Date(utcDateString);

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      timeZone: "UTC"
    });
  } catch (error) {
    console.error('Error formatting date:', dateString, error);
    return dateString;
  }
}

/**
 * Get the day of week for a hold date
 * @param dateString Date string from database
 * @returns Day of week (e.g., "Monday")
 */
export function getHoldDayOfWeek(dateString: string): string {
  try {
    const utcDateString = dateString.includes('T')
      ? dateString
      : dateString + 'T00:00:00Z';

    const date = new Date(utcDateString);

    return date.toLocaleDateString("en-US", {
      weekday: "long",
      timeZone: "UTC"
    });
  } catch (error) {
    console.error('Error getting day of week:', dateString, error);
    return '';
  }
}

/**
 * Check if a date string is valid
 * @param dateString Date string to validate
 * @returns true if valid, false otherwise
 */
export function isValidDate(dateString: string | null | undefined): boolean {
  if (!dateString) return false;

  try {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  } catch {
    return false;
  }
}
