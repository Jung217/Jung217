'use client';

import { useState } from 'react';
import Link from 'next/link';

const SORT_OPTIONS = [
    { key: 'roll', label: 'Roll #' },
    { key: 'brand', label: 'Brand' },
    { key: 'film', label: 'Film Stock' },
];

function sortFilm(items, sortBy, rollAsc) {
    const sorted = [...items];
    switch (sortBy) {
        case 'brand':
            return sorted.sort((a, b) => (a.brand || '').localeCompare(b.brand || ''));
        case 'film':
            return sorted.sort((a, b) => (a.filmStock || '').localeCompare(b.filmStock || ''));
        case 'roll':
        default:
            return sorted.sort((a, b) =>
                rollAsc ? a.rollNumber - b.rollNumber : b.rollNumber - a.rollNumber
            );
    }
}

// 依照排序欄位將卡片分組
function groupFilm(items, sortBy) {
    if (sortBy === 'brand') {
        return groupBy(items, (item) => item.brand || 'Unknown');
    }
    if (sortBy === 'film') {
        return groupBy(items, (item) => item.filmStock || 'Unknown');
    }
    return null; // roll 模式不分組
}

function groupBy(items, keyFn) {
    const map = new Map();
    for (const item of items) {
        const key = keyFn(item);
        if (!map.has(key)) map.set(key, []);
        map.get(key).push(item);
    }
    return map;
}

function FilmCard({ item }) {
    return (
        <Link
            href={`/photography/film/${item.id}`}
            className="film-card-parent"
        >
            <div className="film-card">
                <div className="film-card-cover">
                    {(item.images?.[16] || item.coverImage) && (
                        <img
                            src={item.images?.[16] || item.coverImage}
                            alt={`Roll #${item.rollNumber}`}
                            className="film-card-cover-img"
                        />
                    )}
                </div>

                <div className="film-card-body">
                    <span className="film-card-title">
                        {item.camera || 'Untitled Roll'}
                    </span>
                    <p className="film-card-desc">
                        {item.filmStock && <span>{item.filmStock}</span>}
                        {item.filmStock && ' · '}
                        {item.count} photo{item.count !== 1 ? 's' : ''}
                    </p>
                    {item.keywords && item.keywords.length > 0 && (
                        <div className="film-card-keywords">
                            {item.keywords.slice(0, 3).map((kw) => (
                                <span key={kw} className="film-card-kw">{kw}</span>
                            ))}
                        </div>
                    )}
                    <span className="film-card-cta">See More</span>
                </div>

                <div className="film-card-roll-badge">
                    <span className="film-card-roll-label">ROLL</span>
                    <span className="film-card-roll-num">#{item.rollNumber}</span>
                </div>
            </div>
        </Link>
    );
}

export default function FilmRollGrid({ film }) {
    const [sortBy, setSortBy] = useState('roll');
    const [rollAsc, setRollAsc] = useState(true);

    const handleSort = (key) => {
        if (key === 'roll' && sortBy === 'roll') {
            setRollAsc((prev) => !prev);
        } else {
            setSortBy(key);
            if (key === 'roll') setRollAsc(true);
        }
    };

    const sorted = sortFilm(film, sortBy, rollAsc);
    const groups = groupFilm(sorted, sortBy);

    return (
        <>
            {/* 排序列 */}
            <div className="film-sort-bar">
                <span className="film-sort-label">Sort by</span>
                {SORT_OPTIONS.map((opt, i) => (
                    <span key={opt.key} style={{ display: 'contents' }}>
                        {i > 0 && <span className="film-sort-divider">/</span>}
                        <button
                            className={`film-sort-btn${sortBy === opt.key ? ' film-sort-btn--active' : ''}`}
                            onClick={() => handleSort(opt.key)}
                        >
                            {opt.label}
                        </button>
                    </span>
                ))}
            </div>

            {/* Roll 模式：平鋪網格 */}
            {!groups && (
                <div className="film-grid">
                    {sorted.map((item) => (
                        <FilmCard key={item.id} item={item} />
                    ))}
                </div>
            )}

            {/* Brand / Film 模式：分組顯示 */}
            {groups && (
                <div className="film-groups">
                    {[...groups.entries()].map(([label, items]) => (
                        <div key={label} className="film-group">
                            <h3 className="film-group-title">{label}</h3>
                            <div className="film-grid">
                                {items.map((item) => (
                                    <FilmCard key={item.id} item={item} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}
