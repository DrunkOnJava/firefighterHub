/**
 * useFirefighters Hook Tests
 * 
 * Tests the core firefighter management hook including:
 * - Data fetching and filtering
 * - Hold completion workflow
 * - CRUD operations
 * - Rotation logic integration
 * - Activity logging
 * - Optimistic updates and error handling
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useFirefighters } from '../useFirefighters';
import { 
  mockDatabase, 
  resetMockDatabase, 
  setMockFirefighters,
  simulateError,
  clearErrorSimulation
} from '../../test/supabaseMockV2';
import type { Firefighter } from '../../lib/supabase';

// Mock the supabase module
vi.mock('../../lib/supabase', async () => {
  const actual = await vi.importActual('../../lib/supabase');
  const { createMockSupabaseClient } = await import('../../test/supabaseMockV2');
  return {
    ...actual,
    supabase: createMockSupabaseClient(),
  };
});

describe('useFirefighters', () => {
  const mockToast = vi.fn();

  beforeEach(() => {
    resetMockDatabase();
    mockToast.mockClear();
    clearErrorSimulation();
  });

  describe('loadFirefighters()', () => {
    it('should load active firefighters for current shift only', async () => {
      const shiftAFirefighters: Firefighter[] = [
        {
          id: 'ff1',
          name: 'John Doe',
          shift: 'A',
          is_active: true,
          is_available: true,
          order_position: 0,
          fire_station: '1',
          last_hold_date: null,
          certification_level: 'Firefighter',
          apparatus_ambulance: true,
          apparatus_brush_truck: false,
          apparatus_engine: true,
          apparatus_tanker: false,
          apparatus_truck: false,
          apparatus_boat: false,
          apparatus_utv: false,
          apparatus_rescue_squad: false,
          is_fto: false,
          is_bls: true,
          is_als: false,
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z',
        },
        {
          id: 'ff2',
          name: 'Jane Smith',
          shift: 'A',
          is_active: true,
          is_available: true,
          order_position: 1,
          fire_station: '2',
          last_hold_date: null,
          certification_level: 'Engineer',
          apparatus_ambulance: false,
          apparatus_brush_truck: true,
          apparatus_engine: true,
          apparatus_tanker: false,
          apparatus_truck: false,
          apparatus_boat: false,
          apparatus_utv: false,
          apparatus_rescue_squad: false,
          is_fto: true,
          is_bls: true,
          is_als: false,
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z',
        },
      ];

      const shiftBFirefighter: Firefighter = {
        id: 'ff3',
        name: 'Bob Johnson',
        shift: 'B',
        is_active: true,
        is_available: true,
        order_position: 0,
        fire_station: '1',
        last_hold_date: null,
        certification_level: 'Captain',
        apparatus_ambulance: true,
        apparatus_brush_truck: true,
        apparatus_engine: true,
        apparatus_tanker: true,
        apparatus_truck: true,
        apparatus_boat: false,
        apparatus_utv: false,
        apparatus_rescue_squad: false,
        is_fto: true,
        is_bls: true,
        is_als: true,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
      };

      setMockFirefighters([...shiftAFirefighters, shiftBFirefighter]);

      const { result } = renderHook(() => useFirefighters(mockToast, 'A'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.firefighters).toHaveLength(2);
      expect(result.current.firefighters.every(ff => ff.shift === 'A')).toBe(true);
      expect(result.current.firefighters.find(ff => ff.id === 'ff3')).toBeUndefined();
    });

    it('should only load active firefighters (is_active = true)', async () => {
      const firefighters: Firefighter[] = [
        {
          id: 'ff1',
          name: 'Active Person',
          shift: 'A',
          is_active: true,
          is_available: true,
          order_position: 0,
          fire_station: null,
          last_hold_date: null,
          certification_level: null,
          apparatus_ambulance: false,
          apparatus_brush_truck: false,
          apparatus_engine: false,
          apparatus_tanker: false,
          apparatus_truck: false,
          apparatus_boat: false,
          apparatus_utv: false,
          apparatus_rescue_squad: false,
          is_fto: false,
          is_bls: false,
          is_als: false,
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z',
        },
        {
          id: 'ff2',
          name: 'Deactivated Person',
          shift: 'A',
          is_active: false,
          is_available: false,
          order_position: 1,
          fire_station: null,
          last_hold_date: null,
          certification_level: null,
          apparatus_ambulance: false,
          apparatus_brush_truck: false,
          apparatus_engine: false,
          apparatus_tanker: false,
          apparatus_truck: false,
          apparatus_boat: false,
          apparatus_utv: false,
          apparatus_rescue_squad: false,
          is_fto: false,
          is_bls: false,
          is_als: false,
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z',
        },
      ];

      setMockFirefighters(firefighters);

      const { result } = renderHook(() => useFirefighters(mockToast, 'A'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.firefighters).toHaveLength(1);
      expect(result.current.firefighters[0].name).toBe('Active Person');
      expect(result.current.deactivatedFirefighters).toHaveLength(1);
      expect(result.current.deactivatedFirefighters[0].name).toBe('Deactivated Person');
    });

    it('should sort firefighters by order_position', async () => {
      const firefighters: Firefighter[] = [
        {
          id: 'ff2',
          name: 'Second',
          shift: 'A',
          is_active: true,
          is_available: true,
          order_position: 1,
          fire_station: null,
          last_hold_date: null,
          certification_level: null,
          apparatus_ambulance: false,
          apparatus_brush_truck: false,
          apparatus_engine: false,
          apparatus_tanker: false,
          apparatus_truck: false,
          apparatus_boat: false,
          apparatus_utv: false,
          apparatus_rescue_squad: false,
          is_fto: false,
          is_bls: false,
          is_als: false,
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z',
        },
        {
          id: 'ff1',
          name: 'First',
          shift: 'A',
          is_active: true,
          is_available: true,
          order_position: 0,
          fire_station: null,
          last_hold_date: null,
          certification_level: null,
          apparatus_ambulance: false,
          apparatus_brush_truck: false,
          apparatus_engine: false,
          apparatus_tanker: false,
          apparatus_truck: false,
          apparatus_boat: false,
          apparatus_utv: false,
          apparatus_rescue_squad: false,
          is_fto: false,
          is_bls: false,
          is_als: false,
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z',
        },
      ];

      setMockFirefighters(firefighters);

      const { result } = renderHook(() => useFirefighters(mockToast, 'A'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.firefighters[0].name).toBe('First');
      expect(result.current.firefighters[1].name).toBe('Second');
    });

    it('should handle empty state (no firefighters)', async () => {
      setMockFirefighters([]);

      const { result } = renderHook(() => useFirefighters(mockToast, 'A'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.firefighters).toHaveLength(0);
      expect(result.current.deactivatedFirefighters).toHaveLength(0);
    });

    it('should handle error when fetch fails', async () => {
      simulateError('Network error', true);

      const { result } = renderHook(() => useFirefighters(mockToast, 'A'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(mockToast).toHaveBeenCalledWith(
        'Could not load firefighters. Check your connection and refresh.',
        'error'
      );
    });
  });

  describe('completeHold()', () => {
    it('should complete a hold successfully', async () => {
      const firefighters: Firefighter[] = [
        {
          id: 'ff1',
          name: 'John Doe',
          shift: 'A',
          is_active: true,
          is_available: true,
          order_position: 0,
          fire_station: '1',
          last_hold_date: null,
          certification_level: null,
          apparatus_ambulance: false,
          apparatus_brush_truck: false,
          apparatus_engine: false,
          apparatus_tanker: false,
          apparatus_truck: false,
          apparatus_boat: false,
          apparatus_utv: false,
          apparatus_rescue_squad: false,
          is_fto: false,
          is_bls: false,
          is_als: false,
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z',
        },
        {
          id: 'ff2',
          name: 'Jane Smith',
          shift: 'A',
          is_active: true,
          is_available: true,
          order_position: 1,
          fire_station: '2',
          last_hold_date: null,
          certification_level: null,
          apparatus_ambulance: false,
          apparatus_brush_truck: false,
          apparatus_engine: false,
          apparatus_tanker: false,
          apparatus_truck: false,
          apparatus_boat: false,
          apparatus_utv: false,
          apparatus_rescue_squad: false,
          is_fto: false,
          is_bls: false,
          is_als: false,
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z',
        },
      ];

      setMockFirefighters(firefighters);

      const { result } = renderHook(() => useFirefighters(mockToast, 'A'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const holdDate = '2025-10-27';
      // Pass position 2 (user display) which becomes index 1 (internal)
      await result.current.completeHold('ff1', holdDate, 2);

      await waitFor(() => {
        const ffs = result.current.firefighters;
        expect(ffs.length).toBe(2);
      });

      // Firefighter moved to bottom (position 1)
      const completedFF = result.current.firefighters.find(ff => ff.id === 'ff1');
      expect(completedFF?.order_position).toBe(1);
      expect(completedFF?.last_hold_date).toBe(holdDate);

      // Other firefighter moved up (position 0)
      const otherFF = result.current.firefighters.find(ff => ff.id === 'ff2');
      expect(otherFF?.order_position).toBe(0);

      // Verify scheduled_holds entry created
      const scheduledHold = mockDatabase.scheduled_holds.find(
        h => h.firefighter_id === 'ff1'
      );
      expect(scheduledHold).toBeDefined();
      expect(scheduledHold?.status).toBe('completed');
      expect(scheduledHold?.hold_date).toBe(holdDate);
      expect(scheduledHold?.firefighter_name).toBe('John Doe');
      expect(scheduledHold?.shift).toBe('A');
      expect(scheduledHold?.completed_at).toBeDefined();

      // Verify activity log entry
      const activityLog = mockDatabase.activity_log.find(
        log => log.firefighter_id === 'ff1' && log.action_type === 'completed_hold'
      );
      expect(activityLog).toBeDefined();
      expect(activityLog?.details).toContain('moved to position 2'); // Position 2 out of 2 firefighters

      // Verify toast notification
      expect(mockToast).toHaveBeenCalledWith(
        expect.stringContaining('John Doe finished their hold'),
        'success'
      );
    });

    it('should update last_hold_date when completing hold', async () => {
      const firefighters: Firefighter[] = [
        {
          id: 'ff1',
          name: 'Test Person',
          shift: 'A',
          is_active: true,
          is_available: true,
          order_position: 0,
          fire_station: null,
          last_hold_date: null,
          certification_level: null,
          apparatus_ambulance: false,
          apparatus_brush_truck: false,
          apparatus_engine: false,
          apparatus_tanker: false,
          apparatus_truck: false,
          apparatus_boat: false,
          apparatus_utv: false,
          apparatus_rescue_squad: false,
          is_fto: false,
          is_bls: false,
          is_als: false,
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z',
        },
      ];

      setMockFirefighters(firefighters);

      const { result } = renderHook(() => useFirefighters(mockToast, 'A'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const holdDate = '2025-10-15';
      await result.current.completeHold('ff1', holdDate, 1); // position 1 (only one firefighter)

      await waitFor(() => {
        expect(result.current.firefighters.length).toBe(1);
      });

      const updatedFF = result.current.firefighters.find(ff => ff.id === 'ff1');
      expect(updatedFF?.last_hold_date).toBe(holdDate);
    });

    it('should recalculate all positions after hold completion', async () => {
      const firefighters: Firefighter[] = [
        { id: 'ff1', name: 'First', shift: 'A', is_active: true, is_available: true, order_position: 0, fire_station: null, last_hold_date: null, certification_level: null, apparatus_ambulance: false, apparatus_brush_truck: false, apparatus_engine: false, apparatus_tanker: false, apparatus_truck: false, apparatus_boat: false, apparatus_utv: false, apparatus_rescue_squad: false, is_fto: false, is_bls: false, is_als: false, created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z' },
        { id: 'ff2', name: 'Second', shift: 'A', is_active: true, is_available: true, order_position: 1, fire_station: null, last_hold_date: null, certification_level: null, apparatus_ambulance: false, apparatus_brush_truck: false, apparatus_engine: false, apparatus_tanker: false, apparatus_truck: false, apparatus_boat: false, apparatus_utv: false, apparatus_rescue_squad: false, is_fto: false, is_bls: false, is_als: false, created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z' },
        { id: 'ff3', name: 'Third', shift: 'A', is_active: true, is_available: true, order_position: 2, fire_station: null, last_hold_date: null, certification_level: null, apparatus_ambulance: false, apparatus_brush_truck: false, apparatus_engine: false, apparatus_tanker: false, apparatus_truck: false, apparatus_boat: false, apparatus_utv: false, apparatus_rescue_squad: false, is_fto: false, is_bls: false, is_als: false, created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z' },
      ];

      setMockFirefighters(firefighters);

      const { result } = renderHook(() => useFirefighters(mockToast, 'A'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await result.current.completeHold('ff1', '2025-10-27', 3); // Move to position 3 (bottom)

      await waitFor(() => {
        expect(result.current.firefighters.length).toBe(3);
      });

      const ffs = result.current.firefighters;
      // Positions should be normalized: 0, 1, 2 (no gaps)
      expect(ffs.find(ff => ff.id === 'ff2')?.order_position).toBe(0);
      expect(ffs.find(ff => ff.id === 'ff3')?.order_position).toBe(1);
      expect(ffs.find(ff => ff.id === 'ff1')?.order_position).toBe(2);
    });

    it('should not complete hold for unavailable firefighter', async () => {
      const firefighters: Firefighter[] = [
        {
          id: 'ff1',
          name: 'Unavailable Person',
          shift: 'A',
          is_active: true,
          is_available: false,
          order_position: 0,
          fire_station: null,
          last_hold_date: null,
          certification_level: null,
          apparatus_ambulance: false,
          apparatus_brush_truck: false,
          apparatus_engine: false,
          apparatus_tanker: false,
          apparatus_truck: false,
          apparatus_boat: false,
          apparatus_utv: false,
          apparatus_rescue_squad: false,
          is_fto: false,
          is_bls: false,
          is_als: false,
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z',
        },
      ];

      setMockFirefighters(firefighters);

      const { result } = renderHook(() => useFirefighters(mockToast, 'A'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await result.current.completeHold('ff1', '2025-10-27', 1); // Try to complete with position 1

      // Should not create scheduled_holds entry
      expect(mockDatabase.scheduled_holds).toHaveLength(0);
    });

    it('should rollback on error', async () => {
      const firefighters: Firefighter[] = [
        { id: 'ff1', name: 'John', shift: 'A', is_active: true, is_available: true, order_position: 0, fire_station: null, last_hold_date: null, certification_level: null, apparatus_ambulance: false, apparatus_brush_truck: false, apparatus_engine: false, apparatus_tanker: false, apparatus_truck: false, apparatus_boat: false, apparatus_utv: false, apparatus_rescue_squad: false, is_fto: false, is_bls: false, is_als: false, created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z' },
        { id: 'ff2', name: 'Jane', shift: 'A', is_active: true, is_available: true, order_position: 1, fire_station: null, last_hold_date: null, certification_level: null, apparatus_ambulance: false, apparatus_brush_truck: false, apparatus_engine: false, apparatus_tanker: false, apparatus_truck: false, apparatus_boat: false, apparatus_utv: false, apparatus_rescue_squad: false, is_fto: false, is_bls: false, is_als: false, created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z' },
      ];

      setMockFirefighters(firefighters);

      const { result } = renderHook(() => useFirefighters(mockToast, 'A'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const initialState = [...result.current.firefighters];

      // Simulate error on all calls (not just next one)
      simulateError('Database error', false);

      await result.current.completeHold('ff1', '2025-10-27', 2); // Try to move to position 2

      await waitFor(() => {
        // State should be rolled back
        expect(result.current.firefighters[0].id).toBe(initialState[0].id);
        expect(result.current.firefighters[0].order_position).toBe(initialState[0].order_position);
      });

      expect(mockToast).toHaveBeenCalledWith(
        'Could not complete hold. Please try again.',
        'error'
      );

      // Clear error for subsequent tests
      clearErrorSimulation();
    });

    it('should handle station parameter correctly', async () => {
      const firefighters: Firefighter[] = [
        {
          id: 'ff1',
          name: 'John Doe',
          shift: 'A',
          is_active: true,
          is_available: true,
          order_position: 0,
          fire_station: '1',
          last_hold_date: null,
          certification_level: null,
          apparatus_ambulance: false,
          apparatus_brush_truck: false,
          apparatus_engine: false,
          apparatus_tanker: false,
          apparatus_truck: false,
          apparatus_boat: false,
          apparatus_utv: false,
          apparatus_rescue_squad: false,
          is_fto: false,
          is_bls: false,
          is_als: false,
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z',
        },
      ];

      setMockFirefighters(firefighters);

      const { result } = renderHook(() => useFirefighters(mockToast, 'A'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Complete hold with custom station
      await result.current.completeHold('ff1', '2025-10-27', 1, '5'); // position 1, station '5'

      await waitFor(() => {
        expect(mockDatabase.scheduled_holds.length).toBeGreaterThan(0);
      });

      const scheduledHold = mockDatabase.scheduled_holds.find(
        h => h.firefighter_id === 'ff1'
      );
      expect(scheduledHold?.fire_station).toBe('5');

      expect(mockToast).toHaveBeenCalledWith(
        expect.stringContaining('at Station #5'),
        'success'
      );
    });
  });

  describe('addFirefighter()', () => {
    it('should add firefighter with correct position assignment', async () => {
      const existingFirefighters: Firefighter[] = [
        { id: 'ff1', name: 'Existing FF', shift: 'A', is_active: true, is_available: true, order_position: 0, fire_station: null, last_hold_date: null, certification_level: null, apparatus_ambulance: false, apparatus_brush_truck: false, apparatus_engine: false, apparatus_tanker: false, apparatus_truck: false, apparatus_boat: false, apparatus_utv: false, apparatus_rescue_squad: false, is_fto: false, is_bls: false, is_als: false, created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z' },
      ];

      setMockFirefighters(existingFirefighters);

      const { result } = renderHook(() => useFirefighters(mockToast, 'A'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await result.current.addFirefighter('New Person', '5');

      await waitFor(() => {
        expect(result.current.firefighters.length).toBe(2);
      });

      const newFF = result.current.firefighters.find(ff => ff.name === 'New Person');
      expect(newFF).toBeDefined();
      expect(newFF?.order_position).toBe(1); // Should be at end (max + 1)
      expect(newFF?.fire_station).toBe('5');
      expect(newFF?.shift).toBe('A');
      expect(newFF?.is_active).toBe(true);
      expect(newFF?.is_available).toBe(true);
    });

    it('should add firefighter with apparatus clearances', async () => {
      setMockFirefighters([]);

      const { result } = renderHook(() => useFirefighters(mockToast, 'A'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await result.current.addFirefighter(
        'Apparatus Cleared FF',
        '1',
        'Engineer',
        {
          ambulance: true,
          engine: true,
          truck: true,
          tanker: false,
        }
      );

      await waitFor(() => {
        expect(result.current.firefighters.length).toBe(1);
      });

      const newFF = result.current.firefighters[0];
      expect(newFF.apparatus_ambulance).toBe(true);
      expect(newFF.apparatus_engine).toBe(true);
      expect(newFF.apparatus_truck).toBe(true);
      expect(newFF.apparatus_tanker).toBe(false);
      expect(newFF.certification_level).toBe('Engineer');
    });

    it('should add firefighter with certifications', async () => {
      setMockFirefighters([]);

      const { result } = renderHook(() => useFirefighters(mockToast, 'A'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await result.current.addFirefighter(
        'Certified FF',
        '1',
        'Paramedic',
        undefined,
        {
          isFTO: true,
          isBLS: true,
          isALS: true,
        }
      );

      await waitFor(() => {
        expect(result.current.firefighters.length).toBe(1);
      });

      const newFF = result.current.firefighters[0];
      expect(newFF.is_fto).toBe(true);
      expect(newFF.is_bls).toBe(true);
      expect(newFF.is_als).toBe(true);
    });

    it('should show optimistic update immediately', async () => {
      setMockFirefighters([]);

      const { result } = renderHook(() => useFirefighters(mockToast, 'A'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.firefighters.length).toBe(0);

      // Start adding firefighter
      void result.current.addFirefighter('Optimistic FF', '1');

      // Optimistic update should show immediately (firefighter appears before DB responds)
      await waitFor(() => {
        expect(result.current.firefighters.length).toBe(1);
        const ff = result.current.firefighters[0];
        expect(ff.name).toBe('Optimistic FF');
        // The ID will be temp- initially, then replaced with real ID
        // We just verify the firefighter appears immediately
      }, { timeout: 100 }); // Short timeout to verify it happens quickly
    });

    it('should replace optimistic update with real data', async () => {
      setMockFirefighters([]);

      const { result } = renderHook(() => useFirefighters(mockToast, 'A'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await result.current.addFirefighter('Real FF', '1');

      await waitFor(() => {
        expect(result.current.firefighters.length).toBe(1);
      });

      const realFF = result.current.firefighters[0];
      expect(realFF.id).not.toContain('temp-'); // Should have real ID from database
      expect(realFF.id).toContain('mock-'); // Mock database generates IDs with 'mock-' prefix
    });

    it('should rollback optimistic update on error', async () => {
      setMockFirefighters([]);

      const { result } = renderHook(() => useFirefighters(mockToast, 'A'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      simulateError('Insert failed', true);

      await result.current.addFirefighter('Failed FF', '1');

      await waitFor(() => {
        // Optimistic FF should be removed after error
        expect(result.current.firefighters.length).toBe(0);
      });

      expect(mockToast).toHaveBeenCalledWith(
        'Could not add team member. Please try again.',
        'error'
      );
    });

    it('should log activity when firefighter added', async () => {
      setMockFirefighters([]);

      const { result } = renderHook(() => useFirefighters(mockToast, 'A'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await result.current.addFirefighter('Activity Log Test', '1');

      await waitFor(() => {
        const log = mockDatabase.activity_log.find(
          l => l.firefighter_name === 'Activity Log Test' && l.action_type === 'added'
        );
        expect(log).toBeDefined();
        expect(log?.details).toBe('Added to hold list');
        expect(log?.shift).toBe('A');
      });
    });

    it('should show success toast with position', async () => {
      setMockFirefighters([
        { id: 'ff1', name: 'First', shift: 'A', is_active: true, is_available: true, order_position: 0, fire_station: null, last_hold_date: null, certification_level: null, apparatus_ambulance: false, apparatus_brush_truck: false, apparatus_engine: false, apparatus_tanker: false, apparatus_truck: false, apparatus_boat: false, apparatus_utv: false, apparatus_rescue_squad: false, is_fto: false, is_bls: false, is_als: false, created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z' },
      ]);

      const { result } = renderHook(() => useFirefighters(mockToast, 'A'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await result.current.addFirefighter('Second', '1');

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith(
          expect.stringMatching(/Second joined the rotation at position 2/),
          'success'
        );
      });
    });
  });

  describe('deleteFirefighter()', () => {
    it('should delete firefighter after confirmation', async () => {
      const confirmSpy = vi.spyOn(globalThis, 'confirm').mockReturnValue(true);

      const firefighters: Firefighter[] = [
        { id: 'ff1', name: 'To Delete', shift: 'A', is_active: true, is_available: true, order_position: 0, fire_station: null, last_hold_date: null, certification_level: null, apparatus_ambulance: false, apparatus_brush_truck: false, apparatus_engine: false, apparatus_tanker: false, apparatus_truck: false, apparatus_boat: false, apparatus_utv: false, apparatus_rescue_squad: false, is_fto: false, is_bls: false, is_als: false, created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z' },
      ];

      setMockFirefighters(firefighters);

      const { result } = renderHook(() => useFirefighters(mockToast, 'A'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await result.current.deleteFirefighter('ff1');

      await waitFor(() => {
        expect(result.current.firefighters.length).toBe(0);
      });

      expect(confirmSpy).toHaveBeenCalled();
      expect(mockToast).toHaveBeenCalledWith(
        'To Delete removed - hold history preserved',
        'success'
      );

      confirmSpy.mockRestore();
    });

    it('should NOT delete if user cancels confirmation', async () => {
      const confirmSpy = vi.spyOn(globalThis, 'confirm').mockReturnValue(false);

      const firefighters: Firefighter[] = [
        { id: 'ff1', name: 'Keep Me', shift: 'A', is_active: true, is_available: true, order_position: 0, fire_station: null, last_hold_date: null, certification_level: null, apparatus_ambulance: false, apparatus_brush_truck: false, apparatus_engine: false, apparatus_tanker: false, apparatus_truck: false, apparatus_boat: false, apparatus_utv: false, apparatus_rescue_squad: false, is_fto: false, is_bls: false, is_als: false, created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z' },
      ];

      setMockFirefighters(firefighters);

      const { result } = renderHook(() => useFirefighters(mockToast, 'A'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await result.current.deleteFirefighter('ff1');

      // Should still be there
      expect(result.current.firefighters.length).toBe(1);
      expect(confirmSpy).toHaveBeenCalled();

      confirmSpy.mockRestore();
    });

    it('should log activity when firefighter deleted', async () => {
      const confirmSpy = vi.spyOn(globalThis, 'confirm').mockReturnValue(true);

      const firefighters: Firefighter[] = [
        { id: 'ff1', name: 'Activity Test', shift: 'A', is_active: true, is_available: true, order_position: 0, fire_station: null, last_hold_date: null, certification_level: null, apparatus_ambulance: false, apparatus_brush_truck: false, apparatus_engine: false, apparatus_tanker: false, apparatus_truck: false, apparatus_boat: false, apparatus_utv: false, apparatus_rescue_squad: false, is_fto: false, is_bls: false, is_als: false, created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z' },
      ];

      setMockFirefighters(firefighters);

      const { result } = renderHook(() => useFirefighters(mockToast, 'A'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await result.current.deleteFirefighter('ff1');

      await waitFor(() => {
        const log = mockDatabase.activity_log.find(
          l => l.firefighter_name === 'Activity Test' && l.action_type === 'removed'
        );
        expect(log).toBeDefined();
      });

      confirmSpy.mockRestore();
    });

    it('should rollback on error', async () => {
      const confirmSpy = vi.spyOn(globalThis, 'confirm').mockReturnValue(true);

      const firefighters: Firefighter[] = [
        { id: 'ff1', name: 'Error Test', shift: 'A', is_active: true, is_available: true, order_position: 0, fire_station: null, last_hold_date: null, certification_level: null, apparatus_ambulance: false, apparatus_brush_truck: false, apparatus_engine: false, apparatus_tanker: false, apparatus_truck: false, apparatus_boat: false, apparatus_utv: false, apparatus_rescue_squad: false, is_fto: false, is_bls: false, is_als: false, created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z' },
      ];

      setMockFirefighters(firefighters);

      const { result } = renderHook(() => useFirefighters(mockToast, 'A'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Use continuous error simulation (not just next call)
      simulateError('Delete failed', false);

      await result.current.deleteFirefighter('ff1');

      await waitFor(() => {
        // Should be rolled back
        expect(result.current.firefighters.length).toBe(1);
      });

      expect(mockToast).toHaveBeenCalledWith(
        'Could not remove team member. Please try again.',
        'error'
      );

      // Clear error for subsequent tests
      clearErrorSimulation();
      confirmSpy.mockRestore();
    });
  });

  describe('reorderFirefighters()', () => {
    it('should reorder firefighters and update database', async () => {
      const firefighters: Firefighter[] = [
        { id: 'ff1', name: 'First', shift: 'A', is_active: true, is_available: true, order_position: 0, fire_station: null, last_hold_date: null, certification_level: null, apparatus_ambulance: false, apparatus_brush_truck: false, apparatus_engine: false, apparatus_tanker: false, apparatus_truck: false, apparatus_boat: false, apparatus_utv: false, apparatus_rescue_squad: false, is_fto: false, is_bls: false, is_als: false, created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z' },
        { id: 'ff2', name: 'Second', shift: 'A', is_active: true, is_available: true, order_position: 1, fire_station: null, last_hold_date: null, certification_level: null, apparatus_ambulance: false, apparatus_brush_truck: false, apparatus_engine: false, apparatus_tanker: false, apparatus_truck: false, apparatus_boat: false, apparatus_utv: false, apparatus_rescue_squad: false, is_fto: false, is_bls: false, is_als: false, created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z' },
        { id: 'ff3', name: 'Third', shift: 'A', is_active: true, is_available: true, order_position: 2, fire_station: null, last_hold_date: null, certification_level: null, apparatus_ambulance: false, apparatus_brush_truck: false, apparatus_engine: false, apparatus_tanker: false, apparatus_truck: false, apparatus_boat: false, apparatus_utv: false, apparatus_rescue_squad: false, is_fto: false, is_bls: false, is_als: false, created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z' },
      ];

      setMockFirefighters(firefighters);

      const { result } = renderHook(() => useFirefighters(mockToast, 'A'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Reorder: move ff3 to position 0
      const reordered = [
        { ...firefighters[2], order_position: 0 },
        { ...firefighters[0], order_position: 1 },
        { ...firefighters[1], order_position: 2 },
      ];

      await result.current.reorderFirefighters(reordered);

      await waitFor(() => {
        const updated = result.current.firefighters;
        expect(updated[0].name).toBe('Third');
        expect(updated[0].order_position).toBe(0);
        expect(updated[1].name).toBe('First');
        expect(updated[1].order_position).toBe(1);
        expect(updated[2].name).toBe('Second');
        expect(updated[2].order_position).toBe(2);
      });
    });

    it('should rollback on error', async () => {
      const firefighters: Firefighter[] = [
        { id: 'ff1', name: 'First', shift: 'A', is_active: true, is_available: true, order_position: 0, fire_station: null, last_hold_date: null, certification_level: null, apparatus_ambulance: false, apparatus_brush_truck: false, apparatus_engine: false, apparatus_tanker: false, apparatus_truck: false, apparatus_boat: false, apparatus_utv: false, apparatus_rescue_squad: false, is_fto: false, is_bls: false, is_als: false, created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z' },
        { id: 'ff2', name: 'Second', shift: 'A', is_active: true, is_available: true, order_position: 1, fire_station: null, last_hold_date: null, certification_level: null, apparatus_ambulance: false, apparatus_brush_truck: false, apparatus_engine: false, apparatus_tanker: false, apparatus_truck: false, apparatus_boat: false, apparatus_utv: false, apparatus_rescue_squad: false, is_fto: false, is_bls: false, is_als: false, created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z' },
      ];

      setMockFirefighters(firefighters);

      const { result } = renderHook(() => useFirefighters(mockToast, 'A'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      simulateError('Update failed', false);

      const reordered = [
        { ...firefighters[1], order_position: 0 },
        { ...firefighters[0], order_position: 1 },
      ];

      await result.current.reorderFirefighters(reordered);

      await waitFor(() => {
        // Should rollback to original order
        expect(result.current.firefighters[0].name).toBe('First');
        expect(result.current.firefighters[1].name).toBe('Second');
      });

      expect(mockToast).toHaveBeenCalledWith(
        'Could not update order. Please try again.',
        'error'
      );

      clearErrorSimulation();
    });
  });

  describe('deactivateFirefighter()', () => {
    it('should deactivate firefighter (soft delete)', async () => {
      const confirmSpy = vi.spyOn(globalThis, 'confirm').mockReturnValue(true);

      const firefighters: Firefighter[] = [
        { id: 'ff1', name: 'Active User', shift: 'A', is_active: true, is_available: true, order_position: 0, fire_station: null, last_hold_date: null, certification_level: null, apparatus_ambulance: false, apparatus_brush_truck: false, apparatus_engine: false, apparatus_tanker: false, apparatus_truck: false, apparatus_boat: false, apparatus_utv: false, apparatus_rescue_squad: false, is_fto: false, is_bls: false, is_als: false, created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z' },
      ];

      setMockFirefighters(firefighters);

      const { result } = renderHook(() => useFirefighters(mockToast, 'A'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await result.current.deactivateFirefighter('ff1');

      await waitFor(() => {
        // Should be removed from active roster
        expect(result.current.firefighters.length).toBe(0);
        
        // Should still exist in database with is_active=false
        const dbRecord = mockDatabase.firefighters.find(f => f.id === 'ff1');
        expect(dbRecord).toBeDefined();
        expect(dbRecord?.is_active).toBe(false);
      });

      confirmSpy.mockRestore();
    });

    it('should cancel deactivation if not confirmed', async () => {
      const confirmSpy = vi.spyOn(globalThis, 'confirm').mockReturnValue(false);

      const firefighters: Firefighter[] = [
        { id: 'ff1', name: 'Active User', shift: 'A', is_active: true, is_available: true, order_position: 0, fire_station: null, last_hold_date: null, certification_level: null, apparatus_ambulance: false, apparatus_brush_truck: false, apparatus_engine: false, apparatus_tanker: false, apparatus_truck: false, apparatus_boat: false, apparatus_utv: false, apparatus_rescue_squad: false, is_fto: false, is_bls: false, is_als: false, created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z' },
      ];

      setMockFirefighters(firefighters);

      const { result } = renderHook(() => useFirefighters(mockToast, 'A'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await result.current.deactivateFirefighter('ff1');

      // Should still be there
      expect(result.current.firefighters.length).toBe(1);
      expect(confirmSpy).toHaveBeenCalled();

      confirmSpy.mockRestore();
    });

    it('should log activity when firefighter deactivated', async () => {
      const confirmSpy = vi.spyOn(globalThis, 'confirm').mockReturnValue(true);

      const firefighters: Firefighter[] = [
        { id: 'ff1', name: 'Deactivate Test', shift: 'A', is_active: true, is_available: true, order_position: 0, fire_station: null, last_hold_date: null, certification_level: null, apparatus_ambulance: false, apparatus_brush_truck: false, apparatus_engine: false, apparatus_tanker: false, apparatus_truck: false, apparatus_boat: false, apparatus_utv: false, apparatus_rescue_squad: false, is_fto: false, is_bls: false, is_als: false, created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z' },
      ];

      setMockFirefighters(firefighters);

      const { result } = renderHook(() => useFirefighters(mockToast, 'A'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await result.current.deactivateFirefighter('ff1');

      await waitFor(() => {
        const log = mockDatabase.activity_log.find(
          l => l.firefighter_name === 'Deactivate Test' && l.action_type === 'deactivated'
        );
        expect(log).toBeDefined();
      });

      confirmSpy.mockRestore();
    });
  });

  describe('reactivateFirefighter()', () => {
    it('should reactivate firefighter and add to position 0', async () => {
      const firefighters: Firefighter[] = [
        { id: 'ff1', name: 'Active User', shift: 'A', is_active: true, is_available: true, order_position: 0, fire_station: null, last_hold_date: null, certification_level: null, apparatus_ambulance: false, apparatus_brush_truck: false, apparatus_engine: false, apparatus_tanker: false, apparatus_truck: false, apparatus_boat: false, apparatus_utv: false, apparatus_rescue_squad: false, is_fto: false, is_bls: false, is_als: false, created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z' },
        { id: 'ff2', name: 'Inactive User', shift: 'A', is_active: false, is_available: true, order_position: 1, fire_station: null, last_hold_date: null, certification_level: null, apparatus_ambulance: false, apparatus_brush_truck: false, apparatus_engine: false, apparatus_tanker: false, apparatus_truck: false, apparatus_boat: false, apparatus_utv: false, apparatus_rescue_squad: false, is_fto: false, is_bls: false, is_als: false, created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z' },
      ];

      setMockFirefighters(firefighters);

      const { result } = renderHook(() => useFirefighters(mockToast, 'A'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await result.current.reactivateFirefighter('ff2', 0);

      await waitFor(() => {
        // Should be added to roster
        expect(result.current.firefighters.length).toBe(2);
        
        // Should be at position 0
        const reactivated = result.current.firefighters.find(f => f.id === 'ff2');
        expect(reactivated).toBeDefined();
        expect(reactivated?.is_active).toBe(true);
        expect(reactivated?.order_position).toBe(0);
        
        // Original ff1 should be pushed to position 1
        const original = result.current.firefighters.find(f => f.id === 'ff1');
        expect(original?.order_position).toBe(1);
      });
    });

    it('should log activity when firefighter reactivated', async () => {
      const firefighters: Firefighter[] = [
        { id: 'ff1', name: 'Reactivate Test', shift: 'A', is_active: false, is_available: true, order_position: 0, fire_station: null, last_hold_date: null, certification_level: null, apparatus_ambulance: false, apparatus_brush_truck: false, apparatus_engine: false, apparatus_tanker: false, apparatus_truck: false, apparatus_boat: false, apparatus_utv: false, apparatus_rescue_squad: false, is_fto: false, is_bls: false, is_als: false, created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z' },
      ];

      setMockFirefighters(firefighters);

      const { result } = renderHook(() => useFirefighters(mockToast, 'A'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await result.current.reactivateFirefighter('ff1', 0);

      await waitFor(() => {
        const log = mockDatabase.activity_log.find(
          l => l.firefighter_name === 'Reactivate Test' && l.action_type === 'reactivated'
        );
        expect(log).toBeDefined();
      });
    });
  });

  describe('transferShift()', () => {
    it('should transfer firefighter to new shift', async () => {
      const firefighters: Firefighter[] = [
        { id: 'ff1', name: 'Transfer Test', shift: 'A', is_active: true, is_available: true, order_position: 0, fire_station: '1', last_hold_date: '2025-01-01', certification_level: 'FF1', apparatus_ambulance: true, apparatus_brush_truck: false, apparatus_engine: false, apparatus_tanker: false, apparatus_truck: false, apparatus_boat: false, apparatus_utv: false, apparatus_rescue_squad: false, is_fto: false, is_bls: false, is_als: false, created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z' },
        { id: 'ff2', name: 'Stay on A', shift: 'A', is_active: true, is_available: true, order_position: 1, fire_station: null, last_hold_date: null, certification_level: null, apparatus_ambulance: false, apparatus_brush_truck: false, apparatus_engine: false, apparatus_tanker: false, apparatus_truck: false, apparatus_boat: false, apparatus_utv: false, apparatus_rescue_squad: false, is_fto: false, is_bls: false, is_als: false, created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z' },
      ];

      setMockFirefighters(firefighters);

      const { result } = renderHook(() => useFirefighters(mockToast, 'A'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await result.current.transferShift('ff1', 'B');

      await waitFor(() => {
        // Should be removed from Shift A roster
        expect(result.current.firefighters.length).toBe(1);
        expect(result.current.firefighters[0].name).toBe('Stay on A');
        
        // Should exist in database with shift B
        const transferred = mockDatabase.firefighters.find(f => f.id === 'ff1');
        expect(transferred?.shift).toBe('B');
        expect(transferred?.last_hold_date).toBeNull();
      });
    });

    it('should log activity when firefighter transferred', async () => {
      const firefighters: Firefighter[] = [
        { id: 'ff1', name: 'Transfer Log Test', shift: 'A', is_active: true, is_available: true, order_position: 0, fire_station: null, last_hold_date: null, certification_level: null, apparatus_ambulance: false, apparatus_brush_truck: false, apparatus_engine: false, apparatus_tanker: false, apparatus_truck: false, apparatus_boat: false, apparatus_utv: false, apparatus_rescue_squad: false, is_fto: false, is_bls: false, is_als: false, created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z' },
      ];

      setMockFirefighters(firefighters);

      const { result } = renderHook(() => useFirefighters(mockToast, 'A'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await result.current.transferShift('ff1', 'C');

      await waitFor(() => {
        const log = mockDatabase.activity_log.find(
          l => l.firefighter_name === 'Transfer Log Test' && l.action_type === 'shift_transfer'
        );
        expect(log).toBeDefined();
        expect(log?.details).toContain('Transferred from Shift A to Shift C');
      });
    });

    it('should rollback on error', async () => {
      const firefighters: Firefighter[] = [
        { id: 'ff1', name: 'Transfer Error', shift: 'A', is_active: true, is_available: true, order_position: 0, fire_station: null, last_hold_date: null, certification_level: null, apparatus_ambulance: false, apparatus_brush_truck: false, apparatus_engine: false, apparatus_tanker: false, apparatus_truck: false, apparatus_boat: false, apparatus_utv: false, apparatus_rescue_squad: false, is_fto: false, is_bls: false, is_als: false, created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z' },
      ];

      setMockFirefighters(firefighters);

      const { result } = renderHook(() => useFirefighters(mockToast, 'A'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      simulateError('Transfer failed', false);

      await result.current.transferShift('ff1', 'B');

      await waitFor(() => {
        // Should still be on Shift A
        expect(result.current.firefighters.length).toBe(1);
        expect(result.current.firefighters[0].shift).toBe('A');
      });

      expect(mockToast).toHaveBeenCalledWith(
        'Could not transfer shift. Please try again.',
        'error'
      );

      clearErrorSimulation();
    });
  });

  describe('resetAll()', () => {
    it('should reset all firefighters (ALL SHIFTS) after confirmation', async () => {
      const confirmSpy = vi.spyOn(globalThis, 'confirm').mockReturnValue(true);

      const firefighters: Firefighter[] = [
        { id: 'ff1', name: 'User 1', shift: 'A', is_active: true, is_available: true, order_position: 0, fire_station: null, last_hold_date: null, certification_level: null, apparatus_ambulance: false, apparatus_brush_truck: false, apparatus_engine: false, apparatus_tanker: false, apparatus_truck: false, apparatus_boat: false, apparatus_utv: false, apparatus_rescue_squad: false, is_fto: false, is_bls: false, is_als: false, created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z' },
        { id: 'ff2', name: 'User 2', shift: 'A', is_active: true, is_available: true, order_position: 1, fire_station: null, last_hold_date: null, certification_level: null, apparatus_ambulance: false, apparatus_brush_truck: false, apparatus_engine: false, apparatus_tanker: false, apparatus_truck: false, apparatus_boat: false, apparatus_utv: false, apparatus_rescue_squad: false, is_fto: false, is_bls: false, is_als: false, created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z' },
        { id: 'ff3', name: 'User 3', shift: 'B', is_active: true, is_available: true, order_position: 0, fire_station: null, last_hold_date: null, certification_level: null, apparatus_ambulance: false, apparatus_brush_truck: false, apparatus_engine: false, apparatus_tanker: false, apparatus_truck: false, apparatus_boat: false, apparatus_utv: false, apparatus_rescue_squad: false, is_fto: false, is_bls: false, is_als: false, created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z' },
      ];

      setMockFirefighters(firefighters);

      const { result } = renderHook(() => useFirefighters(mockToast, 'A'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await result.current.resetAll();

      await waitFor(() => {
        // ALL firefighters should be deleted (not just Shift A)
        expect(mockDatabase.firefighters.length).toBe(0);
      });

      confirmSpy.mockRestore();
    });

    it('should cancel reset if not confirmed', async () => {
      const confirmSpy = vi.spyOn(globalThis, 'confirm').mockReturnValue(false);

      const firefighters: Firefighter[] = [
        { id: 'ff1', name: 'User 1', shift: 'A', is_active: true, is_available: true, order_position: 0, fire_station: null, last_hold_date: null, certification_level: null, apparatus_ambulance: false, apparatus_brush_truck: false, apparatus_engine: false, apparatus_tanker: false, apparatus_truck: false, apparatus_boat: false, apparatus_utv: false, apparatus_rescue_squad: false, is_fto: false, is_bls: false, is_als: false, created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z' },
      ];

      setMockFirefighters(firefighters);

      const { result } = renderHook(() => useFirefighters(mockToast, 'A'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await result.current.resetAll();

      // Should still have firefighters
      expect(result.current.firefighters.length).toBe(1);
      expect(confirmSpy).toHaveBeenCalled();

      confirmSpy.mockRestore();
    });
  });

  describe('masterReset()', () => {
    it('should reset all data after double confirmation', async () => {
      const confirmSpy = vi.spyOn(globalThis, 'confirm')
        .mockReturnValueOnce(true)  // First confirmation
        .mockReturnValueOnce(true); // Second confirmation

      const firefighters: Firefighter[] = [
        { id: 'ff1', name: 'User 1', shift: 'A', is_active: true, is_available: true, order_position: 0, fire_station: null, last_hold_date: null, certification_level: null, apparatus_ambulance: false, apparatus_brush_truck: false, apparatus_engine: false, apparatus_tanker: false, apparatus_truck: false, apparatus_boat: false, apparatus_utv: false, apparatus_rescue_squad: false, is_fto: false, is_bls: false, is_als: false, created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z' },
      ];

      setMockFirefighters(firefighters);

      const { result } = renderHook(() => useFirefighters(mockToast, 'A'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await result.current.masterReset();

      await waitFor(() => {
        // All firefighters should be deleted
        expect(mockDatabase.firefighters.length).toBe(0);
        
        // All scheduled holds should be deleted
        expect(mockDatabase.scheduled_holds.length).toBe(0);
        
        // All activity log should be deleted
        expect(mockDatabase.activity_log.length).toBe(0);
      });

      expect(confirmSpy).toHaveBeenCalledTimes(2);
      confirmSpy.mockRestore();
    });

    it('should cancel on first confirmation denial', async () => {
      const confirmSpy = vi.spyOn(globalThis, 'confirm').mockReturnValue(false);

      const firefighters: Firefighter[] = [
        { id: 'ff1', name: 'User 1', shift: 'A', is_active: true, is_available: true, order_position: 0, fire_station: null, last_hold_date: null, certification_level: null, apparatus_ambulance: false, apparatus_brush_truck: false, apparatus_engine: false, apparatus_tanker: false, apparatus_truck: false, apparatus_boat: false, apparatus_utv: false, apparatus_rescue_squad: false, is_fto: false, is_bls: false, is_als: false, created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z' },
      ];

      setMockFirefighters(firefighters);

      const { result } = renderHook(() => useFirefighters(mockToast, 'A'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await result.current.masterReset();

      // Should still have data
      expect(mockDatabase.firefighters.length).toBe(1);
      expect(confirmSpy).toHaveBeenCalledTimes(1);

      confirmSpy.mockRestore();
    });

    it('should cancel on second confirmation denial', async () => {
      const confirmSpy = vi.spyOn(globalThis, 'confirm')
        .mockReturnValueOnce(true)   // First confirmation
        .mockReturnValueOnce(false); // Second confirmation denied

      const firefighters: Firefighter[] = [
        { id: 'ff1', name: 'User 1', shift: 'A', is_active: true, is_available: true, order_position: 0, fire_station: null, last_hold_date: null, certification_level: null, apparatus_ambulance: false, apparatus_brush_truck: false, apparatus_engine: false, apparatus_tanker: false, apparatus_truck: false, apparatus_boat: false, apparatus_utv: false, apparatus_rescue_squad: false, is_fto: false, is_bls: false, is_als: false, created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z' },
      ];

      setMockFirefighters(firefighters);

      const { result } = renderHook(() => useFirefighters(mockToast, 'A'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await result.current.masterReset();

      // Should still have data
      expect(mockDatabase.firefighters.length).toBe(1);
      expect(confirmSpy).toHaveBeenCalledTimes(2);

      confirmSpy.mockRestore();
    });
  });
});
