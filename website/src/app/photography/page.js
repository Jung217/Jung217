import fs from 'fs';
import path from 'path';
import Link from 'next/link';

export default function PhotographyPage() {
    const dataPath = path.join(process.cwd(), 'src', 'data', 'gallery-data.json');
    let digital = [];
    let film = [];
    try {
        const raw = fs.readFileSync(dataPath, 'utf8');
        const data = JSON.parse(raw);
        digital = data.photography.digital;
        film = data.photography.film;
    } catch (e) {
        console.error(e);
    }

    return (
        <main className="container animate-fade-in" style={{ paddingTop: '100px', paddingBottom: '4rem' }}>
            <h1 className="hero-title" style={{ fontSize: '3rem', marginBottom: '4rem' }}>
                My <span>Photography</span>
            </h1>

            <section className="photography-section">
                <h2 className="section-title">Digital Cameras</h2>
                {digital.length === 0 ? (
                    <p className="text-secondary">No digital photography collections yet.</p>
                ) : (
                    <div className="gallery-grid">
                        {digital.map((item) => (
                            <Link href={`/photography/digital/${item.id}`} key={item.id} className="collection-card window-card">
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

            <section className="photography-section">
                <h2 className="section-title">Film Cameras</h2>
                {film.length === 0 ? (
                    <p className="text-secondary">No film photography collections yet.</p>
                ) : (
                    <div className="gallery-grid">
                        {film.map((item) => (
                            <Link href={`/photography/film/${item.id}`} key={item.id} className="collection-card window-card">
                                <div className="align">
                                    <span className="red" />
                                    <span className="yellow" />
                                    <span className="green" />
                                </div>
                                <div className="card-image-wrapper">
                                    {item.coverImage ? (
                                        <img src={item.coverImage} alt={item.camera} className="card-image" />
                                    ) : (
                                        <div className="card-placeholder">No Image</div>
                                    )}
                                </div>
                                <div className="card-content">
                                    <h2>{item.brand} - {item.camera}</h2>
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
