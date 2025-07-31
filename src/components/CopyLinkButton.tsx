'use client';

import { useState } from 'react';

export default function CopyLinkButton() {
  const [copied, setCopied] = useState(false);

  const handle = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  return (
    <button
      onClick={handle}
      className="inline-flex items-center gap-2 text-sm px-3 py-1 border rounded hover:bg-gray-50 transition"
    >
      {copied ? 'Link copied' : 'Copy link'}
    </button>
  );
}
