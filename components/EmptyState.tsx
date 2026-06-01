'use client';

import React from 'react';
import Icon from './Icon';

type EmptyStateProps = {
  onStartCreating: () => void;
  showText?: boolean;
};

export default function EmptyState({ onStartCreating, showText = true }: EmptyStateProps) {
  return (
    <div className="relative group cursor-pointer flex flex-col items-center gap-6 select-none">
      {/* Glassmorphic "+" Button */}
      <button
        id="start-creating-btn"
        onClick={onStartCreating}
        className="w-24 h-24 glass rounded-full flex items-center justify-center neon-glow group-hover:scale-105 transition-transform duration-300 active:scale-95 pulse-ai"
        aria-label="Start Creating"
      >
        <Icon name="add" size={40} className="text-primary font-bold" />
      </button>

      {showText && (
        <div className="text-center transition-all duration-300">
          <h1 className="font-heading text-[32px] font-semibold text-on-surface tracking-[-0.02em]">
            Start Creating
          </h1>
          <p className="font-body text-[16px] text-on-surface-variant opacity-60 mt-1 leading-relaxed">
            Draft, design, or query the infinite
          </p>
        </div>
      )}
    </div>
  );
}
