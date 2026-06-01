'use client';

import React, { useState, useCallback } from 'react';
import Icon from './Icon';
import SocialIcon from './SocialIcon';
import type { PlatformConnection } from '@/lib/types';
import { SOCIAL_PLATFORMS } from '@/lib/platforms';

type ConnectedAppsBarProps = {
  connections: PlatformConnection[];
  onDisconnect: (platformId: string) => void;
};

export default function ConnectedAppsBar({ connections, onDisconnect }: ConnectedAppsBarProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [confirmDisconnect, setConfirmDisconnect] = useState<string | null>(null);

  const activeConnections = connections.filter((c) => c.status === 'connected');

  const handleDisconnect = useCallback(
    (platformId: string) => {
      if (confirmDisconnect === platformId) {
        onDisconnect(platformId);
        setConfirmDisconnect(null);
      } else {
        setConfirmDisconnect(platformId);
        // Auto-reset confirm after 3 seconds
        setTimeout(() => setConfirmDisconnect(null), 3000);
      }
    },
    [confirmDisconnect, onDisconnect]
  );

  if (activeConnections.length === 0) return null;

  return (
    <div
      id="connected-apps-bar"
      className="fixed top-[72px] left-1/2 -translate-x-1/2 z-40 select-none animate-slide-up"
    >
      <div className="glass rounded-full px-4 py-2 flex items-center gap-3 shadow-lg">
        {/* Label */}
        <div className="flex items-center gap-1.5 pr-2 border-r border-white/10 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-label text-[10px] font-semibold tracking-[0.1em] uppercase text-on-surface-variant/60 whitespace-nowrap">
            {activeConnections.length} Active
          </span>
        </div>

        {/* Connected platform icons */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-[500px] scrollbar-none">
          {activeConnections.map((conn) => {
            const platform = SOCIAL_PLATFORMS.find((p) => p.id === conn.platformId);
            if (!platform) return null;
            const isHovered = hoveredId === conn.platformId;
            const isConfirming = confirmDisconnect === conn.platformId;

            return (
              <div
                key={conn.platformId}
                className="relative group"
                onMouseEnter={() => setHoveredId(conn.platformId)}
                onMouseLeave={() => {
                  setHoveredId(null);
                  setConfirmDisconnect(null);
                }}
              >
                <button
                  onClick={() => handleDisconnect(conn.platformId)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center p-1 transition-all duration-200 relative
                    ${isConfirming
                      ? 'bg-red-500/20 border border-red-500/30 scale-110'
                      : 'bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] hover:scale-105'
                    }`}
                  title={isConfirming ? `Disconnect ${platform.name}?` : platform.name}
                >
                  {isConfirming ? (
                    <Icon name="close" size={14} className="text-red-400" />
                  ) : (
                    <SocialIcon platform={platform.icon} size={18} />
                  )}
                  {/* Green dot */}
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-surface" />
                </button>

                {/* Tooltip */}
                {isHovered && (
                  <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-fade-in">
                    <div className="glass rounded-lg px-3 py-2 whitespace-nowrap shadow-xl border border-white/10">
                      <p className="text-[11px] font-semibold text-on-surface">
                        {platform.name}
                      </p>
                      {conn.connectedAs && (
                        <p className="text-[10px] text-emerald-400 mt-0.5">
                          {conn.connectedAs}
                        </p>
                      )}
                      {isConfirming && (
                        <p className="text-[10px] text-red-400 mt-0.5 font-semibold">
                          Click again to disconnect
                        </p>
                      )}
                    </div>
                    {/* Arrow */}
                    <div className="w-2 h-2 bg-white/[0.08] border-l border-t border-white/10 rotate-45 absolute -top-1 left-1/2 -translate-x-1/2" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
