import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import FilmRollGrid from '@/components/FilmRollGrid';

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
                    <FilmRollGrid film={film} />
                )}
            </section>
        </main>
    );
}
