/**
 * Connection Status Indicator
 * Visual feedback for real-time WebSocket connection status
 * Shows: Connected (green), Reconnecting (yellow), Disconnected (red)
 */

import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { useConnectionStatus } from '../hooks/useConnectionStatus';

interface ConnectionStatusIndicatorProps {
  showLabel?: boolean;
}

export function ConnectionStatusIndicator({
  showLabel = false,
}: ConnectionStatusIndicatorProps) {
  const { status, retryCount, lastError, isOnline, reconnect } =
    useConnectionStatus();

  // Don't show if online and connected (reduce visual noise)
  if (status === 'connected' && isOnline) {
    return null;
  }

  const getStatusConfig = () => {
    if (!isOnline) {
      return {
        color: 'text-destructive',
        bgColor: 'bg-destructive/10',
        borderColor: 'border-destructive/50',
        icon: WifiOff,
        label: 'Offline',
        description: 'No internet connection',
        pulse: false,
      };
    }

    switch (status) {
      case 'connected':
        return {
          color: 'text-green-600 dark:text-green-400',
          bgColor: 'bg-green-500/10',
          borderColor: 'border-green-500/50',
          icon: Wifi,
          label: 'Connected',
          description: 'Real-time updates active',
          pulse: false,
        };
      case 'connecting':
        return {
          color: 'text-amber-600 dark:text-amber-400',
          bgColor: 'bg-amber-500/10',
          borderColor: 'border-amber-500/50',
          icon: RefreshCw,
          label: 'Reconnecting',
          description: retryCount > 0 ? `Attempt ${retryCount}` : 'Connecting...',
          pulse: true,
        };
      case 'disconnected':
        return {
          color: 'text-destructive',
          bgColor: 'bg-destructive/10',
          borderColor: 'border-destructive/50',
          icon: WifiOff,
          label: 'Disconnected',
          description: lastError || 'Connection lost',
          pulse: false,
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div className="relative group">
      {/* Status Indicator Button */}
      <button
        onClick={status === 'disconnected' ? reconnect : undefined}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg border transition-all
          ${config.bgColor} ${config.borderColor}
          ${status === 'disconnected' ? 'hover:bg-red-500/20 cursor-pointer' : 'cursor-default'}
          focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
        `}
        aria-label={`Connection status: ${config.label}. ${config.description}`}
        aria-live="polite"
        aria-atomic="true"
      >
        {/* Icon with optional pulse animation */}
        <div className="relative">
          <Icon
            size={16}
            className={`${config.color} ${config.pulse ? 'animate-pulse' : ''}`}
          />
          {config.pulse && (
            <Icon
              size={16}
              className={`absolute inset-0 ${config.color} animate-ping opacity-75`}
            />
          )}
        </div>

        {/* Optional Label */}
        {showLabel && (
          <span className={`text-sm font-medium ${config.color}`}>
            {config.label}
          </span>
        )}

        {/* Retry Count Badge */}
        {retryCount > 0 && status === 'connecting' && (
          <span
            className="text-sm font-bold text-amber-700 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded-full"
            aria-label={`Retry attempt ${retryCount}`}
          >
            {retryCount}
          </span>
        )}
      </button>

      {/* Tooltip on Hover */}
      <div
        className="
          absolute top-full right-0 mt-2 w-64 p-3 rounded-lg shadow-xl border-2 z-50
          opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all
          bg-card border-border
        "
        role="tooltip"
      >
        <div className="flex items-start gap-2">
          <Icon size={20} className={config.color} />
          <div className="flex-1">
            <p
              className="font-semibold text-sm text-foreground"
            >
              {config.label}
            </p>
            <p
              className="text-sm mt-1 text-muted-foreground"
            >
              {config.description}
            </p>

            {/* Detailed Status Info */}
            {!isOnline && (
              <p
                className="text-sm mt-2 text-muted-foreground"
              >
                Check your internet connection and try again.
              </p>
            )}

            {status === 'connecting' && retryCount > 5 && (
              <p className="text-sm mt-2 text-amber-600 dark:text-amber-400">
                Taking longer than expected. You may want to refresh the page.
              </p>
            )}

            {/* Reconnect Button */}
            {(status === 'disconnected' || retryCount > 5) && (
              <button
                onClick={reconnect}
                className="
                  mt-3 w-full px-3 py-2 rounded-lg text-sm font-semibold
                  bg-primary hover:bg-primary/90 text-primary-foreground
                  transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                "
              >
                Reconnect Now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Compact version for mobile/small spaces
export function ConnectionStatusDot() {
  const { status, isOnline } = useConnectionStatus();

  // Don't show if online and connected
  if (status === 'connected' && isOnline) {
    return null;
  }

  const getColor = () => {
    if (!isOnline) return 'bg-destructive';
    switch (status) {
      case 'connected':
        return 'bg-green-600 dark:bg-green-400';
      case 'connecting':
        return 'bg-amber-600 dark:bg-amber-400';
      case 'disconnected':
        return 'bg-destructive';
    }
  };

  const getLabel = () => {
    if (!isOnline) return 'Offline';
    switch (status) {
      case 'connected':
        return 'Connected';
      case 'connecting':
        return 'Reconnecting...';
      case 'disconnected':
        return 'Disconnected';
    }
  };

  return (
    <div
      className="relative group"
      role="status"
      aria-label={`Connection: ${getLabel()}`}
    >
      {/* Dot Indicator */}
      <div className="flex items-center gap-2">
        <div className="relative">
          <div
            className={`w-2 h-2 rounded-full ${getColor()} ${
              status === 'connecting' ? 'animate-pulse' : ''
            }`}
          />
          {status === 'connecting' && (
            <div
              className={`absolute inset-0 w-2 h-2 rounded-full ${getColor()} animate-ping opacity-75`}
            />
          )}
        </div>
      </div>

      {/* Minimal Tooltip */}
      <div
        className="
          absolute top-full right-0 mt-1 px-2 py-1 rounded text-sm whitespace-nowrap
          opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all
          bg-card text-foreground
        "
      >
        {getLabel()}
      </div>
    </div>
  );
}
