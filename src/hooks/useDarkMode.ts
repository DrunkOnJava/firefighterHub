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

  // Apply dark class to document and persist preference
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DARK_MODE, String(isDarkMode));
    
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  return { isDarkMode, setIsDarkMode, toggleDarkMode };
}
