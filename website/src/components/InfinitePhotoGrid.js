'use client';

import { useEffect, useRef } from 'react';

// 所有 DOM 一次渲染（layout 穩定不跳動），
// 圖片只在滾到附近時才載入 src
export default function InfinitePhotoGrid({ images, altPrefix = 'photo' }) {
    const gridRef = useRef(null);

    useEffect(() => {
        const grid = gridRef.current;
        if (!grid) return;

        // 監聽 photo-wrapper（有高度佔位），而非 img（高度為 0）
        const wrappers = grid.querySelectorAll('.photo-wrapper[data-lazy]');

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const wrapper = entry.target;
                        const img = wrapper.querySelector('img');
                        if (img) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            // 圖片載入完成後移除佔位高度
                            img.onload = () => {
                                wrapper.style.minHeight = '';
                                wrapper.removeAttribute('data-lazy');
                            };
                        }
                        observer.unobserve(wrapper);
                    }
                });
            },
            { rootMargin: '600px' }
        );

        wrappers.forEach((w) => observer.observe(w));
        return () => observer.disconnect();
    }, [images]);

    return (
        <div className="photo-grid" ref={gridRef}>
            {images.map((img, idx) => (
                <div
                    key={idx}
                    className="photo-wrapper"
                    data-lazy=""
                    style={{ minHeight: '200px' }}
                >
                    <img
                        data-src={img}
                        alt={`${altPrefix} ${idx + 1}`}
                    />
                </div>
            ))}
        </div>
    );
}
