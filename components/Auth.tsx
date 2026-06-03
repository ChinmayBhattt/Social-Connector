'use client';

import React, { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import Icon from './Icon';

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleEmailAuth = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError(null);
      setMessage(null);

      try {
        if (isSignUp) {
          const { data, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: fullName,
              },
              emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}` : undefined,
            },
          });

          if (signUpError) throw signUpError;
          
          if (data.user && data.session === null) {
            setMessage('Registration successful! Please check your email for verification link.');
          } else {
            setMessage('Account created and signed in successfully!');
          }
        } else {
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (signInError) throw signInError;
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred.');
        }
      } finally {
        setLoading(false);
      }
    },
    [isSignUp, fullName, email, password]
  );

  const handleOAuthSignIn = useCallback(async (provider: 'github' | 'google') => {
    setLoading(true);
    setError(null);
    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: typeof window !== 'undefined' ? `${window.location.origin}` : undefined,
        },
      });
      if (oauthError) throw oauthError;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('OAuth sign in failed.');
      }
      setLoading(false);
    }
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background canvas-bg z-[100] px-4">
      {/* Decorative center glow */}
      <div className="absolute w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -z-10 pointer-events-none" style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }} />

      <div className="glass-elevated rounded-3xl w-full max-w-[420px] overflow-hidden p-8 border border-white/10 shadow-2xl relative animate-modal-in">
        {/* Decorative corner glow */}
        <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

        {/* Logo and Brand */}
        <div className="flex flex-col items-center gap-2 mb-8 text-center">
          <span className="font-heading text-[36px] font-bold text-primary tracking-[-0.03em] drop-shadow-[0_0_12px_rgba(173,198,255,0.2)]">
            Connector
          </span>
          <p className="text-xs text-on-surface-variant/60">
            {isSignUp ? 'Create your canvas developer account' : 'Sign in to access your AI workspace'}
          </p>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="mb-5 flex items-start gap-2.5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 leading-relaxed">
            <Icon name="error" size={16} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
        {message && (
          <div className="mb-5 flex items-start gap-2.5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 leading-relaxed">
            <Icon name="check_circle" size={16} className="shrink-0 mt-0.5" />
            <span>{message}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleEmailAuth} className="flex flex-col gap-4">
          {isSignUp && (
            <div className="flex flex-col gap-1.5 animate-fade-in">
              <label className="font-label text-[10px] font-semibold tracking-[0.1em] uppercase text-on-surface-variant/60">
                FULL NAME
              </label>
              <div className="relative">
                <Icon name="person" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/30" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-xs text-on-surface placeholder:text-on-surface-variant/30 outline-none focus:border-primary/40 transition-colors"
                  placeholder="Chinmay Bhatt"
                />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="font-label text-[10px] font-semibold tracking-[0.1em] uppercase text-on-surface-variant/60">
              EMAIL ADDRESS
            </label>
            <div className="relative">
              <Icon name="mail" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/30" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-xs text-on-surface placeholder:text-on-surface-variant/30 outline-none focus:border-primary/40 transition-colors"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-label text-[10px] font-semibold tracking-[0.1em] uppercase text-on-surface-variant/60">
              PASSWORD
            </label>
            <div className="relative">
              <Icon name="lock" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/30" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-xs text-on-surface placeholder:text-on-surface-variant/30 outline-none focus:border-primary/40 transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-primary text-on-primary hover:opacity-90 transition-all font-semibold text-[13px] flex items-center justify-center gap-1.5 active:scale-[0.98] disabled:opacity-50 mt-2 cursor-pointer shadow-[0_4px_16px_rgba(173,198,255,0.25)]"
          >
            {loading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Icon name={isSignUp ? 'person_add' : 'login'} size={16} />
                <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-[10px] font-semibold tracking-wider text-on-surface-variant/40 uppercase">OR CONTINUE WITH</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        {/* OAuth Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleOAuthSignIn('github')}
            disabled={loading}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 active:scale-[0.98] transition-all text-xs font-semibold text-on-surface"
          >
            {/* Simple GitHub SVG */}
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            <span>GitHub</span>
          </button>

          <button
            type="button"
            onClick={() => handleOAuthSignIn('google')}
            disabled={loading}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 active:scale-[0.98] transition-all text-xs font-semibold text-on-surface"
          >
            {/* Simple Google SVG */}
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-6.887 4.114-4.69 0-8.503-3.813-8.503-8.503s3.813-8.503 8.503-8.503c2.203 0 4.2.812 5.728 2.37l3.117-3.117C18.232 1.188 15.347 0 12.24 0 5.48 0 0 5.48 0 12.24s5.48 12.24 12.24 12.24c6.887 0 12.24-5.48 12.24-12.24 0-.877-.078-1.724-.224-2.553l-12.016.141z" />
            </svg>
            <span>Google</span>
          </button>
        </div>

        {/* Toggle Mode Link */}
        <div className="mt-8 text-center text-xs">
          <span className="text-on-surface-variant/40">
            {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
          </span>
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
              setMessage(null);
            }}
            className="text-primary font-semibold hover:underline cursor-pointer"
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
      </div>
    </div>
  );
}
