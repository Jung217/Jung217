import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import InfinitePhotoGrid from '@/components/InfinitePhotoGrid';

export default function DigitalPhotographyPage() {
    const dataPath = path.join(process.cwd(), 'src', 'data', 'gallery-data.json');
    let allImages = [];

    try {
        const raw = fs.readFileSync(dataPath, 'utf8');
        const data = JSON.parse(raw);
        // 將所有 digital 集合的照片合併
        for (const item of data.photography.digital) {
            if (item.images) allImages.push(...item.images);
        }
    } catch (e) {
        console.error(e);
    }

    return (
        <main className="container animate-fade-in" style={{ paddingTop: '100px', paddingBottom: '4rem' }}>
            <Link href="/photography" className="back-link" style={{ marginBottom: '2.5rem' }}>
                ← Photography
            </Link>

            <div className="detail-header" style={{ marginBottom: '3rem' }}>
                <h1 className="hero-title" style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
                    Digital <span>Photography</span>
                </h1>

            </div>

            {allImages.length === 0 ? (
                <p className="text-secondary">No digital photos yet.</p>
            ) : (
                <InfinitePhotoGrid
                    images={allImages}
                    altPrefix="Digital Photography"
                />
            )}
        </main>
    );
}
