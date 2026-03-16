import fs from 'fs';
import path from 'path';
import Link from 'next/link';

const PREVIEW_COUNT = 4;
const GALLERY_DATA_PATH = path.join(process.cwd(), 'src', 'data', 'gallery-data.json');

function pickRandom(images, n) {
    if (!images?.length) return [];
    const shuffled = [...images].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, n);
}

function EntryCard({ href, previews, overlayClass, badge, label, meta, grain = false }) {
    return (
        <Link href={href} className={`photo-entry-card photo-entry-card--${badge.toLowerCase()}`}>
            <div className="photo-entry-mosaic">
                {previews.map((src, i) => (
                    <img key={i} src={src} alt="" className="photo-entry-mosaic-img" />
                ))}
            </div>
            {grain && <div className="photo-entry-card-bg-grain" />}
            <div className={`photo-entry-card-overlay ${overlayClass}`} />
            <div className="photo-entry-card-content">
                <div className="photo-entry-badge">{badge}</div>
                <h2 className="photo-entry-label">{label}</h2>
                <p className="photo-entry-meta">{meta}</p>
                <span className="photo-entry-cta">Explore →</span>
            </div>
        </Link>
    );
}

export default function PhotographyPage() {
    let digitalTotal = 0;
    let filmTotal = 0;
    let filmCount = 0;
    let digitalPreviews = [];
    let filmPreviews = [];

    try {
        const raw = fs.readFileSync(GALLERY_DATA_PATH, 'utf8');
        const data = JSON.parse(raw);
        const { digital, film } = data.photography;

        digitalTotal = digital.reduce((sum, item) => sum + (item.count || 0), 0);
        filmTotal = film.reduce((sum, item) => sum + (item.count || 0), 0);
        filmCount = film.length;

        const allDigitalImages = digital.flatMap((item) => item.images || []);
        digitalPreviews = pickRandom(allDigitalImages, PREVIEW_COUNT);

        const filmCovers = film.map((item) => item.coverImage || item.images?.[0]).filter(Boolean);
        filmPreviews = pickRandom(filmCovers, PREVIEW_COUNT);
    } catch (e) {
        console.error(e);
    }

    return (
        <main className="photo-entry-page animate-fade-in">
            <div className="photo-entry-header">
                <h1 className="hero-title" style={{ fontSize: '2.5rem' }}>
                    My <span>Photography</span>
                </h1>
                <p className="text-secondary" style={{ marginTop: '0.5rem' }}>
                    Collection of my photos.
                </p>
            </div>

            <div className="photo-entry-wrapper">
                <EntryCard
                    href="/photography/digital"
                    previews={digitalPreviews}
                    overlayClass="photo-entry-card-overlay--digital"
                    badge="Digital"
                    label="Digital"
                    meta={digitalTotal > 0 ? `${digitalTotal} photos` : 'Coming soon'}
                />
                <EntryCard
                    href="/photography/film"
                    previews={filmPreviews}
                    overlayClass="photo-entry-card-overlay--film"
                    badge="Film"
                    label="Film"
                    meta={filmCount > 0 ? `${filmCount} rolls · ${filmTotal} photos` : 'Coming soon'}
                    grain
                />
            </div>
        </main>
    );
}
