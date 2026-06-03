'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import Icon from './Icon';

export default function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Profile data state
  const [profileName, setProfileName] = useState('Chinmay Bhatt');
  const [profileEmail, setProfileEmail] = useState('chinmay.bhatt@gmail.com');
  const [profileBio, setProfileBio] = useState('Full-stack developer building connected workflows.');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [showProfileSuccess, setShowProfileSuccess] = useState(false);

  // Sync developer profile with Supabase authenticated user session
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setProfileEmail(user.email || '');
        const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Chinmay Bhatt';
        const formattedName = name
          .split('.')
          .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        setProfileName(formattedName);
      }
    });
  }, []);

  // Settings data state
  const [autoSave, setAutoSave] = useState(true);
  const [aiAssist, setAiAssist] = useState(true);
  const [gridStyle, setGridStyle] = useState<'dots' | 'lines' | 'none'>('dots');
  const [aiTemperature, setAiTemperature] = useState(0.7);
  const [keyboardShortcuts, setKeyboardShortcuts] = useState(true);
  const [canvasGlows, setCanvasGlows] = useState(true);
  const [devMode, setDevMode] = useState(false);
  const [showSettingsSuccess, setShowSettingsSuccess] = useState(false);

  // Theme state
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Load preferences from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem('connector-canvas-settings');
      if (raw) {
        try {
          const config = JSON.parse(raw);
          if (config.autoSave !== undefined) setAutoSave(config.autoSave);
          if (config.aiAssist !== undefined) setAiAssist(config.aiAssist);
          if (config.gridStyle !== undefined) setGridStyle(config.gridStyle);
          if (config.aiTemperature !== undefined) setAiTemperature(config.aiTemperature);
          if (config.keyboardShortcuts !== undefined) setKeyboardShortcuts(config.keyboardShortcuts);
          if (config.canvasGlows !== undefined) setCanvasGlows(config.canvasGlows);
          if (config.devMode !== undefined) setDevMode(config.devMode);
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const avatarBtnRef = useRef<HTMLButtonElement>(null);

  // Initialize theme from html class list or localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isLight = document.documentElement.classList.contains('light');
      setTheme(isLight ? 'light' : 'dark');
    }
  }, []);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        avatarBtnRef.current &&
        !avatarBtnRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Toggle Dark / Light Theme
  const handleToggleTheme = useCallback(() => {
    const html = document.documentElement;
    if (html.classList.contains('light')) {
      html.classList.remove('light');
      html.classList.add('dark');
      setTheme('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('dark');
      html.classList.add('light');
      setTheme('light');
      localStorage.setItem('theme', 'light');
    }
  }, []);

  // Save profile handler
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: profileName },
      });
      if (error) throw error;
      
      setShowProfileSuccess(true);
      setTimeout(() => {
        setShowProfileSuccess(false);
        setProfileOpen(false);
      }, 1500);
    } catch (err) {
      console.error('Error updating user profile:', err);
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Save settings handler
  const handleSaveSettings = () => {
    if (typeof window !== 'undefined') {
      const config = {
        autoSave,
        aiAssist,
        gridStyle,
        aiTemperature,
        keyboardShortcuts,
        canvasGlows,
        devMode,
      };
      localStorage.setItem('connector-canvas-settings', JSON.stringify(config));
      window.dispatchEvent(new Event('connector-settings-updated'));
    }
    setShowSettingsSuccess(true);
    setTimeout(() => {
      setShowSettingsSuccess(false);
      setSettingsOpen(false);
    }, 1500);
  };

  return (
    <>
      <header
        id="app-header"
        className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-8 py-4 bg-transparent select-none pointer-events-none"
      >
        {/* Brand */}
        <div className="flex items-center gap-2 group cursor-pointer pointer-events-auto">
          <span className="font-heading text-[32px] font-bold text-primary tracking-[-0.03em] transition-all duration-300 group-hover:opacity-80 group-hover:drop-shadow-[0_0_12px_rgba(173,198,255,0.4)]">
            Connector
          </span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4 relative pointer-events-auto">
          {/* System status */}
          <div className="flex items-center gap-[6px] text-on-surface-variant font-label text-[12px] font-semibold tracking-[0.1em] uppercase">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>System Online</span>
          </div>

          {/* Avatar button */}
          <button
            ref={avatarBtnRef}
            id="avatar-btn"
            onClick={() => setDropdownOpen((prev) => !prev)}
            className={`flex items-center justify-center w-10 h-10 rounded-full glass hover:opacity-80 transition-all active:scale-95 duration-200 ${
              dropdownOpen ? 'border-primary shadow-[0_0_8px_rgba(173,198,255,0.3)]' : ''
            }`}
            aria-label="Account"
          >
            <Icon name="account_circle" className="text-primary" size={26} />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute right-0 top-12 w-60 rounded-2xl glass-elevated shadow-xl p-2 flex flex-col gap-1 z-50 animate-modal-in border border-white/10"
            >
              {/* Profile Header section */}
              <div className="px-3 py-2 border-b border-white/[0.06] mb-1">
                <div className="text-xs font-semibold text-on-surface truncate">{profileName}</div>
                <div className="text-[10px] text-on-surface-variant/60 truncate">{profileEmail}</div>
              </div>

              {/* Profile Option */}
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  setProfileOpen(true);
                }}
                className="flex items-center gap-3 w-full px-3 py-2.5 text-left text-xs font-medium rounded-xl hover:bg-white/5 active:scale-[0.98] transition-all text-on-surface-variant hover:text-on-surface"
              >
                <Icon name="person" size={18} className="text-primary" />
                <span>Profile</span>
              </button>

              {/* Settings Option */}
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  setSettingsOpen(true);
                }}
                className="flex items-center gap-3 w-full px-3 py-2.5 text-left text-xs font-medium rounded-xl hover:bg-white/5 active:scale-[0.98] transition-all text-on-surface-variant hover:text-on-surface"
              >
                <Icon name="settings" size={18} className="text-primary" />
                <span>Settings</span>
              </button>

              {/* Theme Toggle Option */}
              <button
                onClick={handleToggleTheme}
                className="flex items-center justify-between w-full px-3 py-2.5 text-left text-xs font-medium rounded-xl hover:bg-white/5 active:scale-[0.98] transition-all text-on-surface-variant hover:text-on-surface"
              >
                <div className="flex items-center gap-3">
                  <Icon name={theme === 'dark' ? 'light_mode' : 'dark_mode'} size={18} className="text-primary" />
                  <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                </div>
                <div className={`w-8 h-4 rounded-full relative flex items-center transition-colors ${theme === 'dark' ? 'bg-white/10' : 'bg-primary'}`}>
                  <span className={`w-3 h-3 rounded-full bg-white absolute transition-transform ${theme === 'dark' ? 'translate-x-0.5' : 'translate-x-4.5'}`} />
                </div>
              </button>

              {/* Divider */}
              <div className="h-px bg-white/[0.06] my-1" />

              {/* Logout Option */}
              <button
                onClick={async () => {
                  setDropdownOpen(false);
                  await supabase.auth.signOut();
                }}
                className="flex items-center gap-3 w-full px-3 py-2.5 text-left text-xs font-medium rounded-xl hover:bg-red-500/10 active:scale-[0.98] transition-all text-red-400 hover:text-red-300"
              >
                <Icon name="logout" size={18} className="text-red-400" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Profile Modal */}
      {profileOpen && (
        <>
          <div className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-md" onClick={() => setProfileOpen(false)} />
          <div className="fixed inset-0 z-[90] flex items-center justify-center p-6 max-md:p-3 animate-fade-in">
            <div
              className="glass-elevated rounded-3xl w-full max-w-[500px] overflow-hidden flex flex-col animate-modal-in border border-white/10 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                    <Icon name="person" size={24} className="text-primary" />
                  </div>
                  <div>
                    <h2 className="font-heading text-[18px] font-semibold text-on-surface tracking-tight">
                      User Profile
                    </h2>
                    <p className="text-[11px] text-on-surface-variant/50">Manage your canvas developer account</p>
                  </div>
                </div>
                <button
                  onClick={() => setProfileOpen(false)}
                  className="p-1.5 text-on-surface-variant hover:text-on-surface rounded-lg hover:bg-white/5 transition-colors"
                  aria-label="Close"
                >
                  <Icon name="close" size={20} />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSaveProfile} className="px-6 py-5 flex flex-col gap-4">
                {/* Banner Gradient Decor */}
                <div className="h-20 w-full rounded-2xl bg-gradient-to-r from-primary/30 via-secondary/20 to-tertiary/20 flex items-end p-3 relative overflow-hidden border border-white/5">
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-primary/20 text-primary border border-primary/30">
                    Developer Account
                  </div>
                  <div className="flex items-center gap-3 z-10">
                    <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-primary text-xl font-bold font-heading">
                      CB
                    </div>
                    <div>
                      <div className="text-xs font-bold text-on-surface">{profileName}</div>
                      <div className="text-[10px] text-on-surface-variant/80">Active Developer Session</div>
                    </div>
                  </div>
                </div>

                {/* Name field */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-label text-[10px] font-semibold tracking-[0.1em] uppercase text-on-surface-variant/60">
                    FULL NAME
                  </label>
                  <input
                    type="text"
                    required
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-on-surface placeholder:text-on-surface-variant/30 outline-none focus:border-primary/40 transition-colors"
                    placeholder="Enter your name"
                  />
                </div>

                {/* Email field */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-label text-[10px] font-semibold tracking-[0.1em] uppercase text-on-surface-variant/60">
                    EMAIL ADDRESS
                  </label>
                  <input
                    type="email"
                    required
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-on-surface placeholder:text-on-surface-variant/30 outline-none focus:border-primary/40 transition-colors"
                    placeholder="name@example.com"
                  />
                </div>

                {/* Bio field */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-label text-[10px] font-semibold tracking-[0.1em] uppercase text-on-surface-variant/60">
                    SHORT BIO
                  </label>
                  <textarea
                    value={profileBio}
                    onChange={(e) => setProfileBio(e.target.value)}
                    rows={2}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2 text-xs text-on-surface placeholder:text-on-surface-variant/30 outline-none focus:border-primary/40 transition-colors resize-none"
                    placeholder="Describe your workflow style..."
                  />
                </div>

                {/* Active Sessions info */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-label text-[10px] font-semibold tracking-[0.1em] uppercase text-on-surface-variant/60">
                    ACTIVE SESSIONS
                  </label>
                  <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-2.5 flex flex-col gap-2">
                    <div className="flex justify-between items-center text-[11px]">
                      <div className="flex items-center gap-1.5 text-on-surface font-medium">
                        <Icon name="laptop_mac" size={14} className="text-primary/70" />
                        <span>macOS (Chrome Browser)</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wide">Current</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px] opacity-60">
                      <div className="flex items-center gap-1.5 text-on-surface">
                        <Icon name="phone_iphone" size={14} />
                        <span>iPhone 15 Pro (Safari)</span>
                      </div>
                      <span className="text-[10px] text-on-surface-variant">2 hrs ago</span>
                    </div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => setProfileOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-[12px] font-semibold text-on-surface active:scale-[0.98] transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingProfile}
                    className="flex-1 py-2.5 rounded-xl bg-primary text-on-primary hover:opacity-90 text-[12px] font-semibold flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    {isSavingProfile ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : showProfileSuccess ? (
                      <>
                        <Icon name="check" size={14} />
                        <span>Saved!</span>
                      </>
                    ) : (
                      <span>Save Changes</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      {/* Settings Modal */}
      {settingsOpen && (
        <>
          <div className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-md" onClick={() => setSettingsOpen(false)} />
          <div className="fixed inset-0 z-[90] flex items-center justify-center p-6 max-md:p-3 animate-fade-in">
            <div
              className="glass-elevated rounded-3xl w-full max-w-[480px] overflow-hidden flex flex-col animate-modal-in border border-white/10 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                    <Icon name="settings" size={24} className="text-primary" />
                  </div>
                  <div>
                    <h2 className="font-heading text-[18px] font-semibold text-on-surface tracking-tight">
                      Preferences
                    </h2>
                    <p className="text-[11px] text-on-surface-variant/50">Configure your application workspace</p>
                  </div>
                </div>
                <button
                  onClick={() => setSettingsOpen(false)}
                  className="p-1.5 text-on-surface-variant hover:text-on-surface rounded-lg hover:bg-white/5 transition-colors"
                  aria-label="Close"
                >
                  <Icon name="close" size={20} />
                </button>
              </div>

              {/* Preferences Settings Content */}
              <div className="px-6 py-5 flex flex-col gap-5">
                {/* Auto Save Toggle */}
                <div className="flex items-center justify-between py-1">
                  <div className="flex flex-col gap-0.5">
                    <div className="text-xs font-semibold text-on-surface">Auto-save changes</div>
                    <div className="text-[10px] text-on-surface-variant/60">Automatically commit workflow steps</div>
                  </div>
                  <button
                    onClick={() => setAutoSave(!autoSave)}
                    className={`w-10 h-6 rounded-full transition-colors relative flex items-center ${
                      autoSave ? 'bg-primary' : 'bg-white/10'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full bg-white absolute transition-transform ${
                        autoSave ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* AI suggestion helper */}
                <div className="flex items-center justify-between py-1">
                  <div className="flex flex-col gap-0.5">
                    <div className="text-xs font-semibold text-on-surface">Enable AI assistance</div>
                    <div className="text-[10px] text-on-surface-variant/60">Inline help & smart code generation</div>
                  </div>
                  <button
                    onClick={() => setAiAssist(!aiAssist)}
                    className={`w-10 h-6 rounded-full transition-colors relative flex items-center ${
                      aiAssist ? 'bg-primary' : 'bg-white/10'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full bg-white absolute transition-transform ${
                        aiAssist ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Canvas grid style selector */}
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-0.5">
                    <div className="text-xs font-semibold text-on-surface">Canvas background grid</div>
                    <div className="text-[10px] text-on-surface-variant/60">Choose standard visual grid layout</div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-1">
                    {(['dots', 'lines', 'none'] as const).map((style) => (
                      <button
                        key={style}
                        onClick={() => setGridStyle(style)}
                        className={`py-2 rounded-xl text-[11px] font-semibold uppercase tracking-wider border capitalize transition-all ${
                          gridStyle === style
                            ? 'bg-primary/10 border-primary text-primary shadow-[0_0_8px_rgba(173,198,255,0.2)]'
                            : 'border-white/10 text-on-surface-variant hover:text-on-surface hover:bg-white/5'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                {/* AI Creativity / Temperature */}
                <div className="flex flex-col gap-2 border-t border-white/[0.06] pt-4">
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col gap-0.5">
                      <div className="text-xs font-semibold text-on-surface">AI Creativity (Temperature)</div>
                      <div className="text-[10px] text-on-surface-variant/60">Balance accuracy vs. creative ideas</div>
                    </div>
                    <span className="text-xs font-mono font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-lg border border-primary/20">
                      {aiTemperature.toFixed(1)}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-[10px] font-semibold text-on-surface-variant/60 font-label">Precise (0.2)</span>
                    <input
                      type="range"
                      min="0.2"
                      max="1.0"
                      step="0.1"
                      value={aiTemperature}
                      onChange={(e) => setAiTemperature(parseFloat(e.target.value))}
                      className="flex-1 accent-primary h-1 rounded-full bg-white/10 appearance-none cursor-pointer"
                    />
                    <span className="text-[10px] font-semibold text-on-surface-variant/60 font-label">Creative (1.0)</span>
                  </div>
                </div>

                {/* Keyboard Shortcuts */}
                <div className="flex items-center justify-between py-1">
                  <div className="flex flex-col gap-0.5">
                    <div className="text-xs font-semibold text-on-surface">Keyboard shortcuts</div>
                    <div className="text-[10px] text-on-surface-variant/60 font-label">Enable pan (P), zoom (Z), reset (ESC)</div>
                  </div>
                  <button
                    onClick={() => setKeyboardShortcuts(!keyboardShortcuts)}
                    className={`w-10 h-6 rounded-full transition-colors relative flex items-center ${
                      keyboardShortcuts ? 'bg-primary' : 'bg-white/10'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full bg-white absolute transition-transform ${
                        keyboardShortcuts ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Hardware Accelerated Canvas Effects */}
                <div className="flex items-center justify-between py-1">
                  <div className="flex flex-col gap-0.5">
                    <div className="text-xs font-semibold text-on-surface">Hardware acceleration</div>
                    <div className="text-[10px] text-on-surface-variant/60 font-label">Accelerated glow, pulse & blur transitions</div>
                  </div>
                  <button
                    onClick={() => setCanvasGlows(!canvasGlows)}
                    className={`w-10 h-6 rounded-full transition-colors relative flex items-center ${
                      canvasGlows ? 'bg-primary' : 'bg-white/10'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full bg-white absolute transition-transform ${
                        canvasGlows ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Developer Mode */}
                <div className="flex items-center justify-between py-1 border-t border-white/[0.06] pt-4">
                  <div className="flex flex-col gap-0.5">
                    <div className="text-xs font-semibold text-on-surface">Developer debug panel</div>
                    <div className="text-[10px] text-on-surface-variant/60">Displays runtime metrics & payload states</div>
                  </div>
                  <button
                    onClick={() => setDevMode(!devMode)}
                    className={`w-10 h-6 rounded-full transition-colors relative flex items-center ${
                      devMode ? 'bg-primary' : 'bg-white/10'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full bg-white absolute transition-transform ${
                        devMode ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* CTA Buttons */}
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => setSettingsOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-[12px] font-semibold text-on-surface active:scale-[0.98] transition-all"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleSaveSettings}
                    className="flex-1 py-2.5 rounded-xl bg-primary text-on-primary hover:opacity-90 text-[12px] font-semibold flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all"
                  >
                    {showSettingsSuccess ? (
                      <>
                        <Icon name="check" size={14} />
                        <span>Saved Preferences!</span>
                      </>
                    ) : (
                      <span>Apply Preferences</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
