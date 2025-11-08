export interface Theme {
  // Main backgrounds
  appBackground: string;
  cardBackground: string;
  cardBorder: string;

  // Text colors
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textMuted: string; // NEW: WCAG AA compliant muted text (5.2:1 dark, 4.7:1 light)

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

  // FirefighterItem specific styles
  firefighterItem: {
    // Card states
    available: string;
    unavailable: string;
    nextInRotation: string;
    nextInRotationBadge: string;

    // Drag states
    dragging: string;
    dragOver: string;

    // Elements
    dragHandle: string;
    title: string;
    outOfRotationBadge: string;

    // Info badges
    stationBadge: string;
    lastHoldBadge: string;
    certificationLabel: string;

    // Certification badges
    ftoBadge: string;
    blsBadge: string;
    alsBadge: string;
    medicalCertBadge: string;

    // Apparatus badges
    apparatusBadge: string;
    rescueSquadBadge: string;

    // Action buttons
    deleteButton: string;
    deleteIcon: string;
    actionButton: string;
    completeHoldButton: string;
  };

  // Calendar specific styles
  calendar: {
    gridBackground: string;
    headerBackground: string;
    headerText: string;
    dayCell: string;
    dayCellHover: string;
    dayCellToday: string;
    dayCellOtherMonth: string;
    dayCellText: string;
    dayCellTextOtherMonth: string;
    holdBadge: string;
    holdBadgeCompleted: string;
  };

  // Roster specific styles
  roster: {
    // RosterSearchBar
    searchInput: string;
    searchIcon: string;
    searchClearHover: string;
    searchHelperText: string;

    // RosterHeader
    filterButton: string;
    filterButtonActive: string;
    exportButton: string;
    headerGradient: string;
    headerBorder: string;
    headerIconGradient: string;
    headerTitle: string;
    headerDescription: string;

    // BulkActions
    bulkActionsBg: string;
    bulkActionsBorder: string;
    bulkActionsHover: string;
    bulkActionButton: string;
    bulkSelectIcon: string;
    bulkSelectedCount: string;

    // ExportMenu
    exportMenuBg: string;
    exportMenuBorder: string;
    exportMenuItemHover: string;
    exportMenuText: string;
    exportMenuItemBorder: string;
  };

  // Metric card styles
  metricCard: {
    background: string;
    border: string;
    titleText: string;
    valueText: string;
    icon: string;
  };

  // Confirm dialog styles
  confirmDialog: {
    overlay: string;
    background: string;
    border: string;
    title: string;
    message: string;
    confirmButton: string;
    cancelButton: string;
  };
}

