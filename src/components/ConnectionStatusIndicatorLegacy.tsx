/**
 * Connection Status Indicator
 * Visual feedback for real-time WebSocket connection status
 * Shows: Connected (green), Reconnecting (yellow), Disconnected (red)
 */

import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { useConnectionStatus } from '../hooks/useConnectionStatus';
import { colors, tokens } from '../styles';

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
        color: colors.semantic.error.text,
        bgColor: colors.semantic.error.light,
        borderColor: colors.semantic.error.border,
        icon: WifiOff,
        label: 'Offline',
        description: 'No internet connection',
        pulse: false,
      };
    }

    switch (status) {
      case 'connected':
        return {
          color: colors.semantic.success.text,
          bgColor: colors.semantic.success.light,
          borderColor: colors.semantic.success.border,
          icon: Wifi,
          label: 'Connected',
          description: 'Real-time updates active',
          pulse: false,
        };
      case 'connecting':
        return {
          color: colors.semantic.warning.text,
          bgColor: colors.semantic.warning.light,
          borderColor: colors.semantic.warning.border,
          icon: RefreshCw,
          label: 'Reconnecting',
          description: retryCount > 0 ? `Attempt ${retryCount}` : 'Connecting...',
          pulse: true,
        };
      case 'disconnected':
        return {
          color: colors.semantic.error.text,
          bgColor: colors.semantic.error.light,
          borderColor: colors.semantic.error.border,
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
          flex items-center ${tokens.spacing.gap.sm} px-3 py-2 ${tokens.borders.radius.lg} border transition-all
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
          <span className={`${tokens.typography.body.secondary} font-medium ${config.color}`}>
            {config.label}
          </span>
        )}

        {/* Retry Count Badge */}
        {retryCount > 0 && status === 'connecting' && (
          <span
            className={`${tokens.typography.body.small} font-bold ${colors.semantic.warning.text} ${colors.semantic.warning.light} px-1.5 py-0.5 ${tokens.borders.radius.full}`}
            aria-label={`Retry attempt ${retryCount}`}
          >
            {retryCount}
          </span>
        )}
      </button>

      {/* Tooltip on Hover */}
      <div
        className={`
          absolute top-full right-0 mt-2 w-64 p-3 ${tokens.borders.radius.lg} shadow-xl border-2 z-50
          opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all
          ${colors.structural.bg.card} ${colors.structural.border.default}
        `}
        role="tooltip"
      >
        <div className={`flex items-start ${tokens.spacing.gap.sm}`}>
          <Icon size={20} className={config.color} />
          <div className="flex-1">
            <p
              className={`font-semibold ${tokens.typography.body.secondary} ${colors.structural.text.primary}`}
            >
              {config.label}
            </p>
            <p
              className={`${tokens.typography.body.small} mt-1 ${colors.structural.text.tertiary}`}
            >
              {config.description}
            </p>

            {/* Detailed Status Info */}
            {!isOnline && (
              <p
                className={`${tokens.typography.body.small} mt-2 ${colors.structural.text.tertiary}`}
              >
                Check your internet connection and try again.
              </p>
            )}

            {status === 'connecting' && retryCount > 5 && (
              <p className={`${tokens.typography.body.small} mt-2 ${colors.semantic.warning.text}`}>
                Taking longer than expected. You may want to refresh the page.
              </p>
            )}

            {/* Reconnect Button */}
            {(status === 'disconnected' || retryCount > 5) && (
              <button
                onClick={reconnect}
                className={`
                  mt-3 w-full px-3 py-2 ${tokens.borders.radius.lg} ${tokens.typography.body.secondary} font-semibold
                  ${colors.semantic.primary.solid} ${colors.semantic.primary.hover} text-white
                  transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                `}
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
    if (!isOnline) return colors.semantic.error.solid;
    switch (status) {
      case 'connected':
        return colors.semantic.success.solid;
      case 'connecting':
        return colors.semantic.warning.solid;
      case 'disconnected':
        return colors.semantic.error.solid;
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
      <div className={`flex items-center ${tokens.spacing.gap.sm}`}>
        <div className="relative">
          <div
            className={`w-2 h-2 ${tokens.borders.radius.full} ${getColor()} ${
              status === 'connecting' ? 'animate-pulse' : ''
            }`}
          />
          {status === 'connecting' && (
            <div
              className={`absolute inset-0 w-2 h-2 ${tokens.borders.radius.full} ${getColor()} animate-ping opacity-75`}
            />
          )}
        </div>
      </div>

      {/* Minimal Tooltip */}
      <div
        className={`
          absolute top-full right-0 mt-1 px-2 py-1 rounded ${tokens.typography.body.small} whitespace-nowrap
          opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all
          ${colors.structural.bg.card} ${colors.structural.text.primary}
        `}
      >
        {getLabel()}
      </div>
    </div>
  );
}
