'use client';

import { useState, useEffect, useRef } from 'react';
import Lightbox from '@/components/Lightbox';
import { shuffle } from '@/lib/shuffle';

const FLOAT_STAGGER_STEP = 0.4;
const FLOAT_STAGGER_MOD = 3;

export default function PotteryOrganic({ images = [] }) {
    const gridRef = useRef(null);
    const [lightboxSrc, setLightboxSrc] = useState(null);
    const [shuffledImages, setShuffledImages] = useState(images);

    useEffect(() => {
        setShuffledImages(shuffle(images));
    }, [images]);

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
            {lightboxSrc && (
                <Lightbox
                    src={lightboxSrc}
                    alt="Pottery large view"
                    onClose={() => setLightboxSrc(null)}
                />
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
                                        decoding="async"
                                        width={600}
                                        height={600}
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
