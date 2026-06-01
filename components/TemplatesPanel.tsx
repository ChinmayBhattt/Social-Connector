'use client';

import React from 'react';
import Icon from './Icon';

type TemplatesPanelProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (prompt: string) => void;
};

const TEMPLATES = [
  {
    category: 'Code',
    icon: 'code',
    color: 'text-primary',
    items: [
      { title: 'Code Review', prompt: 'Review this code for best practices, performance issues, and potential bugs' },
      { title: 'Implement Feature', prompt: 'Help me implement a feature that handles user authentication with JWT tokens' },
      { title: 'Debug Issue', prompt: 'Help me debug this error and suggest a fix with explanation' },
    ],
  },
  {
    category: 'Creative',
    icon: 'palette',
    color: 'text-secondary',
    items: [
      { title: 'Brainstorm Ideas', prompt: 'Brainstorm creative ideas for a new product feature that improves user engagement' },
      { title: 'Design System', prompt: 'Design a comprehensive UI component system for a modern web application' },
      { title: 'Content Strategy', prompt: 'Create a content strategy for launching a new developer tool' },
    ],
  },
  {
    category: 'Research',
    icon: 'science',
    color: 'text-tertiary',
    items: [
      { title: 'Literature Review', prompt: 'Research and summarize recent papers on transformer architecture improvements' },
      { title: 'Market Analysis', prompt: 'Research the competitive landscape for AI-powered development tools' },
      { title: 'Technical Deep Dive', prompt: 'Research how WebGPU enables machine learning inference in the browser' },
    ],
  },
  {
    category: 'Analysis',
    icon: 'analytics',
    color: 'text-primary-fixed-dim',
    items: [
      { title: 'Data Analysis', prompt: 'Analyze this dataset and identify key trends, outliers, and actionable insights' },
      { title: 'Architecture Review', prompt: 'Review this system architecture for scalability, reliability, and maintainability' },
      { title: 'Performance Audit', prompt: 'Audit the performance of this application and suggest optimization strategies' },
    ],
  },
];

export default function TemplatesPanel({ isOpen, onClose, onSelect }: TemplatesPanelProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        id="templates-panel"
        className="fixed inset-0 z-[70] flex items-center justify-center p-8 max-md:p-4"
      >
        <div
          className="glass-elevated rounded-3xl w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col animate-modal-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-6 border-b border-white/[0.06]">
            <div className="flex items-center gap-3">
              <Icon name="layers" className="text-primary" />
              <h2 className="font-heading text-[24px] font-semibold text-on-surface tracking-tight">
                Templates
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-on-surface-variant hover:text-on-surface rounded-lg hover:bg-white/5 transition-colors"
              aria-label="Close templates"
            >
              <Icon name="close" />
            </button>
          </div>

          {/* Grid */}
          <div className="overflow-y-auto custom-scrollbar p-8 max-md:p-4">
            <div className="grid grid-cols-2 max-md:grid-cols-1 gap-6">
              {TEMPLATES.map((group) => (
                <div key={group.category} className="space-y-3">
                  {/* Category header */}
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name={group.icon} size={18} className={group.color} />
                    <span className="font-label text-[12px] font-semibold tracking-[0.1em] uppercase text-on-surface-variant">
                      {group.category}
                    </span>
                  </div>

                  {/* Template cards */}
                  {group.items.map((item) => (
                    <button
                      key={item.title}
                      onClick={() => {
                        onSelect(item.prompt);
                        onClose();
                      }}
                      className="w-full text-left glass rounded-xl p-4 hover:bg-white/[0.06] transition-all duration-200 group hover:scale-[1.01] active:scale-[0.99]"
                    >
                      <p className="text-on-surface text-[14px] font-medium group-hover:text-primary transition-colors">
                        {item.title}
                      </p>
                      <p className="text-on-surface-variant/50 text-[12px] mt-1 line-clamp-2">
                        {item.prompt}
                      </p>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
