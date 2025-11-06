/**
 * Big Calendar Component
 *
 * Full-featured calendar using react-big-calendar
 * Displays firefighter holds in month/week/day views
 */

import { useMemo } from 'react';
import { Calendar, momentLocalizer, View } from 'react-big-calendar';
import moment from 'moment';
import { Firefighter, Shift, HoldDuration } from '../../lib/supabase';
import { ScheduledHold } from '../../utils/calendarUtils';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './big-calendar-theme.css';

const localizer = momentLocalizer(moment);

interface BigCalendarProps {
  firefighters: Firefighter[];
  scheduledHolds: ScheduledHold[];
  onScheduleHold: (
    holdDate: string,
    firefighter: Firefighter,
    station?: string,
    duration?: HoldDuration,
    startTime?: string
  ) => void;
  onRemoveHold: (holdId: string) => void;
  onMarkCompleted: (hold: ScheduledHold) => void;
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
  scheduledHolds,
  loading,
  isDarkMode = true,
}: BigCalendarProps) {

  // Convert scheduled holds to calendar events
  const events: CalendarEvent[] = useMemo(() => {
    return scheduledHolds.map(hold => {
      const date = new Date(hold.hold_date);
      return {
        id: hold.id,
        title: hold.firefighter_name,
        start: date,
        end: date,
        resource: hold,
      };
    });
  }, [scheduledHolds]);

  // Event style getter for color coding
  const eventStyleGetter = (event: CalendarEvent) => {
    const { status } = event.resource;

    let backgroundColor = '#5d87ff'; // default blue
    if (status === 'completed') {
      backgroundColor = '#13deb9'; // teal
    } else if (status === 'skipped') {
      backgroundColor = '#fa896b'; // coral
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.9,
        color: 'white',
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

  return (
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
      />
    </div>
  );
}
