'use client';

import { useState, useEffect } from 'react';

export default function CurrentlyPlaying({ initialToken }) {
    const [songInfo, setSongInfo] = useState(null);
    const [rawData, setRawData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchCurrentlyPlaying = async () => {
        if (!initialToken) {
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('https://api.spotify.com/v1/me/player', {
                headers: {
                    Authorization: `Bearer ${initialToken}`,
                },
                cache: 'no-store',
            });

            if (response.status === 401) {
                console.warn('Spotify access token expired, reloading page...');
                window.location.reload();
                return;
            }

            if (response.status === 204 || response.status > 400) {
                setSongInfo(null);
                return;
            }

            const data = await response.json();
            setRawData(data);

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
                device: data.device.name
            });

        } catch (error) {
            console.error('Failed to fetch currently playing song directly', error);
            setSongInfo(null);
        } finally {
            if (loading) setLoading(false);
        }
    };

    useEffect(() => {
        // 初次載入
        fetchCurrentlyPlaying();

        // 每 15 秒輪詢一次最新狀態
        const interval = setInterval(() => {
            fetchCurrentlyPlaying();
        }, 15000);

        return () => clearInterval(interval);
    }, [initialToken]);

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
