/**
 * Enhanced Supabase Mock v2 for Testing
 *
 * Provides a comprehensive mock of the Supabase client for testing hooks and components.
 * Simulates database operations with real data manipulation, chained queries, and error simulation.
 */

import { vi } from "vitest";
import type { Firefighter } from '@/lib/supabase';

// In-memory database
export const mockDatabase = {
  firefighters: [] as Firefighter[],
  scheduled_holds: [] as any[],
  activity_log: [] as any[],
};

// Error simulation
export const errorSimulation = {
  enabled: false,
  message: "Mock database error",
  nextCallOnly: false,
};

// Helper functions
export function resetMockDatabase() {
  mockDatabase.firefighters = [];
  mockDatabase.scheduled_holds = [];
  mockDatabase.activity_log = [];
}

export function setMockFirefighters(firefighters: Firefighter[]) {
  mockDatabase.firefighters = [...firefighters];
}

export function setMockScheduledHolds(holds: any[]) {
  mockDatabase.scheduled_holds = [...holds];
}

export function setMockActivityLog(logs: any[]) {
  mockDatabase.activity_log = [...logs];
}

export function simulateError(message?: string, nextCallOnly = false) {
  errorSimulation.enabled = true;
  if (message) errorSimulation.message = message;
  errorSimulation.nextCallOnly = nextCallOnly;
}

export function clearErrorSimulation() {
  errorSimulation.enabled = false;
  errorSimulation.nextCallOnly = false;
}

function checkAndClearError() {
  if (errorSimulation.enabled) {
    const error = { message: errorSimulation.message };
    if (errorSimulation.nextCallOnly) {
      clearErrorSimulation();
    }
    return error;
  }
  return null;
}

// Query builder implementation
class MockQueryBuilder {
  private table: keyof typeof mockDatabase;
  private filters: Array<{
    column: string;
    value: any;
    operator: "eq" | "neq" | "gte" | "lte" | "gt" | "lt";
  }> = [];
  // private _selectedColumns = '*'; // Stored but not yet used in mock implementation
  private orderConfig: { column: string; ascending: boolean } | null = null;
  private limitValue: number | null = null;
  private pendingData: any = null;

  constructor(table: keyof typeof mockDatabase) {
    this.table = table;
  }

  select(_columns = "*") {
    // Column selection not yet implemented in mock
    return this;
  }

  eq(column: string, value: any) {
    this.filters.push({ column, value, operator: "eq" });
    return this;
  }

  neq(column: string, value: any) {
    this.filters.push({ column, value, operator: "neq" });
    return this;
  }

  gte(column: string, value: any) {
    this.filters.push({ column, value, operator: "gte" });
    return this;
  }

  lte(column: string, value: any) {
    this.filters.push({ column, value, operator: "lte" });
    return this;
  }

  gt(column: string, value: any) {
    this.filters.push({ column, value, operator: "gt" });
    return this;
  }

  lt(column: string, value: any) {
    this.filters.push({ column, value, operator: "lt" });
    return this;
  }

  order(column: string, options?: { ascending?: boolean }) {
    this.orderConfig = {
      column,
      ascending: options?.ascending ?? true,
    };
    return this;
  }

  limit(count: number) {
    this.limitValue = count;
    return this;
  }

  private applyFilters(data: any[]): any[] {
    return data.filter((item) => {
      return this.filters.every((filter) => {
        const itemValue = item[filter.column];
        switch (filter.operator) {
          case "eq":
            return itemValue === filter.value;
          case "neq":
            return itemValue !== filter.value;
          case "gte":
            return itemValue >= filter.value;
          case "lte":
            return itemValue <= filter.value;
          case "gt":
            return itemValue > filter.value;
          case "lt":
            return itemValue < filter.value;
          default:
            return true;
        }
      });
    });
  }

  private applyOrdering(data: any[]): any[] {
    if (!this.orderConfig) return data;

    const { column, ascending } = this.orderConfig;
    return [...data].sort((a, b) => {
      const aVal = a[column];
      const bVal = b[column];
      if (aVal < bVal) return ascending ? -1 : 1;
      if (aVal > bVal) return ascending ? 1 : -1;
      return 0;
    });
  }

  private applyLimit(data: any[]): any[] {
    if (this.limitValue === null) return data;
    return data.slice(0, this.limitValue);
  }

  private executeQuery(): any[] {
    let data = [...mockDatabase[this.table]];
    data = this.applyFilters(data);
    data = this.applyOrdering(data);
    data = this.applyLimit(data);
    return data;
  }

  async then(resolve: (value: any) => any) {
    const error = checkAndClearError();
    if (error) {
      return resolve({ data: null, error });
    }

    const data = this.pendingData ?? this.executeQuery();
    return resolve({ data, error: null });
  }

  async maybeSingle() {
    const error = checkAndClearError();
    if (error) {
      return { data: null, error };
    }

    const data = this.pendingData ?? this.executeQuery();
    return { data: data[0] || null, error: null };
  }

  async single() {
    const error = checkAndClearError();
    if (error) {
      return { data: null, error };
    }

    const data = this.pendingData ?? this.executeQuery();
    if (data.length === 0) {
      return { data: null, error: { message: "No rows found" } };
    }
    return { data: data[0], error: null };
  }

