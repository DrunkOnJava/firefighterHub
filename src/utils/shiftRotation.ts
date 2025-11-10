/**
 * Shift Rotation Logic
 * 
 * Calculates which shift (A, B, or C) is working on any given date
 * based on a standard fire department rotation schedule.
 * 
 * Standard Pattern: Each shift works 24 hours on, 48 hours off
 * Rotation: A → B → C → A...
 * 
 * This creates a 3-day cycle where each shift works 1 day and is off 2 days.
 */

import { Shift } from "../lib/supabase";

// Reference date where we know which shift was working
// Adjust this to match your department's actual rotation start
const ROTATION_START_DATE = new Date('2025-01-01'); // Jan 1, 2025 = Shift A
const ROTATION_START_SHIFT: Shift = 'A';

const SHIFT_ROTATION_ORDER: Shift[] = ['A', 'B', 'C'];

/**
 * Calculate which shift is working on a given date
 * @param date - The date to check
 * @returns The shift ('A', 'B', or 'C') working on that date
 */
export function getShiftForDate(date: Date): Shift {
  // Normalize both dates to midnight for consistent calculation
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);
  
  const startDate = new Date(ROTATION_START_DATE);
  startDate.setHours(0, 0, 0, 0);
  
  // Calculate days between start date and target date
  const diffTime = targetDate.getTime() - startDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  // Find starting shift index
  const startShiftIndex = SHIFT_ROTATION_ORDER.indexOf(ROTATION_START_SHIFT);
  
  // Calculate which shift is working (3-day rotation)
  const rotationDays = ((diffDays % 3) + 3) % 3; // Handle negative days
  const shiftIndex = (startShiftIndex + rotationDays) % 3;
  
  return SHIFT_ROTATION_ORDER[shiftIndex];
}

/**
 * Get the color classes for a shift (consistent with ShiftSelector)
 */
export function getShiftColor(shift: Shift): {
  badge: string;
  text: string;
  border: string;
  bg: string;
  dot: string;
} {
  const colors = {
    A: {
      badge: 'bg-red-500 text-white',
      text: 'text-red-500',
      border: 'border-red-500',
      bg: 'bg-red-500/10',
      dot: 'bg-red-500',
    },
    B: {
      badge: 'bg-rose-500 text-white',
      text: 'text-rose-500',
      border: 'border-rose-500',
      bg: 'bg-rose-500/10',
      dot: 'bg-rose-500',
    },
    C: {
      badge: 'bg-blue-500 text-white',
      text: 'text-blue-500',
      border: 'border-blue-500',
      bg: 'bg-blue-500/10',
      dot: 'bg-blue-500',
    },
  };
  
  return colors[shift];
}

/**
 * Check if a specific shift is working on a given date
 */
export function isShiftWorking(date: Date, shift: Shift): boolean {
  return getShiftForDate(date) === shift;
}
