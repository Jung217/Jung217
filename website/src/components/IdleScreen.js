'use client';
import { useState, useEffect, useRef } from 'react';

export default function IdleScreen() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef(null);
  const fadeRef = useRef(null);
  const showingRef = useRef(false);

  useEffect(() => {
    const TIMEOUT = 30000;

    const show = () => {
      if (showingRef.current) return;
      showingRef.current = true;
      document.body.style.overflow = 'hidden';
      setMounted(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
    };

    const hide = () => {
      if (!showingRef.current) return;
      showingRef.current = false;
      setVisible(false);
      document.body.style.overflow = '';
      clearTimeout(fadeRef.current);
      fadeRef.current = setTimeout(() => setMounted(false), 1200);
    };

    const reset = () => {
      clearTimeout(timerRef.current);
      if (showingRef.current) hide();
      timerRef.current = setTimeout(show, TIMEOUT);
    };

    const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'touchmove'];
    events.forEach(e => window.addEventListener(e, reset, { passive: true }));
    timerRef.current = setTimeout(show, TIMEOUT);

    return () => {
      clearTimeout(timerRef.current);
      clearTimeout(fadeRef.current);
      document.body.style.overflow = '';
      events.forEach(e => window.removeEventListener(e, reset));
    };
  }, []);

  if (!mounted) return null;

  const words = [
    '山川', '湖海', '田野', '餐廳',
    '獨處時', '相聚時', '清晨', '夜晚',
    '春夏秋冬', '家', '旅途', '下一程', '生活裡'
  ];

  return (
    <div className={`idle-screen ${visible ? 'idle-visible' : ''}`}>
      {/* 樹影層 */}
      <div className="idle-shadows">
        <div className="idle-shadow idle-s1" />
        <div className="idle-shadow idle-s2" />
        <div className="idle-shadow idle-s3" />
        <div className="idle-shadow idle-s4" />
        <div className="idle-shadow idle-s5" />
        <div className="idle-shadow idle-s6" />
        <div className="idle-shadow idle-s7" />
      </div>

      {/* 光斑層 */}
      <div className="idle-lights">
        <div className="idle-bokeh idle-b1" />
        <div className="idle-bokeh idle-b2" />
        <div className="idle-bokeh idle-b3" />
        <div className="idle-bokeh idle-b4" />
        <div className="idle-bokeh idle-b5" />
      </div>

      {/* 品牌 */}
      <div className="idle-brand">cjchien</div>

      {/* 中央內容 */}
      <div className="idle-content">
        {/* 上半文字 */}
        <div className="idle-text-col">
          <span className="idle-char">再</span>
          <span className="idle-char">見</span>
          <span className="idle-char">，</span>
          <span className="idle-char">在</span>
        </div>

        {/* 跑馬燈：場景詞從右往左滾動 */}
        <div className="idle-marquee">
          <div className="idle-marquee-track">
            {words.map((w, i) => (
              <span key={`a-${i}`} className="idle-word">{w}</span>
            ))}
            {words.map((w, i) => (
              <span key={`b-${i}`} className="idle-word">{w}</span>
            ))}
          </div>
        </div>

        {/* 下半文字 */}
        <div className="idle-text-col">
          <span className="idle-char">見</span>
          <span className="idle-char">。</span>
        </div>
      </div>
    </div>
  );
}
