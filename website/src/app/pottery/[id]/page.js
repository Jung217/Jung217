import fs from 'fs';
import path from 'path';
import Link from 'next/link';

// Generate Static Params for structural static generation (Static Export)
export async function generateStaticParams() {
    const dataPath = path.join(process.cwd(), 'src', 'data', 'gallery-data.json');
    if (!fs.existsSync(dataPath)) return [];

    const raw = fs.readFileSync(dataPath, 'utf8');
    const data = JSON.parse(raw);

    return data.pottery.map((item) => ({
        id: item.id,
    }));
}

export const dynamicParams = false;

export default async function PotteryDetailPage({ params }) {
    const resolvedParams = await params;
    const dataPath = path.join(process.cwd(), 'src', 'data', 'gallery-data.json');
    const raw = fs.readFileSync(dataPath, 'utf8');
    const data = JSON.parse(raw);

    const item = data.pottery.find((p) => p.id === resolvedParams.id);

    if (!item) {
        return (
            <main className="container animate-fade-in" style={{ paddingTop: '100px' }}>
                <h1>Collection Not Found</h1>
                <Link href="/pottery" className="back-link">← Back to Pottery</Link>
            </main>
        );
    }

    return (
        <main className="container animate-fade-in" style={{ paddingTop: '100px', paddingBottom: '4rem' }}>
            <Link href="/pottery" className="back-link">← Back to Pottery</Link>

            <div className="detail-header" style={{ marginTop: '2rem', marginBottom: '3rem' }}>
                <h1 className="hero-title" style={{ fontSize: '3rem', margin: 0 }}>
                    {item.name}
                </h1>
                {item.description && (
                    <p className="detail-description" style={{ marginTop: '1rem', whiteSpace: 'pre-wrap', color: 'var(--text-secondary)' }}>
                        {item.description}
                    </p>
                )}
            </div>

            <div className="photo-grid">
                {item.images.map((img, idx) => (
                    <div key={idx} className="photo-wrapper">
                        <img src={img} alt={`${item.name} photo ${idx + 1}`} loading="lazy" />
                    </div>
                ))}
            </div>
        </main>
    );
}
