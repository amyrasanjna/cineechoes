'use client';

import { Share2 } from 'lucide-react';

const SHARE_TEXT = 'Vote your favorite Bollywood actress now!';

export function ShareButton() {
  const onShare = async () => {
    const shareUrl = window.location.href;

    if (navigator.share) {
      await navigator.share({
        text: SHARE_TEXT,
        url: shareUrl
      });
      return;
    }

    await navigator.clipboard.writeText(`${SHARE_TEXT} ${shareUrl}`);
    alert('Share link copied to clipboard.');
  };

  return (
    <button
      onClick={onShare}
      className="inline-flex items-center justify-center gap-2 rounded-full border border-gold/40 bg-white px-4 py-2 text-sm font-semibold text-noir transition hover:bg-gold/5"
    >
      <Share2 size={16} /> Share Battle
    </button>
  );
}