  insert(values: any | any[]) {
    const error = checkAndClearError();
    if (error) {
      // Return a chainable object that will return errors
      const errorBuilder = new MockQueryBuilder(this.table);
      errorBuilder.pendingData = null;
      return {
        select: () => ({
          maybeSingle: async () => ({ data: null, error }),
          single: async () => ({ data: null, error }),
        }),
        then: async (resolve: any) => resolve({ data: null, error }),
      };
    }

    const records = Array.isArray(values) ? values : [values];
    const newRecords = records.map((record) => ({
      ...record,
      id:
        record.id ||
        `mock-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      created_at: record.created_at || new Date().toISOString(),
      updated_at: record.updated_at || new Date().toISOString(),
    }));

    mockDatabase[this.table].push(...newRecords);

    // Create a builder with the inserted data for chaining
    const builder = new MockQueryBuilder(this.table);
    builder.pendingData = newRecords;

    return {
      select: () => ({
        maybeSingle: async () => ({ data: newRecords[0] || null, error: null }),
        single: async () => ({ data: newRecords[0], error: null }),
      }),
      then: async (resolve: any) => resolve({ data: newRecords, error: null }),
    };
  }

  update(values: any) {
    const error = checkAndClearError();
    if (error) {
      return {
        eq: () => this,
        then: async (resolve: any) => resolve({ data: null, error, count: 0 }),
      };
    }

    // Store the update values and return this for chaining .eq()
    const updateData = values;
    // const originalFilters = [...this.filters]; // For debugging/logging if needed

    // Create a function to execute the update
    const executeUpdate = () => {
      let updatedCount = 0;
      const data = mockDatabase[this.table];

      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        const matches = this.filters.every((filter) => {
          if (filter.operator === "eq") {
            return item[filter.column] === filter.value;
          } else {
            return item[filter.column] !== filter.value;
          }
        });

        if (matches) {
          data[i] = {
            ...item,
            ...updateData,
            updated_at: new Date().toISOString(),
          };
          updatedCount++;
        }
      }

      return { data: null, error: null, count: updatedCount };
    };

    // Return chainable object
    return {
      eq: (column: string, value: any) => {
        this.filters.push({ column, value, operator: "eq" });
        return {
          then: async (resolve: any) => resolve(executeUpdate()),
        };
      },
      then: async (resolve: any) => resolve(executeUpdate()),
    };
  }

  delete() {
    const error = checkAndClearError();
    if (error) {
      return {
        eq: () => this,
        neq: () => this,
        then: async (resolve: any) => resolve({ data: null, error }),
      };
    }

    // Return chainable object for .eq() or .neq()
    const executeDelete = () => {
      const data = mockDatabase[this.table];
      const before = data.length;

      const filtered = data.filter((item) => {
        return !this.filters.every((filter) => {
          if (filter.operator === "eq") {
            return item[filter.column] === filter.value;
          } else {
            return item[filter.column] !== filter.value;
          }
        });
      });

      (mockDatabase[this.table] as any[]) = filtered;
      const deleted = before - filtered.length;

      return { data: null, error: null, count: deleted };
    };

    return {
      eq: (column: string, value: any) => {
        this.filters.push({ column, value, operator: "eq" });
        return {
          then: async (resolve: any) => resolve(executeDelete()),
        };
      },
      neq: (column: string, value: any) => {
        this.filters.push({ column, value, operator: "neq" });
        return {
          then: async (resolve: any) => resolve(executeDelete()),
        };
      },
      then: async (resolve: any) => resolve(executeDelete()),
    };
  }
}

// Main mock Supabase client
export function createMockSupabaseClient() {
  return {
    from: (table: keyof typeof mockDatabase) => new MockQueryBuilder(table),
    channel: vi.fn(() => ({
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn((_callback) => {
        // Don't actually call the callback - prevents re-loading during tests
        return 'SUBSCRIBED';
      }),
    })),
    removeChannel: vi.fn(),
    auth: {
      getSession: vi.fn().mockResolvedValue({
        data: {
          session: {
            user: {
              id: 'test-user-id',
              email: 'test@example.com',
              app_metadata: {},
              user_metadata: {},
              aud: 'authenticated',
              created_at: '2025-01-01T00:00:00Z',
            },
            access_token: 'test-access-token',
            refresh_token: 'test-refresh-token',
            expires_in: 3600,
            expires_at: Date.now() + 3600000,
            token_type: 'bearer',
          },
        },
        error: null,
      }),
      getUser: vi.fn().mockResolvedValue({
        data: {
          user: {
            id: 'test-user-id',
            email: 'test@example.com',
            app_metadata: {},
            user_metadata: {},
            aud: 'authenticated',
            created_at: '2025-01-01T00:00:00Z',
          },
        },
        error: null,
      }),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      })),
      signInWithPassword: vi.fn().mockResolvedValue({
        data: { user: null, session: null },
        error: null,
      }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
    },
  };
}

// Default export
export const mockSupabase = createMockSupabaseClient();
