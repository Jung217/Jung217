'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const PLACEHOLDER_HEIGHT = '200px';
const PRELOAD_MARGIN = '600px';
const DESKTOP_COLUMNS = 3;
const MOBILE_COLUMNS = 2;
const MOBILE_BREAKPOINT = 640;
// 透明 1x1 像素，確保 img 元素在手機瀏覽器上正確初始化
const PLACEHOLDER_SRC = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
const MAX_RETRY = 2;

function shuffle(arr) {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function distributeToColumns(images, columnCount) {
    const columns = Array.from({ length: columnCount }, () => []);
    images.forEach((img, i) => columns[i % columnCount].push({ src: img, index: i }));
    return columns;
}

function useColumnCount() {
    const [count, setCount] = useState(DESKTOP_COLUMNS);

    useEffect(() => {
        const update = () => {
            setCount(window.innerWidth <= MOBILE_BREAKPOINT ? MOBILE_COLUMNS : DESKTOP_COLUMNS);
        };
        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);

    return count;
}

export default function InfinitePhotoGrid({ images, altPrefix = 'photo', randomize = false }) {
    const gridRef = useRef(null);
    const columnCount = useColumnCount();
    const [displayImages, setDisplayImages] = useState(images);
    const [lightboxSrc, setLightboxSrc] = useState(null);

    useEffect(() => {
        if (randomize) setDisplayImages(shuffle(images));
    }, [images, randomize]);

    const columns = distributeToColumns(displayImages, columnCount);

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'Escape') setLightboxSrc(null);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    useEffect(() => {
        const grid = gridRef.current;
        if (!grid) return;

        const lazyWrappers = grid.querySelectorAll('.photo-wrapper[data-lazy]');

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;

                    const wrapper = entry.target;
                    const img = wrapper.querySelector('img');
                    if (img && img.dataset.src) {
                        const realSrc = img.dataset.src;
                        img.onload = () => {
                            wrapper.style.minHeight = '';
                            wrapper.removeAttribute('data-lazy');
                        };
                        // 載入失敗時自動重試
                        let retries = 0;
                        img.onerror = () => {
                            if (retries < MAX_RETRY) {
                                retries++;
                                setTimeout(() => { img.src = realSrc; }, 1500 * retries);
                            }
                        };
                        img.src = realSrc;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(wrapper);
                });
            },
            { rootMargin: PRELOAD_MARGIN }
        );

        lazyWrappers.forEach((w) => observer.observe(w));
        return () => observer.disconnect();
    }, [displayImages, columnCount]);

    return (
        <>
            {lightboxSrc && createPortal(
                <div className="pc-lightbox" onClick={() => setLightboxSrc(null)}>
                    <img
                        src={lightboxSrc}
                        alt="Photo large view"
                        className="pc-lightbox-img"
                        onClick={(e) => e.stopPropagation()}
                    />
                    <button className="pc-lightbox-close" onClick={() => setLightboxSrc(null)}>✕</button>
                </div>,
                document.body
            )}

            <div className="photo-grid" ref={gridRef}>
                {columns.map((col, colIdx) => (
                    <div key={colIdx} className="photo-grid-column">
                        {col.map(({ src, index }) => (
                            <div
                                key={index}
                                className="photo-wrapper"
                                data-lazy=""
                                style={{ minHeight: PLACEHOLDER_HEIGHT }}
                                onClick={() => setLightboxSrc(src)}
                            >
                                <img
                                    src={PLACEHOLDER_SRC}
                                    data-src={src}
                                    alt={`${altPrefix} ${index + 1}`}
                                    loading="lazy"
                                    decoding="async"
                                />
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </>
    );
}
