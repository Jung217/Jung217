/**
 * sync-flickr.mjs（Puppeteer 版 - 無限滾動 + CDP 攔截）
 * ──────────────────────────────────────────────────────
 * 在主頁面持續向下滾動，讓 Flickr 自然觸發所有 API 呼叫，
 * 搭配 CDP 攔截每一次 API 回應，直到沒有新照片為止。
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

/* ════════ 從文字中提取 staticflickr URL ════════ */
function extractUrlsFromText(text, photoData) {
    const before = photoData.size;

    /* 優先嘗試完整 JSON 解析 */
    try { walkJson(JSON.parse(text), photoData); } catch (_) {}

    /* 正規表達式補強 */
    const re1 = /"id"\s*:\s*"(\d{10,})"[^}]{0,500}?"secret"\s*:\s*"([a-f0-9]+)"[^}]{0,500}?"server"\s*:\s*"(\d+)"/g;
    const re2 = /"server"\s*:\s*"(\d+)"[^}]{0,500}?"id"\s*:\s*"(\d{10,})"[^}]{0,500}?"secret"\s*:\s*"([a-f0-9]+)"/g;
    const re3 = /"id"\s*:\s*"(\d{10,})"[^}]{0,500}?"server"\s*:\s*"(\d+)"[^}]{0,500}?"secret"\s*:\s*"([a-f0-9]+)"/g;
    const re4 = /https?:\/\/live\.staticflickr\.com\/(\d+)\/(\d{10,})_([a-f0-9]+)_[a-z0-9]+\.jpg/g;

    let m;
    while ((m = re1.exec(text)) !== null) {
        const [, id, secret, server] = m;
        if (!photoData.has(id)) photoData.set(id, `https://live.staticflickr.com/${server}/${id}_${secret}_b.jpg`);
    }
    while ((m = re2.exec(text)) !== null) {
        const [, server, id, secret] = m;
        if (!photoData.has(id)) photoData.set(id, `https://live.staticflickr.com/${server}/${id}_${secret}_b.jpg`);
    }
    while ((m = re3.exec(text)) !== null) {
        const [, id, server, secret] = m;
        if (!photoData.has(id)) photoData.set(id, `https://live.staticflickr.com/${server}/${id}_${secret}_b.jpg`);
    }
    while ((m = re4.exec(text)) !== null) {
        const [, server, id, secret] = m;
        if (!photoData.has(id)) photoData.set(id, `https://live.staticflickr.com/${server}/${id}_${secret}_b.jpg`);
    }

    return photoData.size - before;
}

/* ════════ 遞迴走訪 JSON，找出 id + server + secret 節點 ════════ */
function walkJson(obj, photoData) {
    if (!obj || typeof obj !== 'object') return;
    if (Array.isArray(obj)) { obj.forEach(i => walkJson(i, photoData)); return; }

    const id     = obj.id     && /^\d{10,}$/.test(String(obj.id))      ? String(obj.id)     : null;
    const server = obj.server && /^\d+$/.test(String(obj.server))       ? String(obj.server) : null;
    const secret = obj.secret && /^[a-f0-9]+$/.test(String(obj.secret)) ? String(obj.secret) : null;

    if (id && server && secret && !photoData.has(id))
        photoData.set(id, `https://live.staticflickr.com/${server}/${id}_${secret}_b.jpg`);

    Object.values(obj).forEach(v => walkJson(v, photoData));
}

