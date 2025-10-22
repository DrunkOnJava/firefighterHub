// TECHNICAL DEBT: This file was completely missing from the project!
// All 25+ source files import from this path but it didn't exist.
// This is a CRITICAL missing file that would cause complete build failure.

import { createClient } from '@supabase/supabase-js';

// TECHNICAL DEBT: Environment variables should be validated at startup
// Currently no error handling if these are undefined
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// ISSUE: No validation - app will fail silently if env vars are missing
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file contains VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type Definitions
export type Shift = 'A' | 'B' | 'C';

export interface Firefighter {
  id: string;
  name: string;
  order_position: number;
  is_available: boolean;
  is_active: boolean;
  shift: Shift;
  fire_station: string | null;
  last_hold_date: string | null; // TECHNICAL DEBT: Should be Date type, but DB returns string
  certification_level: string | null;

  // Apparatus certifications
  apparatus_ambulance: boolean;
  apparatus_brush_truck: boolean;
  apparatus_engine: boolean;
  apparatus_tanker: boolean;
  apparatus_truck: boolean;
  apparatus_boat: boolean;
  apparatus_utv: boolean;
  apparatus_rescue_squad: boolean;

  // Additional certifications
  is_fto: boolean; // Field Training Officer
  is_bls: boolean; // Basic Life Support
  is_als: boolean; // Advanced Life Support

  // Timestamps - TECHNICAL DEBT: Should be Date type but DB returns ISO strings
  created_at: string;
  updated_at: string;
}

// TECHNICAL DEBT: Database table structure definition for type safety
// This should be generated from the database schema automatically
export interface Database {
  public: {
    Tables: {
      firefighters: {
        Row: Firefighter;
        Insert: Omit<Firefighter, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Firefighter, 'id' | 'created_at' | 'updated_at'>>;
      };
      scheduled_holds: {
        Row: {
          id: string;
          firefighter_id: string;
          firefighter_name: string;
          hold_date: string;
          status: 'scheduled' | 'completed' | 'skipped';
          shift: Shift;
          fire_station: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
          completed_at: string | null;
        };
      };
      activity_log: {
        Row: {
          id: string;
          firefighter_id: string | null;
          firefighter_name: string;
          action_type: string;
          details: string | null;
          shift: Shift;
          created_at: string;
        };
      };
    };
  };
}

// TECHNICAL DEBT: Type-safe Supabase client
// Consider using Supabase CLI to generate these types automatically
export type TypedSupabaseClient = typeof supabase;
