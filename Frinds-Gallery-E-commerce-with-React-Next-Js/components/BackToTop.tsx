'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

const BackToTop: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <div className={`fixed bottom-8 right-8 z-40 transition-all duration-500 transform ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-50 pointer-events-none'}`}>
            <button
                onClick={scrollToTop}
                className="group relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-indigo-700 p-2 text-white shadow-2xl transition-all duration-300 hover:bg-indigo-800 hover:shadow-indigo-500/40"
                aria-label="Back to top"
            >
                <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/20 to-transparent"></div>
                <ArrowUp className="relative z-10 transition-transform duration-300 group-hover:-translate-y-1" />
            </button>
        </div>
    );
};

export default BackToTop;
