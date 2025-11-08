/**
 * Big Calendar Component
 *
 * Full-featured calendar using react-big-calendar
 * Displays firefighter holds in month/week/day views
 */

import { useMemo, useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { Firefighter, Shift, HoldDuration } from '../../lib/supabase';
import { ScheduledHold } from '../../utils/calendarUtils';
import { DayScheduleModal } from './DayScheduleModal';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './big-calendar-theme.css';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface BigCalendarProps {
  firefighters: Firefighter[];
  scheduledHolds: ScheduledHold[];
  onScheduleHold: (
    holdDate: string,
    firefighter: Firefighter,
    station?: string,
    duration?: HoldDuration,
    startTime?: string,
    isVoluntary?: boolean
  ) => Promise<void> | void;
  onRemoveHold: (holdId: string) => void;
  onMarkCompleted: (hold: ScheduledHold) => Promise<void> | void;
  onSkipFirefighter?: (firefighterId: string) => void;
  loading: boolean;
  isAdminMode?: boolean;
  isDarkMode?: boolean;
  currentShift: Shift;
  selectedFirefighterId?: string | null;
}

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: ScheduledHold;
}

export function BigCalendar({
  firefighters,
  scheduledHolds,
  onScheduleHold,
  onRemoveHold,
  onMarkCompleted,
  onSkipFirefighter,
  loading,
  isAdminMode = false,
  isDarkMode = true,
  currentShift,
  selectedFirefighterId,
}: BigCalendarProps) {
  const [showDayScheduleModal, setShowDayScheduleModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [nextFirefighter, setNextFirefighter] = useState<Firefighter | null>(null);

  // Convert scheduled holds to calendar events
  const events: CalendarEvent[] = useMemo(() => {
    return scheduledHolds.map(hold => {
      const date = hold.hold_date ? new Date(hold.hold_date) : new Date();
      return {
        id: hold.id,
        title: hold.firefighter_name || 'Unknown',
        start: date,
        end: date,
        resource: hold,
      };
    });
  }, [scheduledHolds]);

  // Event style getter - Highlight selected, dim others
  const eventStyleGetter = (event: CalendarEvent) => {
    const { status } = event.resource;
    const isSelectedFF = selectedFirefighterId && event.resource.firefighter_id === selectedFirefighterId;
    const isOtherFF = selectedFirefighterId && event.resource.firefighter_id !== selectedFirefighterId;

    let backgroundColor = '#5d87ff'; // MaterialM blue
    if (status === 'completed') {
      backgroundColor = '#087f6a'; // Dark teal for WCAG AAA contrast with white text
    } else if (status === 'skipped') {
      backgroundColor = '#fa896b'; // MaterialM coral
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        // Highlight selected, dim others, normal when nothing selected
        opacity: isOtherFF ? 0.25 : isSelectedFF ? 1 : 0.9,
        color: 'white',
        border: isSelectedFF ? '2px solid #fbbf24' : '0px', // Gold border for selected
        display: 'block',
        fontWeight: isSelectedFF ? '700' : '500', // Bold for selected
        boxShadow: isSelectedFF ? '0 0 16px rgba(251, 191, 36, 0.8)' : 'none', // Strong glow for selected
        transform: isSelectedFF ? 'scale(1.05)' : 'scale(1)', // Slight enlargement
        zIndex: isSelectedFF ? 10 : 1, // Bring to front
      }
    };
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-96 ${
        isDarkMode ? 'text-slate-400' : 'text-gray-500'
      }`}>
        Loading calendar...
      </div>
    );
  }

  // Handle clicking a hold event
  const handleSelectEvent = (event: CalendarEvent) => {
    // BC Mode: Allow viewing/managing holds
    const hold = event.resource;
    // If hold is scheduled (not completed), allow marking as completed
    if (hold.status === 'scheduled') {
      if (window.confirm(`Mark ${hold.firefighter_name}'s hold as completed?`)) {
        onMarkCompleted(hold);
      }
    } else if (hold.status === 'completed') {
      // If already completed, offer to remove (admin only)
      if (isAdminMode && window.confirm(`Remove ${hold.firefighter_name}'s completed hold?`)) {
        onRemoveHold(hold.id);
      }
    }
  };

  // Handle clicking an empty day - open modal for scheduling
  const handleSelectSlot = ({ start }: { start: Date }) => {
    // BC Mode: Allow scheduling holds from calendar
    // Get next available firefighter for this shift
    const availableFF = firefighters
      .filter(ff => ff.is_available && ff.shift === currentShift)
      .sort((a, b) => a.order_position - b.order_position)[0];

    if (!availableFF) {
      alert('No available firefighters on this shift');
      return;
    }

    setSelectedDate(start);
    setNextFirefighter(availableFF);
    setShowDayScheduleModal(true);
  };

  const handleScheduleFromModal = (
    firefighter: Firefighter,
    station: string,
    duration: HoldDuration,
    startTime: string,
    isVoluntary: boolean
  ) => {
    if (!selectedDate) return;
    const dateStr = selectedDate.toISOString().split('T')[0];
    onScheduleHold(dateStr, firefighter, station, duration, startTime, isVoluntary);
  };

  const handleSkipFromModal = (firefighterId: string) => {
    if (onSkipFirefighter) {
      onSkipFirefighter(firefighterId);
    }
  };

  return (
    <>
      <DayScheduleModal
        isOpen={showDayScheduleModal}
        selectedDate={selectedDate}
        nextFirefighter={nextFirefighter}
        allFirefighters={firefighters}
        onClose={() => setShowDayScheduleModal(false)}
        onSchedule={handleScheduleFromModal}
        onSkip={handleSkipFromModal}
        isDarkMode={isDarkMode}
        currentShift={currentShift}
      />

      <div className={`big-calendar-container ${isDarkMode ? 'dark-theme' : 'light-theme'} h-full`}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          eventPropGetter={eventStyleGetter}
          views={['month', 'week', 'day']}
          defaultView="month"
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          selectable={true}
        />
      </div>
    </>
  );
}
