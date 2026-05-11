'use client';

import { useState } from 'react';

const CATEGORIES = [
    { key: 'experience', label: '經歷', color: '#eab308' },
    { key: 'awards', label: '獎項', color: '#f97316' },
    { key: 'publications', label: '發表', color: '#8b5cf6' },
    { key: 'milestones', label: '大事記', color: '#22d3ee' },
];

const MONTHS_PER_YEAR = 12;
const YEAR_DIGITS = 4;
const DIGIT_LINE_HEIGHT = 0.75;
const YEAR_DOT_SIZE = 6;
const MONTH_PX = 14;
const MIN_NODE_GAP = 68;
const TREE_PADDING = 24;
const TREE_BOTTOM_MARGIN = 20;

function getCategoryMeta(key) {
    return CATEGORIES.find((c) => c.key === key);
}

function toMonths(dateStr) {
    const [y, m] = dateStr.split('-').map(Number);
    return y * MONTHS_PER_YEAR + m;
}

function monthToPixel(month, maxMonth) {
    return (maxMonth - month) * MONTH_PX + TREE_PADDING;
}

function formatDate(dateStr) {
    if (dateStr === 'present') return 'Present';
    const [year, month] = dateStr.split('-');
    return `${year}.${month}`;
}

function getAllEntries(sections) {
    const all = [];
    for (const cat of CATEGORIES) {
        const items = sections[cat.key] || [];
        items.forEach((item) => all.push({ ...item, category: cat.key }));
    }
    all.sort((a, b) => b.date.localeCompare(a.date));
    return all;
}

function buildYearTicks(minMonth, maxMonth) {
    const startYear = Math.floor(minMonth / MONTHS_PER_YEAR);
    const endYear = Math.ceil(maxMonth / MONTHS_PER_YEAR) - 1;
    const ticks = [];
    for (let y = startYear; y <= endYear; y++) {
        const december = y * MONTHS_PER_YEAR + MONTHS_PER_YEAR;
        ticks.push({ year: y, top: monthToPixel(december, maxMonth) });
    }
    return ticks;
}

function positionNodes(entries, maxMonth) {
    const nodes = entries.map((entry) => ({
        ...entry,
        top: monthToPixel(toMonths(entry.date), maxMonth),
    }));

    let lastLeft = -MIN_NODE_GAP;
    let lastRight = -MIN_NODE_GAP;

    nodes.forEach((node, idx) => {
        node.side = idx % 2 === 0 ? 'tl-left' : 'tl-right';
        const last = node.side === 'tl-left' ? lastLeft : lastRight;
        if (node.top - last < MIN_NODE_GAP) {
            node.top = last + MIN_NODE_GAP;
        }
        if (node.side === 'tl-left') lastLeft = node.top;
        else lastRight = node.top;
    });

    return nodes;
}

function buildRangeLine(node, currentMonth, maxMonth) {
    const endMonthVal = node.endDate === 'present' ? currentMonth : toMonths(node.endDate);
    const endPos = monthToPixel(endMonthVal, maxMonth);
    const height = node.top - endPos;
    return height > 0 ? { endPos, height } : null;
}

function DateDisplay({ entry }) {
    if (entry.endDate) {
        return (
            <span className="tl-date">
                {formatDate(entry.date)} ~ {formatDate(entry.endDate)}
            </span>
        );
    }
    return <span className="tl-date">{formatDate(entry.date)}</span>;
}

function YearTick({ tick, isOldest }) {
    const dotSize = isOldest ? 0 : YEAR_DOT_SIZE;
    const digitSize = (MONTHS_PER_YEAR * MONTH_PX - dotSize) / (YEAR_DIGITS * DIGIT_LINE_HEIGHT);

    return (
        <div className="tl-year-tick" style={{ top: `${tick.top}px` }}>
            <span className="tl-year-label" style={{ fontSize: `${digitSize}px`, lineHeight: DIGIT_LINE_HEIGHT }}>
                {String(tick.year).split('').map((d, di) => (
                    <span key={di}>{d}</span>
                ))}
                {!isOldest && <span className="tl-year-dot" />}
            </span>
        </div>
    );
}

function RangeLine({ node, currentMonth, maxMonth }) {
    const range = buildRangeLine(node, currentMonth, maxMonth);
    if (!range) return null;

    const meta = getCategoryMeta(node.category);
    return (
        <div
            className={`tl-range-line ${node.side}`}
            style={{ top: `${range.endPos}px`, height: `${range.height}px` }}
        >
            <span className="tl-range-cap" style={{ backgroundColor: meta.color }} />
        </div>
    );
}

