/**
 * Big Calendar Component
 *
 * Full-featured calendar using react-big-calendar
 * Displays firefighter holds in month/week/day views
 */

import { useMemo } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
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
  firefighters,
  scheduledHolds,
  onScheduleHold,
  onRemoveHold,
  onMarkCompleted,
  loading,
  isAdminMode = false,
  isDarkMode = true,
  currentShift,
}: BigCalendarProps) {

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

  // Handle clicking a hold event
  const handleSelectEvent = (event: CalendarEvent) => {
    if (!isAdminMode) return;

    const hold = event.resource;
    // If hold is scheduled (not completed), allow marking as completed
    if (hold.status === 'scheduled') {
      if (window.confirm(`Mark ${hold.firefighter_name}'s hold as completed?`)) {
        onMarkCompleted(hold);
      }
    } else if (hold.status === 'completed') {
      // If already completed, offer to remove
      if (window.confirm(`Remove ${hold.firefighter_name}'s completed hold?`)) {
        onRemoveHold(hold.id);
      }
    }
  };

  // Handle clicking an empty day (optional scheduling feature)
  const handleSelectSlot = ({ start }: { start: Date }) => {
    if (!isAdminMode) return;

    // Get next available firefighter for this shift
    const availableFF = firefighters
      .filter(ff => ff.is_available && ff.shift === currentShift)
      .sort((a, b) => a.order_position - b.order_position)[0];

    if (!availableFF) {
      alert('No available firefighters on this shift');
      return;
    }

    const dateStr = start.toISOString().split('T')[0];
    if (window.confirm(`Schedule hold for ${availableFF.name} on ${moment(start).format('MMM D, YYYY')}?`)) {
      onScheduleHold(dateStr, availableFF);
    }
  };

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
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
        selectable={isAdminMode}
      />
    </div>
  );
}
