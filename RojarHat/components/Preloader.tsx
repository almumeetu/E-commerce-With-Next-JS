import React, { useEffect, useState } from 'react';
import { Moon } from 'lucide-react';

const Preloader: React.FC = () => {
    const [fadeOut, setFadeOut] = useState(false);
    const [removed, setRemoved] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setFadeOut(true);
            setTimeout(() => setRemoved(true), 300);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    if (removed) return null;

    return (
        <div 
            role="progressbar" 
            aria-label="পৃষ্ঠা লোড হচ্ছে"
            aria-busy="true"
            className={`fixed inset-0 z-[9999] flex items-center justify-center bg-emerald-950 transition-opacity duration-700 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
        >
            <div className="text-center">
                {/* Animated Moon/Logo */}
                <div className="relative mb-8 inline-block">
                    <div className="absolute inset-0 animate-ping rounded-full bg-gold-400/20 blur-xl"></div>
                    <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-gold-300 to-gold-500 shadow-2xl">
                        <Moon className="h-12 w-12 animate-pulse text-emerald-950" fill="currentColor" />
                    </div>
                </div>

                {/* Text */}
                <div className="overflow-hidden">
                    <h1 className="animate-slide-up text-4xl font-bold tracking-widest text-white">
                        রোজার<span className="text-gold-400">হাট</span>
                    </h1>
                    <div className="mt-3 flex justify-center space-x-1">
                        {[0, 1, 2].map((i) => (
                            <div
                                key={i}
                                className="h-1.5 w-1.5 animate-bounce rounded-full bg-gold-400"
                                style={{ animationDelay: `${i * 0.15}s` }}
                            ></div>
                        ))}
                    </div>
                </div>

                <p className="mt-4 text-sm font-medium tracking-widest text-emerald-200/60 uppercase">
                    শুদ্ধ পণ্য, সুস্থ রমজান
                </p>
            </div>

            {/* Background Pattern */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>
        </div>
    );
};

export default Preloader;
