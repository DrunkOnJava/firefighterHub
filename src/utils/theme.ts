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
      appBackground: 'bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800',
      cardBackground: 'bg-gradient-to-br from-slate-800 to-slate-850',
      cardBorder: 'border-slate-700',

      textPrimary: 'text-slate-50',
      textSecondary: 'text-slate-300',
      textTertiary: 'text-slate-400',

      button: {
        primary: 'bg-red-700 hover:bg-red-600 text-white shadow-lg shadow-red-900/50',
        secondary: 'bg-slate-700 hover:bg-slate-600 text-slate-100',
        danger: 'bg-red-700 hover:bg-red-600 text-white',
      },

      input: {
        background: 'bg-slate-900',
        border: 'border-slate-600',
        text: 'text-slate-100',
        placeholder: 'placeholder-slate-500',
      },

      modal: {
        overlay: 'bg-black/75',
        background: 'bg-gradient-to-br from-slate-800 to-slate-850',
        border: 'border-slate-700',
      },

      badge: {
        success: 'bg-emerald-950/80 text-emerald-300 border-emerald-800',
        warning: 'bg-amber-950/80 text-amber-300 border-amber-800',
        error: 'bg-red-950/80 text-red-300 border-red-800',
        info: 'bg-sky-950/80 text-sky-300 border-sky-800',
      },
    };
  }

  // Light mode - Firefighter themed
  return {
    appBackground: 'bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100',
    cardBackground: 'bg-white',
    cardBorder: 'border-slate-300',

    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-600',
    textTertiary: 'text-slate-500',

    button: {
      primary: 'bg-red-600 hover:bg-red-700 text-white',
      secondary: 'bg-slate-200 hover:bg-slate-300 text-slate-900',
      danger: 'bg-red-600 hover:bg-red-700 text-white',
    },

    input: {
      background: 'bg-white',
      border: 'border-slate-300',
      text: 'text-slate-900',
      placeholder: 'placeholder-slate-400',
    },

    modal: {
      overlay: 'bg-black/50',
      background: 'bg-white',
      border: 'border-slate-300',
    },

    badge: {
      success: 'bg-emerald-100 text-emerald-700 border-emerald-400',
      warning: 'bg-amber-100 text-amber-700 border-amber-400',
      error: 'bg-red-100 text-red-700 border-red-400',
      info: 'bg-blue-100 text-blue-700 border-blue-400',
    },
  };
}
