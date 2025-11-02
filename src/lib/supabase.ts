/**
 * Supabase Client Configuration
 * 
 * This file initializes the Supabase client with type-safe database types
 * that are auto-generated from the actual database schema.
 * 
 * To regenerate types after schema changes, run: pnpm types:generate
 */

import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

// Environment variables are trimmed to remove any whitespace/newlines
// This prevents malformed URLs with %0A characters that break WebSocket connections
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file contains VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY'
  );
}

// Create typed Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Re-export commonly used types
export type Shift = 'A' | 'B' | 'C';
export type HoldDuration = '12h' | '24h';
export type HoldStatus = 'scheduled' | 'completed' | 'skipped';

// Extract table row types from auto-generated Database type
// NOTE: Supabase returns generic 'string' types for enum-like columns
// Our application uses these types directly, accepting that shift/status/duration are strings
type DBFirefighter = Database['public']['Tables']['firefighters']['Row'];
type DBScheduledHold = Database['public']['Tables']['scheduled_holds']['Row'];
type DBActivityLog = Database['public']['Tables']['activity_log']['Row'];

// Re-export database types as-is
// The database returns 'string' for shift/status/duration fields, not literal unions
// TypeScript will accept literal values when creating/updating, but queries return string
export type Firefighter = DBFirefighter;
export type ScheduledHold = DBScheduledHold;
export type ActivityLog = DBActivityLog;

// Extract insert types for creating new records
// These are less strict - we can pass literal values and Supabase will accept them
export type FirefighterInsert = Database['public']['Tables']['firefighters']['Insert'];
export type ScheduledHoldInsert = Database['public']['Tables']['scheduled_holds']['Insert'];
export type ActivityLogInsert = Database['public']['Tables']['activity_log']['Insert'];

// Extract update types for partial updates  
export type FirefighterUpdate = Database['public']['Tables']['firefighters']['Update'];
export type ScheduledHoldUpdate = Database['public']['Tables']['scheduled_holds']['Update'];
export type ActivityLogUpdate = Database['public']['Tables']['activity_log']['Update'];

// Type-safe Supabase client type
export type TypedSupabaseClient = typeof supabase;
