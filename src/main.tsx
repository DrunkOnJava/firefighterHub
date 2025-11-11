import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import * as Sentry from '@sentry/react';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary';
import { reportError } from '@/utils/errorReporting';
import './index.css';

/**
 * Sentry Initialization
 *
 * Initialize Sentry as early as possible for error tracking
 * Configured with DSN from environment variables
 */
if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    // Enable performance monitoring
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: false, // Volunteer fire dept data is not sensitive
        blockAllMedia: false,
      }),
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0, // Capture 100% of transactions (adjust in production if needed)
    // Session Replay
    replaysSessionSampleRate: 0.1, // Sample 10% of sessions
    replaysOnErrorSampleRate: 1.0, // Sample 100% of sessions with errors
    // Environment
    environment: import.meta.env.DEV ? 'development' : 'production',
    // Release tracking (could tie to git commit SHA)
    release: 'firefighterhub@1.0.0',
    // Send default PII (IP address, user agent)
    sendDefaultPii: true,
  });

  console.info('✅ Sentry initialized for error tracking');
} else {
  console.warn('⚠️ VITE_SENTRY_DSN not configured - Sentry error tracking disabled');
}

/**
 * Global Error Handlers
 *
 * Catch unhandled errors and rejected promises that escape React's error boundaries
 * Following best practices for production error tracking
 */

// Catch synchronous errors
window.onerror = (message, source, lineno, colno, error) => {
  reportError(error || new Error(String(message)), {
    component: 'Global Error Handler',
    action: 'window.onerror',
    additionalData: {
      source,
      line: lineno,
      column: colno,
    },
  });

  // Return false to allow default error handling
  return false;
};

// Catch unhandled promise rejections
window.onunhandledrejection = (event) => {
  reportError(event.reason || new Error('Unhandled Promise Rejection'), {
    component: 'Global Promise Handler',
    action: 'unhandledrejection',
    additionalData: {
      promise: event.promise,
    },
  });

  // Prevent default console error
  event.preventDefault();
};

// Log application startup
console.info(
  '%c🚒 FirefighterHub Loading...',
  'color: #3b82f6; font-weight: bold; font-size: 16px;'
);
console.info('Environment:', import.meta.env.DEV ? 'Development' : 'Production');
console.info('Version:', '1.0.0');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* NOTE: AuthProvider removed - BC Mode uses localStorage (see App.tsx) */}
    <ErrorBoundary componentName="Application">
      <App />
    </ErrorBoundary>
  </StrictMode>
);
