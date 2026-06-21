'use client';

import { useState } from 'react';

// 點擊後才載入 Spotify iframe 的 facade。
// 初始載入時不請求第三方資源、不寫入第三方 cookie，
// 改善 Best Practices 分數並避免不必要的網路 / 主執行緒成本。
export default function SpotifyEmbed({ src, title, height = 352 }) {
  const [loaded, setLoaded] = useState(false);

  if (loaded) {
    return (
      <iframe
        title={title}
        style={{ borderRadius: 0, marginBottom: '2rem', display: 'block' }}
        src={src}
        width="100%"
        height={height}
        frameBorder="0"
        allowFullScreen
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      />
    );
  }

  return (
    <button
      type="button"
      className="spotify-facade"
      style={{ height }}
      onClick={() => setLoaded(true)}
    >
      <span className="spotify-facade-inner">
        <svg
          className="spotify-facade-logo"
          viewBox="0 0 24 24"
          width="40"
          height="40"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.52 17.34c-.24.36-.66.48-1.02.24-2.82-1.74-6.36-2.1-10.56-1.14-.42.12-.78-.18-.9-.54-.12-.42.18-.78.54-.9 4.56-1.02 8.52-.6 11.64 1.32.42.18.48.66.3 1.02zm1.44-3.3c-.3.42-.84.6-1.26.3-3.24-1.98-8.16-2.58-11.94-1.38-.48.12-1.02-.12-1.14-.6-.12-.48.12-1.02.6-1.14 4.38-1.32 9.78-.66 13.5 1.62.36.18.54.78.24 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.1 9.3c-.6.18-1.2-.18-1.38-.72-.18-.6.18-1.2.72-1.38 4.32-1.32 11.4-1.02 15.9 1.62.54.3.72 1.02.42 1.56-.3.48-1.02.66-1.56.36z" />
        </svg>
        <span className="spotify-facade-text">播放 Spotify</span>
      </span>
    </button>
  );
}
