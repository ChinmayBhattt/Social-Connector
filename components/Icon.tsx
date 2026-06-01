'use client';

import React from 'react';

type IconProps = {
  name: string;
  filled?: boolean;
  size?: number;
  className?: string;
};

export default function Icon({ name, filled = false, size = 24, className = '' }: IconProps) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{
        fontSize: size,
        fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' ${size}`,
      }}
    >
      {name}
    </span>
  );
}