export function getTheme(isDarkMode: boolean): Theme {
  if (isDarkMode) {
    return {
      appBackground: "bg-gradient-to-br from-slate-900 via-slate-875 to-slate-900",
      cardBackground: "bg-gradient-to-br from-slate-825 to-slate-850",
      cardBorder: "border-slate-900",

      textPrimary: "text-gray-50",
      textSecondary: "text-gray-300",
      textTertiary: "text-gray-400",
      textMuted: "text-[#a3b2c8]", // WCAG AA: 5.2:1 contrast on slate-900 (was gray-600 3.5:1)

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
        background: "bg-slate-825",
        border: "border-slate-900",
      },

      badge: {
        success: "bg-emerald-950/80 text-emerald-300 border-emerald-800",
        warning: "bg-amber-950/80 text-amber-300 border-amber-800",
        error: "bg-red-950/80 text-red-300 border-red-800",
        info: "bg-gray-800/80 text-gray-300 border-gray-700",
      },

      firefighterItem: {
        available:
          "bg-gradient-to-br from-slate-825 to-slate-850 border-2 border-slate-900 hover:border-slate-600",
        unavailable:
          "bg-gradient-to-br from-slate-825 to-slate-850 border-2 border-slate-900 opacity-75",
        nextInRotation:
          "bg-gradient-to-br from-blue-900/40 to-blue-800/40 border-2 border-blue-500 shadow-blue-500/20",
        nextInRotationBadge:
          "bg-amber-500 text-gray-900 border-2 border-black shadow-lg shadow-black/50",
        dragging: "opacity-50 scale-95",
        dragOver: "border-4 border-blue-400 scale-105",
        dragHandle: "text-gray-500 hover:text-gray-400",
        title: "text-white",
        outOfRotationBadge:
          "bg-red-600/20 text-red-400 border border-red-600/40",
        stationBadge:
          "bg-sky-700 text-white border-2 border-sky-900 shadow-sm shadow-sky-900/50",
        lastHoldBadge:
          "bg-slate-700 text-white border-2 border-slate-900 shadow-sm",
        certificationLabel: "text-gray-300",
        ftoBadge:
          "bg-amber-600 text-white border-2 border-amber-800 shadow-sm shadow-amber-900/50",
        blsBadge:
          "bg-emerald-600 text-white border-2 border-emerald-800 shadow-sm shadow-emerald-900/50",
        alsBadge:
          "bg-cyan-600 text-white border-2 border-cyan-800 shadow-sm shadow-cyan-900/50",
        medicalCertBadge:
          "bg-purple-600 text-white border-2 border-purple-800 shadow-sm shadow-purple-900/50",
        apparatusBadge:
          "bg-orange-600 text-white border-2 border-orange-800 shadow-sm shadow-orange-900/50",
        rescueSquadBadge:
          "bg-rose-600 text-white border-2 border-rose-800 shadow-sm shadow-rose-900/50",
        deleteButton: "hover:bg-red-900/40",
        deleteIcon: "text-red-400 group-hover:text-red-300",
        actionButton:
          "bg-gray-700 hover:bg-gray-600 text-white border-gray-600 hover:border-gray-500",
        completeHoldButton:
          "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600",
      },

      calendar: {
        gridBackground: "bg-slate-825",
        headerBackground: "bg-slate-950",
        headerText: "text-gray-100",
        dayCell: "bg-slate-825 border-slate-900",
        dayCellHover: "hover:bg-slate-700",
        dayCellToday: "bg-blue-900/30 border-blue-400",
        dayCellOtherMonth: "bg-slate-875",
        dayCellText: "text-gray-100",
        dayCellTextOtherMonth: "text-gray-500",
        holdBadge: "bg-red-900/60 text-red-200 border-red-700",
        holdBadgeCompleted: "bg-green-900/60 text-green-200 border-green-700",
      },

      roster: {
        // RosterSearchBar
        searchInput: "bg-gray-800 border-gray-700 text-gray-100",
        searchIcon: "text-gray-400",
        searchClearHover: "hover:bg-gray-700",
        searchHelperText: "text-gray-400",

        // RosterHeader
        filterButton:
          "bg-gray-700 hover:bg-gray-600 text-gray-200 border-gray-600",
        filterButtonActive:
          "bg-blue-700 hover:bg-blue-600 text-white border-blue-600",
        exportButton:
          "bg-gray-700 hover:bg-gray-600 text-gray-100 border-gray-600",
        headerGradient: "bg-gradient-to-r from-slate-950 to-slate-900",
        headerBorder: "border-slate-900",
        headerIconGradient: "bg-gradient-to-br from-blue-500 to-blue-600",
        headerTitle: "text-gray-100",
        headerDescription: "text-gray-400",

        // BulkActions
        bulkActionsBg: "bg-blue-900/20 border border-blue-800/50",
        bulkActionsBorder: "border-blue-800/50",
        bulkActionsHover: "hover:bg-blue-800/30",
        bulkActionButton:
          "bg-gray-700 hover:bg-gray-600 text-gray-100 border-gray-600",
        bulkSelectIcon: "text-gray-400",
        bulkSelectedCount: "text-blue-400",

        // ExportMenu
        exportMenuBg: "bg-gray-800",
        exportMenuBorder: "border-gray-700",
        exportMenuItemHover: "hover:bg-gray-700 text-white",
        exportMenuText: "text-white",
        exportMenuItemBorder: "border-gray-700",
      },

      metricCard: {
        background: "bg-gradient-to-br from-slate-825 to-slate-850",
        border: "border-slate-900",
        titleText: "text-gray-300",
        valueText: "text-gray-50",
        icon: "text-blue-400",
      },

      confirmDialog: {
        overlay: "bg-black/75",
        background: "bg-gradient-to-br from-slate-825 to-slate-850",
        border: "border-slate-900",
        title: "text-gray-100",
        message: "text-gray-300",
        confirmButton: "bg-red-700 hover:bg-red-600 text-white",
        cancelButton: "bg-gray-700 hover:bg-gray-600 text-gray-100",
      },
    };
  }

  // Light mode - WCAG AA Compliant
  return {
    appBackground: "bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200",
    cardBackground: "bg-white",
    cardBorder: "border-gray-200",

    textPrimary: "text-gray-900",
    textSecondary: "text-gray-700",
    textTertiary: "text-gray-600",
    textMuted: "text-[#64748b]", // WCAG AA: 4.7:1 contrast on white (was gray-500 3.8:1)

    button: {
      primary: "bg-red-600 hover:bg-red-700 text-white",
      secondary: "bg-gray-100 hover:bg-gray-200 text-gray-900",
      danger: "bg-red-600 hover:bg-red-700 text-white",
    },

    input: {
      background: "bg-white",
      border: "border-gray-300",
      text: "text-gray-900",
      placeholder: "placeholder-gray-400",
    },

    modal: {
      overlay: "bg-black/60",
      background: "bg-white",
      border: "border-gray-200",
    },

    badge: {
      success: "bg-emerald-100 text-emerald-700 border-emerald-400",
      warning: "bg-amber-100 text-amber-700 border-amber-400",
      error: "bg-red-100 text-red-700 border-red-400",
      info: "bg-gray-300 text-gray-800 border-gray-500",
    },

    firefighterItem: {
      available: "bg-white border-2 border-slate-300 hover:border-slate-400",
      unavailable:
        "bg-gradient-to-br from-slate-200 to-slate-300 border-2 border-slate-400 opacity-75",
      nextInRotation:
        "bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-400 shadow-blue-400/20",
      nextInRotationBadge:
        "bg-amber-500 text-gray-900 border-2 border-black shadow-lg shadow-black/50",
      dragging: "opacity-50 scale-95",
      dragOver: "border-4 border-blue-400 scale-105",
      dragHandle: "text-slate-400 hover:text-slate-500",
      title: "text-slate-900",
      outOfRotationBadge: "bg-red-100 text-red-700 border border-red-400",
      stationBadge: "bg-sky-600 text-white border-2 border-sky-800 shadow-sm",
      lastHoldBadge:
        "bg-slate-600 text-white border-2 border-slate-800 shadow-sm",
      certificationLabel: "text-slate-700",
      ftoBadge: "bg-amber-600 text-white border-2 border-amber-800 shadow-sm",
      blsBadge:
        "bg-emerald-600 text-white border-2 border-emerald-800 shadow-sm",
      alsBadge: "bg-cyan-600 text-white border-2 border-cyan-800 shadow-sm",
      medicalCertBadge:
        "bg-purple-600 text-white border-2 border-purple-800 shadow-sm",
      apparatusBadge:
        "bg-orange-600 text-white border-2 border-orange-800 shadow-sm",
      rescueSquadBadge:
        "bg-rose-600 text-white border-2 border-rose-800 shadow-sm",
      deleteButton: "hover:bg-red-100",
      deleteIcon: "text-red-600 group-hover:text-red-700",
      actionButton:
        "bg-slate-200 hover:bg-slate-300 text-slate-900 border-slate-400 hover:border-slate-500",
      completeHoldButton:
        "bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600",
    },

    calendar: {
      gridBackground: "bg-white",
      headerBackground: "bg-gray-100",
      headerText: "text-gray-700",
      dayCell: "bg-white border-gray-300",
      dayCellHover: "hover:bg-gray-50",
      dayCellToday: "bg-blue-50 border-blue-400",
      dayCellOtherMonth: "bg-gray-100",
      dayCellText: "text-gray-900",
      dayCellTextOtherMonth: "text-gray-400",
      holdBadge: "bg-red-100 text-red-700 border-red-400",
      holdBadgeCompleted: "bg-green-100 text-green-700 border-green-400",
    },

    roster: {
      // RosterSearchBar
      searchInput: "bg-white border-gray-300 text-gray-900",
      searchIcon: "text-gray-500",
      searchClearHover: "hover:bg-gray-200",
      searchHelperText: "text-gray-600",

      // RosterHeader
      filterButton: "bg-white hover:bg-gray-100 text-gray-700 border-gray-300",
      filterButtonActive:
        "bg-blue-600 hover:bg-blue-700 text-white border-blue-600",
      exportButton: "bg-white hover:bg-gray-100 text-gray-700 border-gray-300",
      headerGradient: "bg-gradient-to-r from-red-50 to-amber-50",
      headerBorder: "border-slate-300",
      headerIconGradient: "bg-gradient-to-br from-blue-600 to-blue-700",
      headerTitle: "text-slate-900",
      headerDescription: "text-slate-600",

      // BulkActions
      bulkActionsBg: "bg-blue-50 border border-blue-200",
      bulkActionsBorder: "border-blue-200",
      bulkActionsHover: "hover:bg-blue-100",
      bulkActionButton:
        "bg-white hover:bg-gray-100 text-gray-700 border-gray-300",
      bulkSelectIcon: "text-gray-600",
      bulkSelectedCount: "text-blue-700",

      // ExportMenu
      exportMenuBg: "bg-white",
      exportMenuBorder: "border-slate-300",
      exportMenuItemHover: "hover:bg-slate-50 text-slate-900",
      exportMenuText: "text-slate-900",
      exportMenuItemBorder: "border-slate-200",
    },

    metricCard: {
      background: "bg-white",
      border: "border-gray-300",
      titleText: "text-gray-600",
      valueText: "text-gray-900",
      icon: "text-blue-600",
    },

    confirmDialog: {
      overlay: "bg-black/50",
      background: "bg-white",
      border: "border-gray-300",
      title: "text-gray-900",
      message: "text-gray-700",
      confirmButton: "bg-red-600 hover:bg-red-700 text-white",
      cancelButton: "bg-gray-200 hover:bg-gray-300 text-gray-900",
    },
  };
}
