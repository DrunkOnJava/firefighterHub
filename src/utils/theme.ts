export interface Theme {
  // Main backgrounds
  appBackground: string;
  cardBackground: string;
  cardBorder: string;

  // Text colors
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;

  // Button styles
  button: {
    primary: string;
    secondary: string;
    danger: string;
  };

  // Input styles
  input: {
    background: string;
    border: string;
    text: string;
    placeholder: string;
  };

  // Modal styles
  modal: {
    overlay: string;
    background: string;
    border: string;
  };

  // Badge styles
  badge: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };
}

export function getTheme(isDarkMode: boolean): Theme {
  if (isDarkMode) {
    return {
      appBackground: "bg-gradient-to-br from-gray-900 via-gray-900 to-black",
      cardBackground: "bg-gradient-to-br from-gray-800 to-gray-850",
      cardBorder: "border-gray-700",

      textPrimary: "text-gray-50",
      textSecondary: "text-gray-300",
      textTertiary: "text-gray-400",

      button: {
        primary:
          "bg-red-700 hover:bg-red-600 text-white shadow-lg shadow-red-900/50",
        secondary: "bg-gray-700 hover:bg-gray-600 text-gray-100",
        danger: "bg-red-700 hover:bg-red-600 text-white",
      },

      input: {
        background: "bg-gray-900",
        border: "border-gray-600",
        text: "text-gray-100",
        placeholder: "placeholder-gray-500",
      },

      modal: {
        overlay: "bg-black/75",
        background: "bg-gradient-to-br from-gray-800 to-gray-850",
        border: "border-gray-700",
      },

      badge: {
        success: "bg-emerald-950/80 text-emerald-300 border-emerald-800",
        warning: "bg-amber-950/80 text-amber-300 border-amber-800",
        error: "bg-red-950/80 text-red-300 border-red-800",
        info: "bg-gray-800/80 text-gray-300 border-gray-700",
      },
    };
  }

  // Light mode - Firefighter themed
  return {
    appBackground: "bg-gradient-to-br from-gray-800 via-gray-850 to-gray-900",
    cardBackground: "bg-gray-800",
    cardBorder: "border-gray-700",

    textPrimary: "text-gray-50",
    textSecondary: "text-gray-300",
    textTertiary: "text-gray-400",

    button: {
      primary: "bg-red-600 hover:bg-red-700 text-white",
      secondary: "bg-gray-700 hover:bg-gray-600 text-gray-100",
      danger: "bg-red-600 hover:bg-red-700 text-white",
    },

    input: {
      background: "bg-gray-900",
      border: "border-gray-600",
      text: "text-gray-100",
      placeholder: "placeholder-gray-500",
    },

    modal: {
      overlay: "bg-black/75",
      background: "bg-gray-800",
      border: "border-gray-700",
    },

    badge: {
      success: "bg-emerald-100 text-emerald-700 border-emerald-400",
      warning: "bg-amber-100 text-amber-700 border-amber-400",
      error: "bg-red-100 text-red-700 border-red-400",
      info: "bg-gray-300 text-gray-800 border-gray-500",
    },
  };
}
