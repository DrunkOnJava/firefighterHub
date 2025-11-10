/**
 * Error Reporting Utility
 *
 * Comprehensive error logging system following best practices for React + Vite + Vercel stack
 *
 * Sends errors to:
 * 1. Browser console (with full diagnostics)
 * 2. Supabase activity_log table (for audit trail)
 * 3. LocalStorage (for client-side debugging)
 * 4. Toast notification (user feedback)
 * 5. Vercel Analytics (if available)
 * 6. Sentry (if VITE_SENTRY_DSN is configured)
 *
 * Usage:
 *   import { reportError } from '@/utils/errorReporting';
 *
 *   try {
 *     // risky operation
 *   } catch (error) {
 *     reportError(error, { component: 'MyComponent', action: 'saveData' });
 *   }
 */

import { supabase } from '../lib/supabase';
import { track } from '@vercel/analytics';
import * as Sentry from '@sentry/react';

export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  shift?: string;
  firefighterId?: string;
  additionalData?: Record<string, unknown>;
}

export interface ErrorReport {
  timestamp: string;
  errorMessage: string;
  errorStack?: string;
  componentStack?: string;
  context: ErrorContext;
  userAgent: string;
  url: string;
  viewport: {
    width: number;
    height: number;
  };
  environment: 'development' | 'production';
  sessionId: string;
}

/**
 * Get or create a session ID for tracking errors across page loads
 */
function getSessionId(): string {
  let sessionId = sessionStorage.getItem('firefighterhub_session_id');

  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    sessionStorage.setItem('firefighterhub_session_id', sessionId);
  }

  return sessionId;
}

/**
 * Create comprehensive error report with all diagnostic information
 */
function createErrorReport(
  error: Error | unknown,
  context: ErrorContext = {}
): ErrorReport {
  const err = error instanceof Error ? error : new Error(String(error));

  return {
    timestamp: new Date().toISOString(),
    errorMessage: err.message || 'Unknown error',
    errorStack: err.stack,
    componentStack: context.additionalData?.componentStack as string | undefined,
    context,
    userAgent: navigator.userAgent,
    url: window.location.href,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
    environment: import.meta.env.DEV ? 'development' : 'production',
    sessionId: getSessionId(),
  };
}

/**
 * Log error to browser console with enhanced formatting
 */
function logToConsole(report: ErrorReport): void {
  const isDev = import.meta.env.DEV;

  console.group(
    `%c🚨 Error Report - ${report.context.component || 'Application'}`,
    'color: #ef4444; font-weight: bold; font-size: 14px;'
  );

  console.error('Error:', report.errorMessage);

  if (report.errorStack && isDev) {
    console.error('Stack Trace:', report.errorStack);
  }

  if (report.componentStack && isDev) {
    console.error('Component Stack:', report.componentStack);
  }

  console.info('Context:', {
    component: report.context.component,
    action: report.context.action,
    shift: report.context.shift,
    ...report.context.additionalData,
  });

  console.info('Environment:', {
    timestamp: report.timestamp,
    sessionId: report.sessionId,
    url: report.url,
    viewport: `${report.viewport.width}x${report.viewport.height}`,
    userAgent: report.userAgent,
  });

  console.groupEnd();
}

/**
 * Store error in localStorage for debugging (keep last 50 errors)
 */
function logToLocalStorage(report: ErrorReport): void {
  try {
    const storageKey = 'firefighterhub_error_log';
    const existingLogs = JSON.parse(localStorage.getItem(storageKey) || '[]') as ErrorReport[];

    // Add new error
    existingLogs.unshift(report);

    // Keep only last 50 errors
    const trimmedLogs = existingLogs.slice(0, 50);

    localStorage.setItem(storageKey, JSON.stringify(trimmedLogs));
  } catch (error) {
    console.error('Failed to store error in localStorage:', error);
  }
}

/**
 * Log error to Supabase activity_log table for audit trail
 */
async function logToSupabase(report: ErrorReport): Promise<void> {
  try {
    await supabase.from('activity_log').insert({
      firefighter_id: report.context.firefighterId || null,
      firefighter_name: 'System',
      action_type: 'error',
      description: `Error in ${report.context.component || 'Application'}: ${report.errorMessage}`,
      details: JSON.stringify({
        error: report.errorMessage,
        stack: report.errorStack?.substring(0, 500), // Truncate stack trace
        context: report.context,
        sessionId: report.sessionId,
        url: report.url,
      }),
      shift: (report.context.shift || 'A') as 'A' | 'B' | 'C',
    });
  } catch (error) {
    console.error('Failed to log error to Supabase:', error);
  }
}

/**
 * Send error to Vercel Analytics
 */
