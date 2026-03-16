import fs from 'fs';
import path from 'path';
import PotteryOrganic from '@/components/PotteryOrganic';

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

    return <PotteryOrganic images={images} />;
}
