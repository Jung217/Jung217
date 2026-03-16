'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

const FLOAT_STAGGER_STEP = 0.4;
const FLOAT_STAGGER_MOD = 3;

function shuffle(arr) {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

export default function PotteryOrganic({ images = [] }) {
    const gridRef = useRef(null);
    const [lightboxSrc, setLightboxSrc] = useState(null);
    const [shuffledImages, setShuffledImages] = useState(images);

    useEffect(() => {
        setShuffledImages(shuffle(images));
    }, [images]);

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

        const cards = grid.querySelectorAll('.po-card');
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('po-card--visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { rootMargin: '50px', threshold: 0.1 }
        );

        cards.forEach((card) => observer.observe(card));
        return () => observer.disconnect();
    }, [images]);

    if (images.length === 0) {
        return (
            <p className="text-secondary">
                No pottery images found. Add images to <code>public/gallery/pottery/</code>
            </p>
        );
    }

    return (
        <>
            {lightboxSrc && createPortal(
                <div className="pc-lightbox" onClick={() => setLightboxSrc(null)}>
                    <img
                        src={lightboxSrc}
                        alt="Pottery large view"
                        className="pc-lightbox-img"
                        onClick={(e) => e.stopPropagation()}
                    />
                    <button className="pc-lightbox-close" onClick={() => setLightboxSrc(null)}>✕</button>
                </div>,
                document.body
            )}

            <main className="po-page animate-fade-in">
                <div className="po-header">
                    <h1 className="hero-title" style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
                        My <span>Pottery</span>
                    </h1>
                    <p className="text-secondary">
                        A collection of my handcrafted ceramic works.
                    </p>
                </div>

                <div className="po-grid" ref={gridRef}>
                    {shuffledImages.map((src, idx) => {
                        const floatDelay = (idx * FLOAT_STAGGER_STEP) % FLOAT_STAGGER_MOD;

                        return (
                            <div
                                key={idx}
                                className="po-card"
                                onClick={() => setLightboxSrc(src)}
                            >
                                <div
                                    className="po-blob"
                                    style={{ animationDelay: `${floatDelay}s` }}
                                >
                                    <img
                                        src={src}
                                        alt={`Pottery ${idx + 1}`}
                                        className="po-img"
                                        loading="lazy"
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </main>
        </>
    );
}
