import { useEffect, useState } from 'react';
import { supabase, Firefighter, Shift } from '../lib/supabase';
import { ScheduledHold } from '../utils/calendarUtils';
import { ToastType } from './useToast';
import { moveToBottom, recalculatePositions } from '../utils/rotationLogic';

export function useScheduledHolds(showToast: (message: string, type: ToastType) => void, currentShift: Shift) {
  const [scheduledHolds, setScheduledHolds] = useState<ScheduledHold[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadScheduledHolds();

    const channel = supabase
      .channel('scheduled_holds_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'scheduled_holds'
        },
        () => {
          loadScheduledHolds();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentShift]);

  async function loadScheduledHolds() {
    try {
      setLoading(true);
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 3, 0);

      const startStr = startOfMonth.toISOString().split('T')[0];
      const endStr = endOfMonth.toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('scheduled_holds')
        .select('*')
        .eq('shift', currentShift)
        .gte('hold_date', startStr)
        .lte('hold_date', endStr)
        .order('hold_date');

      if (error) throw error;
      setScheduledHolds(data || []);
    } catch (error) {
      console.error('Error loading scheduled holds:', error);
      showToast('Could not load scheduled holds. Check your connection and refresh.', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function scheduleHold(holdDate: string, firefighter: Firefighter, station?: string) {
    const stationToUse = station || firefighter.fire_station || null;
    const tempId = `temp-${Date.now()}`;

    const optimisticHold: ScheduledHold = {
      id: tempId,
      firefighter_id: firefighter.id,
      firefighter_name: firefighter.name,
      hold_date: holdDate,
      fire_station: stationToUse,
      status: 'scheduled',
      shift: currentShift,
      notes: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      completed_at: null
    };

    setScheduledHolds(prev => [...prev, optimisticHold]);

    try {
      const { data, error } = await supabase
        .from('scheduled_holds')
        .insert({
          firefighter_id: firefighter.id,
          firefighter_name: firefighter.name,
          hold_date: holdDate,
          fire_station: stationToUse,
          status: 'scheduled',
          shift: currentShift
        })
        .select()
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setScheduledHolds(prev => prev.map(h => h.id === tempId ? data : h));
      }

      const date = new Date(holdDate);
      const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const stationMsg = stationToUse ? ` at Station #${stationToUse}` : '';
      showToast(`Hold assigned to ${firefighter.name}${stationMsg} for ${formattedDate}`, 'success');
    } catch (error: any) {
      console.error('Error scheduling hold:', error);
      setScheduledHolds(prev => prev.filter(h => h.id !== tempId));

      if (error?.code === '23505') {
        showToast('This date is already taken. Choose another date or reassign the existing hold.', 'error');
      } else {
        showToast('Could not schedule hold. Please try again.', 'error');
      }
    }
  }

  async function removeScheduledHold(holdId: string) {
    const previousHolds = [...scheduledHolds];
    const hold = scheduledHolds.find(h => h.id === holdId);
    if (!hold) return;

    try {
      // Reschedule to next day - firefighter still needs to take their turn
      const currentDate = new Date(hold.hold_date + 'T00:00:00');
      const nextDay = new Date(currentDate);
      nextDay.setDate(nextDay.getDate() + 1);
      const nextDayStr = nextDay.toISOString().split('T')[0];

      const { error } = await supabase
        .from('scheduled_holds')
        .update({
          hold_date: nextDayStr,
          notes: hold.notes ? `${hold.notes} (Rescheduled from ${hold.hold_date})` : `Rescheduled from ${hold.hold_date}`
        })
        .eq('id', holdId);

      if (error) throw error;

      // Update local state to show on new date
      setScheduledHolds(prev => prev.map(h =>
        h.id === holdId
          ? { ...h, hold_date: nextDayStr }
          : h
      ));

      showToast(`Hold rescheduled to ${nextDayStr} - firefighter stays first in rotation`, 'success');
    } catch (error) {
      console.error('Error rescheduling hold:', error);
      setScheduledHolds(previousHolds);
      showToast('Could not reschedule hold. Please try again.', 'error');
    }
  }

  async function markHoldCompleted(hold: ScheduledHold) {
    const previousHolds = [...scheduledHolds];
    setScheduledHolds(prev => prev.map(h =>
      h.id === hold.id
        ? { ...h, status: 'completed' as const, completed_at: new Date().toISOString(), updated_at: new Date().toISOString() }
        : h
    ));

    try {
      const { error: holdError } = await supabase
        .from('scheduled_holds')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', hold.id);

      if (holdError) throw holdError;

      const { data: allFirefighters, error: fetchError } = await supabase
        .from('firefighters')
        .select('*')
        .eq('shift', currentShift)
        .order('order_position');

      if (fetchError) throw fetchError;

      if (allFirefighters) {
        let updatedFirefighters = moveToBottom(allFirefighters, hold.firefighter_id);
        updatedFirefighters = updatedFirefighters.map(ff =>
          ff.id === hold.firefighter_id ? { ...ff, last_hold_date: hold.hold_date } : ff
        );
        updatedFirefighters = recalculatePositions(updatedFirefighters);

        for (const ff of updatedFirefighters) {
          const updates: any = { order_position: ff.order_position };
          if (ff.id === hold.firefighter_id) {
            updates.last_hold_date = hold.hold_date;
            updates.updated_at = new Date().toISOString();
          }

          const { error: updateError } = await supabase
            .from('firefighters')
            .update(updates)
            .eq('id', ff.id);

          if (updateError) {
            console.error('Error updating firefighter:', updateError);
          }
        }
      }

      showToast(`${hold.firefighter_name}'s hold completed and moved to end of rotation`, 'success');
    } catch (error) {
      console.error('Error marking hold completed:', error);
      setScheduledHolds(previousHolds);
      showToast('Could not mark hold as completed. Please try again.', 'error');
    }
  }

  return {
    scheduledHolds,
    loading,
    scheduleHold,
    removeScheduledHold,
    markHoldCompleted
  };
}
