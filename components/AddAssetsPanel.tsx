'use client';

import React, { useState, useMemo } from 'react';
import Icon from './Icon';
import SocialIcon from './SocialIcon';
import { SOCIAL_PLATFORMS, CATEGORIES } from '@/lib/platforms';
import type { SocialPlatform } from '@/lib/types';

type AddAssetsPanelProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlatform: (platform: SocialPlatform) => void;
  connectedIds: string[];
};

export default function AddAssetsPanel({
  isOpen,
  onClose,
  onSelectPlatform,
  connectedIds,
}: AddAssetsPanelProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPlatforms = useMemo(() => {
    let result = SOCIAL_PLATFORMS;
    if (activeCategory !== 'all') {
      result = result.filter((p) => p.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.label.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }
    return result;
  }, [activeCategory, searchQuery]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-6 max-md:p-3">
        <div
          id="add-assets-panel"
          className="glass-elevated rounded-3xl w-full max-w-[720px] max-h-[85vh] overflow-hidden flex flex-col animate-modal-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06] shrink-0">
            <h2 className="font-label text-[14px] font-semibold tracking-[0.1em] uppercase text-on-surface">
              Add Assets
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 text-on-surface-variant hover:text-on-surface rounded-lg hover:bg-white/5 transition-colors"
              aria-label="Close"
            >
              <Icon name="close" size={20} />
            </button>
          </div>

          {/* Search + Category filter */}
          <div className="px-6 py-4 border-b border-white/[0.04] shrink-0 space-y-3">
            {/* Search */}
            <div className="relative">
              <Icon
                name="search"
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/40"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-[14px] text-on-surface placeholder:text-on-surface-variant/40 outline-none focus:border-primary/40 transition-colors"
                placeholder="Search platforms..."
              />
            </div>

            {/* Category tabs */}
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-[0.08em] uppercase transition-all duration-200 active:scale-95
                    ${
                      activeCategory === cat.id
                        ? 'bg-primary/20 text-primary border border-primary/30'
                        : 'bg-white/[0.04] text-on-surface-variant/60 border border-white/[0.06] hover:bg-white/[0.08] hover:text-on-surface-variant'
                    }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="overflow-y-auto custom-scrollbar flex-1 p-6">
            {filteredPlatforms.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <Icon name="search_off" size={40} className="text-on-surface-variant/30" />
                <p className="text-on-surface-variant/50 text-[14px]">No platforms found</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 max-md:grid-cols-1 gap-4">
                {filteredPlatforms.map((platform) => {
                  const isConnected = connectedIds.includes(platform.id);
                  return (
                    <button
                      key={platform.id}
                      onClick={() => {
                        if (!isConnected) onSelectPlatform(platform);
                      }}
                      disabled={isConnected}
                      className={`relative group flex flex-col items-center gap-3 rounded-2xl p-5 transition-all duration-200 text-center
                        ${
                          isConnected
                            ? 'bg-white/[0.02] border border-primary/20 opacity-60 cursor-default'
                            : 'glass hover:bg-white/[0.07] hover:scale-[1.02] active:scale-[0.98] cursor-pointer'
                        }`}
                    >
                      {/* Drag handle */}
                      {!isConnected && (
                        <div className="absolute top-3 right-3 text-on-surface-variant/20 group-hover:text-on-surface-variant/40 transition-colors">
                          <Icon name="drag_indicator" size={16} />
                        </div>
                      )}

                      {/* Connected badge */}
                      {isConnected && (
                        <div className="absolute top-3 right-3 flex items-center gap-1">
                          <Icon name="check_circle" size={14} className="text-primary" filled />
                        </div>
                      )}

                      {/* Icon */}
                      <SocialIcon platform={platform.icon} size={48} />

                      {/* Label */}
                      <span className="font-label text-[11px] font-semibold tracking-[0.1em] uppercase text-on-surface-variant/70">
                        {platform.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-white/[0.06] shrink-0">
            <p className="font-label text-[10px] font-semibold tracking-[0.12em] uppercase text-on-surface-variant/30 text-center">
              {connectedIds.length > 0
                ? `${connectedIds.length} connected · Ready for deployment`
                : 'Ready for deployment'}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
