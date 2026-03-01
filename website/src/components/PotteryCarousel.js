'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

// 將圖片 round-robin 分配到 N 個欄位
function splitIntoColumns(images, cols) {
    const columns = Array.from({ length: cols }, () => []);
    images.forEach((img, i) => columns[i % cols].push(img));
    return columns;
}

const COLUMN_COUNT = 3;
const DIRECTIONS = ['up', 'down', 'up'];

export default function PotteryCarousel({ images = [] }) {
    const [selected, setSelected] = useState(null);

    // Esc 鍵關閉
    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') setSelected(null); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    if (images.length === 0) {
        return (
            <p className="text-secondary">
                No pottery images found. Add images directly to <code>public/gallery/pottery/</code>
            </p>
        );
    }

    const columns = splitIntoColumns(images, COLUMN_COUNT);

    return (
        <>
            {/* Lightbox：透過 Portal 直接掛到 body，避免父層 transform 限制 */}
            {selected && createPortal(
                <div className="pc-lightbox" onClick={() => setSelected(null)}>
                    <img
                        src={selected}
                        alt="Pottery large view"
                        className="pc-lightbox-img"
                        onClick={(e) => e.stopPropagation()}
                    />
                    <button className="pc-lightbox-close" onClick={() => setSelected(null)}>✕</button>
                </div>,
                document.body
            )}

            <div className="pc-scene">
                {columns.map((colImages, colIdx) => {
                    const dir = DIRECTIONS[colIdx];
                    const duration = colImages.length * 4;
                    const looped = [...colImages, ...colImages];
                    return (
                        <div key={colIdx} className={`pc-column pc-column-${colIdx + 1}`}>
                            <div
                                className={`pc-strip pc-strip-${dir}`}
                                style={{ animationDuration: `${duration}s` }}
                            >
                                {looped.map((src, idx) => (
                                    <div
                                        key={idx}
                                        className="pc-item"
                                        onClick={() => setSelected(src)}
                                    >
                                        <img
                                            src={src}
                                            alt={`Pottery ${(idx % colImages.length) + 1}`}
                                            className="pc-img"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}
