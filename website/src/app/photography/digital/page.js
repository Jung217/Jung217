import fs from 'fs';
import path from 'path';
import Link from 'next/link';

export default function DigitalPhotographyPage() {
    const dataPath = path.join(process.cwd(), 'src', 'data', 'gallery-data.json');
    let digital = [];

    try {
        const raw = fs.readFileSync(dataPath, 'utf8');
        const data = JSON.parse(raw);
        digital = data.photography.digital;
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
                Digital <span>Cameras</span>
            </h1>

            <section className="photography-section">
                {digital.length === 0 ? (
                    <p className="text-secondary">No digital photography collections yet.</p>
                ) : (
                    <div className="gallery-grid">
                        {digital.map((item) => (
                            <Link
                                href={`/photography/digital/${item.id}`}
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
                                        <img src={item.coverImage} alt={item.name} className="card-image" />
                                    ) : (
                                        <div className="card-placeholder">No Image</div>
                                    )}
                                </div>
                                <div className="card-content">
                                    <h2>{item.name}</h2>
                                    <p>{item.count} photos</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}
