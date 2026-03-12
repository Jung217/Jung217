import fs from 'fs';
import path from 'path';
import Link from 'next/link';

export default function PhotographyPage() {
    const dataPath = path.join(process.cwd(), 'src', 'data', 'gallery-data.json');
    let digital = [];
    let film = [];
    /* 計算各類別照片總張數 */
    let digitalTotal = 0;
    let filmTotal = 0;

    try {
        const raw = fs.readFileSync(dataPath, 'utf8');
        const data = JSON.parse(raw);
        digital = data.photography.digital;
        film = data.photography.film;
        /* 累加每個相機收藏的張數 */
        digitalTotal = digital.reduce((sum, item) => sum + (item.count || 0), 0);
        filmTotal = film.reduce((sum, item) => sum + (item.count || 0), 0);
    } catch (e) {
        console.error(e);
    }

    return (
        <main className="photo-entry-page animate-fade-in">
            {/* 頁面標題列 */}
            <div className="photo-entry-header">
                <h1 className="hero-title" style={{ fontSize: '2.5rem' }}>
                    My <span>Photography</span>
                </h1>
                <p className="text-secondary" style={{ marginTop: '0.5rem' }}>
                    Collection of my photos.
                </p>
            </div>

            {/* 兩張全版入口選擇卡片 */}
            <div className="photo-entry-wrapper">
                {/* Digital 卡片 */}
                <Link href="/photography/digital" className="photo-entry-card photo-entry-card--digital">
                    <div className="photo-entry-card-bg photo-entry-card-bg--digital" />
                    <div className="photo-entry-card-overlay photo-entry-card-overlay--digital" />
                    <div className="photo-entry-card-content">
                        <div className="photo-entry-badge">Digital</div>
                        <h2 className="photo-entry-label">Digital</h2>
                        <p className="photo-entry-meta">
                            {digital.length > 0
                                ? `${digital.length} camera${digital.length > 1 ? 's' : ''} · ${digitalTotal} photo${digitalTotal !== 1 ? 's' : ''}`
                                : 'Coming soon'}
                        </p>
                        <span className="photo-entry-cta">Explore →</span>
                    </div>
                </Link>

                {/* Film 卡片 */}
                <Link href="/photography/film" className="photo-entry-card photo-entry-card--film">
                    <div className="photo-entry-card-bg photo-entry-card-bg--film" />
                    <div className="photo-entry-card-bg-grain" />
                    <div className="photo-entry-card-overlay photo-entry-card-overlay--film" />
                    <div className="photo-entry-card-content">
                        <div className="photo-entry-badge">Film</div>
                        <h2 className="photo-entry-label">Film</h2>
                        <p className="photo-entry-meta">
                            {film.length > 0
                                ? `${film.length} camera${film.length > 1 ? 's' : ''} · ${filmTotal} photo${filmTotal !== 1 ? 's' : ''}`
                                : 'Coming soon'}
                        </p>
                        <span className="photo-entry-cta">Explore →</span>
                    </div>
                </Link>
            </div>
        </main>
    );
}
