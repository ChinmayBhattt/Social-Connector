'use client';

import React, { useState, useCallback, useEffect } from 'react';
import Icon from './Icon';
import SocialIcon from './SocialIcon';
import type { SocialPlatform, ConnectionStatus } from '@/lib/types';
import { getPlatformAuth } from '@/lib/platform-auth';

type ConnectionFlowModalProps = {
  isOpen: boolean;
  platform: SocialPlatform | null;
  onClose: () => void;
  onConnect: (platformId: string) => Promise<void>;
  onConnectWithKey: (platformId: string, key: string) => Promise<void>;
  connectionStatus?: ConnectionStatus;
  connectedAs?: string;
  maskedCredential?: string;
  errorMessage?: string;
};

export default function ConnectionFlowModal({
  isOpen,
  platform,
  onClose,
  onConnect,
  onConnectWithKey,
  connectionStatus,
  connectedAs,
  maskedCredential,
  errorMessage,
}: ConnectionFlowModalProps) {
  const [step, setStep] = useState<'permissions' | 'auth' | 'done'>('permissions');
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [webhookUrl] = useState(
    `https://app.connectorcanvas.com/webhook/usr_${Math.random().toString(36).slice(2, 8)}`
  );
  const [copied, setCopied] = useState(false);

  const auth = platform ? getPlatformAuth(platform.id) : null;

  // Reset state when modal opens/closes or platform changes
  useEffect(() => {
    if (isOpen && platform) {
      setStep('permissions');
      setApiKeyInput('');
      setCopied(false);
    }
  }, [isOpen, platform]);

  // Auto-advance to done when connected
  useEffect(() => {
    if (connectionStatus === 'connected') {
      setStep('done');
    }
  }, [connectionStatus]);

  // Auto-close after connection success
  useEffect(() => {
    if (step === 'done' && connectionStatus === 'connected') {
      const timer = setTimeout(() => {
        onClose();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [step, connectionStatus, onClose]);

  const handleBeginAuth = useCallback(async () => {
    if (!platform || !auth) return;

    if (auth.authType === 'api-key') {
      setStep('auth');
    } else if (auth.authType === 'webhook') {
      setStep('auth');
    } else {
      // OAuth2 — begin simulated redirect
      setStep('auth');
      await onConnect(platform.id);
    }
  }, [platform, auth, onConnect]);

  const handleSubmitApiKey = useCallback(async () => {
    if (!platform || !apiKeyInput.trim()) return;
    await onConnectWithKey(platform.id, apiKeyInput.trim());
  }, [platform, apiKeyInput, onConnectWithKey]);

  const handleCopyWebhook = useCallback(() => {
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [webhookUrl]);

  if (!isOpen || !platform || !auth) return null;

  const authTypeBadge = {
    'oauth2': { label: 'OAuth2', icon: 'lock', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' },
    'api-key': { label: 'API Key', icon: 'key', color: 'text-amber-400 bg-amber-400/10 border-amber-400/20' },
    'webhook': { label: 'Webhook', icon: 'webhook', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20' },
    'credentials': { label: 'Credentials', icon: 'password', color: 'text-purple-400 bg-purple-400/10 border-purple-400/20' },
  }[auth.authType];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[90] flex items-center justify-center p-6 max-md:p-3">
        <div
          className="glass-elevated rounded-3xl w-full max-w-[520px] overflow-hidden flex flex-col animate-modal-in relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Brand color accent glow */}
          <div
            className="absolute -top-20 -right-20 w-[200px] h-[200px] rounded-full opacity-[0.08] blur-[80px] pointer-events-none"
            style={{ backgroundColor: platform.color }}
          />

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 p-1.5">
                <SocialIcon platform={platform.icon} size={28} />
              </div>
              <div>
                <h2 className="font-heading text-[18px] font-semibold text-on-surface tracking-tight">
                  Connect {platform.name}
                </h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase border ${authTypeBadge.color}`}>
                    <Icon name={authTypeBadge.icon} size={12} />
                    {authTypeBadge.label}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-on-surface-variant hover:text-on-surface rounded-lg hover:bg-white/5 transition-colors"
              aria-label="Close"
            >
              <Icon name="close" size={20} />
            </button>
          </div>

          {/* Step Content */}
          <div className="px-6 py-5 min-h-[300px] flex flex-col">
            {/* ========== STEP 1: PERMISSIONS ========== */}
            {step === 'permissions' && (
              <div className="flex flex-col gap-5 animate-fade-in flex-1">
                {/* Connection steps */}
                <div>
                  <h3 className="font-label text-[11px] font-semibold tracking-[0.12em] uppercase text-on-surface-variant/60 mb-3">
                    HOW IT WORKS
                  </h3>
                  <div className="space-y-2.5">
                    {auth.connectionSteps.map((step, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="w-5 h-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-[10px] font-semibold text-primary">{i + 1}</span>
                        </span>
                        <p className="text-[13px] text-on-surface-variant leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Permissions */}
                {auth.scopes && auth.scopeDescriptions && (
                  <div>
                    <h3 className="font-label text-[11px] font-semibold tracking-[0.12em] uppercase text-on-surface-variant/60 mb-3">
                      PERMISSIONS REQUESTED
                    </h3>
                    <div className="space-y-2">
                      {auth.scopes.map((scope) => (
                        <div key={scope} className="flex items-center gap-2.5 py-1.5 px-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                          <Icon name="check_circle" size={14} className="text-emerald-500 shrink-0" filled />
                          <span className="text-[12px] text-on-surface-variant">
                            {auth.scopeDescriptions?.[scope] ?? scope}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trust disclaimer */}
                <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-primary/[0.04] border border-primary/10 mt-auto">
                  <Icon name="shield" size={16} className="text-primary/60 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-on-surface-variant/60 leading-relaxed">
                    We will never post, send, or read anything without your explicit instruction.
                    You can disconnect anytime.
                  </p>
                </div>

                {/* CTA Button */}
                <button
                  onClick={handleBeginAuth}
                  className="w-full py-3 rounded-xl font-semibold text-[14px] transition-all duration-200
                    active:scale-[0.98] hover:opacity-90 flex items-center justify-center gap-2"
                  style={{
                    background: `linear-gradient(135deg, ${platform.color}cc, ${platform.color}88)`,
                    color: '#fff',
                    boxShadow: `0 4px 20px ${platform.color}33`,
                  }}
                >
                  <Icon name={auth.authType === 'api-key' ? 'key' : 'login'} size={18} />
                  {auth.authType === 'api-key' ? 'Enter API Key' : `Connect ${platform.name}`}
                </button>
              </div>
            )}

            {/* ========== STEP 2: AUTH FLOW ========== */}
            {step === 'auth' && (
              <div className="flex flex-col gap-5 animate-fade-in flex-1">
                {/* OAuth2 Flow */}
                {auth.authType === 'oauth2' && (
                  <div className="flex flex-col items-center justify-center gap-6 flex-1 py-8">
                    {connectionStatus === 'connecting' && (
                      <>
                        <div className="relative">
                          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 p-2">
                            <SocialIcon platform={platform.icon} size={40} />
                          </div>
                          <div className="absolute inset-0 rounded-2xl animate-ping opacity-20" style={{ borderColor: platform.color, border: '2px solid' }} />
                        </div>
                        <div className="text-center">
                          <p className="text-[15px] text-on-surface font-medium">Redirecting to {platform.name}...</p>
                          <p className="text-[12px] text-on-surface-variant/50 mt-1">Waiting for authorization</p>
                        </div>
                        {/* Progress bar */}
                        <div className="w-full max-w-[240px] h-1 rounded-full bg-white/[0.06] overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-[1500ms] ease-out"
                            style={{
                              width: '60%',
                              background: `linear-gradient(90deg, ${platform.color}, ${platform.color}88)`,
                            }}
                          />
                        </div>
                      </>
                    )}
                    {connectionStatus === 'verifying' && (
                      <>
                        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 p-2 verify-pulse">
                          <SocialIcon platform={platform.icon} size={40} />
                        </div>
                        <div className="text-center">
                          <p className="text-[15px] text-on-surface font-medium">Verifying connection...</p>
                          <p className="text-[12px] text-on-surface-variant/50 mt-1">{auth.verifyEndpoint}</p>
                        </div>
                        <div className="w-full max-w-[240px] h-1 rounded-full bg-white/[0.06] overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-[1000ms] ease-out"
                            style={{
                              width: '90%',
                              background: `linear-gradient(90deg, ${platform.color}, #4ade80)`,
                            }}
                          />
                        </div>
                      </>
                    )}
                    {connectionStatus === 'error' && (
                      <>
                        <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center border border-red-500/20 p-2">
                          <Icon name="error" size={32} className="text-red-400" />
                        </div>
                        <div className="text-center px-4">
                          <p className="text-[15px] text-on-surface font-medium">Connection Failed</p>
                          <p className="text-[12px] text-red-400/80 mt-2 leading-relaxed max-w-[280px]">
                            {errorMessage || 'An error occurred during authentication.'}
                          </p>
                        </div>
                        <button
                          onClick={handleBeginAuth}
                          className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[13px] text-on-surface hover:bg-white/10 active:scale-[0.98] transition-all mt-4"
                        >
                          Try Again
                        </button>
                      </>
                    )}
                  </div>
                )}

                {/* API Key Flow */}
                {auth.authType === 'api-key' && (
                  <div className="flex flex-col gap-4 flex-1">
                    {connectionStatus !== 'verifying' && connectionStatus !== 'connected' ? (
                      <>
                        {/* Instructions */}
                        {auth.keyInstructions && (
                          <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                            <Icon name="info" size={16} className="text-primary/60 shrink-0 mt-0.5" />
                            <p className="text-[12px] text-on-surface-variant/70 leading-relaxed">
                              {auth.keyInstructions}
                            </p>
                          </div>
                        )}

                        {/* API Key Input */}
                        <div>
                          <label className="font-label text-[11px] font-semibold tracking-[0.1em] uppercase text-on-surface-variant/60 mb-2 block">
                            API KEY
                          </label>
                          <div className="relative">
                            <Icon name="key" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/30" />
                            <input
                              type="password"
                              value={apiKeyInput}
                              onChange={(e) => setApiKeyInput(e.target.value)}
                              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-[14px] text-on-surface placeholder:text-on-surface-variant/30 outline-none focus:border-primary/40 transition-colors font-mono"
                              placeholder={`${auth.keyPrefix ?? ''}••••••••••••••••`}
                              autoFocus
                            />
                          </div>
                        </div>

                        {/* Security notice */}
                        <div className="flex items-start gap-2 px-3 py-2 rounded-lg bg-emerald-500/[0.04] border border-emerald-500/10">
                          <Icon name="encrypted" size={14} className="text-emerald-500/60 shrink-0 mt-0.5" />
                          <p className="text-[11px] text-on-surface-variant/50 leading-relaxed">
                            Your key will be encrypted and stored securely. We will never display the full key again — only the last 4 characters.
                          </p>
                        </div>

                        {/* Submit */}
                        <button
                          onClick={handleSubmitApiKey}
                          disabled={!apiKeyInput.trim()}
                          className="w-full py-3 rounded-xl font-semibold text-[14px] transition-all duration-200
                            active:scale-[0.98] bg-primary text-on-primary flex items-center justify-center gap-2 mt-auto
                            disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
                        >
                          <Icon name="check" size={18} />
                          Validate & Connect
                        </button>
                      </>
                    ) : (
                      /* Verifying state */
                      <div className="flex flex-col items-center justify-center gap-6 flex-1 py-8">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 p-2 verify-pulse">
                          <SocialIcon platform={platform.icon} size={40} />
                        </div>
                        <div className="text-center">
                          <p className="text-[15px] text-on-surface font-medium">Validating API key...</p>
                          <p className="text-[12px] text-on-surface-variant/50 mt-1">Checking permissions</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Webhook Flow */}
                {auth.authType === 'webhook' && (
                  <div className="flex flex-col gap-4 flex-1">
                    <div>
                      <label className="font-label text-[11px] font-semibold tracking-[0.1em] uppercase text-on-surface-variant/60 mb-2 block">
                        YOUR WEBHOOK URL
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={webhookUrl}
                          readOnly
                          className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-4 pr-12 py-3 text-[13px] text-primary/80 font-mono outline-none"
                        />
                        <button
                          onClick={handleCopyWebhook}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-white/5 transition-all"
                          title="Copy URL"
                        >
                          <Icon name={copied ? 'check' : 'content_copy'} size={16} className={copied ? 'text-emerald-500' : ''} />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      {auth.connectionSteps.map((s, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <span className="w-5 h-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                            <span className="text-[10px] font-semibold text-primary">{i + 1}</span>
                          </span>
                          <p className="text-[13px] text-on-surface-variant leading-relaxed">{s}</p>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => onConnect(platform.id)}
                      className="w-full py-3 rounded-xl font-semibold text-[14px] transition-all duration-200
                        active:scale-[0.98] bg-primary text-on-primary flex items-center justify-center gap-2 mt-auto
                        hover:opacity-90"
                    >
                      <Icon name="check" size={18} />
                      I have configured the webhook
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ========== STEP 3: DONE ========== */}
            {step === 'done' && connectionStatus === 'connected' && (
              <div className="flex flex-col items-center justify-center gap-5 flex-1 py-8 animate-fade-in">
                {/* Success icon */}
                <div className="relative">
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center border p-3 connect-success"
                    style={{
                      backgroundColor: `${platform.color}15`,
                      borderColor: `${platform.color}30`,
                    }}
                  >
                    <SocialIcon platform={platform.icon} size={48} />
                  </div>
                  {/* Animated checkmark */}
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg connect-success-badge">
                    <Icon name="check" size={16} filled className="text-white" />
                  </div>
                </div>

                {/* Success text */}
                <div className="text-center">
                  <h3 className="text-[18px] font-semibold text-on-surface mb-1">
                    {platform.name} Connected!
                  </h3>
                  <p className="text-[13px] text-on-surface-variant/70">
                    {connectedAs && (
                      <span className="text-emerald-400 font-medium">{connectedAs}</span>
                    )}
                  </p>
                  {maskedCredential && (
                    <p className="text-[12px] text-on-surface-variant/40 font-mono mt-1">
                      {maskedCredential}
                    </p>
                  )}
                </div>

                {/* Status badge */}
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[12px] font-semibold text-emerald-400 uppercase tracking-wider">
                    Active & Ready
                  </span>
                </div>

                <p className="text-[11px] text-on-surface-variant/40 text-center max-w-[280px]">
                  You can disconnect anytime from the canvas.
                  This window will close automatically.
                </p>
              </div>
            )}
          </div>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 px-6 py-3 border-t border-white/[0.04]">
            {['permissions', 'auth', 'done'].map((s) => (
              <div
                key={s}
                className={`h-1 rounded-full transition-all duration-300 ${
                  s === step
                    ? 'w-8 bg-primary'
                    : ['permissions', 'auth', 'done'].indexOf(s) < ['permissions', 'auth', 'done'].indexOf(step)
                      ? 'w-4 bg-primary/40'
                      : 'w-4 bg-white/10'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
