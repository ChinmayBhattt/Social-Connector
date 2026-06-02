'use client';

import React from 'react';

type SocialIconProps = {
  platform: string;
  size?: number;
  className?: string;
};

export default function SocialIcon({ platform, size = 48, className = '' }: SocialIconProps) {
  const icon = ICONS[platform];
  if (!icon) return <div className={`w-[${size}px] h-[${size}px] ${className}`} />;
  return (
    <div className={className} style={{ width: size, height: size }}>
      {icon(size)}
    </div>
  );
}

const ICONS: Record<string, (size: number) => React.ReactNode> = {
  x: (s) => (
    <svg viewBox="0 0 24 24" width={s} height={s} fill="white">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),

  'x-platform': (s) => (
    <svg viewBox="0 0 24 24" width={s} height={s} fill="white">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),

  instagram: (s) => (
    <svg viewBox="0 0 48 48" width={s} height={s}>
      <defs>
        <radialGradient id="ig1" cx="19.38" cy="42.035" r="44.899" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fd5" />
          <stop offset=".328" stopColor="#ff543f" />
          <stop offset=".348" stopColor="#fc5245" />
          <stop offset=".504" stopColor="#e64771" />
          <stop offset=".643" stopColor="#d53e91" />
          <stop offset=".761" stopColor="#cc39a4" />
          <stop offset=".841" stopColor="#c837ab" />
        </radialGradient>
        <radialGradient id="ig2" cx="11.786" cy="2.779" r="29.813" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#4168c9" />
          <stop offset=".999" stopColor="#4168c9" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="2" y="2" width="44" height="44" rx="12" fill="url(#ig1)" />
      <rect x="2" y="2" width="44" height="44" rx="12" fill="url(#ig2)" />
      <circle cx="24" cy="24" r="9" fill="none" stroke="white" strokeWidth="3" />
      <circle cx="35.5" cy="12.5" r="2.5" fill="white" />
      <rect x="8" y="8" width="32" height="32" rx="8" fill="none" stroke="white" strokeWidth="3" />
    </svg>
  ),

  youtube: (s) => (
    <svg viewBox="0 0 48 48" width={s} height={s}>
      <rect width="48" height="48" rx="10" fill="#FF0000" />
      <path d="M19 32V16l13 8z" fill="white" />
    </svg>
  ),

  linkedin: (s) => (
    <svg viewBox="0 0 48 48" width={s} height={s}>
      <rect width="48" height="48" rx="10" fill="#0A66C2" />
      <path d="M15 20h-4v14h4zm-2-6.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5zM35 34h-4v-7c0-2-.7-3.5-2.6-3.5-1.4 0-2.3 1-2.6 1.9-.1.3-.2.8-.2 1.2V34h-4s.1-12 0-14h4v2c.5-.8 1.5-2 3.6-2 2.6 0 4.6 1.7 4.6 5.4V34h1.2z" fill="white" />
    </svg>
  ),

  facebook: (s) => (
    <svg viewBox="0 0 48 48" width={s} height={s}>
      <rect width="48" height="48" rx="10" fill="#1877F2" />
      <path d="M29 25.5l.7-5H25v-3.2c0-1.4.7-2.8 2.9-2.8H30v-4.3s-2-.3-3.9-.3c-4 0-6.6 2.4-6.6 6.8v3.8h-4.4v5H20V38h5V25.5z" fill="white" />
    </svg>
  ),

  tiktok: (s) => (
    <svg viewBox="0 0 48 48" width={s} height={s}>
      <rect width="48" height="48" rx="10" fill="#010101" />
      <path d="M33.5 16.5c-1.8-1.2-3-3.2-3.2-5.5h-4.8v18.5c0 2.5-2 4.5-4.5 4.5s-4.5-2-4.5-4.5 2-4.5 4.5-4.5c.5 0 1 .1 1.4.2v-4.9c-.5-.1-1-.1-1.4-.1-5.2 0-9.4 4.2-9.4 9.4s4.2 9.4 9.4 9.4 9.4-4.2 9.4-9.4V22c1.8 1.3 4 2 6.3 2v-4.8c-1.3 0-2.5-.4-3.5-1" fill="#00F2EA" />
      <path d="M33.5 16.5c-1.8-1.2-3-3.2-3.2-5.5h-4.8v18.5c0 2.5-2 4.5-4.5 4.5s-4.5-2-4.5-4.5 2-4.5 4.5-4.5c.5 0 1 .1 1.4.2v-4.9c-.5-.1-1-.1-1.4-.1-5.2 0-9.4 4.2-9.4 9.4s4.2 9.4 9.4 9.4 9.4-4.2 9.4-9.4V22c1.8 1.3 4 2 6.3 2v-4.8c-1.3 0-2.5-.4-3.5-1" fill="#FF004F" opacity="0.6" />
    </svg>
  ),

  discord: (s) => (
    <svg viewBox="0 0 48 48" width={s} height={s}>
      <rect width="48" height="48" rx="10" fill="#5865F2" />
      <path d="M33.6 15.2a22.7 22.7 0 00-5.6-1.7l-.2.5c2 .5 3.8 1.2 5.5 2.1A22 22 0 0015.7 16l-.5.1a21.4 21.4 0 00-4 2.1A23 23 0 0016 18l-.3-.5a22.7 22.7 0 00-5.5 1.7S7.3 23.7 6.7 32.8a23 23 0 006.8 3.4l.8-1.1a14.8 14.8 0 01-4.2-2l.3-.3a16.8 16.8 0 0014.7 0l.4.3a15 15 0 01-4.2 2l.8 1.1a23 23 0 006.8-3.4c-.5-6.6-2.2-12.3-4.3-17.6zM18.3 30.2c-1.5 0-2.8-1.4-2.8-3.1s1.2-3.2 2.8-3.2 2.8 1.4 2.8 3.2-1.3 3.1-2.8 3.1zm11.4 0c-1.5 0-2.8-1.4-2.8-3.1s1.2-3.2 2.8-3.2 2.8 1.4 2.8 3.2-1.3 3.1-2.8 3.1z" fill="white" />
    </svg>
  ),

  telegram: (s) => (
    <svg viewBox="0 0 48 48" width={s} height={s}>
      <rect width="48" height="48" rx="10" fill="#26A5E4" />
      <path d="M10.8 23.4l22.2-8.6c1-.4 1.9.2 1.6 1.6l-3.8 17.8c-.3 1.2-1 1.5-2 .9l-5.5-4.1-2.7 2.6c-.3.3-.6.5-1.1.5l.4-5.6L31 18.5c.5-.4-.1-.6-.7-.2L17.5 27l-5.3-1.7c-1.2-.4-1.2-1.2.2-1.7z" fill="white" />
    </svg>
  ),

  whatsapp: (s) => (
    <svg viewBox="0 0 48 48" width={s} height={s}>
      <rect width="48" height="48" rx="10" fill="#25D366" />
      <path d="M24 10c-7.7 0-14 6.3-14 14 0 2.5.7 4.8 1.8 6.8L10 38l7.4-1.9c2 1 4.2 1.5 6.6 1.5 7.7 0 14-6.3 14-14S31.7 10 24 10zm7 19.2c-.3.8-1.7 1.6-2.4 1.7-.6.1-1.4.1-2.3-.1-.5-.2-1.2-.4-2.1-.8-3.7-1.6-6.1-5.3-6.3-5.5-.2-.3-1.5-2-1.5-3.8s.9-2.7 1.3-3.1c.3-.3.7-.5 1-.5h.7c.2 0 .5 0 .8.6.3.7 1 2.4 1.1 2.6.1.2.2.4.1.6-.1.2-.2.4-.3.5-.2.2-.3.4-.5.6-.2.2-.4.4-.2.7.2.4 1 1.6 2.1 2.6 1.4 1.3 2.6 1.7 3 1.9.3.2.5.1.7-.1.2-.2.8-1 1-1.3.2-.3.5-.3.8-.2.3.1 2 .9 2.3 1.1.3.2.6.3.7.4.1.2.1.9-.2 1.7z" fill="white" />
    </svg>
  ),

  twitter: (s) => ICONS.x(s),

  threads: (s) => (
    <svg viewBox="0 0 48 48" width={s} height={s}>
      <rect width="48" height="48" rx="10" fill="#000000" />
      <path d="M31.4 22.6c-.2 0-.3-.1-.5-.2-1-3.6-3.6-5.5-7.3-5.5-3 0-5.3 1.5-6.1 4.1-.6 1.7-.5 3.5.2 5.2.7 1.6 1.9 2.8 3.4 3.4 1.3.5 2.7.6 4 .3 1.3-.3 2.3-1 3-2.1.5-.7.7-1.6.7-2.5 0-1-.3-1.9-.9-2.6-.7-.8-1.6-1.2-2.8-1.2-1 0-1.8.4-2.4 1-.5.5-.7 1.2-.6 1.9.1.5.5 1 1 1.2.5.2 1.1.2 1.6-.1.4-.2.6-.6.6-1h2.2c0 1.1-.5 2.1-1.4 2.7-1 .7-2.2.9-3.4.6-1.3-.3-2.3-1.2-2.8-2.5-.5-1.5-.2-3.2.9-4.4 1.1-1.2 2.6-1.8 4.3-1.6 1.5.1 2.8.8 3.7 2 .8 1.1 1.2 2.5 1.2 3.9 0 1.5-.4 2.9-1.3 4-1 1.3-2.5 2.2-4.3 2.6-1.8.4-3.6.3-5.3-.4-2-.8-3.6-2.3-4.5-4.3-.9-2.2-1-4.6-.3-6.8 1.1-3.5 4-5.7 7.8-5.9 4.5-.2 7.8 2.2 9.2 6.5l.2.7-2 .6z" fill="white" />
    </svg>
  ),

  pinterest: (s) => (
    <svg viewBox="0 0 48 48" width={s} height={s}>
      <rect width="48" height="48" rx="10" fill="#E60023" />
      <path d="M24 10c-7.7 0-14 6.3-14 14 0 5.9 3.7 11 9 13-.1-1-.2-2.6 0-3.7.2-1 1.5-6.3 1.5-6.3s-.4-.8-.4-1.9c0-1.8 1-3.2 2.3-3.2 1.1 0 1.6.8 1.6 1.8 0 1.1-.7 2.7-1.1 4.2-.3 1.3.6 2.3 1.9 2.3 2.3 0 4.1-2.4 4.1-5.9 0-3.1-2.2-5.2-5.4-5.2-3.7 0-5.8 2.7-5.8 5.6 0 1.1.4 2.3 1 3 .1.1.1.3.1.4-.1.4-.3 1.3-.4 1.5-.1.3-.2.3-.5.2-1.7-.8-2.7-3.3-2.7-5.3 0-4.3 3.1-8.3 9-8.3 4.7 0 8.4 3.4 8.4 7.9 0 4.7-3 8.5-7.1 8.5-1.4 0-2.7-.7-3.1-1.6l-.8 3.2c-.3 1.2-.8 2.1-1.3 2.9z" fill="white" />
    </svg>
  ),

  reddit: (s) => (
    <svg viewBox="0 0 48 48" width={s} height={s}>
      <rect width="48" height="48" rx="10" fill="#FF4500" />
      <circle cx="24" cy="26" r="10" fill="white" />
      <circle cx="20" cy="25" r="2" fill="#FF4500" />
      <circle cx="28" cy="25" r="2" fill="#FF4500" />
      <path d="M20 30c0 0 1.5 2 4 2s4-2 4-2" fill="none" stroke="#FF4500" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="34" cy="17" r="2.5" fill="#FF4500" stroke="white" strokeWidth="1" />
      <path d="M26 13l4.5-2 3.5 4" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),

  snapchat: (s) => (
    <svg viewBox="0 0 48 48" width={s} height={s}>
      <rect width="48" height="48" rx="10" fill="#FFFC00" />
      <path d="M24 10c-3 0-5.5 1.2-7 3.5-1 1.6-1.2 3.3-1.2 5v2.3c-1-.2-1.8 0-2.3.4-.5.4-.5 1 0 1.5.5.4 1.3.8 2.2 1 0 .1 0 .2-.1.3-.4 1.5-1.5 2.9-3.3 4-.3.2-.4.5-.3.8.1.3.4.5.7.5 1.2-.1 2.3.1 3.3.6.7.3 1.3.8 1.6 1 .7.5 1.3.7 2.1.7.7 0 1.3-.1 2-.3 1.5-.5 2.7-.8 4.3-.8s2.8.3 4.3.8c.7.2 1.3.3 2 .3.8 0 1.4-.2 2.1-.7.3-.2.9-.7 1.6-1 1-.5 2.1-.7 3.3-.6.3 0 .6-.2.7-.5.1-.3 0-.6-.3-.8-1.8-1.1-2.9-2.5-3.3-4-.1-.1-.1-.2-.1-.3.9-.2 1.7-.6 2.2-1 .5-.5.5-1.1 0-1.5-.5-.4-1.3-.6-2.3-.4v-2.3c0-1.7-.2-3.4-1.2-5-1.5-2.3-4-3.5-7-3.5z" fill="#333" />
    </svg>
  ),

  spotify: (s) => (
    <svg viewBox="0 0 48 48" width={s} height={s}>
      <rect width="48" height="48" rx="10" fill="#1DB954" />
      <path d="M33.6 26.7c-3.5-2.1-9.3-2.3-12.6-1.3-.5.2-1.1-.1-1.3-.7-.2-.5.1-1.1.7-1.3 3.8-1.2 10.1-.9 14.1 1.5.5.3.7.9.4 1.4-.3.5-.9.7-1.3.4zm1.1-4.6c-4.3-2.6-10.9-3.3-16-1.8-.7.2-1.4-.2-1.6-.8-.2-.7.2-1.4.8-1.6 5.8-1.8 13.1-1 17.9 2.1.6.4.8 1.2.5 1.8-.4.6-1.2.8-1.6.3zm.2-4.8C29.3 14 19.4 13.7 14 15.3c-.8.2-1.6-.2-1.8-1-.3-.8.2-1.6 1-1.9C19.3 11 30 11.3 36.5 15c.7.4 1 1.3.5 2.1-.3.7-1.3 1-2.1.5z" fill="white" />
    </svg>
  ),

  twitch: (s) => (
    <svg viewBox="0 0 48 48" width={s} height={s}>
      <rect width="48" height="48" rx="10" fill="#9146FF" />
      <path d="M14 10l-3 6v22h8v4h4l4-4h6l8-8V10zm2 2h18v14l-5 5h-7l-4 4v-4h-2zm7 12h2V16h-2zm6 0h2V16h-2z" fill="white" />
    </svg>
  ),

  github: (s) => (
    <svg viewBox="0 0 48 48" width={s} height={s}>
      <rect width="48" height="48" rx="10" fill="#24292e" />
      <path d="M24 10C16.3 10 10 16.3 10 24c0 6.2 4 11.4 9.6 13.3.7.1 1-.3 1-.7v-2.5c-3.9.8-4.7-1.9-4.7-1.9-.6-1.6-1.6-2.1-1.6-2.1-1.3-.9.1-.9.1-.9 1.4.1 2.1 1.4 2.1 1.4 1.3 2.1 3.3 1.5 4.1 1.2.1-.9.5-1.5.9-1.8-3.1-.4-6.4-1.6-6.4-7 0-1.5.5-2.8 1.4-3.8-.1-.4-.6-1.8.1-3.7 0 0 1.2-.4 3.8 1.4 1.1-.3 2.3-.5 3.5-.5 1.2 0 2.4.2 3.5.5 2.6-1.8 3.8-1.4 3.8-1.4.7 1.9.3 3.3.1 3.7.9 1 1.4 2.3 1.4 3.8 0 5.4-3.3 6.6-6.4 7 .5.4.9 1.3.9 2.6v3.9c0 .4.3.8 1 .7 5.5-1.8 9.5-7.1 9.5-13.3C38 16.3 31.7 10 24 10z" fill="white" />
    </svg>
  ),

  bluesky: (s) => (
    <svg viewBox="0 0 48 48" width={s} height={s}>
      <rect width="48" height="48" rx="10" fill="#0085FF" />
      <path d="M24 14c-2.5 3-7.5 9-7.5 12.5 0 3 2 4.5 4 4.5 1.5 0 2.7-.8 3.5-2 .8 1.2 2 2 3.5 2 2 0 4-1.5 4-4.5 0-3.5-5-9.5-7.5-12.5zm-3.5 19c-1.5 0-4 0-4 2s2.5 2 4 2h7c1.5 0 4 0 4-2s-2.5-2-4-2z" fill="white" />
    </svg>
  ),

  mastodon: (s) => (
    <svg viewBox="0 0 48 48" width={s} height={s}>
      <rect width="48" height="48" rx="10" fill="#6364FF" />
      <path d="M36 21.5c0-6.3-4.1-8.2-4.1-8.2-2.1-1-5.6-1.3-9.3-1.3h-.1c-3.7 0-7.2.3-9.3 1.3 0 0-4.1 1.9-4.1 8.2 0 1.5 0 3.2.1 5.1.3 5.4 2.5 10.1 7.5 11.3 2.3.6 4.3.7 5.9.6 2.9-.2 4.5-.9 4.5-.9l-.1-2.1s-2.1.7-4.4.6c-2.3-.1-4.7-.2-5.1-3 0-.3-.1-.5-.1-.8 2.4.6 5.3.7 7.4.6 1.3-.1 3.6-.2 5.3-.7 2.4-.7 4.5-2.2 4.8-5.3.2-1.9.1-4.6.1-4.6zm-5.5 7.9h-3v-7c0-1.5-.6-2.2-1.9-2.2-1.4 0-2.1 1-2.1 2.7v3.9h-3v-3.9c0-1.7-.7-2.7-2.1-2.7-1.3 0-1.9.7-1.9 2.2v7h-3V21c0-1.5.4-2.7 1.1-3.6.8-.9 1.8-1.4 3.1-1.4 1.5 0 2.6.6 3.3 1.7l.7 1.2.7-1.2c.7-1.1 1.8-1.7 3.3-1.7 1.3 0 2.3.5 3.1 1.4.7.9 1.1 2.1 1.1 3.6v8.4z" fill="white" />
    </svg>
  ),

  slack: (s) => (
    <svg viewBox="0 0 48 48" width={s} height={s}>
      <rect width="48" height="48" rx="10" fill="#4A154B" />
      <path d="M17 27a2.5 2.5 0 01-5 0 2.5 2.5 0 012.5-2.5H17zm1.3 0a2.5 2.5 0 015 0v6.3a2.5 2.5 0 01-5 0zm2.5-10a2.5 2.5 0 010-5 2.5 2.5 0 012.5 2.5V17zm0 1.3a2.5 2.5 0 010 5H14.5a2.5 2.5 0 010-5zm10 2.5a2.5 2.5 0 015 0 2.5 2.5 0 01-2.5 2.5H31zm-1.3 0a2.5 2.5 0 01-5 0v-6.3a2.5 2.5 0 015 0zm-2.5 10a2.5 2.5 0 010 5 2.5 2.5 0 01-2.5-2.5V31zm0-1.3a2.5 2.5 0 010-5h6.3a2.5 2.5 0 010 5z" fill="white" />
    </svg>
  ),

  medium: (s) => (
    <svg viewBox="0 0 48 48" width={s} height={s}>
      <rect width="48" height="48" rx="10" fill="#000000" />
      <path d="M15 16h1.5l6.5 15 6.5-15H31l-8 18h-1.5z" fill="white" />
      <ellipse cx="18" cy="25" rx="5" ry="7" fill="white" />
      <ellipse cx="32" cy="25" rx="3" ry="7" fill="white" />
      <ellipse cx="38" cy="25" rx="1.5" ry="6" fill="white" />
    </svg>
  ),

  dribbble: (s) => (
    <svg viewBox="0 0 48 48" width={s} height={s}>
      <rect width="48" height="48" rx="10" fill="#EA4C89" />
      <circle cx="24" cy="24" r="13" fill="none" stroke="white" strokeWidth="2.5" />
      <path d="M11 24c6-1 12 0 18 4M13 17c4 3 9 8 12 17M35 17c-4 3-9 8-12 17" fill="none" stroke="white" strokeWidth="2" />
    </svg>
  ),

  behance: (s) => (
    <svg viewBox="0 0 48 48" width={s} height={s}>
      <rect width="48" height="48" rx="10" fill="#1769FF" />
      <path d="M13 16h6c3 0 5 1.5 5 4 0 1.5-.8 2.8-2.2 3.4 1.8.5 3 2 3 3.8 0 2.8-2.3 4.6-5.5 4.6H13zm3.2 6h2.5c1.2 0 2-.7 2-1.7s-.8-1.7-2-1.7h-2.5zm0 6.5h3c1.3 0 2.2-.7 2.2-1.9 0-1.2-.9-1.9-2.2-1.9h-3zM28 17h7v2h-7zm3.5 4c2.8 0 4.5 2 4.5 4.8v.7H29c.2 1.5 1.3 2.5 3 2.5 1.2 0 2-.5 2.5-1.3h2.8C36.5 30.3 34.6 32 31.5 32c-3 0-5.2-2.2-5.2-5.5S28.7 21 31.5 21zm-2.4 4H34c-.2-1.3-1.1-2.2-2.5-2.2-1.3 0-2.2.9-2.4 2.2z" fill="white" />
    </svg>
  ),

  figma: (s) => (
    <svg viewBox="0 0 48 48" width={s} height={s}>
      <rect width="48" height="48" rx="10" fill="#1e1e1e" />
      <rect x="14" y="10" width="8" height="8" rx="4" fill="#F24E1E" />
      <rect x="22" y="10" width="8" height="8" rx="4" fill="#FF7262" />
      <rect x="14" y="18" width="8" height="8" rx="4" fill="#A259FF" />
      <circle cx="26" cy="22" r="4" fill="#1ABCFE" />
      <rect x="14" y="26" width="8" height="8" rx="4" fill="#0ACF83" />
    </svg>
  ),

  soundcloud: (s) => (
    <svg viewBox="0 0 48 48" width={s} height={s}>
      <rect width="48" height="48" rx="10" fill="#FF5500" />
      <path d="M10 30v-4m3 5v-6m3 7v-8m3 9v-10m3 11v-12m3 12v-12m3 12v-14" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <path d="M28 18c-.5-.3-1-.5-1.5-.5V33h10.5c2.5 0 4.5-2 4.5-4.5S39 24 36.5 24c-.3 0-.7 0-1 .1C35 20.5 32.5 18 29.5 18z" fill="white" />
    </svg>
  ),

  shopify: (s) => (
    <svg viewBox="0 0 48 48" width={s} height={s}>
      <rect width="48" height="48" rx="10" fill="#96BF48" />
      <path d="M32 13s-.5-.1-.7-.1c-.2 0-3.5-.3-3.5-.3l-2.3-2.3c-.2-.2-.7-.2-.8-.1l-1.2.4c-.7-2-2-3.8-4.2-3.8h-.2c-.6-.8-1.4-1.2-2.1-1.2-5.2 0-7.7 6.5-8.5 9.8l-3.6 1.1c-1.1.3-1.1.4-1.3 1.4L.5 38.5l24 4.5 13-2.8S32.2 13.2 32 13zM23 11.7l-3.3 1c.9-3.4 2.6-5.1 4.1-5.7-.5 1.3-.8 3.1-.8 4.7zM21 6.5c.3 0 .5.1.8.3-2 .9-4 3.2-4.9 7.8l-2.7.8c.7-2.9 2.8-8.9 6.8-8.9z" fill="white" transform="translate(6 6) scale(0.75)" />
    </svg>
  ),

  stripe: (s) => (
    <svg viewBox="0 0 48 48" width={s} height={s}>
      <rect width="48" height="48" rx="10" fill="#635BFF" />
      <path d="M22 18c0-1 .8-1.4 2.1-1.4 1.9 0 4.3.6 6.2 1.6v-5.9c-2.1-.8-4.1-1.2-6.2-1.2-5.1 0-8.4 2.7-8.4 7.1 0 6.9 9.5 5.8 9.5 8.8 0 1.2-1 1.6-2.5 1.6-2.1 0-4.9-.9-7-2.1v6c2.4 1 4.8 1.5 7 1.5 5.2 0 8.8-2.6 8.8-7.1C31.5 20.5 22 21.8 22 18z" fill="white" />
    </svg>
  ),

  substack: (s) => (
    <svg viewBox="0 0 48 48" width={s} height={s}>
      <rect width="48" height="48" rx="10" fill="#FF6719" />
      <path d="M12 14h24v3H12zm0 6h24v3H12zm0 6l12 8 12-8v12l-12 8-12-8z" fill="white" />
    </svg>
  ),

  vimeo: (s) => (
    <svg viewBox="0 0 48 48" width={s} height={s}>
      <rect width="48" height="48" rx="10" fill="#1AB7EA" />
      <path d="M36 19.5c-.1 2.8-2.1 6.6-5.9 11.5C26.1 36 22.8 38 20.3 38c-1.6 0-2.9-1.4-3.9-4.3-2.1-7.8-3-12.4-5.3-12.4-.2 0-.8.4-1.8 1.1l-1.1-1.4c1.1-1 2.2-2 3.3-3 1.5-1.3 2.6-2 3.3-2.1 1.8-.2 2.9 1 3.3 3.6.4 2.8.7 4.6.9 5.2.5 2.3 1 3.4 1.7 3.4.5 0 1.2-.8 2.1-2.3.9-1.5 1.4-2.7 1.5-3.5.1-1.4-.4-2.1-1.6-2.1-.6 0-1.2.1-1.8.4 1.2-3.9 3.5-5.8 6.8-5.7 2.5.1 3.7 1.7 3.6 4.6z" fill="white" />
    </svg>
  ),

  'google-sheets': (s) => (
    <svg viewBox="0 0 48 48" width={s} height={s}>
      <rect width="48" height="48" rx="10" fill="#0F9D58" />
      <path d="M14 12h14l8 8v16a2 2 0 01-2 2H14a2 2 0 01-2-2V14a2 2 0 012-2z" fill="white" opacity="0.95" />
      <path d="M28 12l8 8h-6a2 2 0 01-2-2v-6z" fill="white" opacity="0.7" />
      <rect x="16" y="22" width="16" height="12" rx="1" fill="none" stroke="#0F9D58" strokeWidth="1.5" />
      <line x1="16" y1="26" x2="32" y2="26" stroke="#0F9D58" strokeWidth="1" />
      <line x1="16" y1="30" x2="32" y2="30" stroke="#0F9D58" strokeWidth="1" />
      <line x1="22" y1="22" x2="22" y2="34" stroke="#0F9D58" strokeWidth="1" />
      <line x1="27" y1="22" x2="27" y2="34" stroke="#0F9D58" strokeWidth="1" />
    </svg>
  ),
};
