'use client';

import React from 'react';
import Icon from './Icon';

export default function Header() {
  return (
    <header
      id="app-header"
      className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-8 py-4 bg-transparent select-none"
    >
      {/* Brand */}
      <div className="flex items-center gap-2 group cursor-pointer">
        <span className="font-heading text-[32px] font-bold text-primary tracking-[-0.03em] transition-all duration-300 group-hover:opacity-80 group-hover:drop-shadow-[0_0_12px_rgba(173,198,255,0.4)]">
          Connector
        </span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* System status */}
        <div className="flex items-center gap-[6px] text-on-surface-variant font-label text-[12px] font-semibold tracking-[0.1em] uppercase">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span>System Online</span>
        </div>

        {/* Avatar button */}
        <button
          id="avatar-btn"
          className="flex items-center justify-center w-10 h-10 rounded-full glass hover:opacity-80 transition-opacity active:scale-95 duration-200"
          aria-label="Account"
        >
          <Icon name="account_circle" className="text-primary" />
        </button>
      </div>
    </header>
  );
}
