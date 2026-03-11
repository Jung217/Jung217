'use client';

import { useState, useEffect } from 'react';

// 從環境變數讀取 Spotify 憑證（NEXT_PUBLIC_ 前綴讓瀏覽器端可存取）
const CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.NEXT_PUBLIC_SPOTIFY_REFRESH_TOKEN;
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const PLAYER_ENDPOINT = 'https://api.spotify.com/v1/me/player';

// 每次輪詢前自動換一個新的 Access Token，徹底解決 1 小時過期問題
async function getAccessToken() {
    const basic = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
    const response = await fetch(TOKEN_ENDPOINT, {
        method: 'POST',
        headers: {
            Authorization: `Basic ${basic}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: REFRESH_TOKEN,
        }),
    });
    const data = await response.json();
    return data.access_token;
}

export default function CurrentlyPlaying() {
    const [songInfo, setSongInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchCurrentlyPlaying = async () => {
        if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
            setLoading(false);
            return;
        }

        try {
            // 每次都換新的 Access Token，不會過期
            const access_token = await getAccessToken();

            const response = await fetch(PLAYER_ENDPOINT, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                cache: 'no-store',
            });

            if (response.status === 204 || response.status >= 400) {
                setSongInfo(null);
                return;
            }

            const data = await response.json();

            if (!data.is_playing) {
                setSongInfo(null);
                return;
            }

            const { item } = data;

            if (!item || item.type !== 'track') {
                setSongInfo(null);
                return;
            }

            setSongInfo({
                isPlaying: true,
                title: item.name,
                artist: item.artists.map((_artist) => _artist.name).join(', '),
                albumImageUrl: item.album.images[0]?.url,
                songUrl: item.external_urls.spotify,
                device: data.device?.name,
            });

        } catch (error) {
            console.error('Failed to fetch currently playing song', error);
            setSongInfo(null);
        } finally {
            if (loading) setLoading(false);
        }
    };

    useEffect(() => {
        fetchCurrentlyPlaying();

        const interval = setInterval(() => {
            fetchCurrentlyPlaying();
        }, 15000);

        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="currently-playing skeleton">
                <div className="cp-pulse" />
                <div className="cp-text"><span>Loading Spotify Status...</span></div>
            </div>
        );
    }

    if (!songInfo || !songInfo.isPlaying) {
        return null;
    }

    return (
        <a href={songInfo.songUrl} target="_blank" rel="noopener noreferrer" className="currently-playing active">
            {songInfo.albumImageUrl && (
                <div className="cp-album-art">
                    <img src={songInfo.albumImageUrl} alt={`${songInfo.title} cover`} />
                    <div className="cp-overlay-cd" />
                </div>
            )}
            <div className="cp-info">
                <div className="cp-title">{songInfo.title}</div>
                <div className="cp-artist">{songInfo.artist}</div>
                <div className="cp-header">
                    <span className="cp-badge">Now Playing</span>
                    {songInfo.device && (
                        <span style={{ fontSize: '0.75rem', color: '#1db954', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            {songInfo.device}
                        </span>
                    )}
                    <div className="cp-equalizer">
                        <span className="bar bar1"></span>
                        <span className="bar bar2"></span>
                        <span className="bar bar3"></span>
                    </div>
                </div>
            </div>
        </a>
    );
}
