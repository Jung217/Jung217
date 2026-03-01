import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'];

export async function GET() {
    const potteryDir = path.join(process.cwd(), 'public', 'gallery', 'pottery');

    try {
        if (!fs.existsSync(potteryDir)) {
            return NextResponse.json({ images: [] });
        }

        const files = fs.readdirSync(potteryDir);
        const images = files
            .filter(file => IMAGE_EXTENSIONS.includes(path.extname(file).toLowerCase()))
            .map(file => `/gallery/pottery/${encodeURIComponent(file)}`);

        return NextResponse.json({ images });
    } catch (e) {
        console.error('Failed to read pottery images:', e);
        return NextResponse.json({ images: [] }, { status: 500 });
    }
}
