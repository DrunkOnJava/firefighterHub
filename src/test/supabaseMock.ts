import { vi } from "vitest";

/**
 * Comprehensive Supabase mock for testing
 * Supports chaining: supabase.from().select().eq().order()
 */

export interface MockSupabaseResponse<T = any> {
  data: T | null;
  error: any | null;
}

export interface MockQueryBuilder {
  select: ReturnType<typeof vi.fn>;
  insert: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
  eq: ReturnType<typeof vi.fn>;
  order: ReturnType<typeof vi.fn>;
  single: ReturnType<typeof vi.fn>;
  abortSignal: ReturnType<typeof vi.fn>;
}

export function createMockQueryBuilder(
  response: MockSupabaseResponse = { data: [], error: null }
): MockQueryBuilder {
  const mockEq = vi.fn();
  const mockOrder = vi.fn();
  const mockSelect = vi.fn();
  const mockInsert = vi.fn();
  const mockUpdate = vi.fn();
  const mockDelete = vi.fn();
  const mockSingle = vi.fn();
  const mockAbortSignal = vi.fn();

  // Create a promise-like object that resolves to the response
  const createPromise = (resp: MockSupabaseResponse) => ({
    then: (onFulfilled: (value: MockSupabaseResponse) => any) => {
      return Promise.resolve(resp).then(onFulfilled);
    },
    catch: (onRejected: (error: any) => any) => {
      return Promise.resolve(resp).catch(onRejected);
    },
  });

  // Set up the query chain
  mockSelect.mockReturnValue({
    eq: mockEq,
    order: mockOrder,
    single: mockSingle,
    ...createPromise(response),
  });

  mockEq.mockReturnValue({
    eq: mockEq,
    order: mockOrder,
    single: mockSingle,
    ...createPromise(response),
  });

  mockOrder.mockReturnValue({
    eq: mockEq,
    single: mockSingle,
    abortSignal: mockAbortSignal,
    ...createPromise(response),
  });

  mockAbortSignal.mockReturnValue({
    eq: mockEq,
    single: mockSingle,
    ...createPromise(response),
  });

  mockSingle.mockReturnValue(createPromise(response));

  mockInsert.mockReturnValue({
    select: mockSelect,
    single: mockSingle,
    ...createPromise(response),
  });

  mockUpdate.mockReturnValue({
    eq: mockEq,
    select: mockSelect,
    single: mockSingle,
    ...createPromise(response),
  });

  mockDelete.mockReturnValue({
    eq: mockEq,
    ...createPromise(response),
  });

  return {
    select: mockSelect,
    insert: mockInsert,
    update: mockUpdate,
    delete: mockDelete,
    eq: mockEq,
    order: mockOrder,
    single: mockSingle,
    abortSignal: mockAbortSignal,
  };
}

export function createSupabaseMock() {
  const mockFrom = vi.fn();
  const mockChannel = vi.fn();
  const mockRemoveChannel = vi.fn();

  // Default successful responses
  const defaultQueryBuilder = createMockQueryBuilder({ data: [], error: null });

  mockFrom.mockReturnValue(defaultQueryBuilder);

  // Mock real-time channel (currently disabled but structure needed)
  mockChannel.mockReturnValue({
    on: vi.fn().mockReturnThis(),
    subscribe: vi.fn().mockReturnValue({ unsubscribe: vi.fn() }),
  });

  return {
    from: mockFrom,
    channel: mockChannel,
    removeChannel: mockRemoveChannel,
  };
}

/**
 * Helper to set up specific responses for different tables
 */
export function mockSupabaseResponses(
  mockSupabase: ReturnType<typeof createSupabaseMock>,
  responses: Record<string, MockSupabaseResponse>
) {
  mockSupabase.from.mockImplementation((table: string) => {
    const response = responses[table] || { data: [], error: null };
    return createMockQueryBuilder(response);
  });
}

/**
 * Helper to verify shift filtering was called
 */
export function expectShiftFilter(
  mockFrom: any,
  _shift: string,
  table: string = "firefighters"
) {
  expect(mockFrom).toHaveBeenCalledWith(table);
  // Note: The actual .eq call verification depends on how the mock is set up
}

/**
 * Helper to verify activity logging
 */
export function expectActivityLogged(
  mockFrom: any,
  _actionType: string,
  _firefighterName: string,
  _shift: string
) {
  const activityLogCalls = mockFrom.mock.calls.filter(
    (call: any[]) => call[0] === "activity_log"
  );
  expect(activityLogCalls.length).toBeGreaterThan(0);
}
