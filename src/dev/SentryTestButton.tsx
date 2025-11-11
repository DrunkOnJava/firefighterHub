/**
 * Sentry Test Error Button
 *
 * Development-only component for testing error tracking
 * Throws an intentional error to verify Sentry integration
 *
 * Usage: Add to App.tsx in development mode
 * {import.meta.env.DEV && <SentryTestButton />}
 */

import { Bug } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function SentryTestButton() {
  const handleTestError = () => {
    // This will trigger:
    // 1. Global window.onerror handler
    // 2. reportError() utility
    // 3. All error logging destinations (Console, Supabase, Sentry, etc.)
    throw new Error('🧪 Sentry Test Error - This is your first error!');
  };

  const handleTestAsyncError = async () => {
    // Test unhandled promise rejection
    await Promise.reject(new Error('🧪 Sentry Test - Unhandled Promise Rejection'));
  };

  const handleTestConsoleError = async () => {
    // Test manual error reporting
    console.error('🧪 Sentry Test - Manual Console Error');

    // Dynamically import and use reportError
    const { reportError } = await import('@/utils/errorReporting');
    await reportError(new Error('🧪 Manual Error Report Test'), {
      component: 'SentryTestButton',
      action: 'handleTestConsoleError',
      shift: 'A',
    });
  };

  // Only render in development
  if (!import.meta.env.DEV) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-[9999] flex flex-col gap-2">
      <TooltipProvider>
        {/* Test synchronous error */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={handleTestError}
              variant="destructive"
              size="sm"
              className="shadow-lg"
            >
              <Bug className="w-4 h-4 mr-2" />
              Test Error
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Throw synchronous error (tests ErrorBoundary)</p>
          </TooltipContent>
        </Tooltip>

        {/* Test async error */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={handleTestAsyncError}
              variant="outline"
              size="sm"
              className="shadow-lg"
            >
              <Bug className="w-4 h-4 mr-2" />
              Test Async
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Test unhandled promise rejection</p>
          </TooltipContent>
        </Tooltip>

        {/* Test manual reporting */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={handleTestConsoleError}
              variant="secondary"
              size="sm"
              className="shadow-lg"
            >
              <Bug className="w-4 h-4 mr-2" />
              Test Manual
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Test manual error reporting (no throw)</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <p className="text-xs text-muted-foreground bg-card px-2 py-1 rounded border">
        Dev Mode Only
      </p>
    </div>
  );
}