function TimelineNode({ entry }) {
    const meta = getCategoryMeta(entry.category);
    return (
        <div className={`tl-node ${entry.side}`} style={{ top: `${entry.top}px` }}>
            {!entry.endDate && <span className="tl-node-dot" style={{ backgroundColor: meta.color }} />}
            <div className="tl-connector" />
            <div className="tl-branch">
                <DateDisplay entry={entry} />
                <span className="tl-title">{entry.title}</span>
                {entry.desc && <span className="tl-desc">{entry.desc}</span>}
            </div>
        </div>
    );
}

function TimelineTree({ entries }) {
    if (entries.length === 0) {
        return <p className="text-secondary">No timeline entries yet.</p>;
    }

    const now = new Date();
    const currentMonth = now.getFullYear() * MONTHS_PER_YEAR + (now.getMonth() + 1);
    const maxMonth = now.getFullYear() * MONTHS_PER_YEAR + MONTHS_PER_YEAR;

    const minMonth = Math.min(...entries.map((e) => toMonths(e.date)));
    const trunkHeight = (maxMonth - minMonth) * MONTH_PX + TREE_PADDING * 2;

    const yearTicks = buildYearTicks(minMonth, maxMonth);
    const nodes = positionNodes(entries, maxMonth);

    const yearLabelHeight = MONTHS_PER_YEAR * MONTH_PX;
    const lowestTickBottom = yearTicks.length > 0
        ? Math.max(...yearTicks.map((t) => t.top)) + yearLabelHeight
        : 0;
    const finalHeight = Math.max(trunkHeight, ...nodes.map((n) => n.top), lowestTickBottom)
        + TREE_PADDING + TREE_BOTTOM_MARGIN;

    return (
        <div className="tl-tree" style={{ height: `${finalHeight}px` }}>
            <div className="tl-trunk" style={{ top: `${TREE_PADDING}px`, bottom: `${TREE_PADDING}px` }} />

            {yearTicks.map((tick, i) => (
                <YearTick key={tick.year} tick={tick} isOldest={i === 0} />
            ))}

            {nodes.filter((n) => n.endDate).map((node, idx) => (
                <RangeLine key={`rline-${idx}`} node={node} currentMonth={currentMonth} maxMonth={maxMonth} />
            ))}

            {nodes.map((entry, idx) => (
                <TimelineNode key={idx} entry={entry} />
            ))}
        </div>
    );
}

function CategoryList({ entries, color }) {
    if (entries.length === 0) {
        return <p className="text-secondary">No entries yet.</p>;
    }

    return (
        <ul className="tl-cat-list">
            {entries.map((entry, idx) => (
                <li key={idx} className="tl-cat-item">
                    <span className="tl-cat-dot" style={{ backgroundColor: color }} />
                    <span className="tl-cat-date">
                        {formatDate(entry.date)}
                        {entry.endDate && ` ~ ${formatDate(entry.endDate)}`}
                    </span>
                    <span className="tl-cat-title">{entry.title}</span>
                    {entry.desc && <span className="tl-cat-desc">{entry.desc}</span>}
                </li>
            ))}
        </ul>
    );
}

export default function TimelineView({ sections }) {
    const allEntries = getAllEntries(sections);
    const [activeTab, setActiveTab] = useState(CATEGORIES[0].key);

    const activeMeta = getCategoryMeta(activeTab);
    const activeEntries = (sections[activeTab] || []).sort((a, b) => b.date.localeCompare(a.date));

    return (
        <>
            <section className="tl-section">
                <div className="tl-legend">
                    {CATEGORIES.map((cat) => (
                        <span key={cat.key} className="tl-legend-item">
                            <span className="tl-legend-dot" style={{ backgroundColor: cat.color }} />
                            {cat.label}
                        </span>
                    ))}
                </div>
                <TimelineTree entries={allEntries} />
            </section>

            <section className="tl-tabs-section">
                <div className="tl-tabs">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.key}
                            className={`tl-tab${activeTab === cat.key ? ' tl-tab--active' : ''}`}
                            style={activeTab === cat.key ? { color: cat.color, borderColor: cat.color } : {}}
                            onClick={() => setActiveTab(cat.key)}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                <CategoryList entries={activeEntries} color={activeMeta.color} />
            </section>
        </>
    );
}
