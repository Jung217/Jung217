import Link from 'next/link';
import { readTimeline } from '@/lib/timeline';
import TimelineView from '@/components/TimelineView';

export default function TimelinePage() {
    let sections = {};

    try {
        sections = readTimeline();
    } catch (e) {
        console.error('Failed to read timeline:', e);
    }

    return (
        <main className="container animate-fade-in" style={{ paddingTop: '100px', paddingBottom: '4rem' }}>
            <Link href="/" className="back-link" style={{ marginBottom: '2.5rem' }}>
                ← Home
            </Link>

            <h1 className="hero-title" style={{ fontSize: '3rem', marginBottom: '2rem' }}>
                My <span>Timeline</span>
            </h1>

            <TimelineView sections={sections} />
        </main>
    );
}
