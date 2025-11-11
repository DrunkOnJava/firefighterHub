import { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Bug, Download } from "lucide-react";
import {
  reportError,
  downloadErrorLogs,
  formatErrorReport,
  type ErrorReport,
} from '@/utils/errorReporting';
import { toast } from "sonner";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetKeys?: unknown[];
  componentName?: string;
  shift?: 'A' | 'B' | 'C'; // Current shift for error logging context
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorReport: ErrorReport | null;
  reportSubmitted: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorReport: null,
      reportSubmitted: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  async componentDidCatch(error: Error, errorInfo: ErrorInfo): Promise<void> {
    console.error(
      `ErrorBoundary caught error in ${
        this.props.componentName || "component"
      }:`,
      error,
      errorInfo
    );

    // Create comprehensive error report
    const report = await reportError(error, {
      component: this.props.componentName,
      shift: this.props.shift,
      additionalData: {
        componentStack: errorInfo.componentStack,
      },
    });

    this.setState({
      error,
      errorInfo,
      errorReport: report,
    });

    // Show user-friendly toast notification
    toast.error(`Error in ${this.props.componentName || 'application'}`, {
      description: error.message,
      duration: 5000,
    });

    // Call optional error handler
    this.props.onError?.(error, errorInfo);
  }

  componentDidUpdate(prevProps: Props): void {
    const { resetKeys } = this.props;
    const { hasError } = this.state;

    if (hasError && resetKeys && prevProps.resetKeys) {
      const hasResetKeyChanged = resetKeys.some(
        (key, index) => key !== prevProps.resetKeys![index]
      );

      if (hasResetKeyChanged) {
        this.resetErrorBoundary();
      }
    }
  }

  resetErrorBoundary = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorReport: null,
      reportSubmitted: false,
    });

    toast.success('Component reset successfully');
  };

  handleReport = (): void => {
    const { errorReport } = this.state;

    if (!errorReport) {
      toast.error('No error report available');
      return;
    }

    // Format and copy error report to clipboard
    const formattedReport = formatErrorReport(errorReport);

    navigator.clipboard
      .writeText(formattedReport)
      .then(() => {
        this.setState({ reportSubmitted: true });
        toast.success('Error report copied to clipboard!', {
          description: 'You can now paste it into a support ticket or GitHub issue.',
          duration: 5000,
        });
      })
      .catch((err) => {
        console.error('Failed to copy to clipboard:', err);
        toast.error('Could not copy to clipboard', {
          description: 'Error report is logged in console and localStorage.',
        });
      });

    // Also log the formatted report to console for easy copying
    console.group('📋 Formatted Error Report (Copy from below)');
    console.info(formattedReport);
    console.groupEnd();
  };

  handleDownloadLogs = (): void => {
    try {
      downloadErrorLogs();
      toast.success('Error logs downloaded!', {
        description: 'Check your Downloads folder for the JSON file.',
      });
    } catch (error) {
      toast.error('Failed to download error logs');
      console.error('Download failed:', error);
    }
  };

  render(): ReactNode {
    const { hasError, error, reportSubmitted, errorReport } = this.state;
    const { children, fallback, componentName } = this.props;

    if (hasError) {
      if (fallback) {
        return fallback;
      }

      return (
        <div className="flex items-center justify-center min-h-[400px] p-8">
          <div className="max-w-md w-full bg-card rounded-lg shadow-lg p-6 border border-destructive">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-destructive/10 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">
                  Something went wrong
                </h2>
                <p className="text-sm text-muted-foreground">
                  {componentName
                    ? `Error in ${componentName}`
                    : "An error occurred"}
                </p>
              </div>
            </div>

            <div className="bg-destructive/10 rounded-md p-3 mb-4">
              <p className="text-sm text-destructive font-mono break-words">
                {error?.message || "Unknown error"}
              </p>
            </div>

            {reportSubmitted ? (
              <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-md p-3 mb-4">
                <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                  ✓ Error report copied to clipboard
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  Session ID: {errorReport?.sessionId.substring(0, 20)}...
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground mb-4">
                This component encountered an error and couldn't render properly.
                You can try reloading or report this issue for investigation.
              </p>
            )}

            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <button
                  onClick={this.resetErrorBoundary}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </button>
                <button
                  onClick={this.handleReport}
                  disabled={reportSubmitted}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Bug className="w-4 h-4" />
                  {reportSubmitted ? 'Report Copied' : 'Report Issue'}
                </button>
              </div>

              <button
                onClick={this.handleDownloadLogs}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 text-muted-foreground rounded-lg font-medium transition-colors text-sm"
              >
                <Download className="w-4 h-4" />
                Download Error Logs (Last 50)
              </button>
            </div>

            {import.meta.env.DEV && error?.stack && (
              <details className="mt-4">
                <summary className="text-sm text-muted-foreground cursor-pointer hover:text-foreground">
                  Stack Trace (Development Only)
                </summary>
                <pre className="mt-2 text-sm bg-muted p-3 rounded overflow-x-auto max-h-40 text-foreground">
                  {error.stack}
                </pre>
              </details>
            )}

            {import.meta.env.DEV && errorReport && (
              <details className="mt-2">
                <summary className="text-sm text-muted-foreground cursor-pointer hover:text-foreground">
                  Full Diagnostic Report
                </summary>
                <pre className="mt-2 text-xs bg-muted p-3 rounded overflow-x-auto max-h-60 text-foreground">
                  {JSON.stringify(errorReport, null, 2)}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return children;
  }
}
