import { useState, useMemo, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X, Plus, CheckCircle2, Trash2, Users } from 'lucide-react';
import { Firefighter, Shift, supabase } from '../lib/supabase';
import { StationSelector } from './StationSelector';
import { ShiftIndicator } from './ShiftIndicator';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { useFocusReturn } from '../hooks/useFocusReturn';
import {
  getMonthDays,
  attachScheduledHolds,
  formatMonthYear,
  formatDateForDB,
  getNextAvailableFirefighter,
  ScheduledHold,
  CalendarDay
} from '../utils/calendarUtils';
import { getCalendarTheme } from '../utils/calendarTheme';

interface CalendarProps {
  firefighters: Firefighter[];
  scheduledHolds: ScheduledHold[];
  onScheduleHold: (holdDate: string, firefighter: Firefighter, station?: string) => void;
  onRemoveHold: (holdId: string) => void;
  onMarkCompleted: (hold: ScheduledHold) => void;
  loading: boolean;
  isAdminMode?: boolean;
  isDarkMode?: boolean;
  currentShift: Shift;
}

export function Calendar({
  firefighters,
  scheduledHolds,
  onScheduleHold,
  onRemoveHold,
  onMarkCompleted,
  loading,
  isAdminMode = false,
  isDarkMode = true,
  currentShift
}: CalendarProps) {
  const theme = getCalendarTheme(isDarkMode);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  const [selectedFirefighter, setSelectedFirefighter] = useState<Firefighter | null>(null);
  const [selectedStation, setSelectedStation] = useState<string>('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showAddAnother, setShowAddAnother] = useState(false);
  const [editingHoldId, setEditingHoldId] = useState<string | null>(null);
  const [editStation, setEditStation] = useState<string>('');
  const modalTrapRef = useFocusTrap(selectedDay !== null);
  useFocusReturn(selectedDay !== null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const calendarDays = useMemo(() => {
    const days = getMonthDays(year, month);
    return attachScheduledHolds(days, scheduledHolds, firefighters);
  }, [year, month, scheduledHolds, firefighters]);

  useMemo(() => {
    const monthHolds = scheduledHolds.filter(h => {
      const holdDate = new Date(h.hold_date);
      return holdDate.getFullYear() === year && holdDate.getMonth() === month;
    });

    return {
      scheduled: monthHolds.filter(h => h.status === 'scheduled').length,
      completed: monthHolds.filter(h => h.status === 'completed').length,
      total: monthHolds.length
    };
  }, [scheduledHolds, year, month]);

  const nextFirefighter = getNextAvailableFirefighter(firefighters);
  const availableFirefighters = firefighters.filter(ff => ff.is_available);

  const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    if (!selectedDay) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedDay(null);
        setShowDeleteConfirm(null);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [selectedDay]);

  function handleDayClick(day: CalendarDay) {
    if (!day.isCurrentMonth || !isAdminMode) return;
    setSelectedDay(day);
    setSelectedFirefighter(null);
    setSelectedStation('');
    setShowDeleteConfirm(null);
    setShowAddAnother(false);
  }

  function goToPreviousMonth() {
    setCurrentDate(new Date(year, month - 1));
  }

  function goToNextMonth() {
    setCurrentDate(new Date(year, month + 1));
  }


  function handleFirefighterSelection(firefighter: Firefighter) {
    setSelectedFirefighter(firefighter);
    setSelectedStation(firefighter.fire_station || '');
  }

  function handleConfirmAssignment() {
    if (!selectedDay || !selectedFirefighter) return;
    const stationToUse = selectedStation || undefined;
    onScheduleHold(formatDateForDB(selectedDay.date), selectedFirefighter, stationToUse);
    setSelectedDay(null);
    setSelectedFirefighter(null);
    setSelectedStation('');
    setShowAddAnother(false);
  }

  function handleBackToFirefighterList() {
    setSelectedFirefighter(null);
    setSelectedStation('');
  }

  function handleRemoveHold(holdId: string) {
    onRemoveHold(holdId);
    setShowDeleteConfirm(null);
    setShowAddAnother(false);
    if (selectedDay && selectedDay.scheduledHolds.length === 1) {
      setSelectedDay(null);
    }
  }

  function handleMarkCompleted(hold: ScheduledHold) {
    onMarkCompleted(hold);
    setShowAddAnother(false);
    if (selectedDay && selectedDay.scheduledHolds.length === 1) {
      setSelectedDay(null);
    }
  }

  return (
    <>
      <div className={`border-2 rounded-2xl shadow-2xl overflow-hidden ${theme.container}`}>
        <div className={`border-b-2 p-3 sm:p-6 ${theme.header.background}`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className={`p-2 sm:p-3 rounded-xl ${theme.header.iconBadge}`}>
                <CalendarIcon className="text-white" size={20} />
              </div>
              <div>
                <h2 id="calendar-heading" className={`text-lg sm:text-2xl font-bold ${theme.header.title}`}>Hold Calendar</h2>
                <p className={`text-xs sm:text-base ${theme.header.subtitle} hidden sm:block`}>Click any date to schedule or manage holds</p>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <ShiftIndicator shift={currentShift} isDarkMode={isDarkMode} />
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 sm:gap-6 mb-3 sm:mb-0">
            <button
              onClick={goToPreviousMonth}
              className={`p-1 sm:p-2 rounded-lg transition-colors ${theme.navigation.buttonHover}`}
              aria-label="Previous month"
            >
              <ChevronLeft className={theme.navigation.buttonText} size={24} />
            </button>

            <h3 className={`text-lg sm:text-3xl font-bold min-w-[140px] sm:min-w-[280px] text-center ${theme.navigation.monthTitle}`}>
              {formatMonthYear(currentDate)}
            </h3>

            <button
              onClick={goToNextMonth}
              className={`p-1 sm:p-2 rounded-lg transition-colors ${theme.navigation.buttonHover}`}
              aria-label="Next month"
            >
              <ChevronRight className={theme.navigation.buttonText} size={24} />
            </button>
          </div>
        </div>

        <div className="p-2 sm:p-4 lg:p-6">
          <div className="grid grid-cols-7 gap-1 sm:gap-2 lg:gap-3 mb-2 sm:mb-3">
            {weekDays.map(day => (
              <div
                key={day}
                className={`text-center text-[10px] sm:text-sm lg:text-base font-bold py-1.5 sm:py-2 lg:py-3 rounded-lg border ${theme.grid.weekdayHeader}`}
              >
                <span className="hidden sm:inline">{day}</span>
                <span className="sm:hidden">{day.slice(0, 3)}</span>
              </div>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className={`text-lg ${theme.grid.loadingText}`}>Loading calendar...</p>
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-1 sm:gap-2 lg:gap-3">
              {calendarDays.map((day, index) => {
                const hasHolds = day.scheduledHolds.length > 0;
                const scheduledHolds = day.scheduledHolds.filter(h => h.status === 'scheduled');
                const completedHolds = day.scheduledHolds.filter(h => h.status === 'completed');
                const hasScheduled = scheduledHolds.length > 0;
                const hasCompleted = completedHolds.length > 0;
                const multipleHolds = day.scheduledHolds.length > 1;

                // Determine day cell styling based on state
                let dayCellClasses = 'min-h-[80px] sm:min-h-[100px] lg:min-h-[140px] p-1.5 sm:p-3 lg:p-4 rounded-lg sm:rounded-xl text-left transition-all relative border-2 group';

                if (!day.isCurrentMonth) {
                  dayCellClasses += ' cursor-default opacity-30';
                } else if (hasScheduled && hasCompleted) {
                  dayCellClasses += ` ${theme.dayCells.both} cursor-pointer`;
                } else if (hasScheduled) {
                  dayCellClasses += ` ${theme.dayCells.scheduled} cursor-pointer`;
                } else if (hasCompleted) {
                  dayCellClasses += ` ${theme.dayCells.completed} cursor-pointer`;
                } else if (day.isPast) {
                  dayCellClasses += ' cursor-not-allowed opacity-50';
                } else if (day.isWeekend) {
                  dayCellClasses += ` ${theme.dayCells.emptyWeekend} cursor-pointer hover:shadow-lg`;
                } else {
                  dayCellClasses += ` ${theme.dayCells.emptyWeekday} cursor-pointer hover:shadow-lg`;
                }

                if (day.isToday && day.isCurrentMonth) {
                  dayCellClasses += ` ring-4 ${theme.dayCells.todayRing} ring-offset-2 ${theme.dayCells.todayRingOffset} shadow-lg`;
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleDayClick(day)}
                    disabled={!day.isCurrentMonth || !isAdminMode}
                    className={dayCellClasses}
                  >
                    <div className="flex flex-col h-full">
                      <div className="flex items-start justify-between mb-1 sm:mb-2">
                        <span className={`text-base sm:text-xl lg:text-2xl font-bold ${
                          hasHolds ? theme.dayCells.dayNumberWithHolds :
                          day.isCurrentMonth && !day.isPast ? theme.dayCells.dayNumberCurrent :
                          theme.dayCells.dayNumberOther
                        }`}>
                          {day.dayNumber}
                        </span>
                        <div className="flex flex-col items-end gap-1">
                          {day.isToday && day.isCurrentMonth && (
                            <span className={`px-1.5 sm:px-2 py-0.5 text-[8px] sm:text-xs font-bold rounded ${theme.dayCells.todayBadge}`}>
                              TODAY
                            </span>
                          )}
                          {multipleHolds && (
                            <span className="px-1.5 sm:px-2 py-0.5 bg-white/20 text-white text-[8px] sm:text-xs font-bold rounded flex items-center gap-1">
                              <Users size={10} className="sm:w-3 sm:h-3" />
                              {day.scheduledHolds.length}
                            </span>
                          )}
                        </div>
                      </div>

                      {hasHolds ? (
                        <div className="flex-1 flex flex-col justify-center space-y-0.5 sm:space-y-1">
                          {day.scheduledHolds.slice(0, 2).map((hold) => (
                            <div key={hold.id} className="mb-1">
                              <p className="text-white font-bold text-xs sm:text-sm lg:text-base leading-tight break-words">
                                {hold.firefighter_name}
                              </p>
                              {hold.fire_station && (
                                <p className="text-[10px] sm:text-xs text-white/80 font-semibold">
                                  Station #{hold.fire_station}
                                </p>
                              )}
                              {hold.status === 'completed' && (
                                <span className="inline-flex items-center px-1 sm:px-1.5 py-0.5 bg-emerald-900/70 text-emerald-200 text-[8px] sm:text-xs font-bold rounded">
                                  DONE
                                </span>
                              )}
                            </div>
                          ))}
                          {day.scheduledHolds.length > 2 && (
                            <p className="text-white text-[10px] sm:text-xs font-semibold opacity-80">
                              +{day.scheduledHolds.length - 2} more
                            </p>
                          )}
                        </div>
                      ) : (
                        day.isCurrentMonth && !day.isPast && isAdminMode && (
                          <div className="flex-1 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="flex flex-col items-center gap-1">
                              <Plus size={16} className={`${theme.dayCells.plusIcon} sm:w-6 sm:h-6`} />
                              <span className={`text-[10px] sm:text-xs font-medium ${theme.dayCells.scheduleHoldText} hidden sm:inline`}>Schedule Hold</span>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className={`border-t-2 p-3 sm:p-4 lg:p-6 ${theme.footer.background}`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3 sm:gap-6 flex-wrap">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded border-2 ${theme.footer.legendScheduled}`}></div>
                <span className={`text-xs sm:text-base font-medium ${theme.footer.legendText}`}>Scheduled</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded border-2 ${theme.footer.legendCompleted}`}></div>
                <span className={`text-xs sm:text-base font-medium ${theme.footer.legendText}`}>Completed</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded border-2 ring-4 shadow-lg ${theme.footer.legendToday} ${theme.dayCells.todayRing}`}></div>
                <span className={`text-xs sm:text-base font-medium ${theme.footer.legendText}`}>Today</span>
              </div>
            </div>
            {nextFirefighter && (
              <div className={`flex items-center gap-2 sm:gap-3 px-2 sm:px-4 py-1.5 sm:py-2 border rounded-lg ${theme.nextFirefighter.background}`}>
                <span className={`font-medium text-xs sm:text-base ${theme.nextFirefighter.labelText}`}>Next:</span>
                <span className={`font-bold text-sm sm:text-lg ${theme.nextFirefighter.nameText}`}>{nextFirefighter.name}</span>
                {nextFirefighter.fire_station && (
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-sky-500/30 rounded border border-sky-400/50 flex items-center justify-center">
                      <span className="text-sky-200 text-[10px] sm:text-xs font-bold">{nextFirefighter.fire_station}</span>
                    </div>
                    <span className="text-sky-200 font-bold text-xs sm:text-base hidden sm:inline">Station #{nextFirefighter.fire_station}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedDay && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => {
            setSelectedDay(null);
            setShowDeleteConfirm(null);
            setShowAddAnother(false);
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="day-modal-title"
        >
          <div
            ref={modalTrapRef}
            className="bg-gradient-to-br from-gray-800 to-gray-850 border-2 border-gray-700 rounded-2xl max-w-md w-full shadow-2xl animate-scale-in max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 border-b-2 border-gray-700 p-5 flex items-center justify-between sticky top-0 z-10">
              <div>
                <h3 id="day-modal-title" className="text-xl font-bold text-white">
                  {selectedDay.date.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric'
                  })}
                </h3>
                {selectedDay.scheduledHolds.length > 0 && (
                  <p className="text-sm text-gray-400 mt-1">
                    {selectedDay.scheduledHolds.length} hold{selectedDay.scheduledHolds.length !== 1 ? 's' : ''} scheduled
                  </p>
                )}
              </div>
              <button
                onClick={() => {
                  setSelectedDay(null);
                  setShowDeleteConfirm(null);
                  setShowAddAnother(false);
                }}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors focus-ring"
                aria-label="Close date dialog"
              >
                <X size={24} className="text-gray-400" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto">
              {selectedDay.scheduledHolds.length > 0 && !showAddAnother ? (
                <div className="space-y-4">
                  <div className="space-y-3">
                    {selectedDay.scheduledHolds.map((hold) => (
                      <div key={hold.id} className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <p className="text-xl font-bold text-white">
                              {hold.firefighter_name}
                            </p>
                            {hold.fire_station && (
                              <p className="text-base text-gray-300 mt-1 font-semibold">
                                Station #{hold.fire_station}
                              </p>
                            )}
                            <span className={`inline-block mt-2 px-2 py-1 rounded text-xs font-bold ${
                              hold.status === 'scheduled'
                                ? 'bg-sky-900/70 text-sky-300'
                                : 'bg-emerald-900/70 text-emerald-300'
                            }`}>
                              {hold.status === 'scheduled' ? 'SCHEDULED' : 'COMPLETED'}
                            </span>
                          </div>
                        </div>

                        {isAdminMode && showDeleteConfirm === hold.id && (
                          <div className="space-y-3 pt-3 border-t border-gray-700">
                            <p className="text-sm text-red-300 font-semibold">
                              Are you sure you want to cancel this hold?
                            </p>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleRemoveHold(hold.id)}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-lg transition-colors shadow-lg focus-ring"
                              >
                                Yes, Cancel Hold
                              </button>
                              <button
                                onClick={() => setShowDeleteConfirm(null)}
                                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 rounded-lg transition-colors shadow-lg focus-ring"
                              >
                                No, Keep It
                              </button>
                            </div>
                          </div>
                        )}
                        {isAdminMode && showDeleteConfirm !== hold.id && editingHoldId !== hold.id && (
                          <div className="flex gap-2 pt-3 border-t border-gray-700">
                            {/* Complete Button: Only for 'scheduled' and not past */}
                            {hold.status === 'scheduled' && !selectedDay.isPast && (
                              <button
                                onClick={() => handleMarkCompleted(hold)}
                                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-3 rounded-lg transition-colors shadow-lg focus-ring flex items-center justify-center gap-2"
                                title="Mark as completed and move to end of rotation"
                              >
                                <CheckCircle2 size={16} />
                                <span className="text-sm">Complete</span>
                              </button>
                            )}

                            {/* Edit Button: Always available */}
                            <button
                              onClick={() => {
                                setEditingHoldId(hold.id);
                                setEditStation(hold.fire_station || '');
                              }}
                              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 rounded-lg transition-colors shadow-lg focus-ring flex items-center justify-center gap-2"
                              title="Edit hold station"
                            >
                              <span className="text-sm">Edit</span>
                            </button>

                            {/* Cancel Button: Always available (unless legacy 'past-' id) */}
                            {!hold.id.startsWith('past-') && (
                              <button
                                onClick={() => setShowDeleteConfirm(hold.id)}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-3 rounded-lg transition-colors shadow-lg focus-ring flex items-center justify-center gap-2"
                                title={hold.status === 'completed' ? 'Cancel completed hold and reset firefighter position' : 'Cancel scheduled hold'}
                              >
                                <Trash2 size={16} />
                                <span className="text-sm">Cancel</span>
                              </button>
                            )}
                          </div>
                        )}

                        {/* Edit Mode */}
                        {isAdminMode && editingHoldId === hold.id && (
                          <div className="space-y-3 pt-3 border-t border-gray-700">
                            <div>
                              <label className="block text-sm text-gray-400 mb-2">Hold Station</label>
                              <input
                                type="text"
                                value={editStation}
                                onChange={(e) => setEditStation(e.target.value)}
                                placeholder="Station number"
                                className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white"
                              />
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={async () => {
                                  try {
                                    const { error } = await supabase
                                      .from('scheduled_holds')
                                      .update({ fire_station: editStation || null })
                                      .eq('id', hold.id);

                                    if (error) throw error;

                                    // Update local state
                                    if (selectedDay) {
                                      const updatedHolds = selectedDay.scheduledHolds.map(h =>
                                        h.id === hold.id ? { ...h, fire_station: editStation || null } : h
                                      );
                                      setSelectedDay({ ...selectedDay, scheduledHolds: updatedHolds });
                                    }

                                    setEditingHoldId(null);
                                    showToast('Hold station updated', 'success');
                                  } catch (error) {
                                    console.error('Error updating hold:', error);
                                    showToast('Could not update hold', 'error');
                                  }
                                }}
                                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-lg transition-colors"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingHoldId(null)}
                                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 rounded-lg transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {!selectedDay.isPast && (
                    <button
                      onClick={() => {
                        setShowAddAnother(true);
                        setSelectedFirefighter(null);
                        setSelectedStation('');
                      }}
                      className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 rounded-lg transition-colors shadow-lg focus-ring flex items-center justify-center gap-2"
                    >
                      <Plus size={20} />
                      Add Another Person
                    </button>
                  )}
                </div>
              ) : selectedFirefighter ? (
                <div className="space-y-4">
                  <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                    <p className="text-sm text-gray-400 mb-2">Assigning hold to:</p>
                    <p className="text-xl font-bold text-white">
                      {selectedFirefighter.name}
                    </p>
                    {selectedFirefighter.fire_station && (
                      <p className="text-base text-gray-300 mt-2 font-semibold">
                        Default: Station #{selectedFirefighter.fire_station}
                      </p>
                    )}
                  </div>

                  <StationSelector
                    selectedStation={selectedStation}
                    onStationChange={setSelectedStation}
                    defaultStation={selectedFirefighter.fire_station}
                  />

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={handleBackToFirefighterList}
                      className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-lg transition-colors shadow-lg focus-ring"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleConfirmAssignment}
                      className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 rounded-lg transition-colors shadow-lg focus-ring"
                    >
                      Confirm Assignment
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-gray-400 mb-3">
                    Who should take the hold on {selectedDay.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}?
                  </p>

                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {availableFirefighters.length === 0 ? (
                      <div className="text-center text-gray-500 py-8">
                        <p className="mb-2">No firefighters available</p>
                        <p className="text-xs text-gray-600">Add team members to start scheduling holds</p>
                      </div>
                    ) : (
                      availableFirefighters.map((ff, index) => (
                        <button
                          key={ff.id}
                          onClick={() => handleFirefighterSelection(ff)}
                          className={`w-full text-left bg-gray-900 hover:bg-gray-700 border-2 border-gray-700 rounded-lg p-4 transition-colors focus-ring ${
                            index === 0 ? 'ring-2 ring-blue-500 border-blue-600' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-bold text-white text-lg">{ff.name}</p>
                              {ff.fire_station && (
                                <p className="text-sm text-gray-400 mt-1 font-semibold">
                                  Station #{ff.fire_station}
                                </p>
                              )}
                            </div>
                            {index === 0 && (
                              <span className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-bold">
                                NEXT
                              </span>
                            )}
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-gradient-to-r from-gray-900 to-gray-800 border-t-2 border-gray-700 p-5 sticky bottom-0">
              <button
                onClick={() => {
                  setSelectedDay(null);
                  setShowDeleteConfirm(null);
                  setShowAddAnother(false);
                }}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-lg transition-colors focus-ring"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
