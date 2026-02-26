"use client";

import React, { useState, useEffect } from 'react';

export default function TerminalText({ text, typingSpeed = 50 }) {
    const [displayedText, setDisplayedText] = useState('');
    const [isTyping, setIsTyping] = useState(true);

    useEffect(() => {
        let i = 0;
        setDisplayedText('');
        setIsTyping(true);

        // Add a slight delay before typing starts
        const startDelay = setTimeout(() => {
            const typeWriter = setInterval(() => {
                if (i < text.length) {
                    setDisplayedText((prev) => prev + text.charAt(i));
                    i++;
                } else {
                    setIsTyping(false);
                    clearInterval(typeWriter);
                }
            }, typingSpeed);

            return () => clearInterval(typeWriter);
        }, 500);

        return () => clearTimeout(startDelay);
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