function logToVercelAnalytics(report: ErrorReport): void {
  try {
    track('Error', {
      error: report.errorMessage,
      component: report.context.component || 'Unknown',
      action: report.context.action || 'Unknown',
      environment: report.environment,
    });
  } catch (error) {
    console.error('Failed to send error to Vercel Analytics:', error);
  }
}

/**
 * Send error to Sentry (if configured)
 *
 * NOTE: Sentry is optional. To enable:
 * 1. Install: pnpm add @sentry/react
 * 2. Add VITE_SENTRY_DSN to .env.local
 * 3. Initialize in main.tsx (see Sentry docs)
 */
function logToSentry(report: ErrorReport): void {
  // Check if Sentry is available
  const sentryDsn = import.meta.env.VITE_SENTRY_DSN;

  if (!sentryDsn) {
    return; // Sentry not configured, skip
  }

  // Sentry is initialized globally in main.tsx
  // Use the static import instead of dynamic import to avoid build issues
  try {
    Sentry.captureException(new Error(report.errorMessage), {
      contexts: {
        error_report: {
          ...report,
          errorReport: JSON.stringify(report), // Store full report as string
        },
      },
      tags: {
        component: report.context.component || 'unknown',
        action: report.context.action || 'unknown',
        shift: report.context.shift || 'unknown',
        environment: report.environment,
        sessionId: report.sessionId,
      },
      level: 'error',
    });
    console.info('✅ Error sent to Sentry');
  } catch (err) {
    console.warn('Failed to send error to Sentry:', err);
  }
}

/**
 * Main error reporting function
 *
 * Sends error to all configured destinations:
 * - Console (always)
 * - LocalStorage (always)
 * - Supabase activity_log (always)
 * - Vercel Analytics (if available)
 * - Sentry (if configured)
 *
 * @param error - The error object or message
 * @param context - Additional context about where/why the error occurred
 * @param options - Control which destinations to use
 */
export async function reportError(
  error: Error | unknown,
  context: ErrorContext = {},
  options: {
    skipConsole?: boolean;
    skipLocalStorage?: boolean;
    skipSupabase?: boolean;
    skipAnalytics?: boolean;
    skipSentry?: boolean;
  } = {}
): Promise<ErrorReport> {
  const report = createErrorReport(error, context);

  // Log to console (unless explicitly skipped)
  if (!options.skipConsole) {
    logToConsole(report);
  }

  // Store in localStorage for debugging
  if (!options.skipLocalStorage) {
    logToLocalStorage(report);
  }

  // Log to Supabase activity_log
  if (!options.skipSupabase) {
    await logToSupabase(report);
  }

  // Send to Vercel Analytics
  if (!options.skipAnalytics) {
    logToVercelAnalytics(report);
  }

  // Send to Sentry (if configured)
  if (!options.skipSentry) {
    logToSentry(report);
  }

  return report;
}

/**
 * Get error logs from localStorage
 * Useful for debugging and support
 */
export function getErrorLogs(): ErrorReport[] {
  try {
    const storageKey = 'firefighterhub_error_log';
    return JSON.parse(localStorage.getItem(storageKey) || '[]');
  } catch (error) {
    console.error('Failed to retrieve error logs:', error);
    return [];
  }
}

/**
 * Clear error logs from localStorage
 */
export function clearErrorLogs(): void {
  try {
    localStorage.removeItem('firefighterhub_error_log');
    console.info('Error logs cleared');
  } catch (error) {
    console.error('Failed to clear error logs:', error);
  }
}

/**
 * Download error logs as JSON file
 * Useful for sending to support/developers
 */
export function downloadErrorLogs(): void {
  try {
    const logs = getErrorLogs();
    const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `firefighterhub-error-logs-${new Date().toISOString()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    console.info('Error logs downloaded');
  } catch (error) {
    console.error('Failed to download error logs:', error);
  }
}

/**
 * Format error report for display (e.g., in a modal or support form)
 */
export function formatErrorReport(report: ErrorReport): string {
  return `
FirefighterHub Error Report
===========================

Timestamp: ${new Date(report.timestamp).toLocaleString()}
Session ID: ${report.sessionId}
Environment: ${report.environment}

Error Details:
--------------
Message: ${report.errorMessage}
Component: ${report.context.component || 'Unknown'}
Action: ${report.context.action || 'Unknown'}

System Information:
-------------------
URL: ${report.url}
Viewport: ${report.viewport.width}x${report.viewport.height}
User Agent: ${report.userAgent}

Context:
--------
Shift: ${report.context.shift || 'N/A'}
Firefighter ID: ${report.context.firefighterId || 'N/A'}

${report.errorStack ? `\nStack Trace:\n${report.errorStack}` : ''}
`.trim();
}
