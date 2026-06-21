'use client';

import { useEffect, useRef } from 'react';

const CODE_SNIPPETS = [
  '{', '}', '()', '=>', '/>', '</', '[]',
  'const', 'let', 'if', 'else', 'return',
  'async', 'await', 'import', 'export',
  'function', 'class', 'null', 'true',
  '===', '!==', '&&', '||',
  '0x3F', '0b1010', '/**/', '//',
  'npm', 'git', 'ssh', 'tcp',
  '<div>', '</>', '<?>', '<!>',
  'try', 'catch', 'throw', 'new',
  'this', 'self', 'void', 'type',
];

const COLORS = [
  { r: 234, g: 179, b: 8 },
  { r: 255, g: 255, b: 255 },
  { r: 120, g: 120, b: 120 },
  { r: 180, g: 210, b: 115 },
  { r: 140, g: 170, b: 230 },
  { r: 230, g: 130, b: 160 },
];

// 桌面 vs 手機設定
const CONFIG = {
  desktop: {
    density: 30 / (800 * 800),
    minCount: 40,
    maxCount: 350,
    fontRange: [10, 26],    // min, max fontSize
    glow: true,
    connections: true,
    connectionDist: 120,
    mouseRadius: 150,
  },
  mobile: {
    density: 14 / (800 * 800),  // 降低密度以減輕手機主執行緒負擔
    minCount: 18,
    maxCount: 45,
    fontRange: [8, 18],         // 縮小字體
    glow: false,                // 關閉 shadowBlur
    connections: false,         // 關閉連線
    mouseRadius: 100,
  },
};

const MOBILE_BREAKPOINT = 768;
const MOUSE_FORCE = 0.08;
// 可視區域外的緩衝距離，超過就跳過繪製
const CULL_MARGIN = 100;

