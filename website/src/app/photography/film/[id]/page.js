import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import InfinitePhotoGrid from '@/components/InfinitePhotoGrid';

export async function generateStaticParams() {
    const dataPath = path.join(process.cwd(), 'src', 'data', 'gallery-data.json');
    if (!fs.existsSync(dataPath)) return [];

    const raw = fs.readFileSync(dataPath, 'utf8');
    const data = JSON.parse(raw);

    return data.photography.film.map((item) => ({
        id: item.id, // e.g. "001"
    }));
}

export const dynamicParams = false;

export default async function FilmRollPage({ params }) {
    const resolvedParams = await params;
    const dataPath = path.join(process.cwd(), 'src', 'data', 'gallery-data.json');
    const raw = fs.readFileSync(dataPath, 'utf8');
    const data = JSON.parse(raw);

    const item = data.photography.film.find((p) => p.id === resolvedParams.id);

    if (!item) {
        return (
            <main className="container animate-fade-in" style={{ paddingTop: '100px' }}>
                <h1>Roll Not Found</h1>
                <Link href="/photography/film" className="back-link">← Film Rolls</Link>
            </main>
        );
    }

    return (
        <main className="container animate-fade-in" style={{ paddingTop: '100px', paddingBottom: '4rem' }}>
            <Link href="/photography/film" className="back-link">← Film Rolls</Link>

            <div className="detail-header" style={{ marginTop: '2rem', marginBottom: '3rem' }}>
                {/* 捲號標題 */}
                <p className="text-secondary" style={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Roll #{item.rollNumber}
                </p>

                <h1 className="hero-title" style={{ fontSize: '3rem', margin: '0.25rem 0' }}>
                    {item.camera || 'Untitled Roll'}
                </h1>

                {/* 底部詳細資訊列 */}
                <div className="roll-meta-row">
                    {item.brand && (
                        <span className="roll-meta-item">
                            <span className="roll-meta-label">Brand</span>
                            {item.brand}
                        </span>
                    )}
                    {item.filmStock && (
                        <span className="roll-meta-item">
                            <span className="roll-meta-label">Film</span>
                            {item.filmStock}
                        </span>
                    )}
                    <span className="roll-meta-item">
                        <span className="roll-meta-label">Photos</span>
                        {item.count}
                    </span>
                </div>

                {/* 關鍵字標籤 */}
                {item.keywords && item.keywords.length > 0 && (
                    <div className="roll-keywords" style={{ marginTop: '1rem' }}>
                        {item.keywords.map((kw) => (
                            <span key={kw} className="roll-keyword-tag">{kw}</span>
                        ))}
                    </div>
                )}

                {/* 自由描述文字 */}
                {item.description && (
                    <p className="detail-description" style={{ marginTop: '1.5rem', whiteSpace: 'pre-wrap', color: 'var(--text-secondary)' }}>
                        {item.description}
                    </p>
                )}
            </div>

            {/* 照片網格 */}
            <InfinitePhotoGrid
                images={item.images}
                altPrefix={`Roll #${item.rollNumber} — ${item.camera || ''}`}
            />
        </main>
    );
}
