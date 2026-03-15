/**
 * sync-flickr.mjs（Puppeteer 版 - 遞增翻頁直到無照片）
 * ──────────────────────────────────────────────────────
 * 逐頁訪問 Flickr photostream（/pageN/），
 * 每頁滾動讓照片完整載入，直到某頁沒有任何照片為止。
 *
 * 使用方式：node scripts/sync-flickr.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';

/* ════════ 環境變數 ════════ */
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const envPath = path.join(rootDir, '.env.local');

if (fs.existsSync(envPath)) {
    fs.readFileSync(envPath, 'utf-8').split('\n').forEach(line => {
        const t = line.trim();
        if (!t || t.startsWith('#')) return;
        const eq = t.indexOf('=');
        if (eq === -1) return;
        const k = t.slice(0, eq).trim();
        const v = t.slice(eq + 1).trim().replace(/^['"]|['"]$/g, '');
        if (!process.env[k]) process.env[k] = v;
    });
}

const USERNAME = process.env.FLICKR_USERNAME || 'cjc217';
const BASE_URL = `https://www.flickr.com/photos/${USERNAME}`;
const OUTPUT   = path.join(rootDir, 'src', 'data', 'gallery-data.json');

const sleep = ms => new Promise(r => setTimeout(r, ms));

/* ════════ 提取當前頁面的所有照片 URL ════════ */
async function extractPhotosFromRenderedPage(page) {
    return page.evaluate(() => {
        const photoData = new Map(); /* id -> url */

        /* 方法 A：從最大 script 的 JSON 提取 server/id/secret */
        const scripts = [...document.querySelectorAll('script:not([src])')];
        const bigScript = scripts
            .filter(s => s.textContent.includes('"secret"') && s.textContent.length > 5000)
            .sort((a, b) => b.textContent.length - a.textContent.length)[0];

        if (bigScript) {
            const txt = bigScript.textContent;
            /* 常見欄位順序 1：id ... secret ... server */
            const re1 = /"id"\s*:\s*"(\d{10,})"[^}]{0,300}?"secret"\s*:\s*"([a-f0-9]+)"[^}]{0,300}?"server"\s*:\s*"(\d+)"/g;
            /* 常見欄位順序 2：server ... id ... secret */
            const re2 = /"server"\s*:\s*"(\d+)"[^}]{0,300}?"id"\s*:\s*"(\d{10,})"[^}]{0,300}?"secret"\s*:\s*"([a-f0-9]+)"/g;
            let m;
            while ((m = re1.exec(txt)) !== null) {
                const [, id, secret, server] = m;
                if (!photoData.has(id))
                    photoData.set(id, `https://live.staticflickr.com/${server}/${id}_${secret}_b.jpg`);
            }
            while ((m = re2.exec(txt)) !== null) {
                const [, server, id, secret] = m;
                if (!photoData.has(id))
                    photoData.set(id, `https://live.staticflickr.com/${server}/${id}_${secret}_b.jpg`);
            }
        }

        /* 方法 B：從 img srcset 補充（涵蓋懶載入未在 script 中的照片） */
        document.querySelectorAll('img[src*="staticflickr"],img[srcset*="staticflickr"]').forEach(img => {
            const srcs = [img.src, ...(img.srcset || '').split(',').map(s => s.trim().split(' ')[0])];
            srcs.forEach(src => {
                const m = src.match(/live\.staticflickr\.com\/(\d+)\/(\d{10,})_([a-f0-9]+)_/);
                if (m && !photoData.has(m[2]))
                    photoData.set(m[2], `https://live.staticflickr.com/${m[1]}/${m[2]}_${m[3]}_b.jpg`);
            });
        });

        return [...photoData.values()];
    });
}

/* ════════ 主流程 ════════ */
async function syncFlickr() {
    console.log(`\n🚀 同步 Flickr 照片：${BASE_URL}/\n`);

    let existing = { pottery: [], photography: { digital: [], film: [] } };
    if (fs.existsSync(OUTPUT)) {
        try { existing = JSON.parse(fs.readFileSync(OUTPUT, 'utf-8')); } catch (_) {}
    }

    console.log('🌐 啟動 Puppeteer...');
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 3000 });
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');

    const allPhotos = new Map(); /* id -> url */
    let pageNum = 1;
    let consecutiveEmpty = 0;

    try {
        while (consecutiveEmpty < 2) {
            const pageUrl = pageNum === 1 ? `${BASE_URL}/` : `${BASE_URL}/page${pageNum}/`;
            console.log(`📄 第 ${pageNum} 頁...`);

            try {
                await page.goto(pageUrl, { waitUntil: 'networkidle2', timeout: 45000 });
                await sleep(2500);

                /* 滾動頁面確保懶載入圖片全部渲染 */
                for (let i = 0; i < 6; i++) {
                    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
                    await sleep(1000);
                }
                await sleep(1500);

                const pageUrls = await extractPhotosFromRenderedPage(page);
                const before = allPhotos.size;

                pageUrls.forEach(url => {
                    const id = url.match(/\/(\d{10,})_/)?.[1];
                    if (id) allPhotos.set(id, url);
                });

                const newCount = allPhotos.size - before;
                console.log(`   新增 ${newCount} 張（累計 ${allPhotos.size} 張）`);

                if (newCount === 0) {
                    consecutiveEmpty++;
                    console.log(`   ⚠️  沒有新照片（${consecutiveEmpty}/2）`);
                } else {
                    consecutiveEmpty = 0;
                }

            } catch (err) {
                console.warn(`   ❌ 第 ${pageNum} 頁失敗：${err.message}`);
                consecutiveEmpty++;
            }

            pageNum++;
        }
    } finally {
        await browser.close();
        console.log('\n🌐 瀏覽器已關閉');
    }

    const photoUrls = [...allPhotos.values()];
    console.log(`\n📊 共抓取 ${photoUrls.length} 張照片`);

    if (photoUrls.length === 0) {
        console.error('❌ 未抓取到任何照片，請確認 FLICKR_USERNAME 是否正確');
        process.exit(1);
    }

    const newData = {
        pottery: existing.pottery,
        photography: {
            digital: [{
                id: 'flickr-all',
                name: 'Digital Photos',
                flickrProfileUrl: `${BASE_URL}/`,
                coverImage: photoUrls[0],
                images: photoUrls,
                description: '',
                count: photoUrls.length,
                source: 'flickr',
            }],
            film: existing.photography.film,
        },
    };

    fs.writeFileSync(OUTPUT, JSON.stringify(newData, null, 2), 'utf-8');
    console.log(`✅ 完成！輸出：${OUTPUT}\n`);
}

syncFlickr().catch(err => {
    console.error('\n❌ 失敗：', err.message);
    process.exit(1);
});
