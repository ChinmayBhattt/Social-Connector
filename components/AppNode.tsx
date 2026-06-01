'use client';

import React, { useRef, useCallback, useState, useEffect } from 'react';
import Icon from './Icon';
import SocialIcon from './SocialIcon';
import type { CanvasNode } from '@/lib/types';

type AppNodeProps = {
  node: CanvasNode;
  canvasScale: number;
  onMove: (id: string, x: number, y: number) => void;
  onRemove: (id: string) => void;
};

export default function AppNode({ node, canvasScale, onMove, onRemove }: AppNodeProps) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startX: number; startY: number; nodeX: number; nodeY: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const onDragStart = useCallback(
    (e: React.MouseEvent) => {
      // Don't drag if clicking close button
      if ((e.target as HTMLElement).closest('[data-no-drag]')) return;
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        nodeX: node.position.x,
        nodeY: node.position.y,
      };
    },
    [node.position]
  );

  useEffect(() => {
    if (!isDragging) return;

    const onMouseMove = (e: MouseEvent) => {
      if (!dragRef.current) return;
      const dx = (e.clientX - dragRef.current.startX) / canvasScale;
      const dy = (e.clientY - dragRef.current.startY) / canvasScale;
      onMove(node.id, dragRef.current.nodeX + dx, dragRef.current.nodeY + dy);
    };

    const onMouseUp = () => {
      setIsDragging(false);
      dragRef.current = null;
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging, canvasScale, node.id, onMove]);

  const platform = node.platform;
  if (!platform) return null;

  return (
    <div
      ref={nodeRef}
      onMouseDown={onDragStart}
      className={`absolute select-none group cursor-grab active:cursor-grabbing ${
        isDragging ? 'z-50 scale-105' : 'z-20 hover:scale-102'
      } transition-transform duration-150`}
      style={{
        left: node.position.x,
        top: node.position.y,
        transform: 'translate(-50%, -50%)', // Center the node on its coordinates
      }}
    >
      <div className="glass rounded-2xl border border-white/10 px-4 py-3 flex items-center gap-3.5 shadow-lg w-[220px] relative overflow-hidden neon-glow-hover">
        {/* Brand color accent background glow */}
        <div
          className="absolute -inset-1 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-300 pointer-events-none -z-10"
          style={{ backgroundColor: platform.color || '#adc6ff', filter: 'blur(8px)' }}
        />

        {/* App Logo */}
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 p-2 shrink-0">
          <SocialIcon platform={platform.id} size={24} />
        </div>

        {/* App Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-heading text-[13px] font-semibold text-on-surface truncate leading-tight">
            {platform.name}
          </h4>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-label text-[10px] text-emerald-500 uppercase tracking-wider font-semibold">
              CONNECTED
            </span>
          </div>
        </div>

        {/* Disconnect/Close Button */}
        <button
          onClick={() => onRemove(node.id)}
          data-no-drag
          className="p-1 text-on-surface-variant hover:text-error transition-colors rounded hover:bg-white/5 shrink-0"
          aria-label="Disconnect App"
        >
          <Icon name="close" size={16} />
        </button>
      </div>
    </div>
  );
}
