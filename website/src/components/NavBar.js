'use client';

import { useState, useEffect, useRef } from 'react';

export default function NavBar() {
    // 控制漢堡選單開關
    const [menuOpen, setMenuOpen] = useState(false);
    // 控制導覽列顯示/隱藏
    const [navHidden, setNavHidden] = useState(false);
    const lastScrollY = useRef(0);

    // 滾動監聽：向下滾動隱藏，向上滾動顯示
    useEffect(() => {
        const handleScroll = () => {
            const currentY = window.scrollY;
            if (currentY > lastScrollY.current && currentY > 80) {
                // 向下滾動超過 80px 才隱藏
                setNavHidden(true);
                // 隱藏導覽列時同時關閉手機選單
                setMenuOpen(false);
            } else {
                // 向上滾動立即顯示
                setNavHidden(false);
            }
            lastScrollY.current = currentY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // 開啟選單時防止背景捲動
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

    // 點擊選單連結：先關閉選單，待動畫結束後再跳轉，避免卡頓
    const handleLinkClick = (e, href) => {
        e.preventDefault();
        setMenuOpen(false);
        // 等待選單淡出動畫完成後再跳轉（300ms 剛好對應 CSS transition）
        setTimeout(() => { window.location.href = href; }, 300);
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
                {/* 點選項目後關閉選單再跳轉（避免動畫卡頓） */}
                <a href="/" onClick={(e) => handleLinkClick(e, '/')}>Home</a>
                <a href="/pottery" onClick={(e) => handleLinkClick(e, '/pottery')}>Pottery</a>
                <a href="/photography" onClick={(e) => handleLinkClick(e, '/photography')}>Photography</a>
            </div>
        </>
    );
}
