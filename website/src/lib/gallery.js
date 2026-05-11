import fs from 'fs';
import path from 'path';

const GALLERY_DATA_PATH = path.join(process.cwd(), 'src', 'data', 'gallery-data.json');

export function readGalleryData() {
    const raw = fs.readFileSync(GALLERY_DATA_PATH, 'utf8');
    return JSON.parse(raw);
}
