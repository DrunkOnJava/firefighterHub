import { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Bug } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetKeys?: unknown[];
  componentName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error(
      `ErrorBoundary caught error in ${
        this.props.componentName || "component"
      }:`,
      error,
      errorInfo
    );

    this.setState({
      error,
      errorInfo,
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
    });
  };

  handleReport = (): void => {
    const { error, errorInfo } = this.state;
    const componentName = this.props.componentName || "Unknown Component";

    const reportData = {
      component: componentName,
      error: error?.message,
      stack: error?.stack,
      componentStack: errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
    };

    console.log("Error Report:", reportData);

    // In production, you would send this to an error tracking service like Sentry
    alert(
      "Error report logged to console. In production, this would be sent to error tracking service."
    );
  };

  render(): ReactNode {
    const { hasError, error } = this.state;
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

            <p className="text-sm text-muted-foreground mb-4">
              This component encountered an error and couldn't render properly.
              You can try reloading or report this issue for investigation.
            </p>

            <div className="flex gap-3">
              <button
                onClick={this.resetErrorBoundary}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
              <button
                onClick={this.handleReport}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-lg font-medium transition-colors"
              >
                <Bug className="w-4 h-4" />
                Report Issue
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
          </div>
        </div>
      );
    }

    return children;
  }
}
