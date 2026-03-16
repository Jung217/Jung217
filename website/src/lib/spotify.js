// Spotify 伺服器端共用工具
// 使用伺服器端環境變數（非 NEXT_PUBLIC_ 前綴），僅供 Server Component 使用

// API 端點常數
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const SPOTIFY_API_BASE = 'https://api.spotify.com';

// 快取重新驗證時間（秒）
const REVALIDATE_SECONDS = 3600;

// 熱門曲目預設筆數
const TOP_TRACKS_LIMIT = 5;

/**
 * 透過 Refresh Token 取得新的 Access Token
 * @returns {Promise<string|null>} Access Token 或 null（環境變數缺失時）
 */
export async function getAccessToken() {
  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
  const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

  if (!client_id || !client_secret || !refresh_token) return null;

  const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');

  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token,
    }),
    next: { revalidate: REVALIDATE_SECONDS }
  });

  const data = await response.json();
  return data.access_token;
}

/**
 * 呼叫 Spotify Web API 的通用方法
 * @param {string} endpoint - API 路徑（不含 base URL）
 * @param {string} method - HTTP 方法
 * @param {object} [body] - 請求主體（選填）
 * @returns {Promise<object|null>} API 回應資料或 null
 */
export async function fetchWebApi(endpoint, method, body) {
  const token = await getAccessToken();
  if (!token) return null;

  const res = await fetch(`${SPOTIFY_API_BASE}/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method,
    body: body ? JSON.stringify(body) : undefined,
    next: { revalidate: REVALIDATE_SECONDS }
  });

  if (!res.ok) {
    console.error("Spotify API Error:", res.statusText);
    return null;
  }
  return await res.json();
}

/**
 * 取得使用者近期熱門曲目
 * @returns {Promise<Array>} 曲目陣列
 */
export async function getTopTracks() {
  const data = await fetchWebApi(
    `v1/me/top/tracks?time_range=short_term&limit=${TOP_TRACKS_LIMIT}`,
    'GET'
  );
  return data?.items || [];
}
