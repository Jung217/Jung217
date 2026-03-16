"use client";

import { useState, useEffect } from 'react';

const START_DELAY_MS = 500;
const DEFAULT_TYPING_SPEED = 50;

export default function TerminalText({ text, typingSpeed = DEFAULT_TYPING_SPEED }) {
    const [displayedText, setDisplayedText] = useState('');
    const [isTyping, setIsTyping] = useState(true);

    useEffect(() => {
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
