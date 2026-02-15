'use client';

import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    toast: {
        success: (msg: string) => void;
        error: (msg: string) => void;
        info: (msg: string) => void;
    };
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const addToast = useCallback((message: string, type: ToastType) => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);

        // Auto-remove after 4 seconds
        setTimeout(() => {
            removeToast(id);
        }, 4000);
    }, [removeToast]);

    const toast = {
        success: (msg: string) => addToast(msg, 'success'),
        error: (msg: string) => addToast(msg, 'error'),
        info: (msg: string) => addToast(msg, 'info'),
    };

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}
            <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className={`
              pointer-events-auto
              flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border
              animate-in slide-in-from-right-full duration-300
              ${t.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' :
                                t.type === 'error' ? 'bg-rose-50 border-rose-100 text-rose-800' :
                                    'bg-blue-50 border-blue-100 text-blue-800'}
            `}
                    >
                        {t.type === 'success' && <span className="text-emerald-500 text-xl font-bold">✓</span>}
                        {t.type === 'error' && <span className="text-rose-500 text-xl font-bold">✕</span>}
                        {t.type === 'info' && <span className="text-blue-500 text-xl font-bold">ℹ</span>}

                        <p className="text-sm font-bold">{t.message}</p>

                        <button
                            onClick={() => removeToast(t.id)}
                            className="ml-2 p-1 hover:bg-black/5 rounded-full transition-colors font-bold text-xs"
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

// Global toast object for use outside components if needed
// (Simulating the react-hot-toast export)
let globalToast = {
    success: (msg: string) => { },
    error: (msg: string) => { },
    info: (msg: string) => { },
};

export const toast = {
    success: (msg: string) => globalToast.success(msg),
    error: (msg: string) => globalToast.error(msg),
    info: (msg: string) => globalToast.info(msg),
};

export function Toaster() {
    const context = useContext(ToastContext);

    useEffect(() => {
        if (context) {
            globalToast = context.toast;
        }
    }, [context]);

    return null; // The ToastProvider handles rendering the toasts
}

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context.toast;
};
