export interface CalendarTheme {
  // Main container
  container: string;

  // Header section
  header: {
    background: string;
    iconBadge: string;
    title: string;
    subtitle: string;
  };

  // Stats badges
  scheduledBadge: string;
  completedBadge: string;

  // Navigation
  navigation: {
    buttonHover: string;
    buttonText: string;
    monthTitle: string;
  };

  // Calendar grid
  grid: {
    weekdayHeader: string;
    loadingText: string;
  };

  // Day cells
  dayCells: {
    // Empty cells
    emptyWeekday: string;
    emptyWeekend: string;

    // Cells with holds
    scheduled: string;
    completed: string;
    both: string;

    // Day numbers
    dayNumberWithHolds: string;
    dayNumberCurrent: string;
    dayNumberOther: string;

    // Today indicator
    todayBadge: string;
    todayRing: string;
    todayRingOffset: string;

    // Interactive elements
    scheduleHoldText: string;
    plusIcon: string;
  };

  // Footer/Legend
  footer: {
    background: string;
    legendScheduled: string;
    legendCompleted: string;
    legendToday: string;
    legendText: string;
  };

  // Next firefighter section
  nextFirefighter: {
    background: string;
    labelText: string;
    nameText: string;
  };
}

export function getCalendarTheme(isDarkMode: boolean): CalendarTheme {
  if (isDarkMode) {
    return {
      container: 'bg-gradient-to-br from-slate-800 to-slate-850 border-slate-700',

      header: {
        background: 'bg-gradient-to-r from-red-950/40 via-slate-900 to-slate-800 border-slate-700',
        iconBadge: 'bg-gradient-to-br from-red-600 to-red-700 shadow-lg shadow-red-900/50',
        title: 'text-slate-50',
        subtitle: 'text-slate-300',
      },

      scheduledBadge: 'bg-sky-950/80 border-sky-800 text-sky-200',
      completedBadge: 'bg-emerald-950/80 border-emerald-800 text-emerald-200',

      navigation: {
        buttonHover: 'hover:bg-slate-700/50',
        buttonText: 'text-slate-300',
        monthTitle: 'text-slate-50',
      },

      grid: {
        weekdayHeader: 'text-slate-300 bg-slate-900/50 border-slate-700',
        loadingText: 'text-slate-400',
      },

      dayCells: {
        emptyWeekday: 'bg-slate-900/40 border-slate-700 hover:bg-slate-700/50 hover:border-slate-600',
        emptyWeekend: 'bg-slate-800/60 border-slate-700 hover:bg-slate-700/50',

        scheduled: 'bg-gradient-to-br from-sky-700 to-sky-800 border-sky-600 hover:from-sky-600 hover:to-sky-700 shadow-lg shadow-sky-900/50',
        completed: 'bg-gradient-to-br from-emerald-700 to-emerald-800 border-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-900/50',
        both: 'bg-gradient-to-br from-sky-700 via-emerald-700 to-emerald-800 border-sky-600 hover:border-sky-500 shadow-lg',

        dayNumberWithHolds: 'text-white',
        dayNumberCurrent: 'text-slate-300',
        dayNumberOther: 'text-slate-600',

        todayBadge: 'bg-red-600 text-white',
        todayRing: 'ring-red-600',
        todayRingOffset: 'ring-offset-slate-800',

        scheduleHoldText: 'text-slate-500',
        plusIcon: 'text-slate-500',
      },

      footer: {
        background: 'bg-gradient-to-r from-slate-900 to-slate-800 border-slate-700',
        legendScheduled: 'bg-gradient-to-br from-sky-700 to-sky-800 border-sky-600',
        legendCompleted: 'bg-gradient-to-br from-emerald-700 to-emerald-800 border-emerald-600',
        legendToday: 'bg-slate-900/40 border-slate-700 ring-red-600',
        legendText: 'text-slate-300',
      },

      nextFirefighter: {
        background: 'bg-sky-950/50 border-sky-800',
        labelText: 'text-slate-400',
        nameText: 'text-slate-50',
      },
    };
  }

  // Light mode - Firefighter themed
  return {
    container: 'bg-white border-slate-300',

    header: {
      background: 'bg-gradient-to-r from-red-50 via-amber-50 to-orange-50 border-slate-300',
      iconBadge: 'bg-gradient-to-br from-red-600 to-red-700 shadow-lg shadow-red-500/30',
      title: 'text-slate-900',
      subtitle: 'text-slate-600',
    },

    scheduledBadge: 'bg-blue-100 border-blue-400 text-blue-800',
    completedBadge: 'bg-emerald-100 border-emerald-400 text-emerald-800',

    navigation: {
      buttonHover: 'hover:bg-slate-200',
      buttonText: 'text-slate-700',
      monthTitle: 'text-slate-900',
    },

    grid: {
      weekdayHeader: 'text-slate-700 bg-slate-100 border-slate-300',
      loadingText: 'text-slate-600',
    },

    dayCells: {
      emptyWeekday: 'bg-white border-slate-300 hover:bg-blue-50/60 hover:border-blue-400',
      emptyWeekend: 'bg-gradient-to-br from-blue-50 to-indigo-50 border-slate-300 hover:bg-blue-100/60',

      scheduled: 'bg-gradient-to-br from-blue-600 to-blue-700 border-blue-700 hover:from-blue-500 hover:to-blue-600 shadow-lg shadow-blue-400/40',
      completed: 'bg-gradient-to-br from-emerald-600 to-emerald-700 border-emerald-700 hover:from-emerald-500 hover:to-emerald-600 shadow-lg shadow-emerald-400/40',
      both: 'bg-gradient-to-br from-blue-600 via-emerald-600 to-emerald-700 border-blue-700 hover:border-blue-500 shadow-lg',

      dayNumberWithHolds: 'text-white',
      dayNumberCurrent: 'text-slate-700',
      dayNumberOther: 'text-slate-400',

      todayBadge: 'bg-red-600 text-white',
      todayRing: 'ring-red-600',
      todayRingOffset: 'ring-offset-white',

      scheduleHoldText: 'text-blue-500',
      plusIcon: 'text-blue-500',
    },

    footer: {
      background: 'bg-gradient-to-r from-slate-50 to-slate-100 border-slate-300',
      legendScheduled: 'bg-gradient-to-br from-blue-600 to-blue-700 border-blue-700',
      legendCompleted: 'bg-gradient-to-br from-emerald-600 to-emerald-700 border-emerald-700',
      legendToday: 'bg-white border-slate-300 ring-red-600',
      legendText: 'text-slate-700',
    },

    nextFirefighter: {
      background: 'bg-blue-100 border-blue-300',
      labelText: 'text-slate-600',
      nameText: 'text-slate-900',
    },
  };
}
