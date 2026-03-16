'use client';

import { useEffect, useRef } from 'react';

const PLACEHOLDER_HEIGHT = '200px';
const PRELOAD_MARGIN = '600px';

export default function InfinitePhotoGrid({ images, altPrefix = 'photo' }) {
    const gridRef = useRef(null);

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
                    if (img) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        img.onload = () => {
                            wrapper.style.minHeight = '';
                            wrapper.removeAttribute('data-lazy');
                        };
                    }
                    observer.unobserve(wrapper);
                });
            },
            { rootMargin: PRELOAD_MARGIN }
        );

        lazyWrappers.forEach((w) => observer.observe(w));
        return () => observer.disconnect();
    }, [images]);

    return (
        <div className="photo-grid" ref={gridRef}>
            {images.map((img, idx) => (
                <div
                    key={idx}
                    className="photo-wrapper"
                    data-lazy=""
                    style={{ minHeight: PLACEHOLDER_HEIGHT }}
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
