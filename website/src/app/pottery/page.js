import fs from 'fs';
import path from 'path';
import Link from 'next/link';

export default function PotteryPage() {
    const dataPath = path.join(process.cwd(), 'src', 'data', 'gallery-data.json');
    let pottery = [];
    try {
        const raw = fs.readFileSync(dataPath, 'utf8');
        pottery = JSON.parse(raw).pottery;
    } catch (e) {
        console.error(e);
    }

    return (
        <main className="container animate-fade-in" style={{ paddingTop: '100px', paddingBottom: '4rem' }}>
            <h1 className="hero-title" style={{ fontSize: '3rem', marginBottom: '2rem' }}>
                My <span>Pottery</span>
            </h1>
            <p className="hero-subtitle" style={{ marginBottom: '4rem' }}>
                A collection of my handcrafted ceramic works.
            </p>

            {pottery.length === 0 ? (
                <p className="text-secondary">No pottery collections found yet. Add folders to public/gallery/pottery/</p>
            ) : (
                <div className="gallery-grid">
                    {pottery.map((item) => (
                        <Link href={`/pottery/${item.id}`} key={item.id} className="collection-card window-card">
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
        </main>
    );
}
