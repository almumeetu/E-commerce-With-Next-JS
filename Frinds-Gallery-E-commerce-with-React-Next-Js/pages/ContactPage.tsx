import React from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import type { Page } from '../App';
import { DevicePhoneMobileIcon, EnvelopeIcon, MapPinIcon } from '../components/icons';

interface ContactPageProps {
    navigateTo: (page: Page) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ navigateTo }) => {
    return (
        <div className="bg-white py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <Breadcrumbs items={[{ label: 'হোম', onClick: () => navigateTo('home') }, { label: 'যোগাযোগ' }]} />
                <div className="mt-8">
                    <h1 className="text-3xl font-bold text-gray-900 text-center">যোগাযোগ করুন</h1>
                    <p className="text-center mt-2 text-gray-600">যেকোনো প্রয়োজনে আমাদের সাথে যোগাযোগ করতে পারেন।</p>

                    <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Contact Info */}
                        <div className="space-y-6 bg-yellow">
                            <h2 className="text-xl font-semibold text-gray-800">আমাদের তথ্য</h2>
                            <div className="flex items-start space-x-4">
                                <span className="text-2xl mt-1 text-brand-green"><DevicePhoneMobileIcon className="w-6 h-6" /></span>
                                <div>
                                    <h3 className="font-semibold">ফোন</h3>
                                    <a href="tel:01618803154" className="text-brand-green hover:underline">01618803154</a>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4">
                                <span className="text-2xl mt-1 text-brand-green"><EnvelopeIcon className="w-6 h-6" /></span>
                                <div>
                                    <h3 className="font-semibold">ইমেইল</h3>
                                    <a href="mailto:friendsgallery191@gmail.com" className="text-brand-green hover:underline">friendsgallery191@gmail.com</a>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4">
                                <span className="text-2xl mt-1 text-brand-green"><MapPinIcon className="w-6 h-6" /></span>
                                <div>
                                    <h3 className="font-semibold">ঠিকানা</h3>
                                    <p>Zerabo Ashulia Saver Dhaka 1341</p>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-gray-50 p-6 rounded-lg border">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">বার্তা পাঠান</h2>
                            <form className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">নাম</label>
                                    <input type="text" id="name" />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">ইমেইল</label>
                                    <input type="email" id="email" />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">বার্তা</label>
                                    <textarea id="message" rows={4}></textarea>
                                </div>
                                <button type="submit" className="w-full bg-brand-green text-white py-2.5 rounded-lg font-semibold hover:bg-brand-green-dark transition-all">পাঠিয়ে দিন</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};