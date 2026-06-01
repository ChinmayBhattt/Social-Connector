'use client';

import React, { useRef, useEffect, useState } from 'react';
import Icon from './Icon';
import SocialIcon from './SocialIcon';
import type { CanvasNode } from '@/lib/types';

type AIResponsePanelProps = {
  nodes: CanvasNode[];
  onRemoveNode: (id: string) => void;
  isStreaming: boolean;
};

export default function AIResponsePanel({ nodes, onRemoveNode, isStreaming }: AIResponsePanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new content arrives or streams
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [nodes, isStreaming]);

  // Automatically open panel when a new platform/query is connected
  useEffect(() => {
    if (nodes.length > 0) {
      setIsOpen(true);
    }
  }, [nodes.length]);

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
      // Code blocks
      if (line.startsWith('```')) return <div key={i} className="h-0" />;
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

  // Helper to detect if a prompt is a platform connector
  const getPlatformFromPrompt = (prompt: string) => {
    const lower = prompt.toLowerCase();
    if (lower.startsWith('connect ')) {
      // e.g. "Connect Facebook — Connect with friends and community"
      // extract platform name between "Connect " and " —"
      const match = prompt.match(/Connect\s+([^-—]+)/i);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
    return null;
  };

  return (
    <div
      id="ai-response-panel"
      className={`fixed right-8 top-[100px] bottom-[120px] w-[460px] z-40 flex flex-col glass rounded-2xl border border-white/[0.08] shadow-2xl transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-[calc(100%+32px)]'
      } max-md:fixed max-md:right-4 max-md:left-4 max-md:w-auto max-md:top-[80px] max-md:bottom-[180px]`}
    >
      {/* Slide Toggle Button (attaches to the left edge of the panel) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-1/2 left-0 -translate-x-full -translate-y-1/2 w-8 h-20 glass rounded-l-xl border-y border-l border-white/[0.08] flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors active:scale-95 duration-200 shadow-xl cursor-pointer pointer-events-auto"
        aria-label={isOpen ? 'Close panel' : 'Open panel'}
      >
        <Icon name={isOpen ? 'chevron_right' : 'chevron_left'} size={20} />
      </button>

      {/* Inner overflow container */}
      <div className="flex-1 flex flex-col w-full h-full rounded-2xl overflow-hidden bg-transparent">
        {/* Panel Header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/[0.06] bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <Icon name={isStreaming ? 'auto_awesome' : 'smart_toy'} size={18} className="text-secondary animate-pulse" />
            <span className="font-label text-[12px] font-semibold tracking-[0.12em] uppercase text-on-surface">
              AI WORKSPACE RESPONSES
            </span>
          </div>
          {nodes.length > 0 && (
            <span className="font-label text-[10px] bg-primary/10 text-primary px-2.5 py-0.5 rounded-full font-semibold">
              {nodes.length} {nodes.length === 1 ? 'App' : 'Apps'} Connected
            </span>
          )}
        </div>

        {/* Responses Stream */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar scroll-smooth"
        >
          {nodes.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-40 px-6 py-12">
              <Icon name="chat_bubble_outline" size={40} className="text-on-surface-variant mb-3" />
              <p className="font-body text-[14px]">No active workspace connections</p>
              <p className="font-body text-[12px] mt-1">Connect platforms to view generated analysis</p>
            </div>
          ) : (
            nodes.map((node, index) => {
              const platformName = getPlatformFromPrompt(node.prompt);
              return (
                <div
                  key={node.id}
                  className={`relative border border-white/[0.03] bg-white/[0.01] rounded-xl p-4 transition-all duration-300 ${
                    node.isStreaming ? 'pulse-ai neon-glow border-primary/20' : 'hover:border-white/[0.06]'
                  }`}
                >
                  {/* Node Sub-Header (App / Prompt info) */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      {platformName ? (
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 p-1.5">
                          <SocialIcon platform={platformName.toLowerCase().replace(/\s+platform$/i, '').replace(/\s+/g, '-')} size={20} />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                          <Icon name="question_answer" size={16} className="text-primary" />
                        </div>
                      )}
                      <div>
                        <h4 className="font-heading text-[13px] font-semibold text-on-surface leading-tight">
                          {platformName ? `${platformName.toUpperCase()}` : 'USER QUERY'}
                        </h4>
                        <p className="font-body text-[11px] text-on-surface-variant opacity-60 mt-0.5 max-w-[280px] truncate">
                          {node.prompt}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => onRemoveNode(node.id)}
                      className="text-on-surface-variant hover:text-error p-1 rounded hover:bg-white/5 transition-colors"
                      aria-label="Remove response"
                    >
                      <Icon name="close" size={16} />
                    </button>
                  </div>

                  {/* Divider line */}
                  <div className="h-px bg-white/[0.05] my-3" />

                  {/* Markdown AI Output */}
                  <div className="text-[13.5px] leading-relaxed space-y-2 select-text custom-scrollbar">
                    {node.response ? (
                      <div className="space-y-0 text-on-surface-variant">{formatResponse(node.response)}</div>
                    ) : (
                      <div className="flex items-center gap-2 text-on-surface-variant opacity-50 py-2">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                        <span className="text-[12px] font-mono">Generating insights...</span>
                      </div>
                    )}
                    {/* Streaming cursor */}
                    {node.isStreaming && node.response && (
                      <span className="inline-block w-[2px] h-[14px] bg-primary ml-0.5 animate-pulse align-middle" />
                    )}
                  </div>
                </div>
              );
            })
          )}
          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
}
