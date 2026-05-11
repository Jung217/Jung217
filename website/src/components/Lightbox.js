'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function Lightbox({ src, alt = 'Large view', onClose }) {
    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onClose]);

    return createPortal(
        <div className="pc-lightbox" onClick={onClose}>
            <img
                src={src}
                alt={alt}
                className="pc-lightbox-img"
                onClick={(e) => e.stopPropagation()}
            />
            <button className="pc-lightbox-close" onClick={onClose}>✕</button>
        </div>,
        document.body
    );
}
