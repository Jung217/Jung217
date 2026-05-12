import fs from 'fs';
import path from 'path';

const TIMELINE_PATH = path.join(process.cwd(), 'src', 'data', 'timeline.md');

const SECTION_KEYS = {
    '經歷': 'experience',
    '獎項': 'awards',
    '發表': 'publications',
    '大事記': 'milestones',
};

const DATE_RANGE_PATTERN = /^-\s*(\d{4}-\d{2})\s*~\s*(present|\d{4}-\d{2})\s*\|\s*(.+)$/;
const SINGLE_DATE_PATTERN = /^-\s*(\d{4}-\d{2})\s*\|\s*(.+)$/;

function parseLine(line) {
    const rangeMatch = line.match(DATE_RANGE_PATTERN);
    if (rangeMatch) {
        return { date: rangeMatch[1], endDate: rangeMatch[2], title: rangeMatch[3].trim() };
    }

    const singleMatch = line.match(SINGLE_DATE_PATTERN);
    if (singleMatch) {
        return { date: singleMatch[1], endDate: null, title: singleMatch[2].trim() };
    }

    return null;
}

export function readTimeline() {
    const raw = fs.readFileSync(TIMELINE_PATH, 'utf8');
    const sections = {};
    let currentKey = null;
    let lastEntry = null;

    for (const line of raw.split('\n')) {
        const trimmed = line.trim();

        const heading = trimmed.match(/^##\s+(.+)$/);
        if (heading) {
            const label = heading[1].trim();
            currentKey = SECTION_KEYS[label] || label;
            if (!sections[currentKey]) sections[currentKey] = [];
            lastEntry = null;
            continue;
        }

        if (currentKey && trimmed.startsWith('-')) {
            const entry = parseLine(trimmed);
            if (entry) {
                entry.category = currentKey;
                entry.desc = null;
                sections[currentKey].push(entry);
                lastEntry = entry;
            }
            continue;
        }

        if (lastEntry && trimmed && line.startsWith('  ')) {
            lastEntry.desc = lastEntry.desc ? `${lastEntry.desc}\n${trimmed}` : trimmed;
        }
    }

    return sections;
}
