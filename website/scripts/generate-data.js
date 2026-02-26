const fs = require('fs');
const path = require('path');

const galleryDir = path.join(process.cwd(), 'public', 'gallery');
const outputFile = path.join(process.cwd(), 'src', 'data', 'gallery-data.json');

function getDirectories(srcPath) {
    if (!fs.existsSync(srcPath)) return [];
    return fs.readdirSync(srcPath).filter(file => fs.statSync(path.join(srcPath, file)).isDirectory());
}

function getImagesAndText(folderPath, publicPrefix) {
    if (!fs.existsSync(folderPath)) return { images: [], text: '' };

    const files = fs.readdirSync(folderPath);
    const images = files
        .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
        .map(file => path.join(publicPrefix, file).replace(/\\/g, '/'));

    const textFile = files.find(file => file.toLowerCase() === 'description.txt' || file.toLowerCase() === 'info.txt');
    let text = '';
    if (textFile) {
        text = fs.readFileSync(path.join(folderPath, textFile), 'utf-8');
    }

    return { images, text };
}

function generateData() {
    const data = {
        pottery: [],
        photography: {
            digital: [],
            film: []
        }
    };

    // Pottery
    const potteryBase = path.join(galleryDir, 'pottery');
    const potteryCollections = getDirectories(potteryBase);
    potteryCollections.forEach(collection => {
        const { images, text } = getImagesAndText(path.join(potteryBase, collection), `/gallery/pottery/${collection}`);
        data.pottery.push({
            id: collection,
            name: collection.replace(/-/g, ' '),
            coverImage: images.length > 0 ? images[0] : null,
            images,
            description: text,
            count: images.length
        });
    });

    // Photography - Digital
    const digitalBase = path.join(galleryDir, 'photography', 'digital');
    const digitalCameras = getDirectories(digitalBase);
    digitalCameras.forEach(camera => {
        const { images, text } = getImagesAndText(path.join(digitalBase, camera), `/gallery/photography/digital/${camera}`);
        data.photography.digital.push({
            id: camera,
            name: camera.replace(/-/g, ' '),
            coverImage: images.length > 0 ? images[0] : null,
            images,
            description: text,
            count: images.length
        });
    });

    // Photography - Film
    const filmBase = path.join(galleryDir, 'photography', 'film');
    const filmBrands = getDirectories(filmBase);
    filmBrands.forEach(brand => {
        const brandPath = path.join(filmBase, brand);
        const cameras = getDirectories(brandPath);
        cameras.forEach(camera => {
            const { images, text } = getImagesAndText(path.join(brandPath, camera), `/gallery/photography/film/${brand}/${camera}`);
            data.photography.film.push({
                id: `${brand}-${camera}`,
                brand: brand.replace(/-/g, ' '),
                camera: camera.replace(/-/g, ' '),
                coverImage: images.length > 0 ? images[0] : null,
                images,
                description: text,
                count: images.length
            });
        });
    });

    // Ensure data directory exists
    const dataDir = path.dirname(outputFile);
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }

    // Write to JSON
    fs.writeFileSync(outputFile, JSON.stringify(data, null, 2));
    console.log(`✅ Gallery data generated successfully at ${outputFile}`);
}

generateData();
