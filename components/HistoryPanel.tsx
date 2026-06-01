'use client';

import React from 'react';
import Icon from './Icon';
import type { Message } from '@/lib/types';

type HistoryPanelProps = {
  isOpen: boolean;
  onClose: () => void;
  messages: Message[];
  onResend: (prompt: string) => void;
};

export default function HistoryPanel({ isOpen, onClose, messages, onResend }: HistoryPanelProps) {
  const userMessages = messages.filter((m) => m.role === 'user');

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <aside
        id="history-panel"
        className={`fixed right-0 top-0 h-full w-[380px] max-w-[90vw] z-[70] glass-elevated
                    flex flex-col transition-transform duration-300 ease-out
                    ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <Icon name="history" className="text-primary" />
            <h2 className="font-heading text-[20px] font-semibold text-on-surface tracking-tight">
              History
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-on-surface-variant hover:text-on-surface rounded-lg hover:bg-white/5 transition-colors"
            aria-label="Close history"
          >
            <Icon name="close" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
          {userMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 opacity-50">
              <Icon name="chat_bubble_outline" size={40} className="text-on-surface-variant" />
              <p className="text-on-surface-variant text-[14px]">No history yet</p>
              <p className="text-on-surface-variant/60 text-[13px]">Your conversations will appear here</p>
            </div>
          ) : (
            userMessages.map((msg) => (
              <button
                key={msg.id}
                onClick={() => {
                  onResend(msg.content);
                  onClose();
                }}
                className="w-full text-left glass rounded-xl p-4 hover:bg-white/[0.06] transition-colors group"
              >
                <p className="text-on-surface text-[14px] font-medium truncate group-hover:text-primary transition-colors">
                  {msg.content}
                </p>
                <p className="text-on-surface-variant/50 text-[12px] mt-1">
                  {formatTime(msg.timestamp)}
                </p>
              </button>
            ))
          )}
        </div>
      </aside>
    </>
  );
}

function formatTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (seconds < 60) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return date.toLocaleDateString();
}
