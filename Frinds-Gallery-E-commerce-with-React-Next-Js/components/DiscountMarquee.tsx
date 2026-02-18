import React from 'react';

export const DiscountMarquee: React.FC = () => {
    const discounts = [
        { icon: '🎉', text: '৫০% পর্যন্ত ছাড় সব পণ্যে!' },
        { icon: '🛍️', text: 'প্রথম অর্ডারে অতিরিক্ত ২০% অফ' },
        { icon: '⭐', text: 'ফ্রি ডেলিভারি ৫০০ টাকার উপরে' },
        { icon: '💝', text: 'বিশেষ বান্ডল ডিল এখন লাইভ' },
        { icon: '🎁', text: 'প্রতি ক্রয়ে ফ্রি গিফট!' },
    ];

    return (
        <div className="w-full bg-brand-green-deep overflow-hidden relative border-y border-white/5 shadow-2xl">
            {/* Glossy overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>

            <style>{`
                @keyframes marquee-new {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }
                
                .marquee-content-new {
                    animation: marquee-new 40s linear infinite;
                    display: flex;
                    width: max-content;
                }
                
                .marquee-item-new {
                    flex-shrink: 0;
                    padding: 0 4rem;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }
            `}</style>

            <div className="py-3 sm:py-3.5 relative z-10 flex">
                <div className="marquee-content-new">
                    {[...discounts, ...discounts].map((discount, index) => (
                        <div key={index} className="marquee-item-new">
                            <span className="text-xl">{discount.icon}</span>
                            <span className="text-brand-yellow-vibrant font-black text-sm sm:text-base tracking-wide uppercase italic">
                                {discount.text}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
