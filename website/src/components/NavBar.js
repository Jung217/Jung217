'use client';

import { useState, useEffect, useRef } from 'react';

const SCROLL_HIDE_THRESHOLD = 80;
// 必須與 CSS transition 持續時間一致
const MENU_CLOSE_DELAY_MS = 300;

export default function NavBar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [navHidden, setNavHidden] = useState(false);
    const lastScrollY = useRef(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentY = window.scrollY;
            if (currentY > lastScrollY.current && currentY > SCROLL_HIDE_THRESHOLD) {
                setNavHidden(true);
                setMenuOpen(false);
            } else {
                setNavHidden(false);
            }
            lastScrollY.current = currentY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (menuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [menuOpen]);

    const handleLinkClick = (e, href) => {
        e.preventDefault();
        setMenuOpen(false);
        setTimeout(() => { window.location.href = href; }, MENU_CLOSE_DELAY_MS);
    };

    return (
        <>
            <nav className={`main-nav animate-fade-in${navHidden ? ' nav-hidden' : ''}`}>
                <div className="container nav-content">
                    <a href="/" className="nav-logo">CJ Chien</a>

                    {/* 桌機版連結 */}
                    <div className="nav-links">
                        <a href="/"><span className="inner">Home</span></a>
                        <a href="/pottery"><span className="inner">Pottery</span></a>
                        <a href="/photography"><span className="inner">Photography</span></a>
                    </div>

                    {/* 手機版漢堡按鈕 */}
                    <button
                        className={`hamburger${menuOpen ? ' open' : ''}`}
                        onClick={() => setMenuOpen(prev => !prev)}
                        aria-label="開啟選單"
                    >
                        <span />
                        <span />
                        <span />
                    </button>
                </div>
            </nav>

            {/* 手機版全螢幕選單 */}
            <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
                <a href="/" onClick={(e) => handleLinkClick(e, '/')}>Home</a>
                <a href="/pottery" onClick={(e) => handleLinkClick(e, '/pottery')}>Pottery</a>
                <a href="/photography" onClick={(e) => handleLinkClick(e, '/photography')}>Photography</a>
            </div>
        </>
    );
}
