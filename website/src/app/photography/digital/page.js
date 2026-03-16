import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import InfinitePhotoGrid from '@/components/InfinitePhotoGrid';

const GALLERY_DATA_PATH = path.join(process.cwd(), 'src', 'data', 'gallery-data.json');

export default function DigitalPhotographyPage() {
    let allImages = [];

    try {
        const raw = fs.readFileSync(GALLERY_DATA_PATH, 'utf8');
        const { photography } = JSON.parse(raw);
        allImages = photography.digital.flatMap((item) => item.images || []);
    } catch (e) {
        console.error(e);
    }

    return (
        <main className="container animate-fade-in" style={{ paddingTop: '100px', paddingBottom: '4rem' }}>
            <Link href="/photography" className="back-link" style={{ marginBottom: '2.5rem' }}>
                ← Photography
            </Link>

            <h1 className="hero-title" style={{ fontSize: '3rem', marginBottom: '2rem' }}>
                Digital <span>Photography</span>
            </h1>

            {allImages.length === 0 ? (
                <p className="text-secondary">No digital photos yet.</p>
            ) : (
                <InfinitePhotoGrid
                    images={allImages}
                    altPrefix="Digital Photography"
                    randomize
                />
            )}
        </main>
    );
}
