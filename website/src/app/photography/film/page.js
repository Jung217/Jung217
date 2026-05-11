import Link from 'next/link';
import FilmRollGrid from '@/components/FilmRollGrid';
import { readGalleryData } from '@/lib/gallery';

export default function FilmPhotographyPage() {
    let film = [];

    try {
        const data = readGalleryData();
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
