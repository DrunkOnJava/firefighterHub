/**
 * Connection Status Hook
 * Tracks WebSocket real-time connection state
 * Provides visual feedback to users about connection health
 */

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export type ConnectionStatus = 'connected' | 'connecting' | 'disconnected';

interface ConnectionStatusInfo {
  status: ConnectionStatus;
  retryCount: number;
  lastError: string | null;
  isOnline: boolean;
}

export function useConnectionStatus(): ConnectionStatusInfo & {
  reconnect: () => void;
} {
  const [status, setStatus] = useState<ConnectionStatus>('connecting');
  const [retryCount, setRetryCount] = useState(0);
  const [lastError, setLastError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Monitor browser online/offline status
    const handleOnline = () => {
      setIsOnline(true);
      setStatus('connecting');
    };

    const handleOffline = () => {
      setIsOnline(false);
      setStatus('disconnected');
      setLastError('Internet connection lost');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Monitor Supabase real-time connection
    // Create a test channel to monitor connection health
    const healthCheckChannel = supabase.channel('connection_health_check');

    let checkInterval: ReturnType<typeof setInterval> | null = null;

    healthCheckChannel.subscribe((status, err) => {
      if (status === 'SUBSCRIBED') {
        setStatus('connected');
        setRetryCount(0);
        setLastError(null);
        console.log('✅ Connection status: CONNECTED');

        // Periodic health check
        checkInterval = setInterval(() => {
          // If channel is still subscribed, we're connected
          if (healthCheckChannel.state === 'joined') {
            setStatus('connected');
          }
        }, 10000); // Check every 10 seconds
      } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
        setStatus('connecting');
        setRetryCount((prev) => prev + 1);
        setLastError(err?.message || 'Connection failed');
        console.warn('⚠️ Connection status: RECONNECTING', { retryCount });
      } else if (status === 'CLOSED') {
        setStatus('disconnected');
        setLastError('Connection closed');
        console.log('🔌 Connection status: DISCONNECTED');
      }
    });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (checkInterval) clearInterval(checkInterval);
      supabase.removeChannel(healthCheckChannel);
    };
  }, []);

  const reconnect = () => {
    setStatus('connecting');
    setRetryCount(0);
    // Force reconnection by reloading the page
    // In production, you might want a more graceful approach
    window.location.reload();
  };

  return {
    status,
    retryCount,
    lastError,
    isOnline,
    reconnect,
  };
}
