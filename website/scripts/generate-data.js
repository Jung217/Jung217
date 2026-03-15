const fs = require('fs');
const path = require('path');

/**
 * generate-data.js
 * 掃描本地 gallery 資料夾，產生 gallery-data.json。
 *
 * 注意：photography.digital 的資料由 sync-flickr.mjs 負責（從 Flickr API 抓取）。
 * 若 gallery-data.json 已存在 Flickr 來源的 digital 資料，本腳本將保留不覆寫。
 * 僅在沒有任何 digital 資料時，才 fallback 掃描本地資料夾。
 */

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
    /* 讀取現有 JSON，保留 Film 與 Digital（Flickr）資料 */
    let existingData = { pottery: [], photography: { digital: [], film: [] } };
    if (fs.existsSync(outputFile)) {
        try {
            existingData = JSON.parse(fs.readFileSync(outputFile, 'utf-8'));
        } catch (e) {
            console.warn('⚠️  無法解析現有 gallery-data.json，將重新生成');
        }
    }

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

    /* ─── Photography - Digital ───
     * 若現有資料中已有 Flickr 來源的 digital 資料，保留不覆寫。
     * 僅在沒有任何 digital 資料時（初始狀態），才掃描本地資料夾作為 fallback。
     */
    const hasFlickrData = existingData.photography.digital.some(item => item.source === 'flickr');
    if (hasFlickrData) {
        console.log('📸 Digital 資料已有 Flickr 來源，保留現有資料（如需更新請執行 npm run sync-flickr）');
        data.photography.digital = existingData.photography.digital;
    } else {
        console.log('📸 未偵測到 Flickr 資料，掃描本地資料夾作為 fallback...');
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
    }

    // Photography - Film（全域捲號格式：film/001/ film/002/ ...）
    const filmBase = path.join(galleryDir, 'photography', 'film');
    const rollDirs = getDirectories(filmBase);

    /* 依資料夾名稱排序（字典序：001 < 002 < 003） */
    rollDirs.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

    rollDirs.forEach((rollFolder, index) => {
        const rollPath = path.join(filmBase, rollFolder);

        /* 掃描圖片 */
        const files = fs.readdirSync(rollPath);
        const images = files
            .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
            .sort()
            .map(file => `/gallery/photography/film/${rollFolder}/${file}`);

        /* 解析 info.txt */
        let camera = '';
        let brand = '';
        let filmStock = '';
        let keywords = [];
        let description = '';

        const infoFile = files.find(file => file.toLowerCase() === 'info.txt');
        if (infoFile) {
            const raw = fs.readFileSync(path.join(rollPath, infoFile), 'utf-8');
            const lines = raw.split('\n');
            const bodyLines = [];
            let inBody = false;

            lines.forEach(line => {
                const trimmed = line.trim();

                /* 空行之後視為自由描述 */
                if (!inBody && trimmed === '') {
                    inBody = true;
                    return;
                }
                if (inBody) {
                    bodyLines.push(line);
                    return;
                }

                /* 解析 key: value 欄位（不區分大小寫）*/
                const match = trimmed.match(/^([^:]+):\s*(.*)$/);
                if (match) {
                    const key = match[1].toLowerCase().trim();
                    const val = match[2].trim();
                    if (key === 'camera') camera = val;
                    else if (key === 'brand') brand = val;
                    else if (key === 'film') filmStock = val;
                    else if (key === 'keywords') {
                        keywords = val.split(',').map(k => k.trim()).filter(Boolean);
                    }
                }
            });

            description = bodyLines.join('\n').trim();
        }

        data.photography.film.push({
            id: rollFolder,                          /* e.g. "001" */
            rollNumber: index + 1,                   /* 顯示用序號 */
            rollFolder,                              /* 原始資料夾名稱 */
            camera,
            brand,
            filmStock,
            keywords,
            coverImage: images.length > 0 ? images[0] : null,
            images,
            description,
            count: images.length
        });
    });

    /* 已依資料夾順序排好，不再額外排序 */


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
