import fs from 'fs';
import path from 'path';
import Link from 'next/link';

export default function FilmPhotographyPage() {
    const dataPath = path.join(process.cwd(), 'src', 'data', 'gallery-data.json');
    let film = [];

    try {
        const raw = fs.readFileSync(dataPath, 'utf8');
        const data = JSON.parse(raw);
        film = data.photography.film;
    } catch (e) {
        console.error(e);
    }

    return (
        <main className="container animate-fade-in" style={{ paddingTop: '100px', paddingBottom: '4rem' }}>
            {/* 返回連結 */}
            <Link href="/photography" className="back-link" style={{ marginBottom: '2.5rem' }}>
                ← Photography
            </Link>

            <h1 className="hero-title" style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                Film <span>Rolls</span>
            </h1>

            <section className="photography-section">
                {film.length === 0 ? (
                    <p className="text-secondary">No film rolls yet.</p>
                ) : (
                    <div className="gallery-grid">
                        {film.map((item) => (
                            <Link
                                href={`/photography/film/${item.id}`}
                                key={item.id}
                                className="collection-card window-card"
                            >
                                {/* macOS 風格紅黃綠按鈕 */}
                                <div className="align">
                                    <span className="red" />
                                    <span className="yellow" />
                                    <span className="green" />
                                </div>
                                <div className="card-image-wrapper">
                                    {item.coverImage ? (
                                        <img src={item.coverImage} alt={`Roll ${item.rollNumber}`} className="card-image" />
                                    ) : (
                                        <div className="card-placeholder">No Image</div>
                                    )}
                                </div>
                                <div className="card-content">
                                    {/* 捲號 + 相機 */}
                                    <h2>
                                        <span className="roll-number">#{item.rollNumber}</span>
                                        {item.camera ? ` ${item.camera}` : ' Untitled Roll'}
                                    </h2>
                                    {/* 底片型號 */}
                                    {item.filmStock && (
                                        <p className="roll-film-stock">{item.filmStock}</p>
                                    )}
                                    {/* 照片數量 */}
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                        {item.count} photo{item.count !== 1 ? 's' : ''}
                                    </p>
                                    {/* 關鍵字標籤 */}
                                    {item.keywords && item.keywords.length > 0 && (
                                        <div className="roll-keywords">
                                            {item.keywords.map((kw) => (
                                                <span key={kw} className="roll-keyword-tag">{kw}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}