/* ════════ 主流程 ════════ */
async function syncFlickr() {
    console.log(`\n同步 Flickr 照片：${BASE_URL}/\n`);

    let existing = { pottery: [], photography: { digital: [], film: [] } };
    if (fs.existsSync(OUTPUT)) {
        try { existing = JSON.parse(fs.readFileSync(OUTPUT, 'utf-8')); } catch (_) {}
    }

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 }); /* 正常視窗高度，才會觸發滾動載入 */
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');

    const allPhotos = new Map();

    /* ── CDP：攔截所有 Flickr API 回應 ── */
    const cdp = await page.createCDPSession();
    await cdp.send('Network.enable');

    const pendingRequests = new Map();
    let previewApiUrl = null; /* 捕捉 per_page=5&page=1 的 URL，用來補請求缺口 */

    cdp.on('Network.responseReceived', ({ requestId, response }) => {
        const url = response.url;
        if (!url.includes('api.flickr.com/services/rest')) return;
        if (response.status < 200 || response.status >= 300) return;
        /* 記錄 per_page=5&page=1 的 URL */
        if (!previewApiUrl && url.includes('per_page=5') && url.includes('page=1')) {
            previewApiUrl = url;
        }
        pendingRequests.set(requestId, true);
    });

    cdp.on('Network.loadingFinished', async ({ requestId }) => {
        if (!pendingRequests.has(requestId)) return;
        pendingRequests.delete(requestId);
        try {
            const { body, base64Encoded } = await cdp.send('Network.getResponseBody', { requestId });
            const text = base64Encoded ? Buffer.from(body, 'base64').toString('utf-8') : body;
            extractUrlsFromText(text, allPhotos);
        } catch (_) {}
    });

    /* ── 補請求 per_page=5 的缺口（照片 6-100）── */
    async function fillPreviewGap() {
        if (!previewApiUrl) return;
        for (let pg = 2; pg <= 20; pg++) {
            const url = previewApiUrl.replace(/&page=\d+/, `&page=${pg}`);
            try {
                const result = await page.evaluate(async (u) => {
                    try {
                        const res = await fetch(u, { credentials: 'include' });
                        return { ok: res.ok, text: await res.text() };
                    } catch (e) {
                        return { ok: false, text: '' };
                    }
                }, url);
                if (result.ok && result.text) extractUrlsFromText(result.text, allPhotos);
            } catch (_) {}
            await sleep(200);
        }
    }

    /* ── 導航到新頁面後做漸進式預熱滾動，確保所有初始批次 API 都被觸發 ── */
    async function warmupScroll() {
        /* 每次移動 400px，讓 Flickr 逐步觸發每個 viewport 的 API 請求 */
        for (let y = 400; y <= 4000; y += 400) {
            await page.evaluate((pos) => window.scrollTo(0, pos), y);
            await sleep(400);
        }
        /* 最後滾到底確保不遺漏 */
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await sleep(1500);
        /* 補請求 per_page=5 缺口（照片 6-25） */
        await fillPreviewGap();
    }

    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle2', timeout: 60000 });
    await sleep(2000);
    await warmupScroll();
    let stableRounds = 0;
    const MAX_STABLE = 8; /* 連續 8 次滾動無新增才停止 */
    let scrollRound = 0;

    while (stableRounds < MAX_STABLE) {
        const before = allPhotos.size;

        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await sleep(1200); /* 等待 API 呼叫發出並回應 */

        /* 等待所有 pending 請求處理完 */
        const waitStart = Date.now();
        while (pendingRequests.size > 0 && Date.now() - waitStart < 5000) {
            await sleep(200);
        }

        const gained = allPhotos.size - before;
        scrollRound++;

        if (gained > 0) {
            stableRounds = 0;
        } else {
            stableRounds++;
            if (stableRounds >= 3) {
                /* 嘗試換頁繼續（Flickr 可能用分頁而非無限滾動） */
                const hasNextPage = await page.evaluate(() => {
                    const next = document.querySelector('a[rel="next"], .paginator-next, a.Next');
                    if (next) { next.click(); return true; }
                    return false;
                });
                if (hasNextPage) {
                    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 }).catch(() => {});
                    await sleep(2000);
                    await warmupScroll();
                    stableRounds = 0;
                }
            }
        }
    }

    await cdp.detach().catch(() => {});
    await browser.close();

    const photoUrls = [...allPhotos.values()];

    if (photoUrls.length === 0) {
        console.error('未抓取到任何照片，請確認 FLICKR_USERNAME 是否正確');
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
    console.log(`完成：共 ${photoUrls.length} 張照片`);
}

syncFlickr().catch(err => {
    console.error('\n失敗：', err.message);
    process.exit(1);
});
