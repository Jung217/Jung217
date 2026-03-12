import fs from 'fs';
import path from 'path';
import PotteryCarousel from '@/components/PotteryCarousel';

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif', '.JPG', '.JPEG', '.PNG'];

export default function PotteryPage() {
    const potteryDir = path.join(process.cwd(), 'public', 'gallery', 'pottery');
    let images = [];

    try {
        if (fs.existsSync(potteryDir)) {
            images = fs.readdirSync(potteryDir)
                .filter(file => IMAGE_EXTENSIONS.includes(path.extname(file)))
                .map(file => `/gallery/pottery/${encodeURIComponent(file)}`);
        }
    } catch (e) {
        console.error('Failed to read pottery images:', e);
    }

    return (
        <main className="container animate-fade-in" style={{ paddingTop: '100px', paddingBottom: '4rem' }}>
            <h1 className="hero-title" style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                My <span>Pottery</span>
            </h1>
            <p className="text-secondary" style={{ marginBottom: '4rem' }}>
                A collection of my handcrafted ceramic works.
            </p>
            <PotteryCarousel images={images} />
        </main>
    );
}
