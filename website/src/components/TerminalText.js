"use client";

import { useState, useEffect } from 'react';

const START_DELAY_MS = 500;
const DEFAULT_TYPING_SPEED = 50;

export default function TerminalText({ text, typingSpeed = DEFAULT_TYPING_SPEED }) {
    // 初始值即為完整文字：伺服器端會把整段文字寫進 HTML，
    // 讓這個 LCP 元素在首屏（FCP）就完成繪製，而非等到 JS 逐字打完。
    const [displayedText, setDisplayedText] = useState(text);
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        // 尊重「減少動態效果」偏好：直接保留完整文字，不做打字機動畫
        const prefersReducedMotion =
            typeof window.matchMedia === 'function' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            setDisplayedText(text);
            setIsTyping(false);
            return;
        }

        let i = 0;
        let typeWriter;
        setDisplayedText('');
        setIsTyping(true);

        const startDelay = setTimeout(() => {
            typeWriter = setInterval(() => {
                if (i < text.length) {
                    setDisplayedText((prev) => prev + text.charAt(i));
                    i++;
                } else {
                    setIsTyping(false);
                    clearInterval(typeWriter);
                }
            }, typingSpeed);
        }, START_DELAY_MS);

        return () => {
            clearTimeout(startDelay);
            if (typeWriter) clearInterval(typeWriter);
        };
    }, [text, typingSpeed]);

    return (
        <div className="terminal-container">
            <p className="terminal-text">
                <span className="terminal-prompt">{'> '}</span>
                {displayedText}
                <span className={`terminal-cursor ${isTyping ? 'typing' : 'idle'}`}>_</span>
            </p>
        </div>
    );
}