export default function CodeDrift() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width, height, dpr;
    let mouse = { x: -9999, y: -9999 };
    let time = 0;
    let animId;
    let particles = [];
    let cfg = CONFIG.desktop;
    // canvas 在視窗中的可見範圍（用於剔除不可見粒子）
    let visibleTop = 0;
    let visibleBottom = 0;

    class Particle {
      constructor() {
        this.init(true);
      }

      init(randomY) {
        this.text = CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)];
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.depth = 0.2 + Math.random() * 0.8;

        const [minF, maxF] = cfg.fontRange;
        this.fontSize = minF + this.depth * (maxF - minF);
        this.baseAlpha = 0.08 + this.depth * 0.35;
        this.alpha = this.baseAlpha;

        this.x = Math.random() * width;
        this.y = randomY ? Math.random() * height : height + 50;

        this.baseSpeedX = (0.15 + Math.random() * 0.4) * this.depth;
        this.baseSpeedY = (0.05 + Math.random() * 0.15) * this.depth;
        this.driftDir = Math.random() > 0.5 ? 1 : -1;

        this.waveFrequency = 0.005 + Math.random() * 0.01;
        this.waveOffset = Math.random() * Math.PI * 2;

        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.008 * this.depth;

        this.pushX = 0;
        this.pushY = 0;

        this.flickerSpeed = 0.01 + Math.random() * 0.02;
        this.flickerOffset = Math.random() * Math.PI * 2;
      }

      update() {
        this.x += this.baseSpeedX * this.driftDir;
        this.y -= this.baseSpeedY;

        this.y += Math.sin(time * this.waveFrequency * 60 + this.waveOffset) * 0.3;
        this.x += Math.cos(time * this.waveFrequency * 30 + this.waveOffset) * 0.15;

        this.rotation += this.rotationSpeed;

        // 滑鼠互動
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const distSq = dx * dx + dy * dy;
        const radiusSq = cfg.mouseRadius * cfg.mouseRadius;
        if (distSq < radiusSq) {
          const dist = Math.sqrt(distSq);
          const force = (1 - dist / cfg.mouseRadius) * MOUSE_FORCE;
          const angle = Math.atan2(dy, dx);
          this.pushX += Math.cos(angle) * force * 60;
          this.pushY += Math.sin(angle) * force * 60;
        }

        this.x += this.pushX;
        this.y += this.pushY;
        this.pushX *= 0.92;
        this.pushY *= 0.92;

        const flicker = Math.sin(time * this.flickerSpeed * 60 + this.flickerOffset);
        this.alpha = this.baseAlpha + flicker * 0.06;

        const margin = 80;
        if (this.x > width + margin) this.x = -margin;
        if (this.x < -margin) this.x = width + margin;
        if (this.y < -margin) this.y = height + margin;
        if (this.y > height + margin) this.y = -margin;
      }

      // 是否在可視範圍內
      isVisible() {
        return this.y > visibleTop - CULL_MARGIN && this.y < visibleBottom + CULL_MARGIN;
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        // 桌面才開發光
        if (cfg.glow && this.depth > 0.5) {
          ctx.shadowColor = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.alpha * 0.5})`;
          ctx.shadowBlur = 8 + this.depth * 12;
        }

        ctx.font = `${Math.round(this.fontSize)}px 'SF Mono', 'Fira Code', 'JetBrains Mono', monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.alpha})`;
        ctx.fillText(this.text, 0, 0);

        ctx.restore();
      }
    }

    // 連線效果（僅桌面）
    function drawConnections() {
      if (!cfg.connections) return;
      const maxDist = cfg.connectionDist;
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        if (!a.isVisible()) continue;
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          if (!b.isVisible()) continue;
          if (Math.abs(a.depth - b.depth) > 0.3) continue;

          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distSq = dx * dx + dy * dy;
          if (distSq > maxDist * maxDist) continue;

          const dist = Math.sqrt(distSq);
          const alpha = (1 - dist / maxDist) * 0.06 * Math.min(a.depth, b.depth);
          ctx.strokeStyle = `rgba(234, 179, 8, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    // 更新可視區域
    function updateVisibleRange() {
      const rect = canvas.getBoundingClientRect();
      // rect.top 是 canvas 頂端相對於視窗的位置（負值代表已捲過）
      visibleTop = -rect.top;
      visibleBottom = visibleTop + window.innerHeight;
    }

    function resize() {
      const parent = canvas.parentElement;
      if (!parent) return;

      // 判斷裝置
      cfg = window.innerWidth <= MOBILE_BREAKPOINT ? CONFIG.mobile : CONFIG.desktop;

      // 處理高 DPI
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = parent.offsetHeight;

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      width = w;
      height = h;

      initParticles();
    }

    function initParticles() {
      const count = Math.min(
        cfg.maxCount,
        Math.max(cfg.minCount, Math.floor(width * height * cfg.density))
      );
      if (particles.length === count) return;
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
      particles.sort((a, b) => a.depth - b.depth);
    }

    let lastTime = 0;
    let running = false;
    function loop(timestamp) {
      if (!running) return;
      const dt = Math.min((timestamp - lastTime) / 1000, 0.05);
      lastTime = timestamp;
      time += dt;

      updateVisibleRange();

      ctx.clearRect(0, 0, width, height);
      drawConnections();
      for (const p of particles) {
        p.update();
        // 只繪製可視範圍內的粒子
        if (p.isVisible()) p.draw();
      }
      animId = requestAnimationFrame(loop);
    }

    // 滑鼠座標轉換
    function toCanvasCoords(clientX, clientY) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = clientX - rect.left;
      mouse.y = clientY - rect.top;
    }
    function onMouseMove(e) {
      toCanvasCoords(e.clientX, e.clientY);
    }
    function onMouseLeave() {
      mouse.x = -9999;
      mouse.y = -9999;
    }

    let disposed = false;
    let idleId = null;
    let resizeObserver = null;
    let io = null;

    function startLoop() {
      if (running || disposed) return;
      running = true;
      lastTime = 0;
      animId = requestAnimationFrame(loop);
    }

    function stopLoop() {
      running = false;
      cancelAnimationFrame(animId);
    }

    // 真正的初始化：建立 observer、計算尺寸、依可視狀態啟停動畫
    function setup() {
      if (disposed) return;

      resizeObserver = new ResizeObserver(() => resize());
      resizeObserver.observe(canvas.parentElement);

      // 桌面用 mousemove，手機不綁 touchmove 避免干擾捲動
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseleave', onMouseLeave);

      resize();

      // 畫布捲入視窗附近才執行動畫，捲離即暫停，避免持續佔用主執行緒
      io = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) startLoop();
          else stopLoop();
        },
        { rootMargin: '200px 0px' }
      );
      io.observe(canvas);
    }

    // 尊重「減少動態效果」偏好：完全不啟動裝飾動畫
    const prefersReducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
      // 延遲到瀏覽器閒置時才初始化，把主執行緒讓給首屏渲染與 hydration
      // （顯著改善行動裝置的 FCP / LCP / TBT）
      if ('requestIdleCallback' in window) {
        idleId = window.requestIdleCallback(setup, { timeout: 2000 });
      } else {
        idleId = window.setTimeout(setup, 300);
      }
    }

    return () => {
      disposed = true;
      stopLoop();
      if (idleId != null) {
        if ('cancelIdleCallback' in window) window.cancelIdleCallback(idleId);
        clearTimeout(idleId);
      }
      if (resizeObserver) resizeObserver.disconnect();
      if (io) io.disconnect();
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="code-drift-canvas"
      aria-hidden="true"
    />
  );
}
