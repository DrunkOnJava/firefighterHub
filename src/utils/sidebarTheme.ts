export interface SidebarTheme {
  // Container
  container: string;

  // Header
  header: {
    background: string;
    iconBadge: string;
    title: string;
  };

  // Empty state
  emptyState: {
    iconColor: string;
    primaryText: string;
    secondaryText: string;
  };

  // Section titles
  sectionTitle: string;

  // Divider
  divider: string;

  // Hold cards
  holdCard: {
    background: string;
    hover: string;
    dateBadge: string;
    countBadge: string;
    firefighterName: string;
    stationText: string;
  };

  // Rotation order
  rotation: {
    // Next up (first position)
    nextUp: {
      background: string;
      numberBadge: string;
      name: string;
      badge: string;
    };
    // Others in queue
    others: {
      background: string;
      numberBadge: string;
      name: string;
    };
  };
}

export function getSidebarTheme(isDarkMode: boolean): SidebarTheme {
  if (isDarkMode) {
    return {
      container:
        "bg-gradient-to-br from-slate-800 to-slate-850 border-slate-700",

      header: {
        background:
          "bg-gradient-to-r from-slate-900 to-slate-800 border-slate-700",
        iconBadge:
          "bg-gradient-to-br from-red-600 to-red-700 shadow-lg shadow-red-900/50",
        title: "text-slate-50",
      },

      emptyState: {
        iconColor: "text-slate-600",
        primaryText: "text-slate-400",
        secondaryText: "text-slate-500",
      },

      sectionTitle: "text-slate-400",
      divider: "border-slate-700",

      holdCard: {
        background: "bg-slate-900/50",
        hover: "hover:bg-slate-900/70",
        dateBadge: "bg-sky-950/80 text-sky-300 border border-sky-800",
        countBadge: "bg-amber-950/80 text-amber-300 border border-amber-800",
        firefighterName: "text-slate-50",
        stationText: "text-slate-300",
      },

      rotation: {
        nextUp: {
          background: "bg-red-950/40 border-red-800",
          numberBadge:
            "bg-amber-500 text-slate-900 border-2 border-black shadow-lg shadow-black/50",
          name: "text-slate-50",
          badge:
            "bg-amber-500 text-slate-900 border-2 border-black shadow-lg shadow-black/50",
        },
        others: {
          background: "bg-slate-900/50 border-slate-700",
          numberBadge:
            "bg-slate-700 text-slate-300 border-2 border-slate-700 shadow-sm",
          name: "text-slate-300",
        },
      },
    };
  }

  // Light mode - Firefighter themed
  return {
    container: "bg-white border-slate-300",

    header: {
      background: "bg-gradient-to-r from-blue-50 to-indigo-50 border-slate-300",
      iconBadge: "bg-gradient-to-br from-blue-600 to-blue-700",
      title: "text-slate-900",
    },

    emptyState: {
      iconColor: "text-slate-400",
      primaryText: "text-slate-600",
      secondaryText: "text-slate-500",
    },

    sectionTitle: "text-slate-600",
    divider: "border-slate-300",

    holdCard: {
      background: "bg-slate-50",
      hover: "hover:bg-slate-100",
      dateBadge: "bg-blue-100 text-blue-700",
      countBadge: "bg-amber-100 text-amber-700",
      firefighterName: "text-slate-900",
      stationText: "text-slate-600",
    },

    rotation: {
      nextUp: {
        background: "bg-red-100 border-red-400",
        numberBadge:
          "bg-amber-500 text-slate-900 border-2 border-black shadow-lg shadow-black/50",
        name: "text-slate-900",
        badge:
          "bg-amber-500 text-slate-900 border-2 border-black shadow-lg shadow-black/50",
      },
      others: {
        background: "bg-slate-100 border-slate-300",
        numberBadge:
          "bg-slate-600 text-white border-2 border-slate-800 shadow-sm",
        name: "text-slate-700",
      },
    },
  };
}
