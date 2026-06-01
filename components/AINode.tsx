'use client';

import React, { useRef, useCallback, useState, useEffect } from 'react';
import Icon from './Icon';
import type { CanvasNode } from '@/lib/types';

type AINodeProps = {
  node: CanvasNode;
  canvasScale: number;
  onMove: (id: string, x: number, y: number) => void;
  onRemove: (id: string) => void;
};

export default function AINode({ node, canvasScale, onMove, onRemove }: AINodeProps) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startX: number; startY: number; nodeX: number; nodeY: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const onDragStart = useCallback(
    (e: React.MouseEvent) => {
      // Only drag from header area
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

  /** Format the response with simple markdown-style rendering */
  const formatResponse = (text: string) => {
    return text.split('\n').map((line, i) => {
      // Headers
      if (line.startsWith('### '))
        return (
          <h4 key={i} className="text-[14px] font-semibold text-on-surface mt-3 mb-1">
            {line.slice(4)}
          </h4>
        );
      if (line.startsWith('## '))
        return (
          <h3 key={i} className="text-[15px] font-semibold text-on-surface mt-3 mb-1">
            {line.slice(3)}
          </h3>
        );
      // Bold text
      if (line.startsWith('**') && line.endsWith('**'))
        return (
          <p key={i} className="font-semibold text-on-surface mt-2">
            {line.slice(2, -2)}
          </p>
        );
      // List items
      if (line.startsWith('- '))
        return (
          <li key={i} className="ml-4 text-on-surface-variant list-disc">
            {renderInline(line.slice(2))}
          </li>
        );
      if (/^\d+\.\s/.test(line))
        return (
          <li key={i} className="ml-4 text-on-surface-variant list-decimal">
            {renderInline(line.replace(/^\d+\.\s/, ''))}
          </li>
        );
      // Code blocks (simplified)
      if (line.startsWith('```'))
        return (
          <div key={i} className="h-0" />
        );
      // Table headers
      if (line.startsWith('|') && line.includes('---')) return null;
      if (line.startsWith('|')) {
        const cells = line.split('|').filter((c) => c.trim());
        return (
          <div key={i} className="flex gap-4 text-[12px] text-on-surface-variant py-0.5 font-mono">
            {cells.map((cell, ci) => (
              <span key={ci} className="flex-1 truncate">{cell.trim()}</span>
            ))}
          </div>
        );
      }
      // Empty lines
      if (!line.trim()) return <div key={i} className="h-2" />;
      // Regular text
      return (
        <p key={i} className="text-on-surface-variant leading-relaxed">
          {renderInline(line)}
        </p>
      );
    });
  };

  /** Render inline bold/code */
  const renderInline = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**'))
        return (
          <strong key={i} className="text-on-surface font-medium">
            {part.slice(2, -2)}
          </strong>
        );
      if (part.startsWith('`') && part.endsWith('`'))
        return (
          <code key={i} className="bg-white/5 px-1.5 py-0.5 rounded text-primary text-[13px] font-mono">
            {part.slice(1, -1)}
          </code>
        );
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div
      ref={nodeRef}
      className={`absolute select-none ${isDragging ? 'z-50' : 'z-10'}`}
      style={{
        left: node.position.x,
        top: node.position.y,
        width: 420,
      }}
    >
      <div
        className={`glass rounded-2xl overflow-hidden transition-shadow duration-300 ${
          node.isStreaming ? 'pulse-ai neon-glow' : 'hover:shadow-[0_0_20px_rgba(173,198,255,0.15)]'
        }`}
      >
        {/* Header — draggable */}
        <div
          className={`flex items-center justify-between px-4 py-3 border-b border-white/[0.06] ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          onMouseDown={onDragStart}
        >
          <div className="flex items-center gap-2">
            <Icon name={node.isStreaming ? 'auto_awesome' : 'smart_toy'} size={16} className="text-secondary" />
            <span className="font-label text-[12px] font-semibold tracking-[0.1em] uppercase text-on-surface-variant">
              {node.isStreaming ? 'Generating...' : 'AI Response'}
            </span>
          </div>
          <div className="flex items-center gap-1" data-no-drag>
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 text-on-surface-variant hover:text-on-surface transition-colors rounded hover:bg-white/5"
              aria-label={isMinimized ? 'Expand' : 'Minimize'}
            >
              <Icon name={isMinimized ? 'expand_more' : 'expand_less'} size={18} />
            </button>
            <button
              onClick={() => onRemove(node.id)}
              className="p-1 text-on-surface-variant hover:text-error transition-colors rounded hover:bg-white/5"
              aria-label="Close"
            >
              <Icon name="close" size={18} />
            </button>
          </div>
        </div>

        {/* Prompt */}
        <div className="px-4 py-2 border-b border-white/[0.04] bg-white/[0.02]">
          <p className="text-[13px] text-primary/80 font-medium truncate">
            <Icon name="arrow_forward" size={14} className="inline mr-1.5 align-middle text-primary/50" />
            {node.prompt}
          </p>
        </div>

        {/* Body */}
        {!isMinimized && (
          <div className="px-4 py-3 text-[14px] leading-relaxed max-h-[400px] overflow-y-auto custom-scrollbar">
            {node.response ? (
              <div className="space-y-0">{formatResponse(node.response)}</div>
            ) : (
              <div className="flex items-center gap-2 text-on-surface-variant opacity-50">
                <span className="inline-block w-2 h-2 rounded-full bg-secondary animate-pulse" />
                <span className="text-[13px]">Thinking...</span>
              </div>
            )}
            {/* Streaming cursor */}
            {node.isStreaming && node.response && (
              <span className="inline-block w-[2px] h-[16px] bg-primary ml-0.5 animate-pulse align-middle" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
