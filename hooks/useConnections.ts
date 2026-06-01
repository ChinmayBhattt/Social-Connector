'use client';

import { useState, useCallback, useEffect } from 'react';
import type { PlatformConnection, ConnectionStatus, AuthType } from '@/lib/types';
import { getPlatformAuth, getSimulatedIdentity } from '@/lib/platform-auth';

const STORAGE_KEY = 'connector-canvas-connections';

/**
 * Load connections from localStorage on initial mount.
 */
function loadConnections(): PlatformConnection[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as PlatformConnection[];
  } catch {
    return [];
  }
}

/**
 * Persist connections to localStorage.
 */
function saveConnections(connections: PlatformConnection[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(connections));
  } catch {
    /* silently fail if storage is full */
  }
}

/**
 * Hook managing the full connection lifecycle for all platforms.
 * Persists to localStorage so connections survive page reloads.
 */
export function useConnections() {
  const [connections, setConnections] = useState<PlatformConnection[]>([]);
  const [initialized, setInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = loadConnections();
    if (stored.length > 0) {
      setConnections(stored);
    }
    setInitialized(true);
  }, []);

  // Persist whenever connections change (after initial load)
  useEffect(() => {
    if (initialized) {
      saveConnections(connections);
    }
  }, [connections, initialized]);

  /** Get connection for a specific platform */
  const getConnection = useCallback(
    (platformId: string): PlatformConnection | undefined => {
      return connections.find((c) => c.platformId === platformId);
    },
    [connections]
  );

  /** Check if a platform is connected */
  const isConnected = useCallback(
    (platformId: string): boolean => {
      const conn = connections.find((c) => c.platformId === platformId);
      return conn?.status === 'connected';
    },
    [connections]
  );

  /** All connected platform IDs */
  const connectedPlatformIds = connections
    .filter((c) => c.status === 'connected')
    .map((c) => c.platformId);

  /**
   * Start the connection flow for a platform.
   * This simulates the OAuth/API-key process with realistic timing.
   * Returns a promise that resolves when the connection is complete.
   */
  /**
   * Start the connection flow for a platform.
   * This opens a real OAuth popup window and listens for the postMessage response.
   * Returns a promise that resolves when the connection is complete or failed.
   */
  const connectPlatform = useCallback(
    async (platformId: string): Promise<PlatformConnection> => {
      const auth = getPlatformAuth(platformId);

      // Step 1: Set status to "connecting"
      const initialConnection: PlatformConnection = {
        platformId,
        status: 'connecting',
        authType: auth.authType,
      };

      setConnections((prev) => {
        const filtered = prev.filter((c) => c.platformId !== platformId);
        return [...filtered, initialConnection];
      });

      // Open OAuth popup window centered
      const width = 600;
      const height = 700;
      const left = typeof window !== 'undefined' ? window.screen.width / 2 - width / 2 : 100;
      const top = typeof window !== 'undefined' ? window.screen.height / 2 - height / 2 : 100;

      const popup = typeof window !== 'undefined'
        ? window.open(
            `/api/auth?platform=${platformId}`,
            `Connect ${platformId}`,
            `width=${width},height=${height},left=${left},top=${top},status=no,resizable=yes,scrollbars=yes`
          )
        : null;

      if (!popup) {
        const errConnection: PlatformConnection = {
          platformId,
          status: 'error',
          errorMessage: 'Popup blocker prevented opening authentication window.',
          authType: auth.authType,
        };
        setConnections((prev) =>
          prev.map((c) => (c.platformId === platformId ? errConnection : c))
        );
        return errConnection;
      }

      // Return a promise that resolves when the message handler gets called
      return new Promise<PlatformConnection>((resolve) => {
        const handleMessage = (event: MessageEvent) => {
          if (event.origin !== window.location.origin) return;
          if (event.data?.type !== 'OAUTH_RESULT') return;

          const { success, platformId: resPlatformId, accessToken, refreshToken, connectedAs, error } = event.data.payload;

          if (resPlatformId !== platformId) return;

          // Clean up listener
          window.removeEventListener('message', handleMessage);

          if (success) {
            const finalConnection: PlatformConnection = {
              platformId,
              status: 'connected',
              connectedAt: new Date().toISOString(),
              connectedAs,
              maskedCredential: accessToken ? `access_••••••••${accessToken.slice(-4)}` : undefined,
              authType: auth.authType,
            };

            setConnections((prev) =>
              prev.map((c) => (c.platformId === platformId ? finalConnection : c))
            );

            // Store credentials securely in localStorage
            localStorage.setItem(`token-${platformId}`, JSON.stringify({ accessToken, refreshToken }));

            resolve(finalConnection);
          } else {
            const errConnection: PlatformConnection = {
              platformId,
              status: 'error',
              errorMessage: error || 'Authentication failed',
              authType: auth.authType,
            };

            setConnections((prev) =>
              prev.map((c) => (c.platformId === platformId ? errConnection : c))
            );

            resolve(errConnection);
          }
        };

        window.addEventListener('message', handleMessage);

        // Check if the popup was closed manually by the user
        const checkClosed = setInterval(() => {
          if (popup.closed) {
            clearInterval(checkClosed);
            window.removeEventListener('message', handleMessage);

            setConnections((prev) => {
              const current = prev.find((c) => c.platformId === platformId);
              if (current && current.status !== 'connected') {
                const closedConnection: PlatformConnection = {
                  platformId,
                  status: 'error',
                  errorMessage: 'Authentication window was closed by the user.',
                  authType: auth.authType,
                };
                resolve(closedConnection);
                return prev.map((c) => (c.platformId === platformId ? closedConnection : c));
              }
              return prev;
            });
          }
        }, 1000);
      });
    },
    []
  );

  /**
   * Disconnect a platform — removes all stored data.
   */
  const disconnectPlatform = useCallback((platformId: string) => {
    setConnections((prev) => prev.filter((c) => c.platformId !== platformId));
  }, []);

  /**
   * Set connection status directly (for API key flow where user provides input).
   */
  const setConnectionStatus = useCallback(
    (platformId: string, status: ConnectionStatus, extra?: Partial<PlatformConnection>) => {
      setConnections((prev) =>
        prev.map((c) =>
          c.platformId === platformId ? { ...c, status, ...extra } : c
        )
      );
    },
    []
  );

  /**
   * Connect a platform with an API key (for API-key auth type).
   * Masks the key before storing.
   */
  const connectWithApiKey = useCallback(
    async (platformId: string, apiKey: string): Promise<PlatformConnection> => {
      const auth = getPlatformAuth(platformId);

      // Mask the key: show prefix + last 4 chars
      const prefix = auth.keyPrefix ?? '';
      const lastFour = apiKey.slice(-4);
      const masked = `${prefix}${'•'.repeat(Math.max(0, apiKey.length - prefix.length - 4))}${lastFour}`;

      // Set to verifying
      setConnections((prev) => {
        const filtered = prev.filter((c) => c.platformId !== platformId);
        return [
          ...filtered,
          { platformId, status: 'verifying' as ConnectionStatus, authType: auth.authType },
        ];
      });

      // Simulate verification
      await new Promise((r) => setTimeout(r, 1200));

      const identity = getSimulatedIdentity(platformId);
      const finalConnection: PlatformConnection = {
        platformId,
        status: 'connected',
        connectedAt: new Date().toISOString(),
        connectedAs: identity,
        maskedCredential: masked,
        authType: auth.authType,
      };

      setConnections((prev) =>
        prev.map((c) => (c.platformId === platformId ? finalConnection : c))
      );

      return finalConnection;
    },
    []
  );

  return {
    connections,
    connectedPlatformIds,
    initialized,
    getConnection,
    isConnected,
    connectPlatform,
    disconnectPlatform,
    connectWithApiKey,
    setConnectionStatus,
  };
}
