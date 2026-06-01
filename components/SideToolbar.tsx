'use client';

import React from 'react';
import Icon from './Icon';
import type { Tool } from '@/lib/types';

type SideToolbarProps = {
  activeTool: Tool;
  onToolChange: (tool: Tool) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
};

export default function SideToolbar({
  activeTool,
  onToolChange,
  onZoomIn,
  onZoomOut,
  onReset,
}: SideToolbarProps) {
  return (
    <nav
      id="side-toolbar"
      className="fixed left-0 top-1/2 -translate-y-1/2 flex flex-col gap-4 p-4 z-40 ml-8 glass rounded-2xl shadow-lg select-none
                 max-md:fixed max-md:left-1/2 max-md:-translate-x-1/2 max-md:translate-y-0 max-md:top-auto max-md:bottom-[100px] max-md:ml-0 max-md:flex-row max-md:rounded-full"
    >
      {/* Label (hidden on mobile) */}
      <div className="flex flex-col items-center gap-1 mb-2 max-md:hidden">
        <span className="font-label text-[10px] text-on-surface-variant opacity-50 uppercase tracking-[0.1em]">
          Tools
        </span>
      </div>

      <ToolButton
        icon="zoom_in"
        title="Zoom In"
        active={activeTool === 'zoom-in'}
        onClick={() => {
          onToolChange('zoom-in');
          onZoomIn();
        }}
      />
      <ToolButton
        icon="zoom_out"
        title="Zoom Out"
        active={activeTool === 'zoom-out'}
        onClick={() => {
          onToolChange('zoom-out');
          onZoomOut();
        }}
      />
      <ToolButton
        icon="pan_tool"
        title="Pan"
        active={activeTool === 'pan'}
        variant={activeTool === 'pan' ? 'tertiary' : 'default'}
        onClick={() => onToolChange(activeTool === 'pan' ? 'select' : 'pan')}
      />

      {/* Divider */}
      <div className="h-px w-full bg-white/10 my-1 max-md:h-full max-md:w-px max-md:mx-1" />

      <ToolButton icon="restart_alt" title="Reset View" onClick={onReset} />
    </nav>
  );
}

function ToolButton({
  icon,
  title,
  active = false,
  variant = 'default',
  onClick,
}: {
  icon: string;
  title: string;
  active?: boolean;
  variant?: 'default' | 'tertiary';
  onClick: () => void;
}) {
  const colorClass =
    active && variant === 'tertiary'
      ? 'text-tertiary'
      : active
        ? 'text-primary'
        : 'text-on-surface-variant hover:text-primary';

  return (
    <button
      className={`flex items-center justify-center p-2 ${colorClass} transition-colors active:scale-95 duration-200`}
      title={title}
      aria-label={title}
      onClick={onClick}
    >
      <Icon name={icon} />
    </button>
  );
}
