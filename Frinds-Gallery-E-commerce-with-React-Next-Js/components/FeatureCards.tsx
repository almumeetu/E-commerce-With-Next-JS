import React from 'react';
import { SparklesIcon, FireIcon, TruckIcon, ChatBubbleLeftRightIcon } from './icons';
import { useSiteContent } from '../context/SiteContentContext';

const getIcon = (iconName: string) => {
    switch (iconName) {
        case 'SparklesIcon': return <SparklesIcon />;
        case 'FireIcon': return <FireIcon />;
        case 'TruckIcon': return <TruckIcon />;
        case 'ChatBubbleLeftRightIcon': return <ChatBubbleLeftRightIcon />;
        default: return <SparklesIcon />;
    }
}

export const FeatureCards: React.FC = () => {
    const { content } = useSiteContent();
    const featureData = content.features;


    return (
        <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {featureData.map((feature, index) => (
                    <div key={index} className="flex items-center p-5 sm:p-6 bg-white border border-slate-100 rounded-2xl shadow-card hover:shadow-card-hover transform hover:-translate-y-2 transition-all duration-300 group cursor-default">
                        <div className="text-brand-green-deep text-3xl mr-5 bg-brand-yellow/20 p-3 sm:p-4 rounded-2xl flex-shrink-0 group-hover:bg-brand-yellow transition-colors duration-300">
                            {getIcon(feature.icon)}
                        </div>
                        <div className="min-w-0">
                            <h3 className="font-bold text-slate-800 text-sm sm:text-base tracking-tight mb-0.5 group-hover:text-brand-green-deep transition-colors duration-300">{feature.title}</h3>
                            <p className="text-xs sm:text-sm text-slate-500 font-medium">{feature.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}