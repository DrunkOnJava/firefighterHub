/**
 * Custom hook for managing dark mode state with localStorage persistence
 * Follows best practices: single responsibility, reusable, type-safe
 */

import { useEffect, useState } from "react";
import { STORAGE_KEYS } from "../config/constants";

export function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DARK_MODE);
    return saved !== "false"; // Default to true (dark mode) if not set
  });

  // Persist dark mode preference to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DARK_MODE, String(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  return { isDarkMode, setIsDarkMode, toggleDarkMode };
}
