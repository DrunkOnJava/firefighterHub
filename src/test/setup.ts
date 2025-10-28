import { expect, afterEach, beforeAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Set up test environment variables before any imports
beforeAll(() => {
  // Mock Supabase environment variables for testing
  import.meta.env.VITE_SUPABASE_URL = 'https://test.supabase.co';
  import.meta.env.VITE_SUPABASE_ANON_KEY = 'test-anon-key';
});

expect.extend(matchers);

afterEach(() => {
  cleanup();
});
