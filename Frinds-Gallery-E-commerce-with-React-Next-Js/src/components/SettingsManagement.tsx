import React, { useState } from 'react';

interface Settings {
    storeName: string;
    hotline: string;
    email: string;
    address: string;
    deliveryChargeDhaka: number;
    deliveryChargeOutside: number;
}

export const SettingsManagement: React.FC = () => {
    const [settings, setSettings] = useState<Settings>({
        storeName: 'Friend’s Gallery 0.7',
        hotline: '01618803154',
        email: 'friendsgallery191@gmail.com',
        address: 'Zerabo Ashulia Saver Dhaka 1341',
        deliveryChargeDhaka: 80,
        deliveryChargeOutside: 150,
    });
    
    const [isSaved, setIsSaved] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setSettings(prev => ({...prev, [name]: name.includes('Charge') ? Number(value) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically send data to a server
        console.log('Settings saved:', settings);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000); // Hide message after 3 seconds
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">সেটিংস</h2>
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Store Information */}
                <div className="p-4 border rounded-md">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">দোকানের তথ্য</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                            <label htmlFor="storeName" className="block text-sm font-medium text-gray-700 mb-1">দোকানের নাম</label>
                            <input type="text" name="storeName" id="storeName" value={settings.storeName} onChange={handleChange} />
                        </div>
                        <div>
                            <label htmlFor="hotline" className="block text-sm font-medium text-gray-700 mb-1">হটলাইন</label>
                            <input type="text" name="hotline" id="hotline" value={settings.hotline} onChange={handleChange} />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">ইমেইল</label>
                            <input type="email" name="email" id="email" value={settings.email} onChange={handleChange} />
                        </div>
                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">ঠিকানা</label>
                            <textarea name="address" id="address" value={settings.address} onChange={handleChange} rows={1}></textarea>
                        </div>
                    </div>
                </div>

                {/* Shipping Settings */}
                <div className="p-4 border rounded-md">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">ডেলিভারি সেটিংস</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                            <label htmlFor="deliveryChargeDhaka" className="block text-sm font-medium text-gray-700 mb-1">ঢাকার ভিতরে ডেলিভারি চার্জ (৳)</label>
                            <input type="number" name="deliveryChargeDhaka" id="deliveryChargeDhaka" value={settings.deliveryChargeDhaka} onChange={handleChange} />
                        </div>
                        <div>
                            <label htmlFor="deliveryChargeOutside" className="block text-sm font-medium text-gray-700 mb-1">ঢাকার বাইরে ডেলিভারি চার্জ (৳)</label>
                            <input type="number" name="deliveryChargeOutside" id="deliveryChargeOutside" value={settings.deliveryChargeOutside} onChange={handleChange} />
                        </div>
                    </div>
                </div>
                
                <div className="flex justify-end items-center space-x-4">
                    {isSaved && <p className="text-green-600 font-semibold">সফলভাবে সেভ হয়েছে!</p>}
                    <button type="submit" className="bg-brand-green text-white py-2 px-6 rounded-lg font-semibold hover:bg-brand-green-dark transition-all">
                        পরিবর্তন সেভ করুন
                    </button>
                </div>
            </form>
        </div>
    );
};