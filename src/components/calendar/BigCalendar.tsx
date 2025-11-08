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

  // Event style getter for color coding
  const eventStyleGetter = (event: CalendarEvent) => {
    const { status } = event.resource;

    // Use CSS classes for operational color system
    let className = 'event-scheduled';
    if (status === 'completed') {
      className = 'event-completed';
    } else if (status === 'skipped') {
      className = 'event-scheduled'; // Treat skipped as scheduled visually
    }

    return {
      className,
      style: {
        border: '0px',
        display: 'block',
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
