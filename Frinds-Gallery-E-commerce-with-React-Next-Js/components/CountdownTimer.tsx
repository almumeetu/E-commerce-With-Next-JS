'use client';

import React, { useState, useEffect } from 'react';

const CountdownTimer: React.FC = () => {
  const targetDate = new Date('2026-03-21T00:00:00');

  const calculateTimeLeft = () => {
    const difference = +targetDate - +new Date();
    if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const toBanglaNumber = (num: number) => {
    return num.toString().padStart(2, '0').replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[parseInt(d)]);
  };

  if (!mounted) return null;

  return (
    <div className="relative z-30 max-w-4xl mx-auto px-4 -mt-10 mb-12">
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between overflow-hidden relative text-white">

        {/* Glow Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-r from-indigo-500/20 to-rose-500/20 blur-3xl -z-10"></div>

        <div className="mb-6 md:mb-0 text-center md:text-left z-10 flex items-center">
          <div className="bg-rose-400/20 p-3 rounded-full mr-4 hidden md:block">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rose-400"><path d="M12 2v20M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-black mb-1 drop-shadow-md">পবিত্র ঈদুল ফিতর</h3>
            <p className="text-black text-sm font-medium opacity-90">অপেক্ষা আর মাত্র</p>
          </div>
        </div>

        <div className="flex gap-3 md:gap-5 z-10">
          <TimeUnit value={timeLeft.days} label="দিন" toBangla={toBanglaNumber} />
          <TimeUnit value={timeLeft.hours} label="ঘণ্টা" toBangla={toBanglaNumber} />
          <TimeUnit value={timeLeft.minutes} label="মিনিট" toBangla={toBanglaNumber} />
          <TimeUnit value={timeLeft.seconds} label="সেকেন্ড" toBangla={toBanglaNumber} />
        </div>
      </div>
    </div>
  );
};

const TimeUnit: React.FC<{ value: number, label: string, toBangla: (n: number) => string }> = ({ value, label, toBangla }) => (
  <div className="flex flex-col items-center">
    <div className="bg-indigo-950/60 backdrop-blur-md w-14 h-16 md:w-20 md:h-24 rounded-2xl flex items-center justify-center border border-white/10 shadow-lg mb-2 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-50"></div>
      <span className="text-2xl md:text-4xl font-bold text-rose-400 font-mono relative z-10 group-hover:scale-110 transition-transform">
        {toBangla(value)}
      </span>
    </div>
    <span className="text-xs md:text-sm text-indigo-100/80 font-medium tracking-wide">{label}</span>
  </div>
);

export default CountdownTimer;