// TECHNICAL DEBT: This hook is doing too much - violates Single Responsibility Principle
// Consider splitting into: useFirefightersData, useFirefighterMutations, useFirefighterRealtimeSync
// Currently 465 lines handling: data fetching, mutations, optimistic updates, logging, and real-time sync

import { useEffect, useState, useCallback } from 'react';
import { supabase, Firefighter, Shift } from '../lib/supabase';
import { recalculatePositions, moveToBottom, assignPositions } from '../utils/rotationLogic';
import { ToastType } from './useToast';
import { useOperationLoading } from './useOperationLoading';

export function useFirefighters(showToast: (message: string, type: ToastType) => void, currentShift: Shift) {
  const [firefighters, setFirefighters] = useState<Firefighter[]>([]);
  const [deactivatedFirefighters, setDeactivatedFirefighters] = useState<Firefighter[]>([]);
  const [loading, setLoading] = useState(true);
  const { startLoading, stopLoading, isLoading: isOperationLoading, loadingStates } = useOperationLoading();

  const loadFirefighters = useCallback(async () => {
    try {
      const { data: activeData, error: activeError } = await supabase
        .from('firefighters')
        .select('*')
        .eq('shift', currentShift)
        .eq('is_active', true)
        .order('order_position');

      if (activeError) throw activeError;

      const sorted = recalculatePositions(activeData || []);
      setFirefighters(sorted);

      const { data: deactivatedData, error: deactivatedError } = await supabase
        .from('firefighters')
        .select('*')
        .eq('shift', currentShift)
        .eq('is_active', false)
        .order('name');

      if (deactivatedError) throw deactivatedError;
      setDeactivatedFirefighters(deactivatedData || []);
    } catch (error) {
      console.error('Error loading firefighters:', error);
      showToast('Could not load firefighters. Check your connection and refresh.', 'error');
    } finally {
      setLoading(false);
    }
  }, [currentShift, showToast]);

  useEffect(() => {
    loadFirefighters();

    // GOOD PRACTICE: Real-time subscription for live updates
    const channel = supabase
      .channel('firefighters_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'firefighters'
        },
        () => {
          loadFirefighters();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadFirefighters]);

  async function logActivity(firefighterName: string, actionType: string, details?: string, firefighterId?: string) {
    try {
      await supabase
        .from('activity_log')
        .insert({
          firefighter_id: firefighterId,
          firefighter_name: firefighterName,
          action_type: actionType,
          details: details || null,
          shift: currentShift
        });
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  }

  async function addFirefighter(
    name: string,
    fireStation: string,
    certificationLevel?: string | null,
    apparatusClearances?: {
      ambulance?: boolean;
      brushTruck?: boolean;
      engine?: boolean;
      tanker?: boolean;
      truck?: boolean;
      boat?: boolean;
      utv?: boolean;
      rescueSquad?: boolean;
    },
    certifications?: {
      isFTO?: boolean;
      isBLS?: boolean;
      isALS?: boolean;
    }
  ) {
    startLoading('add');
    const available = firefighters.filter(ff => ff.is_available);
    const maxPosition = available.length > 0
      ? Math.max(...available.map(ff => ff.order_position))
      : -1;

    const tempId = `temp-${Date.now()}`;
    const optimisticFirefighter: Firefighter = {
      id: tempId,
      name,
      fire_station: fireStation || null,
      order_position: maxPosition + 1,
      is_available: true,
      is_active: true,
      shift: currentShift,
      last_hold_date: null,
      certification_level: certificationLevel || null,
      apparatus_ambulance: apparatusClearances?.ambulance || false,
      apparatus_brush_truck: apparatusClearances?.brushTruck || false,
      apparatus_engine: apparatusClearances?.engine || false,
      apparatus_tanker: apparatusClearances?.tanker || false,
      apparatus_truck: apparatusClearances?.truck || false,
      apparatus_boat: apparatusClearances?.boat || false,
      apparatus_utv: apparatusClearances?.utv || false,
      apparatus_rescue_squad: apparatusClearances?.rescueSquad || false,
      is_fto: certifications?.isFTO || false,
      is_bls: certifications?.isBLS || false,
      is_als: certifications?.isALS || false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setFirefighters(prev => [...prev, optimisticFirefighter]);

    try {
      const { data, error } = await supabase
        .from('firefighters')
        .insert({
          name,
          fire_station: fireStation || null,
          order_position: maxPosition + 1,
          is_available: true,
          is_active: true,
          shift: currentShift,
          certification_level: certificationLevel || null,
          apparatus_ambulance: apparatusClearances?.ambulance || false,
          apparatus_brush_truck: apparatusClearances?.brushTruck || false,
          apparatus_engine: apparatusClearances?.engine || false,
          apparatus_tanker: apparatusClearances?.tanker || false,
          apparatus_truck: apparatusClearances?.truck || false,
          apparatus_boat: apparatusClearances?.boat || false,
          apparatus_utv: apparatusClearances?.utv || false,
          apparatus_rescue_squad: apparatusClearances?.rescueSquad || false,
          is_fto: certifications?.isFTO || false,
          is_bls: certifications?.isBLS || false,
          is_als: certifications?.isALS || false
        })
        .select()
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setFirefighters(prev => prev.map(ff => ff.id === tempId ? data : ff));
        const position = (data.order_position || 0) + 1;
        showToast(`${name} joined the rotation at position ${position}`, 'success');
        await logActivity(name, 'added', 'Added to hold list', data.id);
      }
    } catch (error) {
      console.error('Error adding firefighter:', error);
      setFirefighters(prev => prev.filter(ff => ff.id !== tempId));
      showToast('Could not add team member. Please try again.', 'error');
    } finally {
      stopLoading('add');
    }
  }

  async function completeHold(id: string, holdDate: string, station?: string) {
    const firefighter = firefighters.find(ff => ff.id === id);
    if (!firefighter || !firefighter.is_available) return;

    const previousFirefighters = [...firefighters];

    let updatedFirefighters = moveToBottom(firefighters, id);
    updatedFirefighters = updatedFirefighters.map(ff =>
      ff.id === id ? { ...ff, last_hold_date: holdDate } : ff
    );
    updatedFirefighters = recalculatePositions(updatedFirefighters);
    setFirefighters(updatedFirefighters);

    try {
      for (const ff of updatedFirefighters) {
        const updates: { order_position: number; last_hold_date?: string } = { order_position: ff.order_position };
        if (ff.id === id) {
          updates.last_hold_date = holdDate;
        }

        const { error } = await supabase
          .from('firefighters')
          .update(updates)
          .eq('id', ff.id);

        if (error) throw error;
      }

      const stationToUse = station || firefighter.fire_station || null;
      const { error: insertError } = await supabase
        .from('scheduled_holds')
        .insert({
          firefighter_id: id,
          firefighter_name: firefighter.name,
          hold_date: holdDate,
          fire_station: stationToUse,
          status: 'completed',
          completed_at: new Date().toISOString(),
          shift: currentShift
        });

      if (insertError) {
        console.error('Error inserting scheduled hold:', insertError);
      }

      const date = new Date(holdDate);
      const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const stationMsg = stationToUse ? ` at Station #${stationToUse}` : '';
      showToast(`${firefighter.name} finished their hold${stationMsg} for ${formattedDate} and moved to the end of the line`, 'success');
      await logActivity(firefighter.name, 'completed_hold', `Completed hold and moved to bottom of rotation`, id);
    } catch (error) {
      console.error('Error completing hold:', error);
      setFirefighters(previousFirefighters);
      showToast('Could not complete hold. Please try again.', 'error');
    }
  }

  async function deleteFirefighter(id: string) {
    const firefighter = firefighters.find(ff => ff.id === id);
    if (!firefighter) return;
    if (!confirm(`Remove ${firefighter.name} from your roster?\n\nTheir hold history will be preserved on the calendar. This cannot be undone.`)) return;

    const previousFirefighters = [...firefighters];
    setFirefighters(prev => prev.filter(ff => ff.id !== id));

    try {
      // Delete firefighter - their holds remain in database with firefighter_name
      // The holds will still show on calendar since firefighter_name is denormalized
      const { error } = await supabase
        .from('firefighters')
        .delete()
        .eq('id', id);

      if (error) throw error;

      showToast(`${firefighter.name} removed - hold history preserved`, 'success');
      await logActivity(firefighter.name, 'removed', 'Removed from rotation (hold history preserved)');
    } catch (error) {
      console.error('Error deleting firefighter:', error);
      setFirefighters(previousFirefighters);
      showToast('Could not remove team member. Please try again.', 'error');
    }
  }

  async function resetAll() {
    if (!confirm('Delete your entire roster?\n\nThis will remove all firefighters and cancel all scheduled holds. This action is permanent.')) return;

    try {
      const { error } = await supabase
        .from('firefighters')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (error) throw error;
      showToast('All team members removed from roster', 'info');
    } catch (error) {
      console.error('Error resetting firefighters:', error);
      showToast('Could not reset roster. Please try again.', 'error');
    }
  }

  async function masterReset() {
    if (!confirm('MASTER RESET - WARNING\n\nThis will permanently delete:\n• ALL firefighters from ALL shifts\n• ALL scheduled holds\n• ALL activity logs\n• ALL completed holds\n\nThis action CANNOT be undone!\n\nAre you absolutely sure?')) return;

    if (!confirm('Final confirmation: Delete EVERYTHING and start fresh?')) return;

    const previousFirefighters = [...firefighters];
    setFirefighters([]);

    try {
      const { error: firefightersError } = await supabase
        .from('firefighters')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (firefightersError) throw firefightersError;

      const { error: holdsError } = await supabase
        .from('scheduled_holds')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (holdsError) throw holdsError;

      const { error: activityError } = await supabase
        .from('activity_log')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (activityError) throw activityError;

      showToast('System reset complete. Starting fresh!', 'success');
    } catch (error) {
      console.error('Error performing master reset:', error);
      setFirefighters(previousFirefighters);
      showToast('Master reset failed. Please try again.', 'error');
    }
  }

  async function reorderFirefighters(reorderedFirefighters: Firefighter[]) {
    const previousFirefighters = [...firefighters];

    try {
      const updatedWithPositions = assignPositions(reorderedFirefighters);
      setFirefighters(updatedWithPositions);

      for (const ff of updatedWithPositions) {
        const { error } = await supabase
          .from('firefighters')
          .update({ order_position: ff.order_position })
          .eq('id', ff.id);

        if (error) throw error;
      }

      await logActivity('System', `Roster order updated manually`);
    } catch (error) {
      console.error('Error reordering firefighters:', error);
      setFirefighters(previousFirefighters);
      showToast('Could not update order. Please try again.', 'error');
    }
  }

  async function deactivateFirefighter(id: string) {
    const firefighter = firefighters.find(ff => ff.id === id);
    if (!firefighter) return;
    if (!confirm(`Deactivate ${firefighter.name}?\n\nThey will be removed from the roster but all their history and completed holds will be preserved.`)) return;

    const previousFirefighters = [...firefighters];
    setFirefighters(prev => prev.filter(ff => ff.id !== id));

    try {
      const { error } = await supabase
        .from('firefighters')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;

      showToast(`${firefighter.name} deactivated`, 'success');
      await logActivity(firefighter.name, 'deactivated', 'Deactivated from roster (history preserved)', id);
    } catch (error) {
      console.error('Error deactivating firefighter:', error);
      setFirefighters(previousFirefighters);
      showToast('Could not deactivate. Please try again.', 'error');
    }
  }

  async function transferShift(id: string, newShift: Shift) {
    const firefighter = firefighters.find(ff => ff.id === id);
    if (!firefighter) return;

    const previousFirefighters = [...firefighters];
    setFirefighters(prev => prev.filter(ff => ff.id !== id));

    try {
      // Get all firefighters in the new shift to find last position
      const { data: newShiftFFs, error: fetchError } = await supabase
        .from('firefighters')
        .select('*')
        .eq('shift', newShift)
        .eq('is_active', true)
        .order('order_position', { ascending: false });

      if (fetchError) throw fetchError;

      // Place at last position in new shift
      const lastPosition = newShiftFFs && newShiftFFs.length > 0 ? newShiftFFs[0].order_position + 1 : 0;

      const { error } = await supabase
        .from('firefighters')
        .update({
          shift: newShift,
          order_position: lastPosition,
          last_hold_date: null // Reset hold date when transferring
        })
        .eq('id', id);

      if (error) throw error;

      showToast(`${firefighter.name} transferred to Shift ${newShift} at last position`, 'success');
      await logActivity(firefighter.name, 'shift_transfer', `Transferred from Shift ${firefighter.shift} to Shift ${newShift} (placed at end)`, id);
    } catch (error) {
      console.error('Error transferring shift:', error);
      setFirefighters(previousFirefighters);
      showToast('Could not transfer shift. Please try again.', 'error');
    }
  }

  async function reactivateFirefighter(id: string, _position: number) {
    const firefighter = deactivatedFirefighters.find(ff => ff.id === id);
    if (!firefighter) return;

    const previousFirefighters = [...firefighters];
    const previousDeactivated = [...deactivatedFirefighters];

    try {
      // Always place at position 0 (top of rotation)
      const updatedList = [{ ...firefighter, is_active: true, is_available: true }, ...firefighters];
      const reordered = assignPositions(updatedList);
      setFirefighters(reordered);
      setDeactivatedFirefighters(prev => prev.filter(ff => ff.id !== id));

      for (const ff of reordered) {
        const { error } = await supabase
          .from('firefighters')
          .update({
            order_position: ff.order_position,
            is_active: ff.id === id ? true : ff.is_active,
            is_available: ff.id === id ? true : ff.is_available
          })
          .eq('id', ff.id);

        if (error) throw error;
      }

      showToast(`${firefighter.name} reactivated at position 1`, 'success');
      await logActivity(firefighter.name, 'reactivated', 'Reactivated and placed at position 1', id);
    } catch (error) {
      console.error('Error reactivating firefighter:', error);
      setFirefighters(previousFirefighters);
      setDeactivatedFirefighters(previousDeactivated);
      showToast('Could not reactivate. Please try again.', 'error');
    }
  }

  return {
    firefighters,
    deactivatedFirefighters,
    loading,
    addFirefighter,
    completeHold,
    deleteFirefighter,
    deactivateFirefighter,
    reactivateFirefighter,
    transferShift,
    resetAll,
    masterReset,
    reorderFirefighters,
    isOperationLoading,
    loadingStates
  };
}
