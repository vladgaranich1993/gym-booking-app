'use client';

import { useState, useMemo } from 'react';

type AvatarProps = {
  name: string;
  src?: string;
  alt?: string;
  size?: number; // pixels, default 40
  className?: string;
};

function stringToColor(str: string) {
  // simple hash to consistent color
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = ((hash >> 0) & 0x00ffffff).toString(16).toUpperCase();
  return `#${'00000'.substring(0, 6 - color.length)}${color}`;
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export default function Avatar({
  name,
  src,
  alt,
  size = 40,
  className = '',
}: AvatarProps) {
  const [imgError, setImgError] = useState(false);
  const bgColor = useMemo(() => stringToColor(name), [name]);
  const initials = useMemo(() => getInitials(name), [name]);

  return (
    <div
      aria-label={name}
      title={name}
      style={{
        width: size,
        height: size,
        backgroundColor: imgError || !src ? bgColor : undefined,
        fontSize: Math.round(size * 0.4),
      }}
      className={`inline-flex flex-shrink-0 items-center justify-center rounded-full overflow-hidden text-white font-semibold ${className}`}
    >
      {src && !imgError ? (
        <img
          src={src}
          alt={alt ?? name}
          onError={() => setImgError(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <span aria-hidden="true">{initials}</span>
      )}
    </div>
  );
}
