import fs from 'fs';
import path from 'path';
import Link from 'next/link';

// 從陣列中隨機取 n 張不重複的照片
function pickRandom(images, n) {
    if (!images || images.length === 0) return [];
    const shuffled = [...images].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, n);
}

export default function PhotographyPage() {
    const dataPath = path.join(process.cwd(), 'src', 'data', 'gallery-data.json');
    let digital = [];
    let film = [];
    let digitalTotal = 0;
    let filmTotal = 0;
    let digitalPreviews = [];
    let filmPreviews = [];

    try {
        const raw = fs.readFileSync(dataPath, 'utf8');
        const data = JSON.parse(raw);
        digital = data.photography.digital;
        film = data.photography.film;
        digitalTotal = digital.reduce((sum, item) => sum + (item.count || 0), 0);
        filmTotal = film.reduce((sum, item) => sum + (item.count || 0), 0);

        // Digital：從所有照片中隨機取 4 張
        const allDigitalImages = digital.flatMap((item) => item.images || []);
        digitalPreviews = pickRandom(allDigitalImages, 4);

        // Film：從各卷封面中隨機取 4 張
        const filmCovers = film.map((item) => item.coverImage || item.images?.[0]).filter(Boolean);
        filmPreviews = pickRandom(filmCovers, 4);
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
                {/* Digital 卡片 */}
                <Link href="/photography/digital" className="photo-entry-card photo-entry-card--digital">
                    <div className="photo-entry-mosaic">
                        {digitalPreviews.map((src, i) => (
                            <img key={i} src={src} alt="" className="photo-entry-mosaic-img" />
                        ))}
                    </div>
                    <div className="photo-entry-card-overlay photo-entry-card-overlay--digital" />
                    <div className="photo-entry-card-content">
                        <div className="photo-entry-badge">Digital</div>
                        <h2 className="photo-entry-label">Digital</h2>
                        <p className="photo-entry-meta">
                            {digitalTotal > 0 ? `${digitalTotal} photos` : 'Coming soon'}
                        </p>
                        <span className="photo-entry-cta">Explore →</span>
                    </div>
                </Link>

                {/* Film 卡片 */}
                <Link href="/photography/film" className="photo-entry-card photo-entry-card--film">
                    <div className="photo-entry-mosaic">
                        {filmPreviews.map((src, i) => (
                            <img key={i} src={src} alt="" className="photo-entry-mosaic-img" />
                        ))}
                    </div>
                    <div className="photo-entry-card-bg-grain" />
                    <div className="photo-entry-card-overlay photo-entry-card-overlay--film" />
                    <div className="photo-entry-card-content">
                        <div className="photo-entry-badge">Film</div>
                        <h2 className="photo-entry-label">Film</h2>
                        <p className="photo-entry-meta">
                            {film.length > 0
                                ? `${film.length} rolls · ${filmTotal} photos`
                                : 'Coming soon'}
                        </p>
                        <span className="photo-entry-cta">Explore →</span>
                    </div>
                </Link>
            </div>
        </main>
    );
}
